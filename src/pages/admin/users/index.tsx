// pages/admin/users.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/layout/AdminLayout'
import { Users2, Search as SearchIcon, Eye, Edit2, RefreshCw, Trash2 } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: string
  deletedAt: string | null
}

export default function AdminUsersPage(props) {
  const [activeTab, setActiveTab] = useState<'users'|'admins'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const debounceRef = useRef<NodeJS.Timeout|null>(null)
  const [leadsAssigned, setLeadsAssigned] = useState(0)
  const [discountsAssigned, setDiscountsAssigned] = useState(0)

  // helper to fetch users by role
  const fetchUsers = async (role: 'USERS'|'ADMINS') => {
    setLoading(true)
    try {
      // map our UI role to the API role param
      const apiRole = role === 'USERS' ? 'AGENT' : 'ADMIN'
      const res = await fetch(`/api/admin/users?role=${apiRole}`)
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  console.log('fetching users for', users)
  // fetch users on tab change
  useEffect(() => {
    fetchUsers('USERS')  // will hit `/api/admin/users?role=AGENT`
    fetchUsers('ADMINS') // will hit `/api/admin/users?role=ADMIN`
  }, [activeTab])

  // Static totals
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalAdmins, setTotalAdmins] = useState(0)
   // Fetch totals once
  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/users?role=AGENT`).then(r=>r.json()),
      fetch(`/api/admin/users?role=ADMIN`).then(r=>r.json()),
    ])
      .then(([usersData, adminsData]) => {
        setTotalUsers(usersData.users?.length ?? 0)
        setTotalAdmins(adminsData.users?.length ?? 0)
      })
      .catch(console.error)
  }, [])

  // debounce search input (for future API)
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setSearch(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      console.log('search for', v)
      // TODO: re-fetch with search param
    }, 300)
  }

  return (
    <AdminLayout>
      <div className="px-8 pt-6 pb-12">
        <div className="flex flex-col lg:flex-row lg:space-x-6 w-full">
          
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 space-y-4">
            {/* Tabs */}
            <div className="flex space-x-8">
              {(["users", "admins"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-none order-0 flex-grow-0
                      w-[60px] h-[20px]
                      font-plus-jakarta-sans font-semibold
                      text-[16px] leading-[20px]
                      transition
                      ${isActive
                        ? "bg-clip-text text-transparent underline decoration-black underline-offset-6"
                        : "text-black"}
                    `}
                    style={
                      isActive
                        ? {
                            backgroundImage:
                              "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                          }
                        : undefined
                    }
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                );
              })}
            </div>


            {/* Title + icon */}
            <div className="flex items-center space-x-3">
              <Users2 className="h-6 w-6 text-[#285B19]" />
              <h2 className="text-2xl font-bold">User Management</h2>
            </div>

            {/* Search only */}
            <div className="flex justify-end">
              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={onSearch}
                  className="flex h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
                  <SearchIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Table card */}
            <div className="rounded-lg border border-gray-200 overflow-auto shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    {['Name','Email','Role','Actions'].map((h, i) => (
                      <th
                        key={h}
                        className={
                          i === 3
                            ? 'p-3 text-center space-x-2'
                            : 'p-3 text-left'
                        }
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">Loading…</td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-4 text-center">No users found.</td>
                    </tr>
                  ) : users.map(u => (
                    <tr key={u.id} className="border-t text-sm text-gray-700">
                      <td className="p-3">{u.name || '—'}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3 text-center space-x-2">
                        <Link href={`/admin/users/view/${u.id}`}>
                          <button className="inline-flex items-center px-3 py-1 rounded-full text-xs text-white"
                          style={{
                            background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #0396B7 0%, #1CDAF4 100%)"
                          }}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                        </Link>

                        <Link href={`/admin/users/edit/${u.id}`}>
                          <button className="inline-flex items-center px-3 py-1 rounded-full text-xs text-white"
                          style={{
                              background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)"
                            }}>
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </Link>

                        {u.deletedAt ? (
                          <button
                            onClick={async () => {
                              await fetch(`/api/admin/users/${u.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'reactivate' }),
                              })
                              await fetchUsers(activeTab.toUpperCase() as 'USERS'|'ADMINS')
                            }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-600 text-white hover:bg-green-700"
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              await fetch(`/api/admin/users/${u.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'suspend' }),
                              })
                              await fetchUsers(activeTab.toUpperCase() as 'USERS'|'ADMINS')
                            }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs text-white"
                            style={{
                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #956e1bff 0%, #fc3434ff 100%)"
              }}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Suspend
                          </button>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <aside className="space-y-6 lg:col-span-1 lg:w-[300px]">
           {/* Total Users */}
            <div className="p-4 rounded-lg text-white shadow-sm"
            style={{
                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #3A951B 0%, #1CDAF4 100%)"
              }}>
              <p className="text-sm">Total Users</p>
              <h3 className="text-2xl font-semibold">{totalUsers}</h3>
            </div>
            {/* Total Admins */}
            <div
              className="p-4 rounded-lg text-white shadow-sm"
              style={{
                background: "radial-gradient(187.72% 415.92% at 52.87% 247.14%, #0396B7 0%, #1CDAF4 100%)"
              }}
            >
              <p className="text-sm">Total Admins</p>
              <h3 className="text-2xl font-semibold">{totalAdmins}</h3>
            </div>
            {/* Total Leads Assigned */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm">
              <p className="text-sm">Total Leads Assigned</p>
              <h3 className="text-2xl font-semibold">{leadsAssigned}</h3>
            </div>
            {/* Total Discount Assigned */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-sm">
              <p className="text-sm">Total Discount Assigned</p>
              <h3 className="text-2xl font-semibold">{discountsAssigned}</h3>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}
