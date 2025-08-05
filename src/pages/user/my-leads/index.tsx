// pages/user/my-leads.tsx
'use client';
import UserLayout from "@/components/CombinedNavbar";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import moment from 'moment';

type PurchasedLead = {
  id: string;
  name: string;
  contact: string;
  desireArea: string;
  propertyType: string;
  priceRange: string;
  price: number | null;
  leadType: 'BUYER' | 'SELLER';
  status: string;
  createdAt: string;
};

export default function MyLeadsPage(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [leads, setLeads] = useState<PurchasedLead[]>([]);
  const [selectedTab, setSelectedTab] = useState<'BUYER' | 'SELLER'>('BUYER');
  const [search, setSearch] = useState('');
  const debounceRef = useRef<NodeJS.Timeout|null>(null);
  const [page, setPage]       = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // fetch a page of leads
  const fetchPage = async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`/api/user/my-leads?page=${pageNum}&pageSize=10`);
    const { purchases, hasMore } = await res.json();
    // flatten same as before:
    const formatted = purchases.map((p: any) => ({
      id:           p.lead.id,
      purchasesId:  p.purchaseId,
      name:         p.lead.name,
      contact:      p.lead.contact,
      desireArea:   p.lead.desireArea,
      propertyType: p.lead.propertyType,
      priceRange:   p.lead.priceRange,
      price:        p.lead.price,
      leadType:     p.lead.leadType,
      status:       p.status,
      createdAt:    p.purchasedAt,
    }));
    setLeads(prev => pageNum === 1 ? formatted : [...prev, ...formatted]);
    setHasMore(hasMore);
    setPage(pageNum);
    setLoading(false);
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const onSearch = useCallback((e) => {
    const v = e.target.value;
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // filtering happens below
    }, 300);
  }, []);

  const filteredLeads = leads
    .filter(l => l.leadType === selectedTab)
    .filter(l =>
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.includes(search) ||
      l.desireArea.toLowerCase().includes(search.toLowerCase()) ||
      l.propertyType.toLowerCase().includes(search.toLowerCase())
    );

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    const res = await fetch('/api/user/my-leads/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, status: newStatus }),
    });
    if (res.ok) {
      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between mt-8 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Purchased Leads</h1>
          
        </div>
<input
            type="text"
            placeholder="Search by name, contact, area..."
            value={search}
            onChange={onSearch}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
          />
        <div className="flex border-b">
          {(['BUYER', 'SELLER'] as const).map(tab => (
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
                  <th className="p-3">Contact</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Property</th>
                  {/* <th className="p-3">Lead Type</th> */}
                  <th className="p-3">Price Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Purchased</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const isNew = moment().diff(moment(lead.createdAt), 'minutes') <= 60;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/user/my-leads/view/${lead.id}`)}
                      className="border-t text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                    >
                      <td className="p-3">
                        {lead.name}
                        {isNew && (
                          <span className="ml-2 inline-block text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </td>
                      <td className="p-3">{lead.contact}</td>
                      <td className="p-3">{lead.desireArea}</td>
                      <td className="p-3">{lead.propertyType}</td>
                      {/* <td className="p-3">{lead.leadType}</td> */}
                      <td className="p-3">{lead.priceRange}</td>
                      <td
                        className="p-3"
                        onClick={e => e.stopPropagation()}
                      >
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={lead.status}
                          onChange={e =>
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
                        {moment(lead.createdAt).format('MMM D, YYYY • h:mm A')}
                      </td>
                      <td
                        className="p-3 text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => router.push(`/user/my-leads/view/${lead.id}`)}
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
       {/* Load more button */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => fetchPage(page + 1)}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? 'Loading…' : 'Load More'}
          </button>
        </div>
      )}
    </UserLayout>
  );
}
