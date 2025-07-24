'use client';
import UserLayout from '@/layouts/UserLayout';
import { useSession } from 'next-auth/react';

export default function UserDashboard(props) {
  const { data: session } = useSession();

  return (
    <UserLayout>
      {/* full-page gradient */}
      <div
        className="min-h-screen p-6 space-y-6"
        style={{
          background: 'linear-gradient(135deg, var(--tw-gradient-stops))',
        }}
        // className="bg-gradient-to-br from-bgStart to-bgEnd"
      >
        {/* Welcome */}
        <h1 className="text-4xl font-heading text-surface">
          Welcome, {session?.user?.name || 'Agent'} 👋
        </h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Subscription Plan', value: 'Premium' },
            { label: 'Lead Credits', value: '12 Remaining' },
            { label: 'Leads Purchased', value: '38' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-surface rounded-2xl shadow-md p-6 flex flex-col"
            >
              <span className="text-sm font-medium text-text">{label}</span>
              <span className="mt-2 text-2xl font-semibold text-primary">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-heading text-text mb-4">
            Recent Activity
          </h2>
          
          <ul className="space-y-2 font-body text-text">
            <li>• Purchased lead for “DHA Phase 6 – PKR 2.5Cr”</li>
            <li>• Updated profile email</li>
            <li>• Contacted lead “Bahria Town – 5 Marla”</li>
          </ul>
        </div>
      </div>

      <p className="text-red-500">🔴 If this text is red, Tailwind is now loaded!</p>

    </UserLayout>
  );
}
