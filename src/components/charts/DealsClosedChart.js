'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const barChartData = [
 { name: 'Week 1', value: 38 },
 { name: 'Week 2', value: 42 },
 { name: 'Week 3', value: 22 },
 { name: 'Week 4', value: 45 },
];

const DealsClosedChart = () => (
    <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-800">Deals Closed</h3>
            <div className="flex items-center text-xs text-gray-500">
                1M
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
);

export default DealsClosedChart;
