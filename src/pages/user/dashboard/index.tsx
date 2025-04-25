// src/pages/user/dashboard/index.tsx
import UserLayout from '@/layouts/UserLayout';
import { useSession } from 'next-auth/react';

export default function UserDashboard(props) {
  const { data: session } = useSession();

  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {session?.user?.name || 'Agent'} 👋</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-sm text-gray-500">Subscription Plan</h2>
            <p className="text-lg font-semibold text-gray-800">Premium</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-sm text-gray-500">Lead Credits</h2>
            <p className="text-lg font-semibold text-gray-800">12 Remaining</p>
          </div>
          <div className="bg-white shadow rounded-lg p-5">
            <h2 className="text-sm text-gray-500">Leads Purchased</h2>
            <p className="text-lg font-semibold text-gray-800">38</p>
          </div>
        </div>

        {/* Add recent activity / upcoming sections below */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Activity</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Purchased lead for “DHA Phase 6 – PKR 2.5Cr”</li>
            <li>• Updated profile email</li>
            <li>• Contacted lead “Bahria Town – 5 Marla”</li>
          </ul>
        </div>
      </div>
    </UserLayout>
  );
}
