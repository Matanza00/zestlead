// src/pages/DashboardPage.js (or your file path)

'use client';

import { useSession } from 'next-auth/react';
import UserLayout from '../../components/CombinedNavbar';
import StatCard from '../../components/dashboard/StatCard';
import BarChartComponent from '../../components/charts/BarChartComponent';
import AreaChartComponent from '../../components/charts/AreaChartComponent';
import RecentLeads from '../../components/dashboard/RecentLeads';
import Subscription from '../../components/dashboard/Subscription';
import Balance from '../../components/dashboard/Balance';
import RecentActivity from '../../components/dashboard/RecentActivity';
import GradientIcon from '../../components/ui/GradientIcon'; // ✨ Import the new icon component

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
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <StatCard
                title="New Leads"
                value="54"
                buttonText="Visit Marketplace"
                icon={<GradientIcon name="newLeads" />}
                buttonIcon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
                }
              />
              <StatCard
                title="Purchased Leads"
                value="120"
                buttonText="Manage Leads"
                icon={<GradientIcon name="purchasedLeads" />}
              />
              <StatCard
                title="Contacted Leads"
                value="84"
                buttonText="View Status"
                icon={<GradientIcon name="contactedLeads" />}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChartComponent />
              <AreaChartComponent />
            </div>

            {/* Recent Leads Table */}
            <RecentLeads />
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