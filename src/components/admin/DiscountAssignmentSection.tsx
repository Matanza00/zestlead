// src/components/DiscountAssignmentSection.tsx
import { useState, useEffect, useMemo } from "react";

interface AssignedDiscount {
  id: string;
  assignedAt: string;
  used: boolean;
  discount: {
    id: string;
    code: string;
    percentage: number;
  };
}

export default function DiscountAssignmentSection({
  userId,
}: {
  userId: string;
}) {
  const [assigned, setAssigned] = useState<AssignedDiscount[]>([]);
  const [allDiscounts, setAllDiscounts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [usedFilter, setUsedFilter] = useState<"all" | "used" | "unused">(
    "all"
  );
  const [selectedDiscountId, setSelectedDiscountId] = useState("");

  useEffect(() => {
    fetch(`/api/admin/users/${userId}/discounts`)
      .then((res) => res.json())
      .then(setAssigned);
    fetch("/api/admin/discounts")
      .then((res) => res.json())
      .then(setAllDiscounts);
  }, [userId]);

  const filtered = useMemo(
    () =>
      assigned.filter((item) => {
        const { code, percentage } = item.discount;
        const assignedAt = new Date(item.assignedAt).toLocaleDateString();
        const usedText = item.used ? "yes" : "no";
        const matchesSearch = [code, percentage.toString(), assignedAt, usedText]
          .some((field) =>
            field.toLowerCase().includes(searchQuery.toLowerCase())
          );
        const matchesUsed =
          usedFilter === "all" ||
          (usedFilter === "used" && item.used) ||
          (usedFilter === "unused" && !item.used);
        return matchesSearch && matchesUsed;
      }),
    [assigned, searchQuery, usedFilter]
  );

  const handleRemove = async (id: string) => {
    const res = await fetch(
      `/api/admin/users/${userId}/discounts?assignmentId=${id}`,
      { method: "DELETE" }
    );
    if (res.ok) setAssigned((prev) => prev.filter((d) => d.id !== id));
    else alert("Failed to remove discount");
  };

  const handleAssign = async () => {
    if (!selectedDiscountId) return;
    const res = await fetch(`/api/admin/users/${userId}/assign-discount`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountId: selectedDiscountId }),
    });
    if (res.ok) {
      const result = await res.json();
      setAssigned((prev) => [...prev, result.assigned]);
      setSelectedDiscountId("");
    } else {
      alert("Failed to assign discount");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-text">
        Assigned Discounts
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded p-2 flex-1 text-text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="border rounded p-2 text-text"
          value={usedFilter}
          onChange={(e) =>
            setUsedFilter(e.target.value as "all" | "used" | "unused")
          }
        >
          <option value="all">All</option>
          <option value="used">Used</option>
          <option value="unused">Unused</option>
        </select>
      </div>

      {/* Discounts Table */}
      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-primary text-teal-300">
              <th className="p-2 text-left">Code</th>
              <th className="p-2 text-left">Percentage</th>
              <th className="p-2 text-left">Assigned At</th>
              <th className="p-2 text-left">Used</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b hover:bg-surface">
                <td className="p-2 text-text">{item.discount.code}</td>
                <td className="p-2 text-text">
                  {item.discount.percentage}%
                </td>
                <td className="p-2 text-text">
                  {new Date(item.assignedAt).toLocaleDateString()}
                </td>
                <td className="p-2 text-text">
                  {item.used ? "✅ Yes" : "❌ No"}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No discounts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assign New Discount */}
      <div className="flex gap-4 items-center">
        <select
          value={selectedDiscountId}
          onChange={(e) => setSelectedDiscountId(e.target.value)}
          className="border rounded p-2 text-text"
        >
          <option value="">-- Select Discount --</option>
          {allDiscounts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.code} — {d.percentage}%
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Assign Discount
        </button>
      </div>
    </div>
  );
}
