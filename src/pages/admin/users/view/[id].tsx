// pages/admin/users/[id].tsx
'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import AssignLeadSection from '@/components/admin/AssignLeadSection'
import DiscountAssignmentSection from '@/components/admin/DiscountAssignmentSection'
import { Users2 } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: string
  deletedAt: string | null
  createdAt: string
  emailVerified: boolean
}

export default function ViewUserPage(props) {
  const router = useRouter()
  const { id } = router.query
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/users/${id}`)
        .then((res) => res.json())
        .then(setUser)
        .catch(console.error)
    }
  }, [id])

  if (!user) {
    return (
      <AdminLayout>
        <div className="p-6">
          <p className="text-center text-gray-500">Loading user…</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-8 pt-6 pb-12">
        {/* Page header */}
        <div className="flex items-center space-x-3 mb-6">
          <Users2 className="h-6 w-6 text-[#285B19]" />
          <h1 className="text-2xl font-bold">User Detail</h1>
        </div>

        {/* User Info card */}
         {/* User Info card */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-gray-800">
                {user.deletedAt ? 'Suspended' : 'Active'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-800">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-800">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Verified</p>
              <p className="font-medium text-gray-800">
                {user.emailVerified ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Assign + Discount sections */}
        <div className="mt-8 flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
          {/* ── Assign Leads ── */}
          <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Assign Leads</h2>
            <AssignLeadSection userId={user.id} />
          </div>

          {/* ── Discounts ── */}
          <div className="flex-1 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <div className="flex items-center justify-between">
            </div>
            <h2 className="text-lg font-semibold mb-4">Assign Discounts</h2>
            <DiscountAssignmentSection userId={user.id} />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
