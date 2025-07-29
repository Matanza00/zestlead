import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { X } from "lucide-react";

// Define props type
type RefundTransactionModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RefundTransactionModal({
  open,
  onClose,
}: RefundTransactionModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [userId, setUserId] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedTxn, setSelectedTxn] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      fetch("/api/admin/users?role=AGENT")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error("Expected array but got:", data);
            setUsers([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch users:", err);
          setUsers([]);
        });
    }
  }, [open]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/admin/users/${userId}/transactions`)
        .then((res) => res.json())
        .then(setTransactions);
    }
  }, [userId]);

  const handleRefund = async () => {
    if (!selectedTxn) return alert("Select a transaction");
    const res = await fetch(`/api/admin/transactions/${selectedTxn}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      alert("Refund issued successfully.");
      onClose();
    } else {
      const err = await res.json();
      alert("Error: " + err.error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Refund Transaction</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <select
          className="w-full border p-2 rounded mb-3"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} - {u.email}
            </option>
          ))}
        </select>

        {userId && (
          <select
            className="w-full border p-2 rounded mb-3"
            value={selectedTxn}
            onChange={(e) => setSelectedTxn(e.target.value)}
          >
            <option value="">Select Transaction</option>
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.reference} — ${t.amount} —{" "}
                {new Date(t.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        )}

        <textarea
          rows={3}
          placeholder="Reason for refund"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleRefund}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Process Refund
        </button>
      </div>
    </Modal>
  );
}
