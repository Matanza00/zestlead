'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BarChart3, ChevronDown } from 'lucide-react';

const data = [
  { name: 'Week 1', value: 40 },
  { name: 'Week 2', value: 50 },
  { name: 'Week 3', value: 22 },
  { name: 'Week 4', value: 45 },
];

export default function DealsClosedChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-brand-gray-DEFAULT">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-gray-text" />
            <h3 className="font-semibold text-sm text-gray-800">Deals Closed</h3>
        </div>
        <button className="flex items-center text-xs text-brand-gray-text font-medium px-2 py-1 border border-brand-gray-DEFAULT rounded-md">
            1M <ChevronDown className="w-4 h-4 ml-1" />
        </button>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}
                cursor={{fill: 'rgba(238, 251, 243, 0.5)'}}
            />
            <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}