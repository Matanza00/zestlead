'use client';
import UserLayout from '@/components/CombinedNavbar';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

// Corrected mock data for the charts to match the image
const barChartData = [
  { name: 'Week 1', value: 38 },
  { name: 'Week 2', value: 42 },
  { name: 'Week 3', value: 22 },
  { name: 'Week 4', value: 45 },
];

const areaChartData = [
  { name: 'Week 1', value: 10 },
  { name: 'Week 2', value: 25 },
  { name: 'Week 3', value: 20 },
  { name: 'Week 4', value: 40 },
];

// Mock data for the table
const recentLeadsData = [
    { name: 'John Smith', phone: '+1 (495) 234 3452', property: 'Street 16, Sunset Boulevard', status: 'Not Contacted' },
    { name: 'Jane Doe', phone: '+1 (312) 456 7890', property: 'Avenue 21, Maple Street', status: 'Contacted' },
    { name: 'Emily Carter', phone: '+1 (415) 789 1234', property: '123 Elm Street, Oakwood', status: 'Reached Out' },
    { name: 'Sophia Bennett', phone: '+1 (408) 555 9876', property: '456 Maple Avenue, Greenfield', status: 'Contacted' },
    { name: 'Sophia Johnson', phone: '+1 (408) 555 1234', property: '789 Oak Street, Maplewood', status: 'Reached Out' },
    { name: 'Jake Bennett', phone: '+1 (408) 555 9876', property: '456 Maple Avenue, Greenfield', status: 'Contacted' },
];

// Data for Recent Activity
const recentActivityData = [
    { date: '24th Jan 2024', activities: [
        { icon: 'dollar', text: 'You bought 15 leads for $59' },
        { icon: 'user', text: "Tagged Glenn as 'Contacted'" }
    ]},
    { date: '22nd Jan 2024', activities: [
        { icon: 'phone', text: 'Called Glenn' }
    ]},
    { date: '20th Jan 2024', activities: [
        { icon: 'creditUp', text: 'Credit Topped Up' },
        { icon: 'upgrade', text: 'Upgraded to Pro Monthly' },
        { icon: 'stripe', text: 'Stripe Refund issued for 1 Lead' },
        { icon: 'download', text: 'You downloaded CSV export' }
    ]},
    { date: '19th Jan 2024', activities: [
        { icon: 'house', text: "Sold John's House" },
        { icon: 'send', text: 'Bulk-Lead Order Sent' },
        { icon: 'check', text: 'Followed up with Clay' }
    ]},
];

// Icon component for dynamic icons in the activity feed
const ActivityIcon = ({ iconName, className }) => {
    const icons = {
        dollar: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>,
        user: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
        phone: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
        creditUp: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5l0 14"/><path d="m18 11-6-6-6 6"/></svg>,
        upgrade: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>,
        stripe: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>,
        download: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
        house: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        send: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
        check: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>
    };
    return icons[iconName] || null;
}

export default function DashboardPage(props) {
    const { data: session } = useSession();

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Not Contacted':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'Contacted':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'Reached Out':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-secondary text-secondary-foreground';
        }
    };


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
            <div className="rounded-lg flex flex-col justify-between border bg-white text-card-foreground shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600">
                    <line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                New Leads
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-900">54</p>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium h-8 rounded-md px-3 bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                  </svg>
                  Visit Marketplace
                </button>
              </div>
            </div>
            <div className="rounded-lg flex flex-col justify-between border bg-white text-card-foreground shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600">
                    <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Purchased Leads
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-900">120</p>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium h-8 rounded-md px-3 bg-green-600 text-white hover:bg-green-700 transition-colors">Manage Leads</button>
              </div>
            </div>
            <div className="rounded-lg flex flex-col justify-between border bg-white text-card-foreground shadow-sm p-6">
              <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-green-600">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Contacted Leads
              </h3>
              <div className="flex items-end justify-between">
                <p className="text-4xl font-bold text-gray-900">84</p>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-xs font-medium h-8 rounded-md px-3 bg-green-600 text-white hover:bg-green-700 transition-colors">View Status</button>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-800">Deals Closed</h3>
                <div className="flex items-center text-xs text-gray-500">1M
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 50]}/>
                        <Tooltip
                            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}
                            labelStyle={{ color: "#4b5563" }}
                            itemStyle={{ color: "#111827", fontWeight: "bold" }}
                        />
                        <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-800">Revenue Generated</h3>
                <div className="flex items-center text-xs text-gray-500">1M
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 ml-1">
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </div>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[0, 50]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }}
                            labelStyle={{ color: "#4b5563" }}
                            itemStyle={{ color: "#111827", fontWeight: "bold" }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#10B981" fill="url(#revenueGradient)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Leads Table */}
          <div className="rounded-lg border bg-white text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="font-semibold text-base text-gray-800">Recently Purchased Leads</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Name</th>
                    <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Phone</th>
                    <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Property</th>
                    <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                    <th className="text-right p-3 font-medium text-gray-500 text-xs uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeadsData.map((lead, index) => (
                    <tr key={index} className="border-b border-gray-200/50 hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-sm text-gray-800">{lead.name}</td>
                        <td className="p-3 text-gray-500 text-sm">{lead.phone}</td>
                        <td className="p-3 text-gray-500 text-sm">{lead.property}</td>
                        <td className="p-3">
                            <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(lead.status)}`}>{lead.status}</div>
                        </td>
                        <td className="p-3">
                            <div className="flex items-center justify-end space-x-1">
                                <button className="h-8 w-8 inline-flex items-center justify-center hover:bg-gray-200 rounded-md text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </button>
                                <button className="h-8 w-8 inline-flex items-center justify-center hover:bg-gray-200 rounded-md text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="10" y1="15" x2="10" y2="9" /><line x1="14" y1="15" x2="14" y2="9" /></svg>
                                </button>
                                <button className="h-8 w-8 inline-flex items-center justify-center hover:bg-gray-200 rounded-md text-gray-600">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="xl:col-span-1 space-y-6">
          {/* Right Sidebar Content */}
          <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-gray-800">Subscription</h3>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700">Active</div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Plan</p>
                <p className="font-medium text-gray-800">🚀 Ultimate Agent</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Leads Purchased</p>
                  <p className="font-semibold text-sm text-gray-800">10 <span className="text-gray-500 font-normal">out of 10</span></p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Days Left</p>
                  <p className="font-semibold text-sm text-gray-800">12</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-gray-800">Balance</h3>
            </div>
            <div className="mb-4">
              <p className="text-3xl font-bold text-gray-900">$1,554</p>
            </div>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 w-full text-white bg-gradient-to-b from-green-500 to-green-600 hover:opacity-90 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                Buy Credits
            </button>
          </div>
          <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-gray-800">Recent Activity</h3>
              <button className="inline-flex items-center justify-center text-xs font-medium h-8 rounded-md px-3 text-green-600 hover:bg-gray-100">view all</button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {recentActivityData.map((day, index) => (
                    <div key={index}>
                        <p className="text-xs text-gray-500 mb-2">{day.date}</p>
                        <div className="space-y-3">
                            {day.activities.map((activity, actIndex) => (
                                <div key={actIndex} className="flex items-start space-x-3">
                                    <div className="p-1.5 rounded-full bg-gray-100 flex-shrink-0 mt-0.5">
                                        <ActivityIcon iconName={activity.icon} className="h-3 w-3 text-gray-500" />
                                    </div>
                                    <p className="text-sm text-gray-700">{activity.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
        </UserLayout>

 );
}

