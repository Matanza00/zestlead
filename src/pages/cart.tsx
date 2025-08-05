'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CombinedNavSidebar from '@/components/CombinedNavbar';
import CartCheckoutButton from '@/components/CartCheckoutButton';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';

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

export default function CartPage(props) {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [promo, setPromo] = useState('');
  const [promoValid, setPromoValid] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  // now possibly null if unlimited
  const [discountMaxCap, setDiscountMaxCap] = useState<number | null>(null);
  const [discountedIds, setDiscountedIds] = useState<Set<string>>(new Set());

  // fetch cart
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error('Failed to load cart.');
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
  }, [leadIdParam]);

  useEffect(() => {
    fetchCart();
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
        setDiscountMaxCap(
          typeof data.maxCap === 'number' ? data.maxCap : null
        );
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
    if (!promoValid || discountPercent <= 0) return;
    const raw = price * (discountPercent / 100);
    const discountAmt =
      discountMaxCap != null ? Math.min(raw, discountMaxCap) : raw;

    if (discountMaxCap != null && raw > discountMaxCap) {
      toast(`Cap applied at $${discountMaxCap.toFixed(2)}`);
    } else {
      toast.success(`${discountPercent}% Discount Applied`);
    }

    setDiscountedIds(prev => new Set(prev).add(id));
  };

  // compute total
  const calculateTotal = () =>
    items.reduce((sum, { id, lead }) => {
      const price = lead.price;
      if (discountedIds.has(id)) {
        const raw = price * (discountPercent / 100);
        const discountAmt =
          discountMaxCap != null ? Math.min(raw, discountMaxCap) : raw;
        return sum + (price - discountAmt);
      }
      return sum + price;
    }, 0);

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

          {items.map(({ id, lead }) => {
            const original = lead.price;
            const isDiscounted = discountedIds.has(id);
            let final = original;
            let discountAmt = 0;

            if (isDiscounted) {
              const raw = original * (discountPercent / 100);
              discountAmt =
                discountMaxCap != null
                  ? Math.min(raw, discountMaxCap)
                  : raw;
              final = original - discountAmt;
            }

            return (
              <div
                key={id}
                className="grid grid-cols-5 items-center border-t py-3 text-sm"
              >
                <div className="text-gray-900 font-medium">{lead.name}</div>
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
                      {promoValid && (
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
          Total:{' '}
          <span className="text-green-700">
            ${calculateTotal().toFixed(2)}
          </span>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} Lead{items.length > 1 && 's'}
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
              {discountMaxCap != null
                ? `$${discountMaxCap.toFixed(2)}`
                : '∞'}
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
