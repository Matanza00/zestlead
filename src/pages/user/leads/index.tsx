// pages/user/leads.tsx
'use client'
import { useState, useEffect, useRef, useCallback, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import UserLayout from '@/components/CombinedNavbar'
import { ShoppingBag, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { createPortal } from 'react-dom'
import { SocketContext } from '@/contexts/SocketContext';


function BodyPortal({ children }: { children: React.ReactNode }) {
  const mountRef = useRef<HTMLElement | null>(null);
  const elRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    mountRef.current = document.body;
    elRef.current = document.createElement('div');
    elRef.current.style.position = 'fixed';
    mountRef.current.appendChild(elRef.current);
    return () => {
      if (elRef.current && mountRef.current) {
        mountRef.current.removeChild(elRef.current);
      }
    };
  }, []);

  if (!mountRef.current || !elRef.current) return null;
  return createPortal(children, elRef.current);
}

type Lead = {
  id: string
  leadType: 'BUYER' | 'SELLER'
  propertyType: string
  beds?: number
  baths?: number
  desireArea?: string
  priceRange?: string
  price?: number
  timeline?: string
  appointment?: string
  tags?: { id: string; name: string }[]
  createdAt?: string // used for eligibility countdown
}
type CartItem = { id: string; lead: Lead }

type PlanKey = 'STARTER' | 'GROWTH' | 'PRO'

// Normalize any tier string to a key
function normalizePlanKey(input?: string | null): PlanKey {
  const v = (input || '').toUpperCase()
  if (v.includes('PRO')) return 'PRO'
  if (v.includes('GROWTH')) return 'GROWTH'
  if (v.includes('STARTER')) return 'STARTER'
  return 'STARTER'
}

// Required delay window by tier
function requiredDelayMsForTier(tier: PlanKey) {
  if (tier === 'PRO') return 0
  if (tier === 'GROWTH') return 2 * 60 * 60 * 1000 // 2h
  return 24 * 60 * 60 * 1000 // 24h
}

// Format remaining ms to HH:MM:SS
function formatCountdown(ms: number) {
  if (ms <= 0) return '00:00:00'
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

// Compute per-lead remaining time & eligibility
function getEligibility(createdAtISO: string | undefined, tier: PlanKey, nowMs: number) {
  if (tier === 'PRO') {
    return { eligible: true, remainingMs: 0, eligibleAt: null as Date | null }
  }
  if (!createdAtISO) {
    return { eligible: true, remainingMs: 0, eligibleAt: null as Date | null }
  }
  const created = new Date(createdAtISO).getTime()
  if (Number.isNaN(created)) {
    return { eligible: true, remainingMs: 0, eligibleAt: null as Date | null }
  }
  const delay = requiredDelayMsForTier(tier)
  const eligibleAtMs = created + delay
  const remainingMs = Math.max(0, eligibleAtMs - nowMs)
  return {
    eligible: remainingMs === 0,
    remainingMs,
    eligibleAt: new Date(eligibleAtMs)
  }
}

// Try to pick an expiry/renewal field from subscription payloads with varying shapes
function pickExpiryDate(raw: any): Date | null {
  const candidates = [
    raw?.expiresAt,
    raw?.expiry,
    raw?.currentPeriodEnd,
    raw?.current_period_end,
    raw?.subscription?.expiresAt,
    raw?.subscription?.currentPeriodEnd,
    raw?.subscription?.current_period_end,
    raw?.endDate,
    raw?.periodEnd,
  ]
  for (const v of candidates) {
    if (!v) continue
    const t = new Date(v).getTime()
    if (Number.isFinite(t)) return new Date(t)
  }
  return null
}

export default function UserLeadsPage(props) {
  const router = useRouter()
  const { data: session } = useSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlistIds, setWishlistIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [activeTab, setActiveTab] = useState<'BUYER'|'SELLER'>('BUYER')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  // Base filters (visible for all tiers)
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('')
  const [bedFilter, setBedFilter] = useState('')
  const [bathFilter, setBathFilter] = useState('')

  // Growth+ filters
  const [areaFilter, setAreaFilter] = useState('')
  const [leadPriceMin, setLeadPriceMin] = useState<string>('') // keep as string for input control
  const [leadPriceMax, setLeadPriceMax] = useState<string>('')

  // PRO-only filter
  const [priceRangeFilter, setPriceRangeFilter] = useState('')

  const [tier, setTier] = useState<PlanKey>('STARTER') // subscription tier for chips
  const [subExpiry, setSubExpiry] = useState<Date | null>(null) // ⬅️ expiry date for UI card
  // ⬇️ Add after your subExpiry state, near other plan UI state
  const [discountUsedCount, setDiscountUsedCount] = useState<number>(0);
  const DISCOUNT_CAP = 100;
  function planDiscountPercent(tier: PlanKey): number {
    if (tier === 'PRO') return 0.20;     // 20% up to 100 leads
    if (tier === 'GROWTH') return 0.10;  // 10% up to 100 leads
    return 0;
  }

  function hasPlanDiscount(tier: PlanKey) {
    return tier === 'GROWTH' || tier === 'PRO';
  }

  function discountRemaining(used: number) {
    return Math.max(0, DISCOUNT_CAP - used);
  }

  // Display-only effective price with cap check
  function computeDisplayedPrice(base: number | undefined | null, tier: PlanKey, usedCount: number) {
    if (base == null) return null;
    const pct = planDiscountPercent(tier);
    if (!pct) return base;
    if (usedCount >= DISCOUNT_CAP) return base; // cap reached → no discount
    const discounted = base * (1 - pct);
    // Keep your UI style (no decimals)
    return Math.round(discounted);
  }
  useEffect(() => {
    if (!hasPlanDiscount(tier)) {
      setDiscountUsedCount(0);
      return;
    }
    fetch('/api/user/discount-usage?scope=plan', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : { used: 0 }))
      .then(d => setDiscountUsedCount(Number(d?.used || 0)))
      .catch(() => setDiscountUsedCount(0));
  }, [tier]);


  const [now, setNow] = useState<number>(Date.now())  // ticking clock for countdown
  const debounceRef = useRef<NodeJS.Timeout|null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // after your state declarations
  const socket = useContext(SocketContext);

  // Remove lead live when someone else buys it
  useEffect(() => {
    if (!socket) return;

    const onUnavailable = (leadId: string) => {
      // If the lead is currently visible, drop it
      let removed = false;

      setLeads(prev => {
        const next = prev.filter(l => l.id !== leadId);
        removed = next.length !== prev.length;
        return next;
      });

      if (removed) {
        // keep selection/cart clean
        setSelected(prev => {
          const next = new Set(prev);
          next.delete(leadId);
          return next;
        });
        setCart(prev => prev.filter(ci => ci.lead.id !== leadId));
      }
    };

    socket.on('lead:unavailable', onUnavailable);
    return () => {
      socket.off('lead:unavailable', onUnavailable);
    };
  }, [socket, setLeads, setSelected, setCart]);

  useEffect(() => {
    // debug
    // console.log('Selected count:', selected.size);
  }, [selected])

  // tick every second for live countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Fetch current subscription tier + expiry (for cards and filters)
  useEffect(() => {
    fetch('/api/user/account/subscription', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data) => {
        const t = data?.tierName || data?.subscription?.tierName || data?.plan || data?.name
        setTier(normalizePlanKey(t))
        setSubExpiry(pickExpiryDate(data))
      })
      .catch(() => {
        setTier('STARTER')
        setSubExpiry(null)
      })
  }, [])

  // Clear disallowed filters when tier changes (avoid hidden filters affecting results)
  useEffect(() => {
    if (tier === 'STARTER') {
      setAreaFilter('')
      setLeadPriceMin('')
      setLeadPriceMax('')
      setPriceRangeFilter('')
    } else if (tier === 'GROWTH') {
      setPriceRangeFilter('')
    }
  }, [tier])

  // fetch a page of leads with filters and pagination
  const fetchPage = async (pageNum: number) => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(pageNum),
      pageSize: '10',
      leadType: activeTab,
    })

    // Search
    if (search) params.append('query', search)

    // Base filters (all tiers)
    if (propertyTypeFilter) params.append('propertyType', propertyTypeFilter)
    if (bedFilter)         params.append('minBeds', bedFilter)
    if (bathFilter)        params.append('minBaths', bathFilter)

    // Growth+ filters
    const allowGrowth = tier !== 'STARTER'
    if (allowGrowth && areaFilter)             params.append('area', areaFilter)
    if (allowGrowth && leadPriceMin.trim())    params.append('minLeadPrice', leadPriceMin.trim())
    if (allowGrowth && leadPriceMax.trim())    params.append('maxLeadPrice', leadPriceMax.trim())

    // PRO-only
    const allowPro = tier === 'PRO'
    if (allowPro && priceRangeFilter)          params.append('priceRange', priceRangeFilter)

    try {
      const res = await fetch(`/api/user/leads?${params.toString()}`)
      const { leads: fetched, hasMore } = await res.json()
      setLeads(prev => pageNum === 1 ? fetched : [...prev, ...fetched])
      setHasMore(hasMore)
      setPage(pageNum)
    } catch (err) {
      console.error('Error loading leads:', err)
    } finally {
      setLoading(false)
    }
  }

  // initial & filter-triggered load
  useEffect(() => {
    fetchPage(1)
  }, [
    activeTab, search,
    propertyTypeFilter, bedFilter, bathFilter,
    areaFilter, leadPriceMin, leadPriceMax,
    priceRangeFilter, tier
  ])

  useEffect(() => {
    fetch('/api/cart', { credentials: 'include' })
      .then(r => r.json())
      .then((data: CartItem[]) => setCart(data))
      .catch(console.error)
  }, [])

  // Load wishlist on mount
  useEffect(() => {
    fetch('/api/user/wishlist', { credentials: 'include' })
      .then(r => r.json())
      .then((entries: { leadId: string }[]) =>
        setWishlistIds(entries.map(e => e.leadId))
      )
      .catch(console.error)
  }, [])

  // Unique lists for dropdowns (from current page data)
  const areas = Array.from(new Set(leads.map(l => l.desireArea || '').filter(a => a)))
  const propertyTypes = Array.from(new Set(leads.map(l => l.propertyType || '').filter(p => p)))
  const priceRanges = Array.from(new Set(leads.map(l => l.priceRange || '').filter(p => p)))

  // Client-side filtering
  const allowGrowth = tier !== 'STARTER'
  const allowPro = tier === 'PRO'

  const filtered = leads
    .filter(l => l.leadType === activeTab)
    // Base
    .filter(l => !propertyTypeFilter || l.propertyType === propertyTypeFilter)
    .filter(l => !bedFilter || l.beds === parseInt(bedFilter))
    .filter(l => !bathFilter || l.baths === parseInt(bathFilter))
    // Growth+
    .filter(l => !allowGrowth || !areaFilter || l.desireArea === areaFilter)
    .filter(l => {
      if (!allowGrowth) return true
      const min = leadPriceMin.trim() ? Number(leadPriceMin) : null
      const max = leadPriceMax.trim() ? Number(leadPriceMax) : null
      if (min == null && max == null) return true
      if (l.price == null) return false
      if (min != null && l.price < min) return false
      if (max != null && l.price > max) return false
      return true
    })
    // PRO-only
    .filter(l => !allowPro || !priceRangeFilter || l.priceRange === priceRangeFilter)
    // Search
    .filter(l =>
      !search ||
      l.desireArea?.toLowerCase().includes(search.toLowerCase()) ||
      l.propertyType.toLowerCase().includes(search.toLowerCase())
    )

  // Debounced search handler
  const onSearch = useCallback((e) => {
    const v = e.target.value
    setSearch(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {}, 300)
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(s => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const clearAll = () => setSelected(new Set())

  const [clearingCart, setClearingCart] = useState(false);
  const clearCartAll = async () => {
    try {
      setClearingCart(true);
      const ids = cart.map(ci => ci.id);
      await Promise.all(
        ids.map(id =>
          fetch(`/api/cart/${id}`, { method: 'DELETE', credentials: 'include' })
        )
      );
      setCart([]);
      toast.success('Removed all items from cart');
    } catch {
      toast.error('Could not clear cart');
    } finally {
      setClearingCart(false);
    }
  };

  const toggleCart = async (leadId: string) => {
    const inCart = cart.find(ci => ci.lead.id === leadId)
    try {
      if (inCart) {
        await fetch(`/api/cart/${inCart.id}`, { method: 'DELETE', credentials: 'include' })
        setCart(c => c.filter(ci => ci.id !== inCart.id))
        toast.success('Removed')
      } else {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ leadId }),
        })
        const item: CartItem = await res.json()
        setCart(c => [...c, item])
        toast.success('Added')
      }
    } catch {
      toast.error('Error')
    }
  }

  // ▶️ Wishlist toggle
  const toggleWishlist = async (leadId: string) => { 
    const saved = wishlistIds.includes(leadId) 
    try { 
      if (saved) { 
        await fetch(`/api/user/wishlist/${leadId}`, { method: 'DELETE', credentials: 'include' }) 
        setWishlistIds(ids => ids.filter(id => id !== leadId)) 
        toast.success('Removed from wishlist') 
      } else { 
        await fetch('/api/user/wishlist', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leadId }), })
        setWishlistIds(ids => [...ids, leadId]) 
        toast.success('Added to wishlist') 
      } 
    } catch { 
      toast.error('Could not update wishlist') 
    } 
  }

  // Chip component
  function Chip({ label, kind, title }: { label: string; kind: 'instant'|'growth'|'starter'; title?: string }) {
    const cls =
      kind === 'instant'
        ? 'bg-green-100 text-green-700'
        : kind === 'growth'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-700'
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${cls}`} title={title}>
        {label}
      </span>
    )
  }

  // ⬇️ Cart summary for Balance card
  const cartCount = cart.length
  const cartTotal = useMemo(() => {
    // NOTE: purely a preview; real billing should still be validated server-side.
    const pct = planDiscountPercent(tier);
    const capLeft = discountRemaining(discountUsedCount);
    let discountedLeft = capLeft;
    return cart.reduce((sum, ci) => {
      const base = Number(ci?.lead?.price) || 0;
      if (pct > 0 && discountedLeft > 0) {
        discountedLeft -= 1;
        return sum + Math.round(base * (1 - pct));
      }
      return sum + base;
    }, 0);
  }, [cart, tier, discountUsedCount]);

  const fmtUSD = (n: number) =>
    n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <UserLayout>
      <div className="px-8 pt-6 pb-12">
        <div className="flex flex-col lg:flex-row lg:space-x-6 w-full">
          <div className="flex-1 space-y-4">
            <div className="flex space-x-8">
              {(['BUYER','SELLER'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium ${
                    activeTab === tab
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <ShoppingBag className="h-6 w-6 text-[#285B19]" />
              <h2 className="text-2xl font-bold">Lead Marketplace</h2>
            </div>
            


            {/* Filters row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Base filters */}
                <select
                  value={propertyTypeFilter}
                  onChange={e => setPropertyTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value=''>All Property Types</option>
                  {Array.from(new Set(leads.map(l => l.propertyType || '').filter(Boolean))).map(pt => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>

                <select
                  value={bedFilter}
                  onChange={e => setBedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value=''>All Beds</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>

                <select
                  value={bathFilter}
                  onChange={e => setBathFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value=''>All Baths</option>
                  {[1,2,3,4,5].map(n => (
                    <option key={n} value={String(n)}>{n}</option>
                  ))}
                </select>

                {/* Growth+ filters */}
                {tier !== 'STARTER' && (
                  <>
                    <select
                      value={areaFilter}
                      onChange={e => setAreaFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value=''>All Areas</option>
                      {areas.map(a => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={leadPriceMin}
                      onChange={e => setLeadPriceMin(e.target.value)}
                      placeholder="Min Lead Price"
                      className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={leadPriceMax}
                      onChange={e => setLeadPriceMax(e.target.value)}
                      placeholder="Max Lead Price"
                      className="w-36 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </>
                )}

                {/* PRO-only filter */}
                {tier === 'PRO' && (
                  <select
                    value={priceRangeFilter}
                    onChange={e => setPriceRangeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value=''>All Price Ranges</option>
                    {Array.from(new Set(leads.map(l => l.priceRange || '').filter(Boolean))).map(pr => (
                      <option key={pr} value={pr}>{pr}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search by area or property type"
                value={search}
                onChange={onSearch}
                className="w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-500"
              />
            </div>
            


            <div className="rounded-lg border border-gray-200 overflow-auto shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelected(new Set(filtered.map(l => l.id)));
                          } else {
                            clearAll()
                          }
                        }}
                      />
                    </th>
                    <th className="p-4 text-center">
                      <Heart className="w-5 h-5 text-red-500 ml-3" fill="red"/>
                    </th>
                    {['Type','Property','Beds','Baths','Area','Price Range','Lead Price','Action'].map((h,i) => (
                      <th key={h} className={`p-4 text-left ${i === 7 ? 'text-center' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={10} className="p-4 text-center">Loading…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={10} className="p-4 text-center">No leads found.</td></tr>
                  ) : filtered.map(lead => {
                      const inCart = Boolean(cart.find(ci => ci.lead.id === lead.id))
                      const info = getEligibility(lead.createdAt, tier, now)
                      const isGrowth = tier === 'GROWTH'
                      const kind: 'instant'|'growth'|'starter' =
                        info.eligible ? 'instant' : (isGrowth ? 'growth' : 'starter')
                      const label = info.eligible ? 'Instant buy' : `Buy in ${formatCountdown(info.remainingMs)}`
                      const title = info.eligible
                        ? 'This lead is eligible to buy now'
                        : `Eligible at ${info.eligibleAt?.toLocaleString()}`

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => router.push(`/user/leads/view/${lead.id}`)}
                          className="border-t text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                        >
                          <td className="p-3" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selected.has(lead.id)}
                              onChange={() => toggleSelect(lead.id)}
                            />
                          </td>
                          <td
                            className="p-3 text-center"
                            onClick={e => e.stopPropagation()}
                          >
                            <button
                              onClick={() => toggleWishlist(lead.id)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              aria-label={
                                wishlistIds.includes(lead.id)
                                  ? 'Remove from wishlist'
                                  : 'Add to wishlist'
                              }
                            >
                              {wishlistIds.includes(lead.id)
                                ? <Heart className="w-5 h-5 text-red-500" fill="red"/>
                                : <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />}
                            </button>
                          </td>
                          <td className="p-3">{lead.leadType}</td>
                          <td className="p-3">{lead.propertyType}</td>
                          <td className="p-3">{lead.beds ?? '-'}</td>
                          <td className="p-3">{lead.baths ?? '-'}</td>
                          <td className="p-3">{lead.desireArea ?? '-'}</td>
                          <td className="p-3">{lead.priceRange ?? '-'}</td>
                          <td className="p-3">
                            {(() => {
                              // Coerce to number safely
                              const raw = lead.price;
                              const baseNum = raw == null ? NaN : Number(raw);
                              if (!Number.isFinite(baseNum)) return '-';

                              const pct = planDiscountPercent(tier);
                              const remaining = discountRemaining(discountUsedCount);
                              const showDiscount = hasPlanDiscount(tier) && remaining > 0 && pct > 0;

                              const finalPriceNum = showDiscount
                                ? Math.round(baseNum * (1 - pct))
                                : Math.round(baseNum);

                              const fmt = (n: number) =>
                                n.toLocaleString(undefined, { maximumFractionDigits: 0 });

                              return (
                                <div className="flex items-baseline gap-2">
                                  {showDiscount && (
                                    <span
                                      className="line-through text-green-700/70"
                                      title={`${Math.round(pct * 100)}% ${tier} discount applied (remaining ${remaining} of ${DISCOUNT_CAP})`}
                                    >
                                      ${fmt(baseNum)}
                                    </span>
                                  )}

                                  <span className={showDiscount ? 'text-green-700 font-semibold' : 'font-medium'}>
                                    ${fmt(finalPriceNum)}
                                  </span>

                                  {showDiscount && (
                                    <span className="ml-1 text-[10px] rounded bg-green-100 text-green-700 px-1.5 py-0.5">
                                      {tier === 'PRO' ? 'PRO -20%' : 'GROWTH -10%'}
                                    </span>
                                  )}
                                </div>
                                
                              );
                            })()}
                          </td>


                          <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                            <div className="flex flex-col items-center gap-1">
                              <Chip label={label} kind={kind} title={title} />
                              <button
                                onClick={() => toggleCart(lead.id)}
                                className={`px-4 py-1 rounded-full text-sm transition ${
                                  inCart
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {inCart ? 'Remove' : 'Add'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                  })}
                </tbody>
              </table>
            </div>

            {cart.length > 0 && mounted && (
              <BodyPortal>
                <div
                  style={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 24,
                    zIndex: 2147483647,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{ pointerEvents: 'auto' }}
                    className="
                      flex items-center gap-4
                      px-6 py-3 rounded-full
                      shadow-2xl
                      border border-white/40
                      bg-gradient-to-br from-white/70 to-white/40
                      backdrop-blur-xl backdrop-saturate-150
                      ring-1 ring-black/5
                      dark:from-neutral-900/50 dark:to-neutral-800/30 dark:border-white/10
                    "
                    aria-live="polite"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {cartCount} {cartCount === 1 ? 'Lead' : 'Leads'} in Cart • {fmtUSD(cartTotal)}
                    </span>

                    <span className="h-5 w-px bg-gray-300/60 dark:bg-white/20" />

                    <button
                      onClick={clearCartAll}
                      disabled={clearingCart}
                      className="
                        px-3 py-1 text-xs font-medium
                        rounded-full
                        border border-gray-300/60 hover:border-gray-400
                        text-gray-700 hover:text-gray-900
                        bg-white/60 hover:bg-white/80
                        disabled:opacity-60
                        dark:text-gray-200 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20
                        transition
                      "
                    >
                      {clearingCart ? 'Removing…' : 'Remove All'}
                    </button>

                    <button
                      onClick={() => router.push('/cart')}
                      className="
                        inline-flex items-center gap-2
                        px-4 py-1 text-xs font-semibold
                        rounded-full
                        bg-green-600 text-white hover:bg-green-700
                        shadow-md shadow-green-600/20
                        transition
                      "
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </div>
              </BodyPortal>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-4">
                <button
                  onClick={() => fetchPage(page + 1)}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {loading ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </div>

          {/* --- right: sidebar widgets --- */}
          <aside className="space-y-6">

            {/* Balance card — cart summary */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm">
              <p className="text-sm opacity-90">Cart Summary</p>
              <h3 className="text-2xl font-semibold">{fmtUSD(cartTotal)}</h3>
              <p className="text-xs opacity-90">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
              </p>
              <button
                onClick={() => router.push('/cart')}
                className="mt-4 inline-block bg-white text-green-600 font-medium py-1 px-3 rounded-full"
              >
                Go to Cart
              </button>
            </div>

            {/* Subscription card — plan + expiry */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-sm">
              <p className="text-sm opacity-90">Subscription</p>
              <h3 className="text-2xl font-semibold">{tier || 'No Plan'}</h3>
              <p className="text-xs opacity-90">
                {subExpiry
                  ? `Expires on ${subExpiry.toLocaleDateString()}`
                  : 'Expiry date unavailable'}
              </p>
              {hasPlanDiscount(tier) && (
              <div className="text-xs text-white-700 mt-2">
                 Discount used: {discountUsedCount}/{DISCOUNT_CAP}
              </div>
            )}
              <button
                onClick={() => router.push('/user/subscription')}
                className="mt-4 inline-block bg-white text-cyan-700 font-medium py-1 px-3 rounded-full"
              >
                Manage Plan
              </button>
              
            </div>

            {/* Warm leads carousel (placeholder) */}
            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <h4 className="font-medium">Warm Leads 🌟</h4>
                <div className="flex space-x-2">
                  <button className="p-1 rounded-full hover:bg-gray-100">‹</button>
                  <button className="p-1 rounded-full hover:bg-gray-100">›</button>
                </div>
              </div>
              <img src="/placeholder-warm.jpg" alt="Warm lead" className="w-full h-32 object-cover" />
              <div className="p-4 space-y-1 text-sm">
                <button className="w-full inline-block bg-green-600 text-white py-1 rounded-full">Unlock for $59</button>
                <div className="flex justify-between">
                  <span>Owned By</span><span>John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span>Type</span><span>Condo</span>
                </div>
                <div className="flex justify-between">
                  <span>Property Value</span><span>$120K–240K</span>
                </div>
                <div className="flex justify-between">
                  <span>Area</span><span>New York</span>
                </div>
              </div>
            </div>

            {/* Recently Purchased */}
            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-4">
                <h4 className="font-medium">In Cart</h4>
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                {cart.slice(-3).map(ci => (
                  <div key={ci.id} className="p-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="flex justify-between">
                        <span>{ci.lead.propertyType} , {ci.lead.desireArea}</span>
                      </div>
                    </div>
                    <span>
                      {ci.lead.price != null ? `$${ci.lead.price.toLocaleString()}` : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </UserLayout>
  )
}
