// pages/cart.tsx
'use client';
import { useEffect, useState } from 'react';
import CartCheckoutButton from '@/components/CartCheckoutButton';
import toast from 'react-hot-toast';

export default function CartPage(props) {
  const [items, setItems] = useState<
    { id: string; lead: { id: string; name: string; price: number; propertyType: string } }[]
  >([]);

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

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {!items.length && <p>Your cart is empty.</p>}
      {items.map(({ id, lead }) => (
        <div key={id} className="flex justify-between items-center mb-2 p-3 border rounded">
          <div>
            <p className="font-medium">{lead.name}</p>
            <p className="text-sm text-gray-600">{lead.propertyType}</p>
          </div>
          <div className="flex items-center gap-4">
            <span>${lead.price.toFixed(2)}</span>
            <button
              onClick={() => remove(id)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-6">
          {/* Pass the cart items into your checkout button */}
          <CartCheckoutButton cartItems={items} onSuccess={() => setItems([])} />
        </div>
      )}
    </div>
  );
}
