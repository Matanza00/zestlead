// src/pages/leads/view/[id].tsx
'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Phone,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Bed,
  Bath,
  Mail,
  Map,
  ChevronLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import CombinedNavSidebar from '@/components/CombinedNavbar';

interface LeadDetail {
  id: string;
  name?: string;
  leadType: string;
  propertyType: string;
  timeline?: string;
  desireArea?: string;
  priceRange?: string;
  address?: string;
  beds?: number;
  baths?: number;
  contact?: string;
  email?: string;
  isPurchased: boolean;
}

export default function LeadViewPage(props) {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ isSubscribed: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(data => setUserData(data))
      .catch(() => setUserData(null));
  }, []);

  useEffect(() => {
    const { id } = query;
    if (typeof id !== 'string') return;

    fetch(`/api/public/leads/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Lead not found');
        return res.json();
      })
      .then((data: LeadDetail) => setLead(data))
      .catch(() => setLead(null))
      .finally(() => setLoading(false));
  }, [query]);

  const masked = (value: string | undefined, type: 'name' | 'email' | 'contact') => {
    if (!value) return '••••••';
    if (type === 'name') return '*********';
    if (type === 'email') return '••••••@••••.com';
    if (type === 'contact') return '+1 ••• ••• ••••';
    return '••••••';
  };

  const handleBuy = () => {
    if (!session?.user) {
      router.push(`/auth/login?callbackUrl=${router.asPath}`);
    } else if (!userData?.isSubscribed) {
      router.push(`/subscription?redirect=${router.asPath}`);
    } else {
      router.push(`/cart?leadId=${lead?.id}`);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading lead...</div>;
  if (!lead) return <div className="p-8 text-center text-red-500">Lead not found</div>;

  const fullAddress = encodeURIComponent(lead.address || `${lead.desireArea}, USA`);
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=15&size=600x400&markers=color:red%7C${fullAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return (
    <CombinedNavSidebar>
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <motion.h3
          className="text-3xl font-bold mb-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Lead Details
        </motion.h3>

        <motion.div
          className="bg-white border border-border rounded-xl shadow-md grid lg:grid-cols-2 gap-8 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left Section */}
          <div className="flex flex-col gap-6">
            <div className="space-y-1">
              <h4 className="text-xl font-semibold mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Name:</strong>{' '}
                    {lead.isPurchased ? lead.name : masked(lead.name, 'name')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Phone:</strong>{' '}
                    {lead.isPurchased ? lead.contact : masked(lead.contact, 'contact')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Email:</strong>{' '}
                    {lead.isPurchased ? lead.email : masked(lead.email, 'email')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Home className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Type:</strong> {lead.propertyType}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Area:</strong> {lead.desireArea}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Price Range:</strong> {lead.priceRange}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>
                    <strong>Timeline:</strong> {lead.timeline}
                  </span>
                </div>
                {lead.beds !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bed className="w-4 h-4 text-primary" />
                    <span>
                      <strong>Beds:</strong> {lead.beds}
                    </span>
                  </div>
                )}
                {lead.baths !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bath className="w-4 h-4 text-primary" />
                    <span>
                      <strong>Baths:</strong> {lead.baths}
                    </span>
                  </div>
                )}
              </div>

              {!lead.isPurchased && (
                <button
                  className="mt-4 inline-flex items-center text-sm px-4 py-2 rounded-full font-medium gap-2 border border-primary text-primary hover:bg-primary/10 transition"
                  onClick={handleBuy}
                >
                  <Phone className="w-4 h-4" />
                  Buy Lead to View Contact
                </button>
              )}
            </div>

            {/* Remarks */}
            <div>
              <label className="block font-medium text-sm mb-1">Remarks</label>
              <textarea
                rows={3}
                placeholder="Add your remarks or notes"
                className="w-full rounded-md border border-border px-4 py-2 text-sm bg-muted resize-none"
              />
            </div>
          </div>

          {/* Map / Right Section */}
          <div className="w-full h-full">
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
              {lead.isPurchased ? (
                <img
                  src={mapUrl}
                  alt="Lead Map"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-[400px] bg-muted flex items-center justify-center text-muted-foreground text-sm italic rounded-lg">
                  Map is hidden. Buy to unlock.
                </div>
              )}

              <a
                href={`https://maps.google.com/?q=${fullAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 px-3 py-1 text-sm bg-white text-primary rounded-full border border-primary shadow hover:brightness-105 inline-flex items-center"
              >
                <Map className="w-4 h-4 mr-1" />
                See Google Maps
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </CombinedNavSidebar>
  );
}
