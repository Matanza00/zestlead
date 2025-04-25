'use client';
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { X } from "lucide-react";

export default function BulkActionModal({ open, onClose, type }: {
  open: boolean;
  onClose: () => void;
  type: "REFUND" | "INVOICE";
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/admin/users?role=AGENT")
        .then(res => res.json())
        .then(setUsers);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedUser) return alert("Please select a user");

    const res = await fetch(`/api/admin/transactions/bulk-${type.toLowerCase()}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser }),
    });

    if (res.ok) {
      alert(`${type} processed successfully`);
      onClose();
    } else {
      alert("Failed to process");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{type === "REFUND" ? "Bulk Refund" : "Generate Bulk Invoice"}</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <select
          className="w-full border p-2 rounded mb-4"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select User --</option>
          {Array.isArray(users) && users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} - {u.email}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
        >
          {type === "REFUND" ? "Refund All Transactions" : "Generate Invoice"}
        </button>
      </div>
    </Modal>
  );
}
