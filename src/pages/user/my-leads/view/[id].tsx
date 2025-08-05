// pages/user/my-leads/view/[id].tsx
'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';
import UserLayout from '@/components/CombinedNavbar';
import {
  User,
  Phone,
  Mail,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Bed,
  Bath,
  Tag,
  FileText,
  Music,
  ChevronLeft,
} from 'lucide-react';

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

  // group definitions
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
    'Additional Details': [
      'hasRealtor',
      'specialRequirements',
      'notes',
      'tags',
      'audioFileUrl',
    ],
    'Status & Purchase': ['status', 'purchasedAt'],
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

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/user/my-leads/${id}`);
        const raw = await res.json();
        const detail: any = raw.lead
          ? { ...raw.lead, status: raw.status, purchasedAt: raw.purchasedAt || raw.createdAt }
          : raw;
        setLead(detail);
      } catch {
        setLead(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  // status color map
  const statusColor: Record<string, string> = {
    NOT_CONTACTED: 'bg-gray-100 text-gray-600',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    NO_RESPONSE: 'bg-red-100 text-red-600',
    CLOSED: 'bg-green-100 text-green-700',
  };

  // format values, return null to hide
  const formatValue = (key: keyof LeadDetail) => {
    const val = (lead as any)[key];
    if (
      val === undefined ||
      val === null ||
      (typeof val === 'string' && val === '')
    ) {
      return null;
    }
    if (key === 'purchasedAt') {
      return moment(val).format('MMM D, YYYY • h:mm A');
    }
    if (key === 'preApproved' || key === 'hasRealtor') {
      return val ? 'Yes' : 'No';
    }
    if (key === 'tags' && Array.isArray(val)) {
      return val.length ? val.map((t: any) => t.name).join(', ') : null;
    }
    if (key === 'audioFileUrl') {
      return <audio controls src={val as string} className="w-full" />;
    }
    return String(val);
  };

  const fullAddress = encodeURIComponent(
    lead.propertyAddress || `${lead.desireArea}, USA`
  );
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=14&size=600x400&markers=color:red%7C${fullAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

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
        <h1 className="text-3xl font-bold mb-6">Purchased Lead Details</h1>
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
                    // Only one rendering path, label and value on the same line
                    <div className="space-y-2">
                      {visible.map(({ key, value }) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="font-medium">{labels[key]}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // All other sections still use the two-column grid
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
            <img
              src={mapUrl}
              alt="Property location"
              className="w-full h-full object-cover"
            />
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
      </div>
    </UserLayout>
  );
}
//```네요
