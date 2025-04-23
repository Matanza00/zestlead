import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";

export default function ViewLeadPage() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/leads/${id}`)
        .then(res => res.json())
        .then(setLead);
    }
  }, [id]);

  if (!lead) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Lead Details</h1>
        <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
          {Object.entries(lead).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs uppercase text-gray-500">{key}</p>
              <p className="text-sm">{String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
