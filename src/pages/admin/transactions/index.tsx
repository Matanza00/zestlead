// pages/admin/transactions/index.tsx
import AdminLayout from "@/layouts/AdminLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import TransactionActionModal from '@/components/admin/TransactionActionModal';
import RefundTransactionModal from '@/components/admin/RefundTransactionModal';
import BulkActionModal from "@/components/admin/BulkActionModal";

export default function TransactionsPage(props) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'refund' | 'invoice' | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [bulkRefundOpen, setBulkRefundOpen] = useState(false);
  const [bulkInvoiceOpen, setBulkInvoiceOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then(res => res.json())
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">All Transactions</h1>
        <div className="flex gap-4 mb-6">
            <button
                onClick={() => { setModalType('refund'); setModalOpen(true); }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Refund User
            </button>

            <button
                onClick={() => { setModalType('invoice'); setModalOpen(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Generate Invoice
            </button>
            <button
              onClick={() => setShowRefundModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Manual Refund
            </button>

            </div>
            <div className="flex gap-4 mb-4">
              <button onClick={() => setBulkRefundOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded">
                Refund User's Transactions
              </button>
              <button onClick={() => setBulkInvoiceOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded">
                Generate Invoice
              </button>
            </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
            
            

          <table className="w-full table-auto border text-sm">
            
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Reference</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="border-t">
                  <td className="p-2">{tx.user?.name || "N/A"}</td>
                  <td className="p-2">{tx.type}</td>
                  <td className="p-2">${tx.amount}</td>
                  <td className="p-2">{tx.status}</td>
                  <td className="p-2">{tx.reference}</td>
                  <td className="p-2">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <Link
                      href={`/admin/transactions/${tx.id}`}
                      className="text-blue-600 underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <RefundTransactionModal open={showRefundModal} onClose={() => setShowRefundModal(false)} />
        <BulkActionModal open={bulkRefundOpen} onClose={() => setBulkRefundOpen(false)} type="REFUND" />
        <BulkActionModal open={bulkInvoiceOpen} onClose={() => setBulkInvoiceOpen(false)} type="INVOICE" />
        {modalOpen && modalType && (
        <TransactionActionModal
            open={modalOpen}
            type={modalType}
            onClose={() => {
            setModalOpen(false);
            setModalType(null);
            }}
        />
        )}

      </div>
    </AdminLayout>
  );
}
