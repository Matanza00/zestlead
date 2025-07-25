import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";

export default function ReferralAdminPage(props) {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState({
    code: "",
    description: "",
    percentage: "",
    expiresAt: "",
    maxUsage: "",
    stackable: false,
  });

  useEffect(() => {
    fetch("/api/admin/discounts")
      .then(res => res.json())
      .then(setDiscounts);
  }, []);

  const handleCreate = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        percentage: parseFloat(form.percentage),
        maxUsage: form.maxUsage ? parseInt(form.maxUsage) : undefined,
        expiresAt: form.expiresAt || null,
      }),
    });

    if (res.ok) {
      const newDiscount = await res.json();
      setDiscounts(prev => [newDiscount, ...prev]);
      setForm({
        code: "",
        description: "",
        percentage: "",
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
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Referral Codes</h1>

        <form onSubmit={handleCreate} className="mb-6 border p-4 rounded bg-white shadow">
            <h2 className="text-lg font-semibold mb-3">Create Referral</h2>
            <div className="grid grid-cols-2 gap-4">
            <input
                type="text"
                placeholder="Referral Code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                className="border p-2 rounded"
            />
            <input
                type="number"
                placeholder="Discount %"
                value={form.percentage}
                onChange={(e) => setForm({ ...form, percentage: e.target.value })}
                required
                className="border p-2 rounded"
            />
            <input
                type="text"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border p-2 rounded col-span-2"
            />
            <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="border p-2 rounded"
            />
            <input
                type="number"
                placeholder="Max Usage"
                value={form.maxUsage}
                onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
                className="border p-2 rounded"
            />
            <label className="flex items-center gap-2 col-span-2">
                <input
                type="checkbox"
                checked={form.stackable}
                onChange={(e) => setForm({ ...form, stackable: e.target.checked })}
                />
                Stackable with other promotions
            </label>
            </div>
            <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Create Referral
            </button>
        </form>

        <h2 className="text-lg font-semibold mb-2">All Referrals</h2>
        <table className="w-full table-auto border">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Discount %</th>
                    <th className="p-2 text-left">Expires</th>
                    <th className="p-2 text-left">Used / Assigned</th>
                    <th className="p-2 text-left">Usage</th>
                    <th className="p-2 text-left">Stackable</th>
                </tr>
            </thead>
            
            <tbody>
            {discounts.map((d) => (
                <tr key={d.id} className="border-t">
                <td className="p-2">{d.code}</td>
                <td className="p-2">{d.percentage}%</td>
                <td className="p-2">{d.expiresAt ? new Date(d.expiresAt).toLocaleDateString() : "∞"}</td>
                <td className="p-2">
                    {d.assignedUsers?.filter(u => u.used).length || 0}
                    {" / "}
                    {d.assignedUsers?.length || 0}
                    </td>
                    <td className="p-2">{d.maxUsage}</td>
                <td className="p-2">{d.stackable ? "Yes" : "No"}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </AdminLayout>
  );
}
