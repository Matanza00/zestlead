// pages/user/my-leads/view/[id].tsx
'use client';

import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import UserLayout from '@/components/CombinedNavbar';
import { MapPin, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface LeadDetail {
  status: string;
  purchasedAt: string;
  id: string;
  name: string;
  contact: string;
  email?: string;
  leadType: string;
  propertyType: string;
  desireArea?: string;
  propertyAddress?: string;
  beds?: number;
  baths?: number;
  priceRange?: string;
  price?: number;
  paymentMethod?: string;
  preApproved?: boolean;
  hasRealtor?: boolean;
  timeline?: string;
  appointment?: string;
  specialRequirements?: string;
  notes?: string;
  propertySize?: string;
  parcelId?: string;
  askingPrice?: number;
  marketValue?: number;
  tags?: { id: string; name: string }[];
  audioFileUrl?: string;
}

export default function MyLeadViewPage(props) {
  const router = useRouter();
  const { id } = router.query;

  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Editable UI state
  const [statusDraft, setStatusDraft] = useState<string>('NOT_CONTACTED');
  const [notesDraft, setNotesDraft] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Status values and styling
  const STATUS_OPTIONS: { value: string; label: string }[] = [
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'NOT_CONTACTED', label: 'Not Contacted' },
    { value: 'NO_RESPONSE', label: 'No Response' },
    { value: 'CLOSED', label: 'Closed' },
  ];
  const statusColor: Record<string, string> = {
    NOT_CONTACTED: 'bg-gray-100 text-gray-600',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    NO_RESPONSE: 'bg-red-100 text-red-600',
    CLOSED: 'bg-green-100 text-green-700',
  };

  // Grouped read-only sections
  const groupedFields: Record<string, (keyof LeadDetail)[]> = {
    'Client Information': ['name', 'contact', 'email'],
    'Property Information': [
      'propertyType',
      'beds',
      'baths',
      'desireArea',
      'propertyAddress',
      'propertySize',
      'parcelId',
    ],
    'Price & Timeline': [
      'priceRange',
      'price',
      'askingPrice',
      'marketValue',
      'paymentMethod',
      'timeline',
      'appointment',
      'preApproved',
    ],
    'Additional Details': ['hasRealtor', 'specialRequirements', 'notes', 'tags', 'audioFileUrl'],
    'Status ': ['status', 'purchasedAt'],
  };

  const labels: Record<string, string> = {
    name: 'Name',
    contact: 'Contact',
    email: 'Email',
    propertyType: 'Property Type',
    beds: 'Beds',
    baths: 'Baths',
    desireArea: 'Area',
    propertyAddress: 'Address',
    propertySize: 'Property Size',
    parcelId: 'Parcel ID',
    priceRange: 'Price Range',
    price: 'Lead Price',
    askingPrice: 'Asking Price',
    marketValue: 'Market Value',
    paymentMethod: 'Payment Method',
    timeline: 'Timeline',
    appointment: 'Appointment',
    preApproved: 'Pre-approved',
    hasRealtor: 'Has Realtor',
    specialRequirements: 'Special Requirements',
    notes: 'Notes',
    tags: 'Tags',
    audioFileUrl: 'Audio Note',
    status: 'Status',
    purchasedAt: 'Purchased On',
  };

  // Fetch lead on mount/id change
  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/my-leads/${id}`);
        if (!res.ok) throw new Error('Failed to load');
        const raw = await res.json();
        const detail: any = raw.lead
          ? { ...raw.lead, status: raw.status, purchasedAt: raw.purchasedAt || raw.createdAt }
          : raw;

        const normalizedStatus = (detail?.status || '')
          .toString()
          .trim()
          .toUpperCase()
          .replace(/\s+/g, '_');

        setLead(detail);
        setStatusDraft(
          ['CONTACTED', 'NOT_CONTACTED', 'NO_RESPONSE', 'CLOSED'].includes(normalizedStatus)
            ? normalizedStatus
            : 'NOT_CONTACTED'
        );
        setNotesDraft(detail?.notes || '');
      } catch (e) {
        setLead(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Helper to format cell values
  const formatValue = (key: keyof LeadDetail) => {
    if (!lead) return null;
    const val = (lead as any)[key];

    if (val === undefined || val === null || (typeof val === 'string' && val === '')) {
      return null;
    }
    if (key === 'purchasedAt') return moment(val).format('MMM D, YYYY • h:mm A');
    if (key === 'preApproved' || key === 'hasRealtor') return val ? 'Yes' : 'No';
    if (key === 'tags' && Array.isArray(val)) return val.length ? val.map((t: any) => t.name).join(', ') : null;
    if (key === 'audioFileUrl') return <audio controls src={val as string} className="w-full" />;
    if (key === 'status') {
      const cls = statusColor[(lead?.status || 'NOT_CONTACTED').toUpperCase()] || statusColor.NOT_CONTACTED;
      const friendly =
        STATUS_OPTIONS.find(o => o.value === (lead?.status || '').toUpperCase())?.label ||
        (lead?.status || '').toString();
      return <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${cls}`}>{friendly}</span>;
    }
    return String(val);
  };

  // Derived UI bits (keep hooks BEFORE early returns)
  const fullAddress = encodeURIComponent(lead?.propertyAddress || `${lead?.desireArea || ''}, USA`);
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=14&size=600x400&markers=color:red%7C${fullAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  const statusBadgeClass = useMemo(() => {
    const key = (lead?.status || 'NOT_CONTACTED').toUpperCase();
    return statusColor[key] || statusColor.NOT_CONTACTED;
  }, [lead?.status]);

  // Save handler (optimistic)
  const saveStatusAndNotes = async () => {
    if (!id || !lead) return;
    const payload = {
      status: statusDraft, // expects CONTACTED | NOT_CONTACTED | NO_RESPONSE | CLOSED
      notes: notesDraft ?? '',
    };

    setSaving(true);
    const prev = lead;
    setLead({ ...lead, status: payload.status, notes: payload.notes });

    try {
      const res = await fetch(`/api/user/my-leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      toast.success('Lead updated');
    } catch (e) {
      setLead(prev);
      toast.error('Could not save changes');
    } finally {
      setSaving(false);
    }
  };

  // Early returns AFTER all hooks
  if (loading) {
    return (
      <UserLayout>
        <p className="p-6">Loading lead...</p>
      </UserLayout>
    );
  }
  if (!lead) {
    return (
      <UserLayout>
        <p className="p-6 text-red-600">Lead not found.</p>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <button
        onClick={() => router.back()}
        className="mt-4 ml-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back
      </button>

      <div className="max-w-8xl mx-auto p-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-3xl font-bold">Purchased Lead Details</h1>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${statusBadgeClass}`}>
            {STATUS_OPTIONS.find(o => o.value === (lead.status || '').toUpperCase())?.label ||
              lead.status ||
              'Not Contacted'}
          </span>
        </div>

        

        {/* Details + Map */}
        <div className="grid md:grid-cols-2 gap-8 bg-white border rounded-lg shadow p-6">
          {/* LEFT: grouped fields */}
          <div className="space-y-6 text-gray-700 text-sm">
            {Object.entries(groupedFields).map(([section, keys]) => {
              const visible = keys
                .map(key => ({ key, value: formatValue(key) }))
                .filter(({ value }) => value !== null);

              if (!visible.length) return null;

              return (
                <div key={section}>
                  <h2 className="text-xl font-semibold mb-3">{section}</h2>

                  {section === 'Additional Details' ? (
                    <div className="space-y-2">
                      {visible.map(({ key, value }) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-medium">{labels[key]}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-y-3 gap-x-6 grid-cols-1 md:grid-cols-2">
                      {visible.map(({ key, value }) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="font-medium">{labels[key]}:</span>
                          <span className="flex-1">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RIGHT: map */}
          <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
            <img src={mapUrl} alt="Property location" className="w-full h-full object-cover" />
            <a
              href={`https://maps.google.com/?q=${fullAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 inline-flex items-center bg-white text-primary text-sm px-3 py-1 rounded-full shadow"
            >
              <MapPin className="w-4 h-4 mr-1" />
              View on Google Maps
            </a>
          </div>
        </div>
        {/* Quick Edit card */}
        <div className="mb-6 grid md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold mb-3">Status & Notes</h2>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Status dropdown */}
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Status</label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm"
                  disabled={saving}
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Choose current engagement outcome.</p>
              </div>

              {/* Notes box */}
              <div className="flex flex-col md:col-span-1">
                <label className="text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  className="min-h-[90px] px-3 py-2 border border-gray-200 rounded-md text-sm"
                  placeholder="Call summary, objections, next steps…"
                  disabled={saving}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={saveStatusAndNotes}
                disabled={saving}
                className={`px-4 py-2 rounded-md text-white ${
                  saving ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setStatusDraft((lead.status || 'NOT_CONTACTED').toUpperCase().replace(/\s+/g, '_'));
                  setNotesDraft(lead.notes || '');
                }}
                disabled={saving}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick meta */}
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold mb-3">Purchase</h2>
            <div className="text-sm text-gray-700">
              <div className="flex justify-between py-1">
                <span className="font-medium">Purchased On:</span>
                <span>{moment(lead.purchasedAt).format('MMM D, YYYY • h:mm A')}</span>
              </div>
              {typeof lead.price === 'number' && (
                <div className="flex justify-between py-1">
                  <span className="font-medium">Lead Price:</span>
                  <span>${Math.round(lead.price).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
