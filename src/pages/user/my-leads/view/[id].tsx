'use client';
import UserLayout from "@/components/CombinedNavbar"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import moment from 'moment';

export default function LeadViewPage(props) {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchLead = async () => {
      const res = await fetch(`/api/user/my-leads/${id}`);
      const data = await res.json();
      setLead(data);
      setLoading(false);
    };
    fetchLead();
  }, [id]);

  const statusColorMap: Record<string, string> = {
    NOT_CONTACTED: 'bg-gray-100 text-gray-600',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    NO_RESPONSE: 'bg-red-100 text-red-600',
    CLOSED: 'bg-green-100 text-green-700',
  };

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
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow mt-4 space-y-4">
        <h1 className="text-xl font-bold text-gray-800 mb-2">Lead Details</h1>

        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Name:</strong> {lead.name}</p>
          <p><strong>Area:</strong> {lead.desireArea}</p>
          <p><strong>Property Type:</strong> {lead.propertyType}</p>
          <p><strong>Lead Type:</strong> {lead.leadType}</p>
          <p><strong>Price Range:</strong> {lead.priceRange}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded-full text-xs ${statusColorMap[lead.status]}`}>
              {lead.status.replaceAll('_', ' ')}
            </span>
          </p>
          <p><strong>Purchased On:</strong> {moment(lead.createdAt).format('MMM D, YYYY • h:mm A')}</p>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
        >
          ← Back to My Leads
        </button>
      </div>
    </UserLayout>
  );
}
