import { useState, useEffect, useMemo } from "react";

interface Lead {
  id: string;
  name: string;
  propertyType: string;
  desireArea: string;
  leadType: "BUYER" | "SELLER";
  isAvailable: boolean;
}

interface AssignedLead {
  id: string;
  assignedAt: string;
  lead: {
    id: string;
    name: string;
    propertyType: string;
    desireArea: string;
    leadType: "BUYER" | "SELLER";
  };
}

export default function AssignLeadSection({ userId }: { userId: string }) {
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [assignedLeads, setAssignedLeads] = useState<AssignedLead[]>([]);
  const [leadTab, setLeadTab] = useState<"BUYER" | "SELLER">("BUYER");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [filterAssignedQuery, setFilterAssignedQuery] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [modalSearch, setModalSearch] = useState("");

  useEffect(() => {
    // Load available leads
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data: Lead[]) => setAvailableLeads(data.filter((l) => l.isAvailable)));
    // Load assigned leads
    fetch(`/api/admin/users/${userId}/assigned`)
      .then((res) => res.json())
      .then(setAssignedLeads);
  }, [userId]);

  const propertyOptions = useMemo(
    () => Array.from(new Set(assignedLeads.map((a) => a.lead.propertyType))),
    [assignedLeads]
  );
  const areaOptions = useMemo(
    () => Array.from(new Set(assignedLeads.map((a) => a.lead.desireArea))),
    [assignedLeads]
  );

  // Assigned leads filtering, now respects the active tab
  const filteredAssigned = useMemo(
    () => assignedLeads.filter((item) => {
      if (item.lead.leadType !== leadTab) return false;
      const { name, propertyType, desireArea } = item.lead;
      const assignedAt = new Date(item.assignedAt).toLocaleDateString();
      return [name, propertyType, desireArea, assignedAt]
        .some((f) => f.toLowerCase().includes(filterAssignedQuery.toLowerCase()))
        && (!filterProperty || item.lead.propertyType === filterProperty)
        && (!filterArea || item.lead.desireArea === filterArea);
    }),
    [assignedLeads, filterAssignedQuery, filterProperty, filterArea, leadTab]
  );

  // Available leads in modal for bulk assign
  const filteredAvailable = useMemo(
    () => availableLeads
      .filter((lead) => lead.leadType === leadTab)
      .filter((lead) => [lead.name, lead.propertyType, lead.desireArea]
        .some((f) => f.toLowerCase().includes(modalSearch.toLowerCase()))),
    [availableLeads, leadTab, modalSearch]
  );

  const toggleSelection = (id: string) => {
    setSelectedLeads((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  // Bulk assign and refresh
  const handleBulkAssign = async () => {
    if (!selectedLeads.length) return;
    await Promise.all(selectedLeads.map((leadId) =>
      fetch(`/api/admin/users/${userId}/assign-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      })
    ));
    // refresh assigned
    const res = await fetch(`/api/admin/users/${userId}/assigned`);
    if (res.ok) setAssignedLeads(await res.json());
    setSelectedLeads([]);
    setModalOpen(false);
    setModalSearch("");
  };

  const handleRemove = async (id: string) => {
    const res = await fetch(`/api/admin/users/${userId}/assigned`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedId: id }),
    });
    if (res.ok) setAssignedLeads((prev) => prev.filter((a) => a.id !== id));
    else alert("Failed to unassign lead");
  };

  return (
    <div className="mt-6">
      {/* Tabs & Assign Button */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setLeadTab("BUYER")}
          className={`px-4 py-1 rounded shadow ${leadTab === "BUYER" ? "bg-primary text-teal-300" : "bg-teal-400"}`}
        >Buyer</button>
        <button
          onClick={() => setLeadTab("SELLER")}
          className={`px-4 py-1 rounded shadow ${leadTab === "SELLER" ? "bg-primary text-teal-300" : "bg-teal-400"}`}
        >Seller</button>
        <div className="ml-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-accent text-text px-4 py-2 rounded shadow border border-gray-300"
          >Assign Leads</button>
        </div>
      </div>

      {/* Filters for Assigned Leads */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search assigned leads..."
          className="border rounded p-2 flex-1 text-text shadow"
          value={filterAssignedQuery}
          onChange={(e) => setFilterAssignedQuery(e.target.value)}
        />
        <select
          className="border rounded p-2 text-text shadow"
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}>
          <option value="">All Property Types</option>
          {propertyOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <select
          className="border rounded p-2 text-text shadow"
          value={filterArea}
          onChange={(e) => setFilterArea(e.target.value)}>
          <option value="">All Desired Areas</option>
          {areaOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>

      {/* Assigned Leads Table */}
      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full border-collapse shadow">
          <thead>
            <tr className="bg-primary text-teal-300">
              <th className="p-2 text-left">Lead Name</th>
              <th className="p-2 text-left">Property Type</th>
              <th className="p-2 text-left">Desired Area</th>
              <th className="p-2 text-left">Assigned At</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssigned.map((item) => (
              <tr key={item.id} className="border-b hover:bg-surface">
                <td className="p-2 text-text">{item.lead.name}</td>
                <td className="p-2 text-text">{item.lead.propertyType}</td>
                <td className="p-2 text-text">{item.lead.desireArea}</td>
                <td className="p-2 text-text">{new Date(item.assignedAt).toLocaleDateString()}</td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >Remove</button>
                </td>
              </tr>
            ))}
            {filteredAssigned.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500 italic">No leads assigned.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Bulk Assign */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-surface rounded-lg w-11/12 md:w-3/4 p-6 shadow-lg border border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-text">Select Leads</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setLeadTab("BUYER")}
                className={`px-4 py-1 rounded shadow ${leadTab === "BUYER" ? "bg-primary text-white" : "bg-gray-200"}`}
              >Buyer Leads</button>
              <button
                onClick={() => setLeadTab("SELLER")}
                className={`px-4 py-1 rounded shadow ${leadTab === "SELLER" ? "bg-primary text-white" : "bg-gray-200"}`}
              >Seller Leads</button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search leads in modal..."
                className="border rounded p-2 w-full text-text shadow"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="table-auto w-full border-collapse shadow">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-2"><input
                      type="checkbox"
                      checked={filteredAvailable.length > 0 && selectedLeads.length === filteredAvailable.length}
                      onChange={() => setSelectedLeads(
                        selectedLeads.length === filteredAvailable.length ? [] : filteredAvailable.map((l) => l.id)
                      )} /></th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Property Type</th>
                    <th className="p-2 text-left">Desired Area</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAvailable.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-surface">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleSelection(lead.id)}
                        />
                      </td>
                      <td className="p-2 text-text">{lead.name}</td>
                      <td className="p-2 text-text">{lead.propertyType}</td>
                      <td className="p-2 text-text">{lead.desireArea}</td>
                    </tr>
                  ))}
                  {filteredAvailable.length === 0 && (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-500 italic">No leads available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded border text-text shadow">Cancel</button>
              <button onClick={handleBulkAssign} className="bg-accent text-text px-4 py-2 rounded shadow-lg">Assign Selected</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
