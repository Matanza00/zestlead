'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CombinedAdminNav from '@/components/layout/AdminLayout';

export default function AdminSupportPage(props) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/support-chat')
      .then((res) => res.json())
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <CombinedAdminNav>
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Support Chats</h1>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users have contacted support yet.</p>
      ) : (
        <ul className="divide-y border rounded bg-white shadow-sm">
          {users.map((user) => (
            <li key={user.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-800">{user.name || user.email}</p>
                <p className="text-sm text-gray-500">
                  {user.supportChats?.[0]?.message || 'No message'} ·{' '}
                  {user.supportChats?.[0]?.createdAt
                    ? new Date(user.supportChats[0].createdAt).toLocaleString()
                    : ''}
                </p>
              </div>
              <Link
                href={`/admin/support/${user.id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Chat →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    </CombinedAdminNav>
  );
}
