import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";

export default function ViewLeadPage(props) {
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
          {Object.entries(lead).map(([key, value]) => {
            if (["id","createdAt", "updatedAt", "deletedAt"].includes(key)) return null;
            if (key === "audioFileUrl" && value) {
              return (
                <div key={key} className="col-span-2">
                  <p className="text-xs uppercase text-gray-500 mb-1">{key}</p>
                  <audio controls className="w-full rounded shadow">
                    <source src={value} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <p className="text-sm text-gray-500 mt-1">{value}</p>
                </div>
              );
            }
            return (
              <div key={key}>
                <p className="text-xs uppercase text-gray-500">{key}</p>
                {key === "tags" && Array.isArray(value) ? (
                  <div className="flex flex-wrap gap-2">
                    {value.map((tag: any) => (
                      <span key={tag.id || tag.name} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm">{String(value)}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
