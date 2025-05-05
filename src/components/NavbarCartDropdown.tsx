// components/NavbarCartDropdown.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type CartItem = {
  id: string;
  lead: {
    id: string;
    name: string;
    price: number;
    propertyType: string;
  };
};

export default function NavbarCartDropdown() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch cart data, bypassing cache for fresh results
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include', cache: 'no-store' });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setCartItems(data);
      else console.error('Unexpected /api/cart response:', data);
    } catch (err) {
      console.error('Error loading cart:', err);
    }
  };

  // Initial load and listen for cart-updated events
  useEffect(() => {
    fetchCart();
    const onCartUpdated = () => fetchCart();
    window.addEventListener('cart-updated', onCartUpdated);
    return () => window.removeEventListener('cart-updated', onCartUpdated);
  }, []);

  // Refresh cart whenever dropdown is opened
  useEffect(() => {
    if (open) fetchCart();
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const removeItem = async (id: string) => {
    try {
      const res = await fetch(`/api/cart/${id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      toast.success('Removed from cart');
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error('Could not remove item');
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 hover:bg-gray-100 rounded"
        aria-label="Cart"
      >
        {/* Cart SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9m-6-9v9"
          />
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {cartItems.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          <div className="p-4 max-h-80 overflow-y-auto">
            {cartItems.length === 0 ? (
              <p className="text-gray-600 text-sm">Your cart is empty.</p>
            ) : (
              cartItems.map(({ id, lead }) => (
                <div key={id} className="flex justify-between items-center mb-3 last:mb-0">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.propertyType}</p>
                    <p className="text-sm">PKR {lead.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeItem(id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="border-t p-3">
              <Link href="/cart" className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                View Full Cart
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}