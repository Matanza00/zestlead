'use client';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui2/button";
import Link from "next/link";
import {
  Mail, Phone, Bed, Bath, MapPin, DollarSign,
  TrendingUpDown, HandCoins, ArrowLeft
} from 'lucide-react'


export default function ViewLeadPage(props) {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/leads/${id}`)
        .then(res => res.json())
        .then(setLead);
    }
  }, [id]);

  if (!lead) return <AdminLayout><p className="p-6">Loading...</p></AdminLayout>;

  const groupedFields = {
    'Client Information': ['name', 'contact', 'email'],
    'Property Information': ['propertyType', 'beds', 'baths', 'desireArea'],
    'Price & Timeline': ['price', 'priceRange', 'paymentMethod', 'timeline', 'preApproved'],
    'Additional Info': ['hasRealtor', 'specialReq', 'notes'],
  };

  const renderField = (key: string, value: any) => {
    if (!value) return null;

    const iconMap: { [key: string]: React.ElementType } = {
      email: Mail,
      contact: Phone,
      beds: Bed,
      baths: Bath,
      desireArea: MapPin,
      price: DollarSign,
      priceRange: TrendingUpDown,
      paymentMethod: HandCoins,
    };

    const Icon = iconMap[key];

    return (
      <div key={key} className="border border-[#D1D5DC] rounded p-3 bg-gray-50">
        <p className="text-[13px] font-semibold text-gray-800 mb-2 capitalize">
          {key.replace(/([A-Z])/g, ' $1')}
        </p>
        <p className="text-sm text-gray-800 break-words flex items-center gap-2">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span>{String(value)}</span>
        </p>
      </div>
    );
};


  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-plus-jakarta-sans text-3xl font-semibold bg-[radial-gradient(190.64%_199.6%_at_-3.96%_130%,#3A951B_0%,#1CDAF4_100%)]
            bg-clip-text text-transparent capitalize">
            {lead.leadType} Lead
          </h1>

          <Button
            asChild
            variant="outline"
            className="border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <Link href="/admin/leads">
              <ArrowLeft size={18} /> Back
            </Link>
          </Button>
        </div>

        {/* Section blocks */}
        {Object.entries(groupedFields).map(([section, keys]) => (
          <div key={section} className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">{section}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {keys.map(key => renderField(key, lead[key]))}
            </div>
          </div>
        ))}

        {/* Tags */}
        {Array.isArray(lead.tags) && lead.tags.length > 0 && (
          <div className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {lead.tags.map((tag: any) => (
                <span
                  key={tag.id || tag.name}
                  className="border border-[#D1D5DC] bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Audio block */}
        {lead.audioFileUrl && (
          <div className="rounded-lg bg-white shadow p-6 border border-[#D1D5DC]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Audio Note</h2>
            <div className="border border-[#D1D5DC] rounded p-3 bg-gray-50">
              <audio controls className="w-full rounded shadow">
                <source src={lead.audioFileUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className="text-sm text-gray-500 mt-2 break-words">{lead.audioFileUrl}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
