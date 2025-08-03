'use client';
import UserLayout from "@/components/CombinedNavbar"
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import moment from 'moment';

type PurchasedLead = {
  id: string;
  name: string;
  desireArea: string;
  propertyType: string;
  priceRange: string;
  price: number | null;
  leadType: 'BUYER' | 'SELLER';
  status: string;
  createdAt: string;
};

export default function MyLeadsPage(props) {
  const { data: session } = useSession();
  const [leads, setLeads] = useState<PurchasedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'BUYER' | 'SELLER'>('BUYER');

  useEffect(() => {
    const fetchMyLeads = async () => {
      try {
        const res = await fetch('/api/user/my-leads');
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error('Error loading leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyLeads();
  }, []);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const res = await fetch('/api/user/my-leads/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, status: newStatus }),
    });

    if (res.ok) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    }
  };

const filteredLeads = Array.isArray(leads)
  ? leads.filter((lead) => lead.leadType === selectedTab)
  : [];


  return (
    <UserLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">My Purchased Leads</h1>

        {/* Tabs for Buyer and Seller */}
        <div className="flex border-b">
          {(['BUYER', 'SELLER'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm focus:outline-none ${
                selectedTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-gray-600">No {selectedTab.toLowerCase()} leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow-sm">
              <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Lead Type</th>
                  <th className="p-3">Price Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Purchased</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const isNew =
                    moment().diff(moment(lead.createdAt), 'minutes') <= 60;
                  return (
                    <tr key={lead.id} className="border-t text-sm">
                      <td className="p-3">
                        {lead.name}
                        {isNew && (
                          <span className="ml-2 inline-block text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </td>
                      <td className="p-3">{lead.desireArea}</td>
                      <td className="p-3">{lead.propertyType}</td>
                      <td className="p-3">{lead.leadType}</td>
                      <td className="p-3">{lead.priceRange}</td>
                      <td className="p-3">
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusChange(lead.id, e.target.value)
                          }
                        >
                          <option value="NOT_CONTACTED">Not Contacted</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="NO_RESPONSE">No Response</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td className="p-3 text-xs text-gray-500">
                        {moment(lead.createdAt).format(
                          'MMM D, YYYY • h:mm A'
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            (window.location.href = `/user/my-leads/view/${lead.id}`)
                          }
                          className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
