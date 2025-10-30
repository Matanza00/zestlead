'use client';
import { useSession } from 'next-auth/react';
import UserLayout from '../../../components/CombinedNavbar';
import StatCard from '../../../components/dashboard/StatCard';
import BarChartComponent from '../../../components/charts/BarChartComponent';
import AreaChartComponent from '../../../components/charts/AreaChartComponent';
import RecentLeads from '../../../components/dashboard/RecentLeads';
import Subscription from '../../../components/dashboard/Subscription';
import Balance from '../../../components/dashboard/Balance';
import RecentActivity from '../../../components/dashboard/RecentActivity';
import GradientIcon from '../../../components/ui/GradientIcon'; // ✨ Import the new icon component
import useSWR from 'swr';

export default function UserDashboard(props) {
  const { data: session } = useSession();
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  const { data, error, isLoading } = useSWR('/api/user/dashboard/summary', fetcher, {
    revalidateOnFocus: false,
  });

  return (
    <UserLayout>
      {/* full-page gradient */}
      <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
              <div className="mb-6">
                 <h1 className="text-2xl font-bold text-gray-800">
                  Welcome, {session?.user?.name ?? 'Agent'}!
                </h1>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-3 space-y-6">
                  {/* Stats Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <StatCard
                      title="New Leads"
                      value={isLoading ? '—' : (data?.newLeads?.last7 ?? 0)}
                      subtitle={
                        isLoading
                          ? undefined
                          : `Today: ${data?.newLeads?.today ?? 0} · Last 3d: ${data?.newLeads?.last3 ?? 0}`
                      }
                      buttonText="Visit Marketplace"
                      icon={<GradientIcon name="newLeads" />}
                      buttonIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          className="h-4 w-4 mr-2">
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                        </svg>
                      }
                    />

                    <StatCard
                      title="Purchased Leads"
                      value={isLoading ? '—' : (data?.purchasedLeads?.total ?? 0)}
                      subtitle={isLoading ? undefined : `Last 7d: ${data?.purchasedLeads?.last7 ?? 0}`}
                      buttonText="Manage Leads"
                      icon={<GradientIcon name="purchasedLeads" />}
                    />

                    <StatCard
                      title="Contacted Leads"
                      value={isLoading ? '—' : (data?.contactedLeads?.total ?? 0)}
                      subtitle={isLoading ? undefined : `Last 7d: ${data?.contactedLeads?.last7 ?? 0}`}
                      buttonText="View Status"
                      icon={<GradientIcon name="contactedLeads" />}
                    />
                  </div>
      
                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChartComponent
                      data={(data?.dealClosed?.weekly ?? []).map(w => ({
                        label: new Date(w.weekStart).toLocaleDateString(),
                        value: w.count
                      }))}
                    />
                    <AreaChartComponent
                      data={(data?.charts?.area ?? []).map(d => ({
                        label: new Date(d.date).toLocaleDateString(),
                        value: d.newLeads
                      }))}
                    />
                  </div>
      
                  {/* Recent Leads Table */}
                  <RecentLeads
                    items={(data?.recentPurchases ?? []).map(p => ({
                      id: p.id,
                      purchasedAt: p.purchasedAt,
                      status: p.status,
                      name: p.lead.name,
                      contact: p.lead.contact || p.lead.email,
                      meta: {
                        type: p.lead.leadType,
                        area: p.lead.desireArea,
                        price: p.lead.price ?? p.lead.priceRange,
                        beds: p.lead.beds,
                        baths: p.lead.baths,
                      }
                    }))}
                  />
                </div>
      
                {/* Right Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                  <Subscription />
                  <Balance />
                  <RecentActivity />
                </div>
              </div>
            </div>

    </UserLayout>
  );
}
