'use client';
import { useSession } from 'next-auth/react';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '../../../components/dashboard/StatCard';
import BarChartComponent from '../../../components/charts/BarChartComponent';
import AreaChartComponent from '../../../components/charts/AreaChartComponent';
import RecentLeads from '../../../components/dashboard/RecentLeads';
import Subscription from '../../../components/dashboard/Subscription';
import Balance from '../../../components/dashboard/Balance';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import GradientIcon from '../../../components/ui/GradientIcon';
import useSWR from 'swr';

export default function AdminDashboard(props) {
  const { data: session } = useSession();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR('/api/admin/dashboard/summary', fetcher, {
    revalidateOnFocus: false,
  });

  const fmt = (n: number | undefined | null, dashes = '—') =>
    (typeof n === 'number' && isFinite(n) ? n : dashes);

  const fmtMoney = (n: number | undefined | null) =>
    typeof n === 'number' && isFinite(n)
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data?.totals?.revenue?.currency ?? 'USD' }).format(n)
      : '—';

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {session?.user?.name ?? 'Admin'}!
          </h1>
          {isLoading && <p className="text-sm text-gray-500 mt-1">Loading admin stats…</p>}
          {error && <p className="text-sm text-red-600 mt-1">Failed to load admin stats.</p>}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard
                title="Total Users"
                value={isLoading ? '—' : fmt(data?.totals?.users)}
                icon={<GradientIcon name="users" />}
              />
              <StatCard
                title="Subscribed Users"
                value={isLoading ? '—' : fmt(data?.totals?.subscribedUsers)}
                subtitle={data?.totals?.subscribedUsers == null ? 'Model not configured' : undefined}
                icon={<GradientIcon name="subscribed" />}
              />
              <StatCard
                title="Total Leads"
                value={isLoading ? '—' : fmt(data?.totals?.leads)}
                icon={<GradientIcon name="newLeads" />}
                buttonText="Manage Leads"
              />
              <StatCard
                title="Purchased Leads"
                value={isLoading ? '—' : fmt(data?.totals?.purchasedLeads)}
                icon={<GradientIcon name="purchasedLeads" />}
              />
              <StatCard
                title="Closed Deals"
                value={isLoading ? '—' : fmt(data?.totals?.closedDeals)}
                icon={<GradientIcon name="dealClosed" />}
              />
              <StatCard
                title="Revenue (Gross)"
                value={isLoading ? '—' : fmtMoney(data?.totals?.revenue?.gross)}
                icon={<GradientIcon name="revenue" />}
              />

              {/* Optional cards (only if you want them visible) */}
              <StatCard
                title="Referrals"
                value={isLoading ? '—' : fmt(data?.totals?.referrals)}
                subtitle={data?.totals?.referrals == null ? 'Model not configured' : undefined}
                icon={<GradientIcon name="referrals" />}
              />
              <StatCard
                title="Discount Codes"
                value={isLoading ? '—' : fmt(data?.totals?.discountCodes)}
                subtitle={data?.totals?.discountCodes == null ? 'Model not configured' : undefined}
                icon={<GradientIcon name="discounts" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartComponent
                data={(data?.charts?.closedWeekly ?? []).map(
                  (w: { weekStart: string; count: number }) => ({
                    label: new Date(w.weekStart).toLocaleDateString(),
                    value: w.count,
                  })
                )}
              />
              <AreaChartComponent
                data={(data?.charts?.revenueWeekly ?? []).map(
                  (w: { weekStart: string; value: number }) => ({
                    label: new Date(w.weekStart).toLocaleDateString(),
                    value: w.value,
                  })
                )}
              />
            </div>

            {/* Recent purchases table (admin-wide) */}
            <RecentLeads
              items={(data?.recentPurchases ?? []).map((p: any) => ({
                id: p.id,
                purchasedAt: p.purchasedAt,
                status: p.status,
                name: p.lead?.name ?? p.buyer?.name ?? '—',
                contact: p.lead?.contact || p.lead?.email || p.buyer?.email || '—',
                meta: {
                  type: p.lead?.leadType,
                  area: p.lead?.desireArea,
                  price: p.lead?.price ?? '—',
                  beds: p.lead?.beds,
                  baths: p.lead?.baths,
                }
              }))}
/>
          </div>

          {/* Right Sidebar (keep your existing widgets or swap for admin-specific) */}
          <div className="xl:col-span-1 space-y-6">
            <Subscription />
            <Balance />
            <RecentActivity />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
