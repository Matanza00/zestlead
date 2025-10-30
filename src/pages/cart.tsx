'use client';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import CombinedNavSidebar from '@/components/CombinedNavbar';
import CartCheckoutButton from '@/components/CartCheckoutButton';
import { ShoppingCart, ArrowLeft, Check, Sparkles, Copy, Percent, Clock } from 'lucide-react';

type CartItem = {
  id: string;
  lead: {
    id: string;
    name: string;
    price: number;
    propertyType: string;
    desireArea: string;
    priceRange: string;
  };
};
// 1) Add a tiny helper up top (below imports)
const num = (v: any, fallback = 0): number => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};


type AssignedDiscount = {
  code: string;
  percentage: number;
  expiresAt?: string | null;
  active?: boolean;
  remaining?: number | null;   // optional, if your API provides remaining uses
  maxCap?: number | null;      // optional, if your API provides a per-use cap
};
// Show compact label for subscription codes
const getDiscountLabel = (d: { code: string }) => {
  const c = (d.code || '').toUpperCase();
  if (c.startsWith('GROWTH-')) return 'GROWTH';
  if (c.startsWith('PRO-')) return 'PRO';
  return c; // other discounts show the full code
};

function normalizePlanKey(input?: string | null): PlanKey {
  const v = (input || '').toUpperCase();

  // Treat Enterprise as PRO-tier benefits
  if (v.includes('ENTERPRISE') || v.includes('BUSINESS') || v.includes('PRO')) return 'PRO';

  if (v.includes('GROWTH')) return 'GROWTH';
  if (v.includes('STARTER')) return 'STARTER';
  return 'STARTER';
}



export default function CartPage(props) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);

  // promo (typed or selected)
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const [promo, setPromo] = useState('');
  const [promoValid, setPromoValid] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  // now possibly null if unlimited
  const [discountMaxCap, setDiscountMaxCap] = useState<number | null>(null);
  const [discountedIds, setDiscountedIds] = useState<Set<string>>(new Set());

  // assigned discounts (fetched)
  const [assigned, setAssigned] = useState<AssignedDiscount[]>([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  // fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data: CartItem[] = await res.json();

      // Partition: valid (>0) vs zero/invalid price
      const valid: CartItem[] = [];
      const zeroIds: string[] = [];

      for (const it of Array.isArray(data) ? data : []) {
        const price = num(it?.lead?.price, 0);
        if (price > 0) {
          valid.push(it);
        } else if (it?.id) {
          zeroIds.push(it.id);
        }
      }

      setItems(valid);

      // Silently purge zero-priced items on the server
      if (zeroIds.length) {
        // fire-and-forget; no need to block UI
        removeItemsById(zeroIds, { silent: true });
      }
    } catch {
      toast.error('Failed to load cart.');
    }
  };


  const removeItem = async (itemId: string) => {
    // optimistic UI
    setRemovingIds(prev => new Set(prev).add(itemId));
    const prevItems = items;
    setItems(prev => prev.filter(i => i.id !== itemId));
    setDiscountedIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });

    let ok = false;

    // Attempt 1: DELETE /api/cart/:itemId
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      ok = res.ok;
    } catch {}

    // Attempt 2: DELETE /api/cart with JSON body
    if (!ok) {
      try {
        const res = await fetch(`/api/cart`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId }),
        });
        ok = res.ok;
      } catch {}
    }

    if (ok) {
      toast.success('Removed from cart');
    } else {
      // rollback + refetch for consistency
      toast.error('Failed to remove. Restoring…');
      setItems(prevItems);
      fetchCart();
    }

    setRemovingIds(prev => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
  };
  const removeItemsById = async (ids: string[], { silent = true }: { silent?: boolean } = {}) => {
  if (!ids.length) return;

  // optimistic UI
  setItems(prev => prev.filter(i => !ids.includes(i.id)));
  setDiscountedIds(prev => {
    const next = new Set(prev);
    ids.forEach(id => next.delete(id));
    return next;
  });

  const tryDelete = async (itemId: string) => {
    // Attempt 1: DELETE /api/cart/:itemId
    try {
      const r = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      if (r.ok) return true;
    } catch {}
    // Attempt 2: DELETE /api/cart with JSON body
    try {
      const r = await fetch(`/api/cart`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      });
      if (r.ok) return true;
    } catch {}
    return false;
  };

  const results = await Promise.allSettled(ids.map(tryDelete));
  const anyFailed = results.some(r => r.status === 'fulfilled' && !r.value);

  if (!silent) {
    if (anyFailed) {
      toast.error('Some items could not be removed. Refreshing cart…');
      fetchCart();
    } else {
      toast.success('Removed from cart');
    }
  }
};


  // auto-add via query param
  const leadIdParam = Array.isArray(router.query.leadId)
    ? router.query.leadId[0]
    : router.query.leadId;

  useEffect(() => {
    if (leadIdParam) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadIdParam }),
      }).then(fetchCart);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadIdParam]);

  useEffect(() => {
    fetchCart();
  }, []);

  // --- Assigned discounts fetcher ---
  // Tries a few likely endpoints; uses the first that returns an array.
  // Replace your current fetchAssignedDiscounts() with this:
const fetchAssignedDiscounts = async () => {
  setLoadingAssigned(true);
  try {
    const r = await fetch('/api/discount/validate'); // GET returns assigned codes
    if (r.ok) {
      const data = await r.json();
      // normalize just in case
      const norm = (Array.isArray(data) ? data : []).map((d: any) => ({
        code: (d.code || '').toString().toUpperCase(),
        percentage: Number(d.percentage ?? d.discountPercentage ?? 0),
        expiresAt: d.expiresAt ?? null,
        active: typeof d.active === 'boolean' ? d.active : true,
        remaining:
          typeof d.remaining === 'number'
            ? d.remaining
            : typeof d.remainingUses === 'number'
            ? d.remainingUses
            : null,
        maxCap:
          typeof d.maxCap === 'number'
            ? d.maxCap
            : typeof d.cap === 'number'
            ? d.cap
            : null,
      }));
      setAssigned(norm);
    } else {
      setAssigned([]);
    }
  } catch {
    setAssigned([]);
  } finally {
    setLoadingAssigned(false);
  }
};


  useEffect(() => {
    fetchAssignedDiscounts();
  }, []);

  // validate promo code
  const validatePromo = async (code: string) => {
    if (!code) {
      setPromoValid(false);
      setDiscountPercent(0);
      setDiscountMaxCap(null);
      return;
    }
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setPromoValid(data.valid);
      if (data.valid) {
        setDiscountPercent(data.discountPercentage);
        // data.maxCap could be number or null
        setDiscountMaxCap(typeof data.maxCap === 'number' ? data.maxCap : null);
      } else {
        setDiscountPercent(0);
        setDiscountMaxCap(null);
      }
    } catch {
      setPromoValid(false);
      setDiscountPercent(0);
      setDiscountMaxCap(null);
    }
  };

  const onPromoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim().toUpperCase();
    setPromo(code);
    validatePromo(code);
  };

  // apply discount to a specific cart-item
  const applyPromoToLead = (id: string, price: number) => {
  const safePrice = num(price, 0);
  if (!promoValid || discountPercent <= 0 || safePrice <= 0) return;
  const raw = safePrice * (discountPercent / 100);
  const discountAmt = discountMaxCap != null ? Math.min(raw, discountMaxCap) : raw;

  if (discountMaxCap != null && raw > discountMaxCap) {
    toast(`Cap applied at $${discountMaxCap.toFixed(2)}`);
  } else {
    toast.success(`${discountPercent}% Discount Applied`);
  }
  setDiscountedIds((prev) => new Set(prev).add(id));
};

  // compute total
  // 3) Make the total calculation robust too
  const total = useMemo(
    () =>
      (items ?? []).reduce((sum, { id, lead }) => {
        const price = num(lead.price, 0);              // <- coerce
        if (discountedIds.has(id) && discountPercent > 0) {
          const raw = price * (discountPercent / 100);
          const discountAmt = discountMaxCap != null ? Math.min(raw, discountMaxCap) : raw;
          return sum + Math.max(0, price - discountAmt); // guard against negatives
        }
        return sum + price;
      }, 0),
    [items, discountedIds, discountPercent, discountMaxCap]
  );


  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Code copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  const now = Date.now();
  const usableAssigned = useMemo(
    () =>
      assigned
        .filter((d) => d.code && d.percentage > 0)
        .filter((d) => d.active !== false)
        .filter((d) => {
          if (!d.expiresAt) return true;
          const t = new Date(d.expiresAt).getTime();
          return !Number.isNaN(t) ? t >= now : true;
        }),
    [assigned, now]
  );

  const formatExpiry = (iso?: string | null) => {
    if (!iso) return 'No expiry';
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return 'No expiry';
      return d.toLocaleDateString();
    } catch {
      return 'No expiry';
    }
  };
  

  return (
    <CombinedNavSidebar>
      <div className="bg-white min-h-screen py-10 px-6 md:px-12 max-w-5xl mx-auto text-[#1A1A1A]">
        <div className="mb-6 flex items-center gap-2 text-green-700">
          <ShoppingCart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Check Out</h1>
        </div>
        <p className="text-gray-500 mb-6">Order ID #2423</p>

        {/* Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-5 text-sm text-gray-500 font-semibold mb-2">
            <span>Name</span>
            <span>Area</span>
            <span>Type</span>
            <span>Price Range</span>
            <span className="text-right">Price</span>
          </div>

        {(items ?? []).map(({ id, lead }) => {
          const original = num(lead.price, 0);
          if (original <= 0) return null; // should never render due to fetch clean, but safe
          const isDiscounted = discountedIds.has(id);
          let final = original;
          let discountAmt = 0;

          if (isDiscounted && discountPercent > 0) {
            const raw = original * (discountPercent / 100);
            discountAmt = discountMaxCap != null ? Math.min(raw, discountMaxCap) : raw;
            final = original - discountAmt;
          }

          return (
            <div key={id} className="grid grid-cols-5 items-center border-t py-3 text-sm">
              <div className="text-gray-900 font-medium">
                <div className="flex items-center justify-between gap-2">
                  <span>{lead.name}</span>
                </div>

                <button
                  onClick={() => removeItem(id)}
                  disabled={removingIds.has(id)}
                  className="mt-1 text-xs text-red-600 hover:underline disabled:opacity-50"
                  title="Remove from cart"
                >
                  {removingIds.has(id) ? 'Removing…' : 'Remove'}
                </button>
              </div>

              <div>{lead.desireArea}</div>
              <div>{lead.propertyType}</div>
              <div>{lead.priceRange}</div>
              <div className="text-right">
                {isDiscounted ? (
                  <>
                    <span className="line-through text-gray-400 mr-1">
                      ${original.toFixed(2)}
                    </span>
                    <span className="text-green-600 font-semibold">
                      ${final.toFixed(2)}
                    </span>
                    <p className="text-green-500 text-xs">
                      You saved ${discountAmt.toFixed(2)}
                    </p>
                    {discountMaxCap != null && discountAmt === discountMaxCap && (
                      <p className="text-green-500 text-[10px]">
                        (Cap of ${discountMaxCap.toFixed(2)} applied)
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-gray-800">
                      ${original.toFixed(2)}
                    </span>
                    {promoValid && original > 0 && (
                      <button
                        onClick={() => applyPromoToLead(id, original)}
                        className="text-green-600 text-xs hover:underline ml-2"
                      >
                        Apply {discountPercent}% Off
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}

        </div>

        {/* Summary */}

        <div className="text-right text-base font-semibold text-gray-800 mb-6">
          Total: <span className="text-green-700">${num(total, 0).toFixed(2)}</span>
          <p className="text-sm text-gray-500 mt-1">
            {(items ?? []).length} Lead{(items ?? []).length > 1 && 's'}
          </p>
        </div>


        {/* Promo Input */}
        <div className="mb-6 max-w-lg">
          <input
            type="text"
            value={promo}
            onChange={onPromoChange}
            placeholder="Add a discount/promo code"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: one discount per lead.
          </p>
          {promoValid && (
            <div className="flex items-center text-green-600 text-sm mt-1 gap-1">
              <Check className="w-4 h-4" />
              Code valid: {discountPercent}% off up to{' '}
              {discountMaxCap != null ? `$${discountMaxCap.toFixed(2)}` : '∞'}
            </div>
          )}
        </div>

        {/* Assigned Discounts */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-700" />
            <h3 className="font-semibold">Your Discount Codes</h3>
          </div>

          {loadingAssigned ? (
            <p className="text-sm text-gray-500">Loading your discounts…</p>
          ) : usableAssigned.length === 0 ? (
            <p className="text-sm text-gray-500">
              No active discounts available.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {usableAssigned.map((d) => (
                <div
                  key={`${d.code}-${d.expiresAt ?? 'noexp'}`}
                  className="border rounded-lg px-4 py-3 flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {getDiscountLabel(d)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold">
                        <Percent className="w-3 h-3" />
                        {d.percentage} OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>Valid till: {formatExpiry(d.expiresAt)}</span>
                      {typeof d.remaining === 'number' && (
                        <span>• Uses left: {d.remaining}</span>
                      )}
                      {typeof d.maxCap === 'number' && (
                        <span>• Cap: ${d.maxCap.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copy(d.code)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const code = d.code.toUpperCase();
                        setPromo(code);
                        validatePromo(code);
                        toast.success('Code applied. Now click “Apply … Off” on the lead you want.');
                      }}
                      className="text-green-700 text-sm font-medium hover:underline"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <button
            onClick={() => router.push('/user/leads')}
            className="bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-full hover:bg-gray-200 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Add More Leads
          </button>

          <CartCheckoutButton
            cartItems={items}
            referralCode={promoValid ? promo : undefined}
            discountPercent={promoValid ? discountPercent : 0}
            discountMaxCap={promoValid ? discountMaxCap : null}
            onSuccess={() => {
              setItems([]);
              setDiscountedIds(new Set());
              toast.success('Order confirmed');
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-green-700"
          />
        </div>
      </div>
    </CombinedNavSidebar>
  );
}
