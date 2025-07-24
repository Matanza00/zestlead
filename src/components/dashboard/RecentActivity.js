'use client';
import React from 'react';
import ActivityIcon from '../ui/ActivityIcon';

const recentActivityData = [
  { date: '24th Jan 2024', activities: [
    { icon: 'dollar', text: 'You bought 15 leads for ' },
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

const RecentActivityCard = () => (
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
);

export default RecentActivityCard;
