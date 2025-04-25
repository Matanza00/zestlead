// components/admin/TransactionActionModal.tsx
'use client';
import { useEffect, useState } from 'react';

export default function TransactionActionModal({
  open,
  onClose,
  type, // "refund" | "invoice"
}: {
  open: boolean;
  onClose: () => void;
  type: 'refund' | 'invoice';
}) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (search.length > 2) {
      fetch(`/api/admin/users/search?query=${search}`)
        .then(res => res.json())
        .then(setUsers);
    }
  }, [search]);

  useEffect(() => {
    if (selectedUser?.id) {
      fetch(`/api/admin/transactions?userId=${selectedUser.id}`)
        .then(res => res.json())
        .then(setTransactions);
    }
  }, [selectedUser]);

  const handleAction = async (transactionId: string) => {
    const endpoint = type === 'refund'
      ? `/api/admin/transactions/${transactionId}/refund`
      : `/api/admin/transactions/${transactionId}/invoice`;

    const res = await fetch(endpoint, { method: 'POST' });
    if (res.ok) {
      alert(`${type === 'refund' ? 'Refund issued' : 'Invoice generated'} successfully.`);
      onClose();
    } else {
      alert('Failed to process request.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          {type === 'refund' ? 'Refund Transaction' : 'Generate Invoice'}
        </h2>

        <input
          type="text"
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {users.length > 0 && !selectedUser && (
          <ul className="border rounded mb-4 max-h-40 overflow-y-auto">
            {users.map(user => (
              <li
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedUser(user)}
              >
                {user.name} ({user.email})
              </li>
            ))}
          </ul>
        )}

        {selectedUser && (
          <>
            <p className="mb-2 font-medium">Transactions for {selectedUser.name}</p>
            <ul className="max-h-52 overflow-y-auto border rounded mb-4">
              {transactions.map(tx => (
                <li key={tx.id} className="flex justify-between p-2 border-b">
                  <span>${tx.amount} - {tx.type}</span>
                  <button
                    onClick={() => handleAction(tx.id)}
                    className={`px-3 py-1 text-sm rounded ${type === 'refund' ? 'bg-red-500' : 'bg-blue-600'} text-white`}
                  >
                    {type === 'refund' ? 'Refund' : 'Invoice'}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <button onClick={onClose} className="mt-4 text-sm text-gray-600 underline">
          Close
        </button>
      </div>
    </div>
  );
}
