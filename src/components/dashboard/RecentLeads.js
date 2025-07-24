'use client';
import React from 'react';

const recentLeadsData = [
  { name: 'John Smith', phone: '+1(405) 234 3452', property: 'Street 16, Sunset Boulevard', status: 'Not Contacted' },
  { name: 'Jane Doe', phone: '+1(312) 456 7890', property: 'Avenue 21, Maple Street', status: 'Contacted' },
  { name: 'Emily Carter', phone: '+1(415) 789 1234', property: '123 Elm Street, Oakwood', status: 'Reached Out' },
  { name: 'Sophia Bennett', phone: '+1(408) 555 9876', property: '456 Maple Avenue, Greenfield', status: 'Contacted' },
  { name: 'Sophia Johnson', phone: '+1(408) 555 1234', property: '789 Oak Street, Maplewood', status: 'Reached Out' },
  { name: 'Jake Bennett', phone: '+1(408) 555 9876', property: '456 Maple Avenue, Greenfield', status: 'Contacted' },
];

const RecentLeadsTable = () => (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="pb-6 flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M1.7251 9.83333C2.02013 7.58252 3.12536 5.5164 4.83389 4.02172C6.54242 2.52704 8.73713 1.70627 11.0072 1.71305C13.2772 1.71984 15.467 2.55372 17.1665 4.05859C18.8661 5.56346 19.959 7.63616 20.2405 9.88869C20.5221 12.1412 19.9731 14.4191 18.6962 16.2961C17.4194 18.173 15.5023 19.5202 13.3037 20.0856C11.1052 20.6509 8.776 20.3957 6.75212 19.3675C4.72823 18.3394 3.14843 16.6089 2.30843 14.5M1.7251 20.3333V14.5H7.55843" stroke="#4EBC26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h3 className="font-semibold text-lg text-foreground">Recently Purchased Leads</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="">
                        {/* Updated column header styles */}
                        <th className="text-left  font-semibold text-black text-base">Name</th>
                        <th className="text-left  font-semibold text-black text-base">Phone</th>
                        <th className="text-left  font-semibold text-black text-base">Property</th>
                        <th className="text-left  font-semibold text-black text-base">Status</th>
                        <th className="text-right  font-semibold text-black text-base"><span className="sr-only">Actions</span></th>
                    </tr>
                </thead>
                <tbody>
                    {recentLeadsData.map((lead, index) => (
                        <tr key={index} className="border-b border-gray-200/50">
                            <td className="px-0 p-4 font-medium text-base text-neutral whitespace-nowrap">{lead.name}</td>
                            <td className="px-0 p-4 text-base font-normal text-neutral whitespace-nowrap">{lead.phone}</td>
                            <td className="px-0 p-4 text-base font-normal text-neutral whitespace-nowrap">{lead.property}</td>
                            <td className="px-0 p-4 font-medium text-base text-neutral whitespace-nowrap">{lead.status}</td>
                            <td className="px-0 p-4">
                                <div className="flex items-center justify-end space-x-2">
                                    <button className="h-7 w-7 inline-flex items-center justify-center bg-sky-100 hover:bg-sky-200 rounded-full text-sky-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                    </button>
                                    <button className="h-7 w-7 inline-flex items-center justify-center bg-sky-100 hover:bg-sky-200 rounded-full text-sky-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M17 3a2.85 2.83 0 0 0-4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                    </button>
                                    <button className="h-7 w-7 inline-flex items-center justify-center bg-rose-100 hover:bg-rose-200 rounded-full text-rose-600 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg"  width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default RecentLeadsTable;