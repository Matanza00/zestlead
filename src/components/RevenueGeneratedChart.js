'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, ChevronDown } from 'lucide-react';

const data = [
  { name: 'Week 1', value: 15 },
  { name: 'Week 2', value: 25 },
  { name: 'Week 3', value: 20 },
  { name: 'Week 4', value: 42 },
];

export default function RevenueGeneratedChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-DEFAULT">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-brand-gray-text" />
            <h3 className="font-semibold text-sm text-gray-800">Revenue Generated</h3>
        </div>
        <button className="flex items-center text-xs text-brand-gray-text font-medium px-2 py-1 border border-brand-gray-DEFAULT rounded-md">
            1M <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}
                    cursor={{stroke: '#22c55e', strokeWidth: 1}}
                />
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#colorRevenue)" />
            </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}