'use client';

import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui2/Input";
import { Button } from "@/components/ui2/button";
import {
  Percent,
  Calendar,
  BadgePercent,
  Users,
  Layers,
  Settings2
} from "lucide-react";

type Referral = {
  id: string;
  code: string;
  description?: string;
  percentage: number;
  maxCap?: number;
  expiresAt?: string;
  maxUsage?: number;
  stackable: boolean;
  assignedUsers?: { used: boolean }[];
};

export default function ReferralAdminPage(props) {
  const [discounts, setDiscounts] = useState<Referral[]>([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    percentage: "",
    maxCap: "",        // ← new
    expiresAt: "",
    maxUsage: "",
    stackable: false,
  });

  // fetch existing referrals
  useEffect(() => {
    fetch("/api/admin/discounts")
      .then(res => res.json())
      .then(setDiscounts);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      code: form.code.trim(),
      description: form.description.trim() || undefined,
      percentage: parseFloat(form.percentage),
      maxCap: form.maxCap ? parseFloat(form.maxCap) : undefined,  // ← include maxCap
      expiresAt: form.expiresAt || null,
      maxUsage: form.maxUsage ? parseInt(form.maxUsage) : undefined,
      stackable: form.stackable,
    };

    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newDiscount = await res.json();
      setDiscounts(prev => [newDiscount, ...prev]);
      setForm({
        code: "",
        description: "",
        percentage: "",
        maxCap: "",      // ← reset
        expiresAt: "",
        maxUsage: "",
        stackable: false,
      });
    } else {
      alert("Failed to create referral");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent">
          Referral Codes
        </h1>

        <form onSubmit={handleCreate} className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <BadgePercent size={20} /> Create Referral
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Referral Code"
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              required
            />

            <Input
              type="number"
              placeholder="Discount %"
              value={form.percentage}
              onChange={e => setForm({ ...form, percentage: e.target.value })}
              required
              icon={Percent}
            />

            <Input
              type="number"
              placeholder="Max Cap ($)"
              value={form.maxCap}
              onChange={e => setForm({ ...form, maxCap: e.target.value })}
              icon={BadgePercent}
            />

            <Input
              type="date"
              placeholder="Expires At"
              value={form.expiresAt}
              onChange={e => setForm({ ...form, expiresAt: e.target.value })}
              icon={Calendar}
            />

            <Input
              type="number"
              placeholder="Max Usage"
              value={form.maxUsage}
              onChange={e => setForm({ ...form, maxUsage: e.target.value })}
              icon={Users}
            />

            <label className="flex items-center gap-2 md:col-span-2">
              <input
                type="checkbox"
                checked={form.stackable}
                onChange={e => setForm({ ...form, stackable: e.target.checked })}
              />
              Stackable with other promotions
            </label>

            <div className="md:col-span-2 text-right">
              <Button type="submit">
                <Settings2 size={16} className="mr-2" /> Create Referral
              </Button>
            </div>
          </div>
        </form>

        <div className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Layers size={18} /> All Referrals
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left font-medium">Code</th>
                  <th className="p-2 text-left font-medium">Discount %</th>
                  <th className="p-2 text-left font-medium">Max Cap ($)</th>  {/* ← new */}
                  <th className="p-2 text-left font-medium">Expires</th>
                  <th className="p-2 text-left font-medium">Used / Assigned</th>
                  <th className="p-2 text-left font-medium">Usage</th>
                  <th className="p-2 text-left font-medium">Stackable</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map(d => (
                  <tr key={d.id} className="border-t">
                    <td className="p-2 font-semibold text-gray-800">{d.code}</td>
                    <td className="p-2">{d.percentage}%</td>
                    <td className="p-2">
                      {d.maxCap != null ? `$${d.maxCap.toFixed(2)}` : '∞'}
                    </td>
                    <td className="p-2">
                      {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : '∞'}
                    </td>
                    <td className="p-2">
                      {(d.assignedUsers?.filter(u => u.used).length) || 0} / {(d.assignedUsers?.length) || 0}
                    </td>
                    <td className="p-2">{d.maxUsage ?? '∞'}</td>
                    <td className="p-2">{d.stackable ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
