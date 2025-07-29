import AdminLayout from "@/components/layout/AdminLayout";
import { Input } from "@/components/ui2/Input";
import { Button } from "@/components/ui2/button";
import { useEffect, useState } from "react";
import { Search, ReceiptText, RotateCcw, FileSearch, Eye } from "lucide-react";
import TransactionActionModal from '@/components/admin/TransactionActionModal';
import RefundTransactionModal from '@/components/admin/RefundTransactionModal';
import BulkActionModal from "@/components/admin/BulkActionModal";
import Link from "next/link";

export default function TransactionsPage(props) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const filteredTransactions = transactions.filter(tx =>
    tx.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    tx.reference?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#0061ff] to-[#60efff] bg-clip-text text-transparent">All Transactions</h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by user or reference"
              className="pl-10 py-2 text-sm rounded-md border border-gray-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive" onClick={() => { setModalType('refund'); setModalOpen(true); }}>
              <RotateCcw className="mr-2 w-4 h-4" /> Refund User
            </Button>
            <Button variant="default" onClick={() => { setModalType('invoice'); setModalOpen(true); }}>
              <ReceiptText className="mr-2 w-4 h-4" /> Generate Invoice
            </Button>
            <Button variant="outline" onClick={() => setShowRefundModal(true)}>
              <RotateCcw className="mr-2 w-4 h-4" /> Manual Refund
            </Button>
            <Button variant="destructive" onClick={() => setBulkRefundOpen(true)}>
              <RotateCcw className="mr-2 w-4 h-4" /> Bulk Refund
            </Button>
            <Button variant="success" onClick={() => setBulkInvoiceOpen(true)}>
              <FileSearch className="mr-2 w-4 h-4" /> Bulk Invoice
            </Button>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full text-sm text-left border border-gray-200">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx: any) => (
                  <tr key={tx.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{tx.user?.name || "N/A"}</td>
                    <td className="p-3">{tx.type}</td>
                    <td className="p-3 text-green-600 font-semibold">${tx.amount}</td>
                    <td className="p-3">{tx.status}</td>
                    <td className="p-3">{new Date(tx.createdAt).toLocaleString()}</td>
                    <td className="p-3">
                      <Link href={`/admin/transactions/view/${tx.id}`}>
                              <button className="inline-flex items-center px-3 py-1 rounded-full text-xs text-white"
                              style={{
                                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #0396B7 0%, #1CDAF4 100%)"
                              }}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                            </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
