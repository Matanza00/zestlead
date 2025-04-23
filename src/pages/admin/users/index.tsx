import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState("agents");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (role: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?role=${role.toUpperCase()}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, isSuspended: boolean) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: isSuspended ? "reactivate" : "suspend" }),
    });
    if (res.ok) {
      fetchUsers(activeTab);
    }
  };

  useEffect(() => {
    fetchUsers(activeTab === "agents" ? "agent" : "admin");
  }, [activeTab]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">User Management</h1>
        <div className="flex space-x-4 border-b pb-2">
          <button
            className={`px-4 py-2 rounded-t text-sm font-medium ${
              activeTab === "agents"
                ? "bg-white border border-b-0 text-black"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("agents")}
          >
            Agents
          </button>
          <button
            className={`px-4 py-2 rounded-t text-sm font-medium ${
              activeTab === "admins"
                ? "bg-white border border-b-0 text-black"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => setActiveTab("admins")}
          >
            Admins
          </button>
        </div>
      </div>

      <div>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((user: any) => (
              <li key={user.id} className="p-4 bg-white shadow rounded">
                <p className="font-medium">{user.name || "No name"}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mb-2">Role: {user.role}</p>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/users/view/${user.id}`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/users/edit/${user.id}`}
                    className="px-3 py-1 text-xs bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => toggleStatus(user.id, !!user.deletedAt)}
                    className={`px-3 py-1 text-xs text-white rounded ${
                      user.deletedAt ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {user.deletedAt ? "Reactivate" : "Suspend"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </AdminLayout>
  );
}
