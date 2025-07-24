'use client';
import { useSession } from 'next-auth/react';
import UserLayout from '@/components/layout/UserLayout';
import StatCard from '@/components/dashboard/StatCard';
import DealsClosedChart from '@/components/charts/DealsClosedChart';
import RevenueGeneratedChart from '@/components/charts/RevenueGeneratedChart';
import RecentLeadsTable from '@/components/dashboard/RecentLeadsTable';
import SubscriptionCard from '@/components/dashboard/SubscriptionCard';
import BalanceCard from '@/components/dashboard/BalanceCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <UserLayout>
            <div className="p-4 sm:p-6 bg-gray-50/50 min-h-screen">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Welcome, John!</h1>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <div className="xl:col-span-3 space-y-6">
                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            <StatCard 
                                title="New Leads" 
                                value="54" 
                                buttonText="Visit Marketplace"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>}
                                buttonIcon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>}
                            />
                            <StatCard 
                                title="Purchased Leads" 
                                value="120" 
                                buttonText="Manage Leads"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>}
                            />
                            <StatCard 
                                title="Contacted Leads" 
                                value="84" 
                                buttonText="View Status"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>}
                            />
                        </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <DealsClosedChart />
                                <RevenueGeneratedChart />
                            </div>

                            {/* Recent Leads Table */}
                            <RecentLeadsTable />
                    </div>
                    <div className="xl:col-span-1 space-y-6">
                        {/* Right Sidebar Content */}
                        <SubscriptionCard />
                        <BalanceCard />
                        <RecentActivityCard />
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
