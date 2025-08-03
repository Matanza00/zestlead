'use client';
import UserLayout from '@/components/CombinedNavbar';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage(props) {
  const { data: session, update } = useSession();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/account/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        await update();
        toast.success('Profile updated!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="max-w-md mx-auto p-6 space-y-4 bg-white border rounded shadow">
        <h1 className="text-xl font-semibold">Your Profile</h1>
        <div>
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={session?.user?.email || ''}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 text-sm text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
        </div>
        <div className="pt-6 border-t mt-6">
        <label className="block text-sm text-gray-600 mb-1">New Password</label>
        <input
            type="password"
            className="w-full border px-3 py-2 rounded text-sm mb-3"
            placeholder="Enter new password"
        />
        <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
        <input
            type="password"
            className="w-full border px-3 py-2 rounded text-sm"
            placeholder="Confirm new password"
        />
        <button className="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 text-sm">
            Update Password
        </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {loading ? 'Saving...' : 'Update Profile'}
        </button>
      </div>
    </UserLayout>
  );
}
