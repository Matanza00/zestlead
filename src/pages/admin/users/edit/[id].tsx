// pages/admin/users/edit/[id].tsx
'use client'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Button } from '@/components/ui2/button'  // your cva-based Button
import { User, Users2, Mail, CheckCircle, Slash, Shield } from 'lucide-react'

type FormState = {
  name: string
  email: string
  status: 'active' | 'suspended'
  role: 'user' | 'admin'
}

export default function EditUserPage(props) {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    status: 'active',
    role: 'user',
  })
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          email: data.email,
          status: data.deletedAt ? 'suspended' : 'active',
          role: data.role.toLowerCase() === 'admin' ? 'admin' : 'user',
        })
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value as any }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        action: form.status === 'active' ? 'reactivate' : 'suspend',
        role: form.role.toUpperCase(),
      }),
    })
    router.push('/admin/users')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-500">Loading…</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-6 space-y-6 font-plus-jakarta-sans"
      >
        <h1 className="text-2xl font-semibold">Edit User</h1>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            <Users2 className="inline-block mr-2 align-text-bottom" /> Name
          </label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            <Mail className="inline-block mr-2 align-text-bottom" /> Email
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
            required
          />
        </div>

        {/* Status */}
        <div>
          <span className="block text-sm font-medium mb-1">
            <Shield className="inline-block mr-2 align-text-bottom" /> Status
          </span>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="active"
                checked={form.status === 'active'}
                onChange={handleChange('status')}
                className="h-4 w-4"
              />
              <span className="flex items-center text-sm">
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                Active
              </span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="status"
                value="suspended"
                checked={form.status === 'suspended'}
                onChange={handleChange('status')}
                className="h-4 w-4"
              />
              <span className="flex items-center text-sm">
                <Slash className="h-4 w-4 text-red-600 mr-1" />
                Suspended
              </span>
            </label>
          </div>
        </div>

        {/* Role */}
        <div>
          <span className="block text-sm font-medium mb-1">Role</span>
          <select
            value={form.role}
            onChange={handleChange('role')}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-green-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="pt-4 text-right">
          <Button type="submit" variant="default" size="lg">
            Save Changes
          </Button>
        </div>
      </form>
    </AdminLayout>
  )
}
