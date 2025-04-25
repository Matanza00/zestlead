import { useEffect, useState } from "react";

export default function DiscountAssignmentSection({ userId }: { userId: string }) {
  const [assignedDiscounts, setAssignedDiscounts] = useState([]);
  const [allDiscounts, setAllDiscounts] = useState([]);
  const [selectedDiscountId, setSelectedDiscountId] = useState("");

  useEffect(() => {
    if (userId) {
      fetch(`/api/admin/users/${userId}/discounts`)
        .then(res => res.json())
        .then(setAssignedDiscounts);

      fetch("/api/admin/discounts")
        .then(res => res.json())
        .then(setAllDiscounts);
    }
  }, [userId]);
  const handleRemove = async (assignmentId: string) => {
    const res = await fetch(`/api/admin/users/${userId}/discounts?assignmentId=${assignmentId}`, 
        {  method: "DELETE" });
    if (res.ok) {
      setAssignedDiscounts(prev => prev.filter(item => item.id !== assignmentId));
    } else {
      alert("Failed to remove discount");
    }
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
      setAssignedDiscounts((prev) => [...prev, result.assigned]);
      setSelectedDiscountId("");
    } else {
      alert("Failed to assign discount");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Assigned Discounts</h2>

      <ul className="mb-4">
        {assignedDiscounts.length === 0 && <p>No discounts assigned.</p>}
        {assignedDiscounts.map((item) => (
        <li key={item.id} className="border p-2 rounded mb-2 flex justify-between items-center">
            <div>
            <strong>{item.discount?.code || "Unknown"}</strong> — {item.discount?.percentage || 0}% off
            <br />
            Assigned on: {new Date(item.assignedAt).toLocaleDateString()}
            <br />
            Used: {item.used ? "✅ Yes" : "❌ No"}
            </div>
            <button
            onClick={() => handleRemove(item.id)}
            className="text-red-500 hover:text-red-700 text-sm"
            >
            Remove
            </button>
        </li>
        ))}
      </ul>

      <div className="flex gap-4 items-center">
        <select
          value={selectedDiscountId}
          onChange={(e) => setSelectedDiscountId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Select Discount --</option>
          {allDiscounts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.code} — {d.percentage}%
            </option>
          ))}
        </select>

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleAssign}
        >
          Assign Discount
        </button>
      </div>
    </div>
  );
}
