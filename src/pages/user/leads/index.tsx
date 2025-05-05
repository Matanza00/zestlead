// pages/user/leads.tsx
'use client';
import UserLayout from '@/layouts/UserLayout';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type Lead = {
  id: string;
  name: string;
  propertyType: string;
  desireArea: string;
  priceRange: string;
  price: number | null;
  leadType: 'BUYER' | 'SELLER';
  createdAt: string;
};

type CartItem = {
  id: string;
  lead: {
    id: string;
    name: string;
    propertyType: string;
    price: number;
  };
};

export default function UserLeadsPage(props) {
  const { data: session } = useSession();
  const userId = session?.user?.id as string;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'BUYER' | 'SELLER'>('BUYER');

  // fetch leads
  useEffect(() => {
    fetch('/api/user/leads')
      .then((r) => r.json())
      .then(setLeads)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // fetch existing cart items
  useEffect(() => {
    fetch('/api/cart', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: CartItem[]) => setCartItems(data))
      .catch(console.error);
  }, []);

  const addToCart = async (leadId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      const newItem: CartItem = await res.json();
      setCartItems((prev) => [...prev, newItem]);
      toast.success('Added to cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to add to cart');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' , credentials: 'include', });
      if (!res.ok) throw new Error('Delete failed');
      setCartItems((prev) => prev.filter((ci) => ci.id !== itemId));
      toast.success('Removed from cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove from cart');
    }
  };

  const filtered = leads.filter((l) => l.leadType === activeTab);

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Leads Marketplace</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-2">
          {(['BUYER', 'SELLER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading leads…</p>
        ) : filtered.length === 0 ? (
          <p>No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow-sm">
              <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price Range</th>
                  <th className="p-3">Admin Price</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => {
                  // find if this lead is in cart
                  const cartItem = cartItems.find((ci) => ci.lead.id === lead.id);
                  const inCart = Boolean(cartItem);

                  return (
                    <tr key={lead.id} className="border-t text-sm">
                      <td className="p-3">{lead.name}</td>
                      <td className="p-3">{lead.desireArea}</td>
                      <td className="p-3">{lead.propertyType}</td>
                      <td className="p-3">{lead.priceRange}</td>
                      <td className="p-3">
                        {lead.price ? `PKR ${lead.price.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-3 text-center">
                        {inCart ? (
                          <button
                            onClick={() => removeFromCart(cartItem!.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                          >
                            Remove from Cart
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(lead.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Add to Cart
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
