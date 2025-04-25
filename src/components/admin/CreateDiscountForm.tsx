import { useState } from "react";

export default function CreateDiscountForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({
    code: "",
    description: "",
    percentage: "",
    expiresAt: "",
    maxUsage: "",
    stackable: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        description: form.description,
        percentage: parseFloat(form.percentage),
        expiresAt: form.expiresAt || null,
        maxUsage: form.maxUsage ? parseInt(form.maxUsage) : undefined,
        stackable: form.stackable,
      }),
    });

    if (res.ok) {
      alert("Discount created!");
      if (onCreated) onCreated();
      setForm({
        code: "",
        description: "",
        percentage: "",
        expiresAt: "",
        maxUsage: "",
        stackable: false,
      });
    } else {
      alert("Failed to create discount");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded bg-white shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Create New Discount</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Percentage"
          value={form.percentage}
          onChange={(e) => setForm({ ...form, percentage: e.target.value })}
          className="border p-2 rounded"
          required
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
        <label className="flex items-center col-span-2">
          <input
            type="checkbox"
            checked={form.stackable}
            onChange={(e) => setForm({ ...form, stackable: e.target.checked })}
            className="mr-2"
          />
          Stackable with other discounts
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Creating..." : "Create Discount"}
      </button>
    </form>
  );
}
