// pages/user/leads.tsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import UserLayout from '@/components/CombinedNavbar'
import { ShoppingBag, Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

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
  // Unknown / no subscription: treat as STARTER
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
    // If we don't know createdAt, don't mislead—assume eligible (server still enforces)
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
  const [now, setNow] = useState<number>(Date.now())  // ticking clock for countdown
  const debounceRef = useRef<NodeJS.Timeout|null>(null)

  // tick every second for live countdown
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Fetch current subscription tier (for chip & filter visibility logic)
  useEffect(() => {
    fetch('/api/user/account/subscription', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data) => {
        const t = data?.tierName || data?.subscription?.tierName || data?.plan || data?.name
        setTier(normalizePlanKey(t))
      })
      .catch(() => setTier('STARTER'))
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
    // no clearing for PRO
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

  // Client-side filtering (apply only allowed filters)
  const allowGrowth = tier !== 'STARTER'
  const allowPro = tier === 'PRO'

  const filtered = leads
    .filter(l => l.leadType === activeTab)
    // Base (always)
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

  // ▶️ Add / remove from Wishlist 
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

            {/* Filters row (visibility depends on subscription tier) */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                {/* Base filters — visible to all tiers */}
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

              {/* Search (kept for all tiers) */}
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
                          e.target.checked
                            ? filtered.forEach(l => toggleSelect(l.id))
                            : clearAll()
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
                          <td className="p-3">{lead.price != null ? `$${lead.price}` : '-'}</td>
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

            {selected.size > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full shadow-lg px-6 py-3 flex items-center space-x-4">
                <span className="text-gray-700">{selected.size} Selected</span>
                <button
                  onClick={clearAll}
                  className="px-4 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Deselect All
                </button>
                <button
                  onClick={() => {
                    Array.from(selected).forEach(id => toggleCart(id))
                    clearAll()
                  }}
                  className="px-6 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center space-x-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add To Cart</span>
                </button>
              </div>
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

            {/* Balance card */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm">
              <p className="text-sm">Balance</p>
              <h3 className="text-2xl font-semibold">$1,554</h3>
              <button className="mt-4 inline-block bg-white text-green-600 font-medium py-1 px-3 rounded-full">
                Buy Credits
              </button>
            </div>

            {/* Remaining leads */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-sm">
              <p className="text-sm">Remaining Leads</p>
              <h3 className="text-2xl font-semibold">10</h3>
              <p className="text-xs opacity-90">On Subscription</p>
            </div>

            {/* Warm leads carousel */}
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
                <h4 className="font-medium">Recently Purchased</h4>
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                {cart.slice(-3).map(ci => (
                  <div key={ci.id} className="p-4 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="flex justify-between">
                        <span>Owned By</span><span>{ci.lead.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type</span><span>{ci.lead.propertyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Property Value</span>
                        <span>
                          {ci.lead.price != null ? `$${ci.lead.price.toLocaleString()}` : '-'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <button className="text-green-600 text-sm">View</button>
                      <button className="text-green-600 text-sm">Call Now</button>
                    </div>
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
