import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";

export default function EditLeadPage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/leads/${id}`)
        .then(res => res.json())
        .then(setForm);
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push(`/admin/leads/view/${id}`);
  };

  if (!form) return <AdminLayout><p>Loading...</p></AdminLayout>;

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Edit Lead</h1>
        {Object.entries(form).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm text-gray-600 mb-1">{key}</label>
            <input
              type="text"
              value={value || ""}
              className="w-full p-2 border rounded"
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <button className="bg-green-600 text-white px-4 py-2 rounded">Update Lead</button>
      </form>
    </AdminLayout>
  );
}
