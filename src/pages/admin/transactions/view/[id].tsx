import AdminLayout from "@/components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { Button } from "@/components/ui2/button";

const groupedFields = {
  'Client Information': ['user.name', 'user.email'],
  'Transaction Info': ['amount', 'type', 'status', 'reference'],
  'Timestamps': ['createdAt', 'updatedAt'],
};

function getValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function formatFieldValue(key, value) {
  if (!value) return 'N/A';
  if (key.includes('At')) return format(new Date(value), 'dd MMM yyyy, hh:mm a');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number' && key === 'amount') return `$${value}`;
  return value;
}

export default function TransactionViewPage(props) {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/transactions/${id}`)
      .then(res => res.json())
      .then(setTransaction)
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#0061ff] to-[#60efff] bg-clip-text text-transparent">Transaction Details</h1>

        {loading ? (
          <p>Loading...</p>
        ) : !transaction ? (
          <p>Transaction not found.</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFields).map(([group, fields]) => (
              <div key={group} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-1">{group}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fields.map((fieldKey) => (
                    <div key={fieldKey}>
                      <p className="text-sm text-gray-500 capitalize mb-1">
                        {fieldKey.split('.').slice(-1)[0].replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="font-medium text-gray-800">
                        {formatFieldValue(fieldKey, getValue(transaction, fieldKey))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8">
              <Button variant="outline" onClick={() => router.back()}>
                Go Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}