'use client';
import React from 'react';

// SVG icon for 'Ultimate Agent' provided by the user, converted to a React component.
const AgentIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 17" fill="none" {...props}>
        <path d="M1.5 15.25V13.75C1.5 12.9544 1.81607 12.1913 2.37868 11.6287C2.94129 11.0661 3.70435 10.75 4.5 10.75H7.5C8.29565 10.75 9.05871 11.0661 9.62132 11.6287C10.1839 12.1913 10.5 12.9544 10.5 13.75V15.25M3 4.75C3 5.54565 3.31607 6.30871 3.87868 6.87132C4.44129 7.43393 5.20435 7.75 6 7.75C6.79565 7.75 7.55871 7.43393 8.12132 6.87132C8.68393 6.30871 9 5.54565 9 4.75C9 3.95435 8.68393 3.19129 8.12132 2.62868C7.55871 2.06607 6.79565 1.75 6 1.75C5.20435 1.75 4.44129 2.06607 3.87868 2.62868C3.31607 3.19129 3 3.95435 3 4.75Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// SVG icon for 'Subscription', designed to match the image.
const SubscriptionIcon = (props) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 2V8H20" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.5 15.5L11.5 17.5L15.5 13.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const SubscriptionCard = () => (
    <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
                <SubscriptionIcon />
                <h3 className="text-sm font-semibold text-gray-900">Subscription</h3>
            </div>
            <div className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Active
            </div>
        </div>

        <div className="space-y-3">
            <div>
                <p className="text-xs text-gray-500">Plan</p>
                <div className="inline-flex items-center gap-1 rounded-lg bg-purple-200 px-3 py-1.5 mt-1">
                    <AgentIcon className="w-4 h-4 text-purple-800" />
                    <p className="text-sm text-purple-800">Ultimate Agent</p>
                </div>
            </div>

            <hr className="border-gray-200" />

            <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                    <p className="text-xs text-gray-500">Leads Purchased</p>
                    <p className="text-sm font-semibold mt-1">
                        <span className="text-cyan-600">10</span>
                        <span className="font-normal text-gray-500 ml-1">out of 10</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Days Left</p>
                    <p className="text-sm font-semibold text-gray-800 mt-1">12</p>
                </div>
            </div>
        </div>
    </div>
);

export default SubscriptionCard;