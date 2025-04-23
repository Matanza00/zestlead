import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/layouts/AdminLayout";

export default function LeadListPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then(setLeads)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Leads</h1>
        <Link href="/admin/leads/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New Lead
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : leads.length > 0 ? (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Type</th>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead: any) => (
              <tr key={lead.id} className="border-t">
                <td className="p-2">{lead.name}</td>
                <td>{lead.contact}</td>
                <td>{lead.email || "-"}</td>
                <td>{lead.leadType}</td>
                <td>{lead.propertyType}</td>
                <td>{lead.isAvailable ? "Available" : "Unavailable"}</td>
                <td className="space-x-2">
                  <Link href={`/admin/leads/view/${lead.id}`} className="text-blue-600 underline">View</Link>
                  <Link href={`/admin/leads/edit/${lead.id}`} className="text-yellow-600 underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leads found.</p>
      )}
    </AdminLayout>
  );
}
