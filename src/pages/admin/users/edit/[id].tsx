import AdminLayout from "@/layouts/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/users/${id}`)
        .then(res => res.json())
        .then(data => setForm({ name: data.name, email: data.email }));
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    router.push("/admin/users");
  };

  return (
    <AdminLayout>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <h2 className="text-2xl mb-4 font-bold">Edit User</h2>
      <input
        type="text"
        className="w-full mb-3 p-2 border rounded"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <button className="bg-blue-600 text-white w-full py-2 rounded">Save Changes</button>
    </form>
    </AdminLayout>
  );
}
