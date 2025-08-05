// pages/admin/leads/index.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import StripeCheckoutButton from '@/components/StripeCheckoutButton'
import { useSession } from 'next-auth/react'
import { Search as SearchIcon, Tag, DollarSign, UserPlus, Eye, Edit2, FilePlus } from 'lucide-react'
import { Button } from '@/components/ui2/button'
import { useRouter } from 'next/router'

type Lead = {
  id: string
  name: string
  contact: string
  email?: string
  leadType: 'BUYER' | 'SELLER'
  propertyType: string
  isAvailable: boolean
  price?: number
  tags: { id: string; name: string }[]
}
type LeadsPageProps = {
  // add specific props here, e.g., leads: Lead[]
};

const LeadsPage = (props) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 100;  // same default you send to the API
  const totalPages = Math.ceil(totalCount / pageSize);
  const [page, setPage]       = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)   // flip to false initially
  const [selected, setSelected] = useState<string[]>([])
  const [bulkTag, setBulkTag] = useState('')
  const [bulkPrice, setBulkPrice] = useState('')
  const [activeTab, setActiveTab] = useState<'BUYER'|'SELLER'>(
    (typeof window !== 'undefined' && (localStorage.getItem('zestTab') as any)) || 'BUYER'
  )
  const [filters, setFilters] = useState({
    query: '',
    propertyType: '',
    status: '',
  })
  const debounceRef = useRef<NodeJS.Timeout|null>(null)

  const fetchPage = async (pageNum = 1) => {
    setLoading(true)
    const q = new URLSearchParams()
    q.set('page', String(pageNum))
    q.set('pageSize', '100')
    Object.entries(filters).forEach(([k, v]) => v && q.set(k, v))
    const res = await fetch(`/api/admin/leads?${q.toString()}`)
    const { leads: items, hasMore } = await res.json()
    // setLeads(prev => pageNum === 1 ? items : [...prev, ...items])
    setLeads(items)
    setHasMore(hasMore)
    setPage(pageNum)
    setLoading(false)
    setTotalCount(totalCount);
    setPage(pageNum);
  }

  // fire page load on mount and whenever filters change:
  useEffect(() => {
    fetchPage(1)
  }, [filters, activeTab])

  // Handlers
  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])

  const applyBulkTag = async () => {
    if (!bulkTag.trim() || !selected.length) return
    await fetch('/api/admin/leads/tag-bulk', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ leadIds:selected, tag:bulkTag.trim() })
    })
    setSelected([]); setBulkTag('')
    // re-fetch
    setFilters(f => ({ ...f })) 
  }

  const applyBulkPrice = async () => {
    const p = parseFloat(bulkPrice)
    if (isNaN(p) || !selected.length) return
    await fetch('/api/admin/leads/price-bulk', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ leadIds:selected, price:p })
    })
    setSelected([]); setBulkPrice('')
    setFilters(f => ({ ...f }))
  }

  const removeTag = async (tagId:string, leadId:string) => {
    await fetch(`/api/admin/leads/${leadId}/tags/${tagId}`, { method:'DELETE' })
    setLeads(l => l.map(lead => lead.id===leadId
      ? { ...lead, tags: lead.tags.filter(t=>t.id!==tagId) }
      : lead
    ))
  }

  // Derived subsets
  const buyer = leads.filter(l=>l.leadType==='BUYER')
  const seller = leads.filter(l=>l.leadType==='SELLER')

  return (
    <AdminLayout>
      <div className="px-8 pt-6 pb-12">

        {/* Header + Add */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="
              w-[200px] h-[30px] font-semibold text-3xl leading-[25px]
              bg-[radial-gradient(190.64%_199.6%_at_-3.96%_130%,#3A951B_0%,#1CDAF4_100%)]
              bg-clip-text text-transparent
            ">All Leads</h1>      
        </div>

        {/* Filters & Bulk */}
        <details className="border rounded-lg bg-gray-50 mb-6">
          <summary className="px-4 py-2 cursor-pointer font-medium">Filters & Bulk Actions</summary>
          <div className="px-4 py-4 space-y-4">

            {/* Search + property + status */}
            <div className="flex items-center justify-between mb-6 space-x-4">
              {/* ── LEFT: all your filter controls ── */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Search leads…"
                    className="flex h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 pr-10"
                    value={filters.query}
                    onChange={e => {
                      const v = e.target.value
                      clearTimeout(debounceRef.current!)
                      debounceRef.current = setTimeout(() => {
                        setFilters(f => ({ ...f, query: v }))
                      }, 300)
                    }}
                  />
                  <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Property Type"
                  className="rounded-lg border px-3 py-2 text-sm bg-secondary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 pr-10"
                  value={filters.propertyType}
                  onChange={e => setFilters(f => ({ ...f, propertyType: e.target.value }))}
                />
                <select
                  className="rounded-lg border px-3 py-2 text-sm bg-secondary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 pr-10"
                  value={filters.status}
                  onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="">All Status</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              {/* right-aligned Add New button */}   
                
               
            </div>


            {/* Bulk tag & price */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 max-w-sm">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Tag name"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm bg-secondary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 pr-10"
                    value={bulkTag}
                    onChange={e=>setBulkTag(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={applyBulkTag}
                className="rounded-lg px-4 py-2 font-medium text-white"
                style={{
                  backgroundImage:
                    'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
                }}
              >
                Apply Tag
              </button>

              <div className="flex-1 max-w-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <input
                    type="number"
                    placeholder="Set price"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm bg-secondary placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 pr-10"
                    value={bulkPrice}
                    onChange={e=>setBulkPrice(e.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={applyBulkPrice}
                className="rounded-lg px-4 py-2 font-medium text-white"
                style={{
                  backgroundImage:
                    'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
                }}
              >
                Update Price
              </button>

              <span className="text-gray-600">{selected.length} selected</span>
            </div>
          </div>
        </details>

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          {(['BUYER','SELLER'] as const).map(tab => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  localStorage.setItem('zestTab', tab)
                }}
                className={`font-semibold text-[16px] leading-[20px] ${
                  isActive
                    ? 'bg-clip-text text-transparent underline decoration-black underline-offset-4'
                    : 'text-black'
                }`}
                style={
                  isActive
                    ? {
                        backgroundImage:
                          'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)',
                      }
                    : undefined
                }
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            )
          })}
          <Button
            onClick={() => router.push('/admin/leads/add')}
            size="sm"
            variant="outline"
            className="whitespace-nowrap text-white"
            style={{
              backgroundImage:
                'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
            }}
          >
            <FilePlus className="h-5 w-5" />
            Add Lead
          </Button>  
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row lg:space-x-6 w-full">
          {/* Left = Table */}
          <div className="flex-1 space-y-4">
            {loading ? (
              <div className="text-center py-6 text-gray-500">Loading…</div>
            ) : (
              <div className="rounded-lg border border-gray-200 shadow-sm overflow-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50 text-gray-600 text-sm">
                    <tr>
                      <th className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.length ===
                            (activeTab==='BUYER' ? buyer.length : seller.length)}
                          onChange={e => {
                            if (e.target.checked) {
                              const ids = (activeTab==='BUYER' ? buyer : seller).map(l=>l.id)
                              setSelected(ids)
                            } else {
                              setSelected([])
                            }
                          }}
                        />
                      </th>
                      {['Name','Contact','Email','Type','Property','Status','Lead Price','Tags','Actions'].map((h,i) => (
                        <th
                          key={h}
                          className={`p-3 text-left ${i===8?'text-center':''}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab==='BUYER'?buyer:seller).map(lead => {
                      const inCart = !!lead.price && lead.isAvailable
                      return (
                        <tr key={lead.id} className="border-t text-sm hover:bg-gray-50">
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selected.includes(lead.id)}
                              onChange={()=>toggleSelect(lead.id)}
                            />
                          </td>
                          <td className="p-3">{lead.name}</td>
                          <td className="p-3">{lead.contact}</td>
                          <td className="p-3">{lead.email||'—'}</td>
                          <td className="p-3">{lead.leadType}</td>
                          <td className="p-3">{lead.propertyType}</td>
                          <td className="p-3">
                            {lead.isAvailable ? 'Available' : 'Unavailable'}
                          </td>
                          <td className="p-3">
                            {lead.price ? `$${lead.price.toLocaleString()}` : '—'}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {lead.tags.map(t=>(
                                <span
                                  key={t.id}
                                  className="inline-flex items-center gap-1 bg-gray-200 px-2 py-1 rounded-full text-xs"
                                >
                                  {t.name}
                                  <button
                                    onClick={()=>removeTag(t.id, lead.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >×</button>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-center space-x-2">
                          

                            <Link href={`/admin/leads/view/${lead.id}`}>
                              <button className="inline-flex items-center px-3 py-1 rounded-full text-xs text-white"
                              style={{
                                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #0396B7 0%, #1CDAF4 100%)"
                              }}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </button>
                            </Link>

                            <Link href={`/admin/leads/edit/${lead.id}`}>
                              <button className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs text-white"
                              style={{
                                  background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)"
                                }}>
                                <Edit2 className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                            </Link>
                            {/* {inCart && (
                              <StripeCheckoutButton
                                lead={{
                                  id: lead.id,
                                  name: lead.name,
                                  price: lead.price!,
                                  propertyType: lead.propertyType
                                }}
                                userId={session?.user?.id}
                              />
                            )} */}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
             {/* Pagination */}
            {/* <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => fetchPage(pNum)}
                  className={`px-3 py-1 rounded ${
                    pNum === page
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {pNum}
                </button>
              ))}
            </div> */}
          </div>

          {/* Right = Stats */}
          <aside className="space-y-6 mt-6 lg:mt-0 lg:w-[300px]">
            <div className="p-4 rounded-lg text-white shadow-sm"
              style={{
                backgroundImage:
                  'radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)'
              }}
            >
              <h1 className="text-sm">Total Leads</h1>
              <h3 className="text-2xl font-semibold">{leads.length}</h3>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-sm">
              <h2 className="text-sm">
                {activeTab==='BUYER' ? 'Buyer Leads' : 'Seller Leads'}
              </h2>
              <h3 className="text-2xl font-semibold">
                {(activeTab==='BUYER' ? buyer : seller).length}
              </h3>
            </div>
            <div className="p-4 rounded-lg text-white shadow-sm bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm">
              <p className="text-sm">Recently Purchased Leads</p>
              <h3 className="text-2xl font-semibold">{leads.length}</h3>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-sm">
              <p className="text-sm">Total Leads</p>
              <h3 className="text-2xl font-semibold">{leads.length}</h3>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}

export default LeadsPage;