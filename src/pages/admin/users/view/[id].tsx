import AdminLayout from "@/layouts/AdminLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AssignLeadSection from "@/components/admin/AssignLeadSection";


export default function ViewUserPage(props) {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/users/${id}`)
        .then(res => res.json())
        .then(setUser);
    }
  }, [id]);

  if (!user) return <div className="p-6">Loading...</div>;

  return (
    <AdminLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">User Detail</h1>
      <div className="border p-4 rounded">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Status:</strong> {user.deletedAt ? "Suspended" : "Active"}</p>
        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <div className="mt-6">
        <AssignLeadSection userId={user.id} />
      </div>

    </div>
    </AdminLayout>
  );
}
