'use client';
import UserLayout from '@/components/CombinedNavbar';
import { useEffect, useState } from 'react';
import { LucideReceiptText, LucideLoader, LucideFileWarning, LucideActivity } from 'lucide-react';

export default function BillingHistoryPage(props) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/account/transactions')
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch('/api/user/activity')
      .then((res) => res.json())
      .then(setActivity)
      .catch(console.error);
  }, []);

  const formatPKR = (value: number) => `USD ${value.toLocaleString()}`;

  return (
    <UserLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white dark:bg-[#10141e] rounded-xl shadow border border-[#D1D5DC] p-6">
          <div className="flex items-center gap-2 mb-6">
            <LucideReceiptText className="text-primary w-6 h-6" />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
              Billing History
            </h1>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <LucideLoader className="animate-spin w-4 h-4" />
              Loading billing history...
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <LucideFileWarning className="w-4 h-4" />
              No billing records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded overflow-hidden">
                <thead className="bg-gray-50 dark:bg-[#1a1f2e] text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="p-3 text-left font-medium">Amount</th>
                    <th className="p-3 text-left font-medium">Type</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Reference</th>
                    <th className="p-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-200">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="p-3 font-medium">{formatPKR(txn.amount)}</td>
                      <td className="p-3 capitalize">{txn.type.replace('_', ' ')}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            txn.status === 'SUCCESS'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                              : txn.status === 'REFUNDED'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                        {txn.reference || '-'}
                      </td>
                      <td className="p-3 text-xs text-gray-500 dark:text-gray-400">
                        {new Date(txn.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* User Activity Section */}
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-3">
              <LucideActivity className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                User Activity
              </h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {activity.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between py-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span>{item.description}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
              {activity.length === 0 && (
                <li className="py-2 text-sm text-gray-400 flex items-center gap-2">
                  <LucideFileWarning className="w-4 h-4" />
                  No recent activity.
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </UserLayout>
  );
}
