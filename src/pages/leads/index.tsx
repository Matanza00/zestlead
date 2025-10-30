// src/pages/leads/index.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  MapPin,
  X,
  Bed,
  Bath,
  DollarSign,
  Home,
  User,
  Lock,
  Clock,
  Phone,
} from 'lucide-react';

import Header from '@/components/landing/Header';

type PlanKey = 'STARTER' | 'GROWTH' | 'ENTERPRISE';

function normalizePlanKey(input?: string | null): PlanKey {
  const v = (input || '').toUpperCase();
  if (v.includes('ENTERPRISE')) return 'ENTERPRISE';
  if (v.includes('GROWTH')) return 'GROWTH';
  if (v.includes('STARTER')) return 'STARTER';
  return 'STARTER'; // unknown/no sub => treat as STARTER
}

function requiredDelayMsForTier(tier: PlanKey) {
  if (tier === 'ENTERPRISE') return 0;
  if (tier === 'GROWTH') return 2 * 60 * 60 * 1000; // 2h
  return 24 * 60 * 60 * 1000;                        // 24h
}

function formatCountdown(ms: number) {
  if (ms <= 0) return '00:00:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function getEligibility(createdAtISO: string | undefined, tier: PlanKey, nowMs: number) {
  if (tier === 'ENTERPRISE') {
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

// Return the minimal tier that would allow instant-buy *right now*
function bestInstantUpgradeTier(createdAtISO: string | undefined, nowMs: number): PlanKey {
  if (!createdAtISO) return 'ENTERPRISE'; // unknown age → only Enterprise guaranteed instant
  const created = new Date(createdAtISO).getTime();
  if (Number.isNaN(created)) return 'ENTERPRISE';

  const ageMs = nowMs - created;
  const twoHours = 2 * 60 * 60 * 1000;

  // If the lead is at least 2h old, Growth would already be instant.
  if (ageMs >= twoHours) return 'GROWTH';

  // Otherwise only Enterprise is instant right now.
  return 'ENTERPRISE';
}

interface PublicLead {
  id: string;
  name: string;
  desireArea: string;
  propertyType: string;
  timeline: string;
  leadType: 'BUYER' | 'SELLER';
  priceRange: string;
  beds?: number;
  baths?: number;
  createdAt?: string; // required for countdown logic
}

interface ApiResponse {
  data: PublicLead[];
  total: number;
  page: number;
  pageSize: number;
}

export default function PublicLeadsPage(props) {
  const [leads, setLeads] = useState<PublicLead[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    leadType: '',
    propertyType: '',
    desireArea: '',
    available: false,
  });
  const [loading, setLoading] = useState(true);

  // From working page: track subscription (tier) and whether user is subscribed
  const [tier, setTier] = useState<PlanKey>('STARTER');
  const [userData, setUserData] = useState<{ isSubscribed: boolean } | null>(null);

  // Live ticking every second for countdowns
  const [now, setNow] = useState<number>(Date.now());

  const router = useRouter();
  const { data: session } = useSession();

  // --- Fetch user basic info: isSubscribed (same as working page) ---
  useEffect(() => {
    fetch('/api/user/me')
      .then(r => r.json())
      .then(data => setUserData(data))
      .catch(() => setUserData(null));
  }, []);

  // --- Fetch current subscription tier (same endpoint as working page) ---
  useEffect(() => {
    fetch('/api/user/account/subscription', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then((data) => {
        const t =
          (data as any)?.tierName ||
          (data as any)?.subscription?.tierName ||
          (data as any)?.plan ||
          (data as any)?.name;
        setTier(normalizePlanKey(t));
      })
      .catch(() => setTier('STARTER'));
  }, []);

  // Live ticking clock
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Buy handler (follows working page: login → subscription → cart)
  const handleBuy = async (leadId: string) => {
    if (!session?.user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (!userData?.isSubscribed) {
      router.push(`/subscription?redirect=${encodeURIComponent(router.asPath)}`);
      return;
    }
    // Add to cart then go to cart
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });
      if (!res.ok) throw new Error('Failed to add lead to cart');
      router.push('/cart');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  // Load dynamic area and propertyType options
  useEffect(() => {
    async function fetchOptions() {
      try {
        const [areasRes, typesRes] = await Promise.all([
          fetch('/api/public/areas'),
          fetch('/api/public/property-types'),
        ]);
        const areasData = await areasRes.json();
        const typesData = await typesRes.json();
        setAreas(Array.isArray(areasData) ? areasData : []);
        setPropertyTypes(Array.isArray(typesData) ? typesData : []);
      } catch (err) {
        console.error('Failed to load filter options', err);
        setAreas([]);
        setPropertyTypes([]);
      }
    }
    fetchOptions();
  }, []);

  // Fetch paginated & filtered data
  useEffect(() => {
    async function fetchLeads() {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (filters.leadType) params.set('leadType', filters.leadType);
      if (filters.propertyType) params.set('propertyType', filters.propertyType);
      if (filters.desireArea) params.set('area', filters.desireArea);
      if (filters.available) params.set('available', 'true');

      setLoading(true);
      try {
        const res = await fetch(`/api/public/leads?${params.toString()}`);
        const json: ApiResponse = await res.json();
        setLeads(json.data || []);
        setTotal(json.total || 0);
      } catch (err) {
        console.error('Failed to fetch leads', err);
        setLeads([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, [page, pageSize, filters]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clearFilters = () =>
    setFilters({ leadType: '', propertyType: '', desireArea: '', available: false });

  // Upgrade link helper (same shape as working page's goUpgrade)
  const goUpgradeHref = (target: PlanKey) => {
    const redir = encodeURIComponent(router.asPath);
    return `/user/subscription?redirect=${redir}&target=${target}`;
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-4xl font-heading text-text"></h1>

        {/* Filters */}
        <div className="bg-surface p-6 rounded-2xl shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <input
              type="text"
              placeholder="Search by location or name..."
              className="col-span-3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
            />
            <select
              value={filters.leadType}
              onChange={(e) => setFilters({ ...filters, leadType: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Leads</option>
              <option value="BUYER">Buyer Leads</option>
              <option value="SELLER">Seller Leads</option>
            </select>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Types</option>
              {propertyTypes?.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={filters.desireArea}
              onChange={(e) => setFilters({ ...filters, desireArea: e.target.value })}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Areas</option>
              {areas?.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <button onClick={() => setPage(1)} className="bg-primary text-white px-6 rounded-lg">
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
                className="accent-primary"
              />
              <span className="text-text">Show only available leads</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {filters.leadType && (
                <span className="badge">
                  {filters.leadType === 'BUYER' ? 'Buyer Leads' : 'Seller Leads'}
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setFilters({ ...filters, leadType: '' })}
                  />
                </span>
              )}
              {filters.propertyType && (
                <span className="badge">
                  {filters.propertyType}
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setFilters({ ...filters, propertyType: '' })}
                  />
                </span>
              )}
              {filters.desireArea && (
                <span className="badge">
                  {filters.desireArea}
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setFilters({ ...filters, desireArea: '' })}
                  />
                </span>
              )}
              {filters.available && (
                <span className="badge">
                  Available
                  <X
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => setFilters({ ...filters, available: false })}
                  />
                </span>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="ml-auto text-accent border border-accent px-4 py-1 rounded-lg"
            >
              Clear Filters
            </button>
          </div>

          <p className="text-text text-sm">
            We found <strong>{total}</strong> results
          </p>
        </div>

        {/* Leads list */}
        {loading ? (
          <div className="text-center py-12 text-text">Loading leads...</div>
        ) : (
          <>
            <div className="space-y-6">
              {leads.map((lead) => {
                const info = getEligibility(lead.createdAt, tier, now);
                const recommended = bestInstantUpgradeTier(lead.createdAt, now);

                const unlockBtnDisabled = !info.eligible;
                const unlockBtnTitle =
                  !info.eligible && info.eligibleAt
                    ? `Available at ${info.eligibleAt.toLocaleString()}`
                    : undefined;

                return (
                  <div
                    key={lead.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Home className="h-10 w-10" />
                      </div>

                      <div className="lg:col-span-2 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                            ${
                              lead.leadType === 'BUYER'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            {lead.leadType} Lead
                          </span>

                          {/* Countdown pill if locked */}
                          {!info.eligible && (
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                              <Clock className="w-3 h-3" />
                              {formatCountdown(info.remainingMs)}
                            </span>
                          )}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">{lead.name}</h2>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {lead.desireArea}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-yellow-600" />
                            {lead.priceRange}
                          </span>
                          {lead.beds !== undefined && (
                            <span className="flex items-center gap-1">
                              <Bed className="w-4 h-4 text-purple-500" />
                              {lead.beds} beds
                            </span>
                          )}
                          {lead.baths !== undefined && (
                            <span className="flex items-center gap-1">
                              <Bath className="w-4 h-4 text-blue-400" />
                              {lead.baths} baths
                            </span>
                          )}
                        </div>

                        {/* Unlock ETA label */}
                        {!info.eligible && info.eligibleAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Unlocks at <strong>{info.eligibleAt.toLocaleString()}</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-between mt-5 gap-4">
                      <button
                        onClick={() => router.push(`/leads/view/${lead.id}`)}
                        className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                      >
                        Open Details
                      </button>

                      <div className="flex items-center gap-3">
                        {/* Not subscribed → always show upgrade to minimal instant tier */}
                        {!userData?.isSubscribed ? (
                          <Link
                            href={goUpgradeHref(recommended)}
                            className="mr-2 text-sm px-6 py-2 rounded-full text-white"
                            style={{
                              background:
                                'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)',
                            }}
                            title={`Subscribe to ${recommended} to buy instantly`}
                          >
                            Upgrade to <span className="font-semibold">{recommended}</span> to buy instantly
                          </Link>
                        ) : info.eligible ? (
                          // Subscribed and eligible → can buy now
                          <button
                            onClick={() => handleBuy(lead.id)}
                            className="border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition inline-flex items-center gap-2"
                            title="Add to cart and continue"
                          >
                            <Phone className="w-4 h-4" />
                            Unlock Lead
                          </button>
                        ) : (
                          // Subscribed but still locked → disabled countdown + upgrade CTA
                          <>
                            <button
                              disabled
                              title={unlockBtnTitle}
                              className="rounded-lg px-6 py-2 bg-amber-500/90 text-white font-medium cursor-not-allowed inline-flex items-center gap-2"
                            >
                              <Lock className="w-4 h-4" />
                              Upgrade to Unlock • {formatCountdown(info.remainingMs)}
                            </button>

                            {/* Offer upgrade if a higher tier would unlock instantly now */}
                            {(() => {
                              // Only show if recommended is higher than current tier
                              const order = { STARTER: 1, GROWTH: 2, ENTERPRISE: 3 } as const;
                              if (order[recommended] > order[tier]) {
                                return (
                                  <Link
                                    href={goUpgradeHref(recommended)}
                                    className="mr-2 text-sm px-6 py-2 rounded-full text-white"
                                    style={{
                                      background:
                                        'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)',
                                    }}
                                    title={`Upgrade to ${recommended} to buy instantly`}
                                  >
                                    Upgrade to <span className="font-semibold">{recommended}</span> to buy instantly
                                  </Link>
                                );
                              }
                              return null;
                            })()}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center mt-6 space-x-3">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg hover:bg-primary/10 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="font-body">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-primary/10 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
