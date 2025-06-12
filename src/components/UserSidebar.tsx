'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Home,
  Search,
  ListOrdered,
  Bell,
  User,
  Headset,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard',     icon: Home,        href: '/user/dashboard' },
  { name: 'Leads',         icon: Search,      href: '/user/leads'     },
  { name: 'My Leads',      icon: ListOrdered, href: '/user/my-leads' },
  { name: 'Notification',  icon: Bell,        href: '/user/notification' },
  { name: 'Account',       icon: User,        href: '/user/account'  },
  { name: 'Support',       icon: Headset,     href: '/user/support'  },
];

export default function UserSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  // Load collapse state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) {
      setCollapsed(stored === 'true')
    }
  }, [])

  // Persist collapse state
  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', next.toString())
      return next
    })
  }

  return (
    <div
      className={
        `fixed top-0 left-0 z-30 h-full bg-sidebar flex flex-col
         transition-all duration-200
         ${collapsed ? 'w-16' : 'w-64'}`
      }
    >
      <button
        onClick={toggle}
        className="p-2 m-2 text-surface self-end hover:bg-primary/20 rounded"
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      <div className="px-4 mb-6">
        {!collapsed && (
          <h2 className="font-heading text-xl text-surface">ZestLeads</h2>
        )}
      </div>

      <nav className="flex-1 px-2 space-y-2">
        {navItems.map(({ name, icon: Icon, href }) => {
          const active = router.pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={
                `flex items-center gap-3 p-2 rounded-lg
                 ${active ? 'bg-primary/20 text-primary' : 'text-surface hover:bg-primary/10'}`
              }
            >
              <Icon className="h-6 w-6" />
              {!collapsed && <span className="font-body">{name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

