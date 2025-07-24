'use client';
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const areaChartData = [
 { name: 'Week 1', value: 10 },
 { name: 'Week 2', value: 25 },
 { name: 'Week 3', value: 20 },
 { name: 'Week 4', value: 40 },
];

const RevenueGeneratedChart = () => (
    <div className="rounded-lg border bg-white text-card-foreground shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-800">Revenue Generated</h3>
            <div className="flex items-center text-xs text-gray-500">
                1M
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
);

export default RevenueGeneratedChart;
