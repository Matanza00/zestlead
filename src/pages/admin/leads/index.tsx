import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "@/layouts/AdminLayout";

export default function LeadListPage(props) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [tag, setTag] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [activeTab, setActiveTab] = useState(typeof window !== "undefined" && localStorage.getItem("zestTab") || "BUYER");
  const [filters, setFilters] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zestLeadFilters');
      return saved ? JSON.parse(saved) : {
        query: "",
        propertyType: "",
        tag: "",
        status: "",
        minBeds: "",
        minBaths: "",
        minPrice: "",
        maxPrice: ""
      };
    }
    return {
      query: "",
      propertyType: "",
      tag: "",
      status: "",
      minBeds: "",
      minBaths: "",
      minPrice: "",
      maxPrice: ""
    };
  });

  useEffect(() => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
  
    fetch(`/api/admin/leads?${queryParams.toString()}`)
      .then((res) => res.json())
      .then(setLeads)
      .finally(() => setLoading(false));
  }, [filters]);
  

  const handleToggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const applyBulkTag = async () => {
    if (!tag.trim() || selected.length === 0) return;
    await fetch("/api/admin/leads/tag-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadIds: selected, tag: tag.trim() })
    });
    alert("Tag applied to selected leads.");
    setSelected([]);
    setTag("");
    location.reload();
  };

  const removeTag = async (tagId: string, leadId: string) => {
    await fetch(`/api/admin/leads/${leadId}/tags/${tagId}`, { method: "DELETE" });
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId ? {
          ...lead,
          tags: lead.tags.filter((tag: any) => tag.id !== tagId)
        } : lead
      )
    );
  };

  const renderTable = (leadsToRender: any[]) => (
    <table className="w-full table-auto border">
      <thead>
        <tr className="bg-gray-100 text-left">
          <th className="p-2"></th>
          <th className="p-2">Name</th>
          <th>Contact</th>
          <th>Email</th>
          <th>Type</th>
          <th>Property</th>
          <th>Status</th>
          <th>Price</th>
          <th>Tags</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {leadsToRender.map((lead: any) => (
          <tr key={lead.id} className="border-t">
            <td className="p-2">
              <input
                type="checkbox"
                checked={selected.includes(lead.id)}
                onChange={() => handleToggle(lead.id)}
              />
            </td>
            <td className="p-2">{lead.name}</td>
            <td>{lead.contact}</td>
            <td>{lead.email || "-"}</td>
            <td>{lead.leadType}</td>
            <td>{lead.propertyType}</td>
            <td>{lead.isAvailable ? "Available" : "Unavailable"}</td>
            <td>{lead.price ? `$${lead.price}` : "-"}</td>
            <td>
              <div className="flex flex-wrap gap-1">
                {(lead.tags || []).map((tag: any) => (
                  <span key={tag.id} className="bg-gray-200 px-2 py-1 text-xs rounded-full flex items-center gap-1">
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tag.id, lead.id)}
                      className="text-red-500 hover:text-red-700"
                    >×</button>
                  </span>
                ))}
              </div>
            </td>
            <td className="space-x-2">
              <Link href={`/admin/leads/view/${lead.id}`} className="text-blue-600 underline">View</Link>
              <Link href={`/admin/leads/edit/${lead.id}`} className="text-yellow-600 underline">Edit</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const buyerLeads = leads.filter((lead: any) => lead.leadType === "BUYER");
  const sellerLeads = leads.filter((lead: any) => lead.leadType === "SELLER");

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Leads</h1>
        <Link href="/admin/leads/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add New Lead
        </Link>
      </div>

      <details className="border rounded p-4 bg-gray-50 mb-6">
        <summary className="font-medium cursor-pointer">Filters & Bulk Actions</summary>
        <div className="flex flex-wrap gap-4 mt-4">
          <input type="text" placeholder="Search by name, contact, email or area" className="border p-2 rounded w-64" value={filters.query} onChange={(e) => { const updated = { ...filters, query: e.target.value }; setFilters(updated); localStorage.setItem("zestLeadFilters", JSON.stringify(updated)); }} />
          <input type="text" placeholder="Property Type" className="border p-2 rounded" value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })} />
          <input type="text" placeholder="Tag" className="border p-2 rounded" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })} />
          <select className="border p-2 rounded" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
          <input type="number" placeholder="Min Beds" className="border p-2 rounded w-24" value={filters.minBeds} onChange={(e) => setFilters({ ...filters, minBeds: e.target.value })} />
          <input type="number" placeholder="Min Baths" className="border p-2 rounded w-24" value={filters.minBaths} onChange={(e) => setFilters({ ...filters, minBaths: e.target.value })} />
          <input type="number" placeholder="Min Price" className="border p-2 rounded w-24" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
          <input type="number" placeholder="Max Price" className="border p-2 rounded w-24" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          <button onClick={() => { const cleared = { query: "", propertyType: "", tag: "", status: "", minBeds: "", minBaths: "", minPrice: "", maxPrice: "" }; setFilters(cleared); localStorage.removeItem("zestLeadFilters"); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Clear Filters</button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Tag name" className="border p-2 rounded w-64" />
          <button onClick={applyBulkTag} className="bg-green-600 text-white px-4 py-2 rounded">Apply Tag to Selected</button>
          <input type="number" value={bulkPrice} onChange={(e) => setBulkPrice(e.target.value)} placeholder="Set price" className="border p-2 rounded w-40" />
          <button onClick={async () => { if (!bulkPrice || isNaN(parseFloat(bulkPrice)) || selected.length === 0) return; await fetch("/api/admin/leads/price-bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadIds: selected, price: parseFloat(bulkPrice) }) }); alert("Price updated."); setBulkPrice(""); setSelected([]); location.reload(); }} className="bg-blue-600 text-white px-4 py-2 rounded">Update Price</button>
          <span className="text-sm text-gray-500">{selected.length} selected</span>
        </div>
      </details>

      <div className="flex gap-4 border-b mb-4">
        <button className={`px-4 py-2 text-sm font-medium ${activeTab === "BUYER" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => { setActiveTab("BUYER"); localStorage.setItem("zestTab", "BUYER"); }}>Buyer</button>
        <button className={`px-4 py-2 text-sm font-medium ${activeTab === "SELLER" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`} onClick={() => { setActiveTab("SELLER"); localStorage.setItem("zestTab", "SELLER"); }}>Seller</button>
      </div>

      {loading ? <p>Loading...</p> : leads.length > 0 ? (activeTab === "BUYER" ? renderTable(buyerLeads) : renderTable(sellerLeads)) : <p>No leads found.</p>}
    </AdminLayout>
  );
}