// src/pages/leads/view/[id].tsx
'use client';

import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
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
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import CombinedNavSidebar from '@/components/CombinedNavbar';

type PlanKey = 'STARTER' | 'GROWTH' | 'PRO';

// Normalize any tier string to a key
function normalizePlanKey(input?: string | null): PlanKey {
  const v = (input || '').toUpperCase();
  if (v.includes('PRO')) return 'PRO';
  if (v.includes('GROWTH')) return 'GROWTH';
  if (v.includes('STARTER')) return 'STARTER';
  return 'STARTER'; // unknown/no sub => treat as STARTER
}

// Delay by tier
function requiredDelayMsForTier(tier: PlanKey) {
  if (tier === 'PRO') return 0;
  if (tier === 'GROWTH') return 2 * 60 * 60 * 1000;  // 2h
  return 24 * 60 * 60 * 1000;                        // 24h
}

// HH:MM:SS
function formatCountdown(ms: number) {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Compute eligibility for countdown
function getEligibility(createdAtISO: string | undefined, tier: PlanKey, nowMs: number) {
  if (tier === 'PRO') {
    return { eligible: true, remainingMs: 0, eligibleAt: null as Date | null };
  }
  if (!createdAtISO) {
    // If createdAt is missing, assume eligible (server still enforces)
    return { eligible: true, remainingMs: 0, eligibleAt: null as Date | null };
  }
  const created = new Date(createdAtISO).getTime();
  if (Number.isNaN(created)) {
    return { eligible: true, remainingMs: 0, eligibleAt: null as Date | null };
  }
  const delay = requiredDelayMsForTier(tier);
  const eligibleAtMs = created + delay;
  const remainingMs = Math.max(0, eligibleAtMs - nowMs);
  return {
    eligible: remainingMs === 0,
    remainingMs,
    eligibleAt: new Date(eligibleAtMs),
  };
}

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
  createdAt?: string; // <-- used for countdown
}

// Return the minimal tier that would allow instant-buy *right now*
function bestInstantUpgradeTier(createdAtISO: string | undefined, nowMs: number): PlanKey | null {
  if (!createdAtISO) return 'PRO'; // unknown age → only PRO is guaranteed instant
  const created = new Date(createdAtISO).getTime();
  if (Number.isNaN(created)) return 'PRO';

  const ageMs = nowMs - created;
  const twoHours = 2 * 60 * 60 * 1000;

  // If the lead is at least 2h old, Growth would already be instant.
  if (ageMs >= twoHours) return 'GROWTH';

  // Otherwise only PRO is instant right now.
  return 'PRO';
}


export default function LeadViewPage(props) {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ isSubscribed: boolean } | null>(null);

  // Subscription tier (for chip + button lock)
  const [tier, setTier] = useState<PlanKey>('STARTER');
  // Ticking clock for live countdown
  const [now, setNow] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  

  useEffect(() => {
    intervalRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(data => setUserData(data))
      .catch(() => setUserData(null));
  }, []);

  // Fetch current subscription (same endpoint used on subscription page)
  useEffect(() => {
    fetch('/api/user/account/subscription', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then((data) => {
        const t =
          data?.tierName ||
          data?.subscription?.tierName ||
          data?.plan ||
          data?.name;
        setTier(normalizePlanKey(t));
      })
      .catch(() => setTier('STARTER'));
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

  // Countdown info (used to lock the button until eligible)
  const info = getEligibility(lead.createdAt, tier, now);
  const isLocked = !lead.isPurchased && !info.eligible;
  const buttonLabel = isLocked
    ? `Locked • ${formatCountdown(info.remainingMs)}`
    : 'Buy Lead to View Contact';
  const buttonTitle = isLocked
    ? `Available at ${info.eligibleAt?.toLocaleString()}`
    : undefined;

  // Optional small chip near title (visual indicator)
  const Chip = ({ label, kind, title }: { label: string; kind: 'instant'|'growth'|'starter'; title?: string }) => {
    const cls =
      kind === 'instant'
        ? 'bg-green-100 text-green-700'
        : kind === 'growth'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-700';
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${cls}`} title={title}>
        {label}
      </span>
    );
  };
  const chipLabel = info.eligible ? 'Instant buy' : `Buy in ${formatCountdown(info.remainingMs)}`;
  const chipKind: 'instant' | 'growth' | 'starter' =
    info.eligible ? 'instant' : tier === 'GROWTH' ? 'growth' : 'starter';
  const chipTitle = info.eligible
    ? 'This lead is eligible to buy now'
    : `Eligible at ${info.eligibleAt?.toLocaleString()}`;

    const recommendedTier = bestInstantUpgradeTier(lead.createdAt, now);

  const goUpgrade = (target: PlanKey) => {
    const redir = encodeURIComponent(router.asPath);
    router.push(`/user/subscription?redirect=${redir}&target=${target}`);
  };
  console.log(lead)

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
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold mb-2">Details</h4>
                  {/* Eligibility chip (only relevant if not purchased) */}
                  {!lead.isPurchased && (
                    <Chip label={chipLabel} kind={chipKind} title={chipTitle} />
                  )}
                </div>

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
                <div className="block mt-2">
                 
                {!lead.isPurchased && recommendedTier && (
                  
                      <button
                        onClick={() => goUpgrade(recommendedTier)}
                        className="text-xs mt-2 px-3 py-2 rounded-full text-white"
                        style={{
                            background: 'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
                        }}
                        title={`Upgrade to ${recommendedTier} to buy instantly`}
                      >
                        Upgrade to <span className="font-semibold">{recommendedTier}</span> to buy instantly
                      </button>
                    
                )}

                {/* Optional helper text when locked */}
                {isLocked && (
                  <div className="p-3 flex flex-wrap items-center gap-3">
                    <p className="text-xs text-gray-500">
                      Unlocks at {formatCountdown(info.remainingMs)}
                    </p>

                    {/* Upgrade CTA to buy instantly */}
                    
                  </div>
                )}
                </div>
              </div>

              {/* Remarks */}
              {/* <div>
                <label className="block font-medium text-sm mb-1">Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Add your remarks or notes"
                  className="w-full rounded-md border border-border px-4 py-2 text-sm bg-muted resize-none"
                />
              </div> */}
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
