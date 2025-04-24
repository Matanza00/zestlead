import { useState, useEffect } from "react";

export default function AssignLeadSection({ userId }) {
  const [availableLeads, setAvailableLeads] = useState([]);
  const [assignedLeads, setAssignedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState("");
  const [leadTab, setLeadTab] = useState<"BUYER" | "SELLER">("BUYER");
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => setAvailableLeads(data.filter((l) => l.isAvailable)));

    fetch(`/api/admin/users/${userId}/assigned`)
      .then((res) => res.json())
      .then(setAssignedLeads);
  }, [userId]);

  const handleAssign = async () => {
    if (!selectedLead) return;
    const res = await fetch(`/api/admin/users/${userId}/assign-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: selectedLead, note })
    });
    if (res.ok) {
      alert("Lead assigned!");
      setSelectedLead("");
      setNote("");
      const leadData = await res.json();
      setAssignedLeads((prev) => [...prev, leadData.assigned]);
    }
  };

  return (
    <div className="mt-6">
        <div className="flex gap-4 mb-4">
        <button
            onClick={() => setLeadTab("BUYER")}
            className={`px-4 py-1 rounded ${
            leadTab === "BUYER" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
            Buyer Leads
        </button>
        <button
            onClick={() => setLeadTab("SELLER")}
            className={`px-4 py-1 rounded ${
            leadTab === "SELLER" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
        >
            Seller Leads
        </button>
        </div>

      <h3 className="text-lg font-semibold mb-2">Assign New Lead</h3>
      <div className="flex gap-4 items-center mb-4">
      <select
        value={selectedLead}
        onChange={(e) => setSelectedLead(e.target.value)}
        className="border rounded p-2"
        >
        <option value="">-- Select {leadTab} Lead --</option>
        {availableLeads
            .filter((lead) => lead.leadType === leadTab)
            .map((lead) => (
            <option key={lead.id} value={lead.id}>
                {lead.name} — {lead.contact}
            </option>
        ))}
        </select>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          className="border p-2 rounded"
        />
        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Assign
        </button>
      </div>

      {assignedLeads.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Assigned Leads</h4>
          <ul className="space-y-1 text-sm">
            {/*Assigned Leads details */}
          {assignedLeads.map((item) => (
            <li key={item.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                <strong>{item.lead?.leadType || "Unknown"}:</strong>{" "}
                {item.lead?.name || "Unnamed Lead"} — {item.note || "No note"}{" "}
                <span className="text-gray-500">
                    ({new Date(item.assignedAt).toLocaleDateString()})
                </span>
                </div>
                <button
                onClick={async () => {
                    const res = await fetch(`/api/admin/users/${userId}/assigned`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ assignedId: item.id }),
                    });
                    if (res.ok) {
                    setAssignedLeads((prev) => prev.filter((p) => p.id !== item.id));
                    } else {
                    alert("Failed to unassign lead");
                    }
                }}
                className="text-red-600 hover:text-red-800 text-sm"
                >
                Remove
                </button>
            </li>
            ))}


          </ul>
        </div>
      )}
    </div>
  );
}
