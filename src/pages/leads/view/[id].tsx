// src/pages/leads/view/[id].tsx
'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  User, Phone, Home, MapPin, DollarSign,
  Calendar, Map, ChevronRight,
  Mail,
  Bed,
  Bath
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LeadDetail {
  id: string;
  name: string;
  leadType: string;
  propertyType: string;
  timeline: string;
  desireArea: string;
  priceRange: string;
  address?: string;
  beds?: number;
  baths?: number;
  contact?: string;
  email?: string;
  isPurchased: boolean;
}

export default function LeadViewPage(props) {
  const { query } = useRouter();
  const router = useRouter();
  const { data: session } = useSession();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ isSubscribed: boolean } | null>(null);

  useEffect(() => {
  const getUser = async () => {
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      setUserData(data);
    } catch {
      console.error('Failed to fetch user');
    }
  };
  getUser();
}, []);


  const fetchLead = async (id: string) => {
    try {
      const res = await fetch(`/api/public/leads/${id}`);
      if (!res.ok) throw new Error('Lead not found');
      const data = await res.json();
      setLead(data);
    } catch (err) {
      console.error('Error fetching lead', err);
      setLead(null);
    } finally {
      setLoading(false);
    }
  };

  const masked = (value: string | undefined, type: 'name' | 'email' | 'contact') => {
  if (!value) return '••••••';
  if (type === 'name') return '*********';
  if (type === 'email') return '••••••@••••.com';
  if (type === 'contact') return '+1 ••• ••• ••••';
  return '••••••';
};

  useEffect(() => {
    const { id } = query;
    if (typeof id === 'string') fetchLead(id);
  }, [query]);

  const handleBuy = () => {
    if (!session?.user) {
      router.push(`/auth/login?callbackUrl=${router.asPath}`);
      return;
    }
    router.push(`/subscription?redirect=${router.asPath}`);
  };

  if (loading) return <div className="p-8 text-center">Loading lead...</div>;
  if (!lead) return <div className="p-8 text-center text-red-500">Lead not found</div>;

  const fullAddress = encodeURIComponent(lead.address || `${lead.desireArea}, USA`);
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=15&size=600x400&markers=color:red%7C${fullAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

  return (
    <section className="py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
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
                  <span><strong>Name:</strong> {lead.isPurchased ? lead.name : masked(lead.name, 'name')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span><strong>Phone:</strong> {lead.isPurchased ? lead.contact : masked(lead.contact, 'contact')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span><strong>Email:</strong> {lead.isPurchased ? lead.email : masked(lead.email, 'email')}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Home className="w-4 h-4 text-primary" />
                  <span><strong>Type:</strong> {lead.propertyType}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span><strong>Area:</strong> {lead.desireArea}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span><strong>Price Range:</strong> {lead.priceRange}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span><strong>Timeline:</strong> {lead.timeline}</span>
                </div>
                {lead.beds !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bed className="w-4 h-4 text-primary" />
                    <span><strong>Beds:</strong> {lead.beds}</span>
                  </div>
                )}
                {lead.baths !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bath className="w-4 h-4 text-primary" />
                    <span><strong>Baths:</strong> {lead.baths}</span>
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

            {/* Bottom CTA Button Section */}
            <div className="mt-6 flex gap-2">
              {!session?.user ? (
                // 3️⃣ Not logged in → send to login, callback back to this lead
                <button
                  onClick={() =>
                    router.push(
                      `/auth/login?callbackUrl=/leads/view/${lead.id}`
                    )
                  }
                  className="w-full text-sm px-4 py-2 bg-primary text-white rounded-full"
                >
                  Log in to Buy Lead
                </button>

              ) : !userData?.isSubscribed ? (
                // 2️⃣ Logged in & NOT subscribed → send to subscription page
                <button
                  onClick={() =>
                    router.push(
                      `/subscription?leadId=${lead.id}`
                    )
                  }
                  className="w-full text-sm px-4 py-2 bg-yellow-500 text-white rounded-full"
                >
                  Subscribe to Buy Lead
                </button>

              ) : !lead.isPurchased ? (
                // 1️⃣ Logged in & Subscribed & not yet purchased → send to cart
                <button
                  onClick={() =>
                    router.push(`/cart?leadId=${lead.id}`)
                  }
                  className="w-full text-sm px-4 py-2 bg-green-600 text-white rounded-full"
                >
                  Buy Lead
                </button>

              ) : (
                // Already purchased
                <button
                  onClick={() =>
                    router.push(`/user/leads/view/${lead.id}`)
                  }
                  className="w-full text-sm px-4 py-2 bg-blue-600 text-white rounded-full"
                >
                  View Lead in Dashboard
                </button>
              )}
            </div>

          </div>

          {/* Map */}
          <div className="w-full h-full">
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-border">
              {lead.isPurchased ? (
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${fullAddress}&zoom=15&size=600x400&markers=color:red%7C${fullAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
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
  );
}
