// pages/user/my-leads.tsx
'use client';
import UserLayout from "@/components/CombinedNavbar";
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import moment from 'moment';
import toast from 'react-hot-toast';
import { FileDown } from 'lucide-react';

type PurchasedLead = {
  id: string;
  purchasesId?: string;
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

  // selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // fetch a page of leads
  const fetchPage = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/my-leads?page=${pageNum}&pageSize=10`, { credentials: 'include' });
      const { purchases, hasMore } = await res.json();

      const formatted: PurchasedLead[] = purchases.map((p: any) => ({
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
    } catch (e) {
      console.error(e);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const onSearch = useCallback((e) => {
    const v = e.target.value;
    setSearch(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // client-side filter only; no refetch
    }, 300);
  }, []);

  // filter by tab + search
  const filteredLeads = useMemo(() => {
    const s = search.trim().toLowerCase();
    return leads
      .filter(l => l.leadType === selectedTab)
      .filter(l =>
        !s ||
        l.name.toLowerCase().includes(s) ||
        (l.contact || '').toLowerCase().includes(s) ||
        (l.desireArea || '').toLowerCase().includes(s) ||
        (l.propertyType || '').toLowerCase().includes(s)
      );
  }, [leads, selectedTab, search]);

  // clear selection when tab changes (avoid mixing buyer/seller selections)
  useEffect(() => { setSelectedIds([]); }, [selectedTab]);

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const visibleIds = useMemo(() => filteredLeads.map(l => l.id), [filteredLeads]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every(id => selectedIds.includes(id));

  const toggleAllVisible = (checked: boolean) => {
    setSelectedIds(prev => {
      if (checked) {
        // add all visible to selection
        const set = new Set(prev);
        visibleIds.forEach(id => set.add(id));
        return Array.from(set);
        }
      // remove all visible from selection
      return prev.filter(id => !visibleIds.includes(id));
    });
  };

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/user/my-leads/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: newStatus } : lead));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  // CSV export helpers
  const exportCsvSelected = async () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one lead');
      return;
    }
    try {
      const res = await fetch('/api/user/my-leads/export-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leadIds: selectedIds }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zestleads-my-leads-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch (e: any) {
      toast.error(e.message || 'CSV export failed');
    }
  };

  const exportCsvAll = async () => {
    try {
      const res = await fetch('/api/user/my-leads/export-csv?all=true', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zestleads-my-leads-${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('CSV exported (all)');
    } catch (e: any) {
      toast.error(e.message || 'CSV export failed');
    }
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 mb-2">
          <h1 className="text-2xl font-bold text-gray-800">My Purchased Leads</h1>
          <div className="flex gap-2">
            <button
              onClick={exportCsvSelected}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              <FileDown className="w-4 h-4" />
              Export CSV (selected)
            </button>
            <button
              onClick={exportCsvAll}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50"
            >
              <FileDown className="w-4 h-4" />
              Export CSV (all)
            </button>
          </div>
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            type="text"
            placeholder="Search by name, contact, area..."
            value={search}
            onChange={onSearch}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-72"
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
        </div>

        {/* Table */}
        {loading && page === 1 ? (
          <p>Loading...</p>
        ) : filteredLeads.length === 0 ? (
          <p className="text-gray-600">No {selectedTab.toLowerCase()} leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded shadow-sm">
              <thead className="bg-gray-100 text-left text-sm text-gray-600">
                <tr>
                  <th className="p-3 w-10">
                    {/* Select all (shown) */}
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={(e) => toggleAllVisible(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Price Range</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Purchased</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const isNew = moment().diff(moment(lead.createdAt), 'minutes') <= 60;
                  const checked = selectedIds.includes(lead.id);
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => router.push(`/user/my-leads/view/${lead.id}`)}
                      className="border-t text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                    >
                      <td className="p-3 w-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleOne(lead.id)}
                        />
                      </td>
                      <td className="p-3">
                        {lead.name}
                        {isNew && (
                          <span className="ml-2 inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </td>
                      <td className="p-3">{lead.contact}</td>
                      <td className="p-3">{lead.desireArea}</td>
                      <td className="p-3">{lead.propertyType}</td>
                      <td className="p-3">{lead.priceRange}</td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          className="border rounded px-2 py-1 text-sm"
                          value={lead.status}
                          onChange={e => handleStatusChange(lead.id, e.target.value)}
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
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
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

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => fetchPage(page + 1)}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? 'Loading…' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
