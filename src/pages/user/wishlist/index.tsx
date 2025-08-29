// src/pages/user/wishlist.tsx
'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CombinedNavSidebar from '@/components/CombinedNavbar';
import { useRouter } from 'next/navigation';
import { Trash2, Heart } from 'lucide-react';

interface WishlistEntry {
  id: string;
  lead: {
    id: string;
    name: string;
    propertyType: string;
    desireArea: string;
    price: number;
  };
}

export default function WishlistPage(props) {
  const [entries, setEntries] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load wishlist on mount
  useEffect(() => {
    fetch('/api/user/wishlist', { credentials: 'include' })
      .then(r => r.json())
      .then((data: WishlistEntry[]) => setEntries(data))
      .catch(() => toast.error('Failed to load wishlist'));
  }, []);

  // Remove from wishlist
  const handleRemove = async (leadId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/wishlist/${leadId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error();
      setEntries(e => e.filter(item => item.lead.id !== leadId));
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CombinedNavSidebar>
      <div className="bg-white min-h-screen py-10 px-6 md:px-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-2 text-green-700">
          <Heart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Your Wishlist</h1>
        </div>

        {entries.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty. Browse leads and tap the heart to save them here.</p>
        ) : (
          <ul className="space-y-4">
            {entries.map(({ lead }) => (
              <li
                key={lead.id}
                className="group flex justify-between items-center p-6 border border-[#D1D5DC] rounded-lg hover:shadow-lg transition"
              >
                {/* Lead Info */}
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">{lead.name}</h2>
                  <p className="text-sm text-gray-600">
                    {lead.propertyType} • {lead.desireArea}
                  </p>
                  <p className="text-base font-medium text-green-700">
                    ${(lead.price ?? 0).toFixed(0)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push(`/user/leads/view/${lead.id}`)}
                    className="text-sm text-green-600 hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleRemove(lead.id)}
                    disabled={loading}
                    className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CombinedNavSidebar>
  );
}
