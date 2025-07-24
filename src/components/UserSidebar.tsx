'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Home,
  ShoppingBag,
  ShoppingCart,
  FolderOpen,
  CreditCard,
  Wallet,
  Activity as ActivityIcon,
  Settings,
  HelpCircle,
  Info,
  Bell,
} from 'lucide-react'

type NavItem = {
  name: string
  href?: string
  icon: React.ComponentType<any>
  children?: NavItem[]
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/user/dashboard', icon: Home },
      {
        name: 'Leads',
        icon: ShoppingBag,
        children: [
          { name: 'Buy', href: '/user/leads', icon: ShoppingCart },
          { name: 'Owned', href: '/user/my-leads', icon: FolderOpen },
        ],
      },
    ],
  },
  {
    title: 'Profile',
    items: [
      { name: 'Subscription', href: '/user/subscription', icon: CreditCard },
      { name: 'Wallet',       href: '/user/wallet',       icon: Wallet },
      { name: 'Activity',     href: '/user/activity',     icon: ActivityIcon },
      { name: 'Settings',     href: '/user/account',      icon: Settings },
    ],
  },
  {
    title: 'Support',
    items: [
      { name: 'Help & FAQ', href: '/user/help',  icon: HelpCircle },
      { name: 'About',     href: '/user/about', icon: Info },
    ],
  },
]

export default function UserSidebar() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [leadsOpen, setLeadsOpen]     = useState(false)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const toggleLeads   = () => setLeadsOpen(!leadsOpen)

  const renderItem = (item: NavItem, indent = false) => {
    const active = item.href ? pathname.startsWith(item.href) : false
    const hasKids = !!item.children?.length

    const baseClasses =
      'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors'
    const activeClasses = active || (hasKids && leadsOpen)
      ? 'bg-green-100 text-green-600'
      : 'text-slate-600 hover:bg-green-50'
    const indentClass = indent ? 'pl-8' : ''

    if (hasKids) {
      return (
        <div key={item.name}>
          <button
            onClick={toggleLeads}
            className={`${baseClasses} ${activeClasses} ${indentClass}`}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.name}</span>
            <svg
              className={`h-4 w-4 transform transition-transform ${
                leadsOpen ? 'rotate-90' : ''
              }`}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 5l5 5-5 5" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              leadsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {item.children!.map((child) => renderItem(child, true))}
          </div>
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href!}
        className={`${baseClasses} ${activeClasses} ${indentClass}`}
      >
        <item.icon className="h-5 w-5" />
        <span>{item.name}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden"
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:flex-shrink-0
        `}
      >
        {/* Logo */}
        <div className="px-6 py-4">
          <h1
            className="
              w-[101px] h-[25px]
              [font-family:'Plus\\ Jakarta\\ Sans'] font-semibold text-[20px] leading-[25px]
              bg-[radial-gradient(135.64%_109.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text [-webkit-background-clip:text]
              text-transparent [-webkit-text-fill-color:transparent]
            "
          >
            ZestLeads
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {navSections.map(({ title, items }) => (
            <div key={title} className="mb-6">
              <p className="px-4 text-xs font-semibold uppercase text-gray-400 mb-2">
                {title}
              </p>
              <div className="space-y-1">
                {items.map((item) => renderItem(item))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Pane */}
        <div className="mt-auto border-t">
          {/* Notifications */}
          <div className="p-4">
            <Link
              href="/user/notification"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-600 hover:bg-green-50 transition"
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </Link>
          </div>

          {/* Promotion Card */}
          <div className="m-4 p-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-lg font-bold mb-2">Upgrade your plan now</h3>
              <p className="text-sm mb-4 opacity-90">
                Get more leads and get notified first for every hot lead
              </p>
              <Link
                href="/user/leads/buy"
                className="mt-auto inline-block bg-white text-green-600 font-semibold py-2 px-4 rounded-full"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
