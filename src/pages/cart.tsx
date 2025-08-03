'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CombinedNavSidebar from '@/components/CombinedNavbar';
import CartCheckoutButton from '@/components/CartCheckoutButton';
import { ShoppingCart, ArrowLeft, Check } from 'lucide-react';

export default function CartPage() {
  const [items, setItems] = useState<
    { id: string; lead: { id: string; name: string; price: number; propertyType: string; desireArea: string; priceRange: string } }[]
  >([]);
  const [promo, setPromo] = useState('');
  const [promoValid, setPromoValid] = useState(false);
  const [discountedIds, setDiscountedIds] = useState<Set<string>>(new Set());
  const [discountPercent, setDiscountPercent] = useState(0);


  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error('Failed to load cart.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const remove = async (id: string) => {
    await fetch(`/api/cart/${id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const applyPromoToLead = (id: string) => {
    if (promo === 'ZEST30') {
      setDiscountedIds(prev => new Set([...prev, id]));
      toast.success('30% Discount Applied');
    }
  };

  const calculateTotal = () => {
  const applyDiscount = promoValid && discountPercent > 0;
  return items.reduce((acc, item, idx) => {
    const price = item.lead.price || 0;
    const isDiscounted = applyDiscount && idx === 0; // 1 discount per user/lead
    const discount = isDiscounted ? price * (discountPercent / 100) : 0;
    return acc + (price - discount);
  }, 0);
};


  return (
    <CombinedNavSidebar>
      <div className="bg-white min-h-screen py-10 px-6 md:px-12 max-w-5xl mx-auto text-[#1A1A1A]">
        <div className="mb-6 flex items-center gap-2 text-green-700">
          <ShoppingCart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Check Out</h1>
        </div>
        <p className="text-gray-500 mb-6">Order ID #2423</p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-5 text-sm text-gray-500 font-semibold mb-2">
            <span>Name</span>
            <span>Area</span>
            <span>Type</span>
            <span>Property Price</span>
            <span className="text-right">Price</span>
          </div>

          {items.map(({ id, lead }) => {
            const isDiscounted = discountedIds.has(id);
            const originalPrice = lead.price || 0;
            const finalPrice = isDiscounted ? originalPrice * 0.7 : originalPrice;

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
                      <span className="line-through text-gray-400 text-sm mr-1">${originalPrice.toFixed(0)}</span>
                      <span className="text-green-600 font-semibold">${finalPrice.toFixed(0)}</span>
                      <p className="text-green-500 text-xs">30% Off</p>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-gray-800">${originalPrice.toFixed(0)}</span>
                      {promo === 'ZEST30' && (
                        <div>
                          <button
                            onClick={() => applyPromoToLead(id)}
                            className="text-green-600 text-xs hover:underline ml-2"
                          >
                            Apply 30% Discount
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-right text-base font-semibold text-gray-800 mb-6">
          Total: <span className="text-green-700">${calculateTotal().toFixed(0)}</span>
          {promoValid && discountPercent > 0 && (
          <p className="text-sm text-green-500">
            Promo Applied: {discountPercent}% off {items.length === 1 ? 'this lead' : 'the first lead'}
          </p>
        )}
          <p className="text-sm text-gray-500 mt-1">{items.length} Leads</p>
        </div>
        


        <div className="mb-6 max-w-lg">
          <input
            type="text"
            value={promo}
            onChange={async (e) => {
              const code = e.target.value.trim();
              setPromo(code);

              if (!code) return setPromoValid(false);

              try {
                const res = await fetch('/api/discount/validate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ code }),
                });
                const data = await res.json();
                setPromoValid(data.valid);
                setDiscountPercent(data.valid ? data.discountPercentage : 0);
              } catch {
                setPromoValid(false);
              }
            }}

            placeholder="Add a discount/promo code"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Note: You can only apply the discount/promo code on a single lead.
          </p>
          {promoValid && (
            <div className="flex items-center text-green-600 text-sm mt-1 gap-1">
              <Check className="w-4 h-4" />
              Discount Code is valid
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <button className="bg-gray-100 text-gray-800 text-sm px-4 py-2 rounded-full hover:bg-gray-200 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Add More Leads
          </button>

          <CartCheckoutButton
            cartItems={items}
            referralCode={promoValid ? promo : undefined}
            discountPercent={promoValid ? discountPercent : 0}
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
