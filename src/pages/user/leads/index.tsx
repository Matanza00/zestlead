// pages/user/leads.tsx
'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import UserLayout from '@/components/CombinedNavbar'
import { ShoppingBag } from 'lucide-react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

type Lead = { /* ... */ }
type CartItem = { /* ... */ }

export default function UserLeadsPage(props) {
  const { data: session } = useSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'BUYER'|'SELLER'>('BUYER')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  const debounceRef = useRef<NodeJS.Timeout|null>(null)

  useEffect(() => {
    fetch('/api/user/leads')
      .then(r => r.json())
      .then((data: Lead[]) => setLeads(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  useEffect(() => {
    fetch('/api/cart', { credentials: 'include' })
      .then(r => r.json())
      .then((data: CartItem[]) => setCart(data))
      .catch(console.error)
  }, [])

  const filtered = leads.filter(l => l.leadType === activeTab)

  const onSearch = useCallback((e) => {
    const v = e.target.value
    setSearch(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      /* apply your search filter */
    }, 300)
  }, [])

  // selection helpers
  const toggleSelect = (id: string) => {
    setSelected(s => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const clearAll = () => setSelected(new Set())

  // cart toggler
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

  return (
    <UserLayout>
      <div className="px-8 pt-6 pb-12">
  {/* 2-column grid: left is main content, right is widgets */}
    <div className="flex flex-col lg:flex-row lg:space-x-6 w-full">
    
    {/* ── LEFT COLUMN ── */}
    <div className="flex-1 space-y-4">

      {/* 1) Tabs above everything */}
      <div className="flex space-x-8">
        {(['BUYER','SELLER'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium ${
              activeTab===tab 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500'
            }`}
          >
            {tab.charAt(0)+tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* 2) Heading immediately under tabs */}
      <div className="flex items-center space-x-3">
        <ShoppingBag className="h-6 w-6 text-[#285B19]" />
        <h2 className="text-2xl font-bold">Lead Marketplace</h2>
      </div>

      {/* 3) Filters row: filters on left, search on right */}
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-3">
          {['Sort By','Area','Type','Price','Property Price'].map((label,i) => (
            <select
              key={i}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option>{label}</option>
            </select>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search for leads according to your type"
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
                        checked={selected.size === filtered.length}
                        onChange={e => {
                          e.target.checked
                            ? filtered.forEach(l => toggleSelect(l.id))
                            : clearAll()
                        }}
                      />
                    </th>
                    {['Name','Phone','Address','Area','Type','Property Price','Price','Action'].map((h,i) => (
                      <th
                        key={h}
                        className={`p-3 text-left ${i===7?'text-center':''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-4 text-center">Loading…</td>
                    </tr>
                  ) : filtered.length===0 ? (
                    <tr>
                      <td colSpan={8} className="p-4 text-center">No leads found.</td>
                    </tr>
                  ) : filtered.map(lead => {
                      const inCart = Boolean(cart.find(ci=>ci.lead.id===lead.id))
                      return (
                        <tr key={lead.id} className="border-t text-sm text-gray-700">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selected.has(lead.id)}
                              onChange={()=>toggleSelect(lead.id)}
                            />
                          </td>
                          <td className="p-3">{lead.name}</td>
                          <td className="p-3">{lead.phone}</td>
                          <td className="p-3">{lead.propertyType}</td>
                          <td className="p-3">{lead.desireArea}</td>
                          <td className="p-3">{lead.propertyType}</td>
                          <td className="p-3">{lead.priceRange}</td>
                          <td className="p-3">{lead.price? `$${lead.price}`:'-'}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={()=>toggleCart(lead.id)}
                              className={`px-4 py-1 rounded-full text-sm transition ${
                                inCart
                                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
                            >
                              {inCart ? 'Remove' : 'Buy Now'}
                            </button>
                          </td>
                        </tr>
                      )
                  })}
                </tbody>
              </table>
            </div>

            {/* bulk action bar */}
            {selected.size > 0 && (
              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full shadow-lg px-6 py-3 flex items-center space-x-4">
                <span className="text-gray-700">{selected.size} Leads Selected</span>
                <button
                  onClick={clearAll}
                  className="px-4 py-1 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Deselect All
                </button>
                <button
                  onClick={()=> {
                    Array.from(selected).forEach(id=>toggleCart(id))
                    clearAll()
                  }}
                  className="px-6 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 flex items-center space-x-2"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Add To Cart</span>
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