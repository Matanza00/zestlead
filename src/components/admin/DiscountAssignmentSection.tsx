// src/components/DiscountAssignmentSection.tsx
import { Tag } from "lucide-react";
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
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSearch, setModalSearch] = useState('')
  const [selectedId, setSelectedId] = useState('')

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
  // filter modal list
  const filteredModal = useMemo(
    () =>
      allDiscounts.filter((d) =>
        [d.code, `${d.percentage}%`]
          .some((f) =>
            f.toLowerCase().includes(modalSearch.toLowerCase())
          )
      ),
    [allDiscounts, modalSearch]
  )

  const handleRemove = async (id: string) => {
    const res = await fetch(
      `/api/admin/users/${userId}/discounts?assignmentId=${id}`,
      { method: "DELETE" }
    );
    if (res.ok) setAssigned((prev) => prev.filter((d) => d.id !== id));
    else alert("Failed to remove discount");
  };

  const handleAssign = async () => {
    if (!selectedId) return
    const res = await fetch(`/api/admin/users/${userId}/assign-discount`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ discountId: selectedId }),
    })
    if (res.ok) {
      const { assigned: newAssignment } = await res.json()
      setAssigned((prev) => [...prev, newAssignment])
      setSelectedId('')
      setModalOpen(false)
      setModalSearch('')
    } else {
      alert('Failed to assign discount')
    }
  }

  return (
    <div className="mt-6">
      {/* Assign New Discount */}
      {/* Assign Discount Modal */}
      <div className="flex gap-4 mb-4">
      <div className="ml-auto">
     
       <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-white rounded-md "
          style={{
                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)"
              }}>
        
          <Tag className="h-4 w-4 mr-1" />
          Assign Discount
        </button>
      </div>
      </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
              type="text"
              placeholder="Search Discount Codes…"
              className="
                flex h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm
                placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring pr-10
              "
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
            <tr className="text-black">
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
      {/* Assign Discount Modal */}
      {modalOpen && (
              <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-semibold">Select a Discount</h4>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="text-gray-500 hover:text-gray-800 text-lg"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search discount…"
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      className="w-full border rounded p-2 shadow"
                    />
                  </div>
                  <div className="overflow-auto max-h-80 mb-4">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="p-2 text-left">Code</th>
                          <th className="p-2 text-left">%</th>
                          <th className="p-2 text-center">Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredModal.length === 0 && (
                          <tr>
                            <td
                              colSpan={3}
                              className="p-4 text-center text-gray-500 italic"
                            >
                              No discounts found.
                            </td>
                          </tr>
                        )}
                        {filteredModal.map((d) => (
                          <tr
                            key={d.id}
                            className="border-t hover:bg-gray-50 cursor-pointer"
                          >
                            <td className="p-2">{d.code}</td>
                            <td className="p-2">{d.percentage}%</td>
                            <td className="p-2 text-center">
                              <input
                                type="radio"
                                name="discount"
                                checked={selectedId === d.id}
                                onChange={() => setSelectedId(d.id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 border rounded shadow"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssign}
                      className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition"
                    >
                      Assign Selected
                    </button>
                  </div>
                </div>
              </div>
      )}
      
    </div>
  );
}
