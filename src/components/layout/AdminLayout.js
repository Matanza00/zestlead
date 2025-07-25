'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import {
  Home,
  Users,
  FileText,
  FileCode,
  CreditCard,
  FileEdit,
  Menu as MenuIcon,
  Bell as NotificationIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
} from 'lucide-react'

const menuItems = [
  { label: 'Dashboard',            path: '/admin',           icon: <Home size={18} /> },
  { label: 'User Management',      path: '/admin/users',     icon: <Users size={18} /> },
  { label: 'Lead Management',      path: '/admin/leads',     icon: <FileText size={18} /> },
  { label: 'Referrals Management', path: '/admin/referrals',  icon: <FileCode size={18} /> },
  { label: 'Transaction Management', path: '/admin/transactions', icon: <CreditCard size={18} /> },
  { label: 'Content Management',   path: '/admin/content',    icon: <FileEdit size={18} /> },
]

export default function CombinedAdminNav({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // auto-close mobile drawer on nav
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="flex w-full min-h-screen bg-background p-4 lg:p-2">
      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed top-4 left-4 z-40 w-64 h-[calc(100vh-2rem)]
          bg-card rounded-[16px] shadow-sm
          flex flex-col justify-between transition-transform
          lg:static lg:translate-x-0 lg:w-55 lg:h-[calc(100vh-3rem)] lg:mr-2 lg:shrink-0
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="lg:sticky px-6 py-2">
          <div className="flex items-center h-16 mb-4">
            <h1 className="
              w-[101px] h-[25px] font-semibold text-[20px] leading-[25px]
              bg-[radial-gradient(135.64%_109.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text text-transparent
            ">
              ZestLeads
            </h1>
          </div>
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Admin
            </h3>
            {menuItems.map(({ label, path, icon }) => {
              const active = pathname === path
              return (
                <Link
                  key={path}
                  href={path}
                  className={`
                    flex items-center gap-2 py-2 px-3 rounded-md transition-colors
                    ${active
                      ? 'bg-sidebar-active-background/40 text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
                  `}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        {/* <div className="p-6">
          <div className="bg-plan rounded-lg p-4 text-center text-primary-foreground">
            <h3 className="font-semibold text-sm mb-1">Upgrade your plan now</h3>
            <p className="text-xs opacity-90 mb-4">
              Get unlimited leads and get notified first for every hot lead.
            </p>
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 w-full bg-white text-plan hover:bg-white/90">
              Buy Now
            </button>
          </div>
        </div> */}
      </aside>

      {/* mobile backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* --- HEADER / NAVBAR --- */}
        <header className="
          h-16 px-6 flex items-center justify-between sticky top-4 z-20
          border-b bg-card rounded-[16px]
        ">
          {/* mobile hamburger */}
          <button
            className="lg:hidden flex-shrink-0 p-2 bg-white rounded-md shadow-md"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon className="h-6 w-6 text-gray-700" />
          </button>

          {/* search input */}
          <div className="relative w-full max-w-sm hidden sm:block flex-shrink-0">
            <input
              type="text"
              placeholder="Search for anything…"
              className="
                flex h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm
                placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring pr-10
              "
            />
            <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* right controls */}
          <div className="flex items-center gap-x-3">
            <button className="h-10 w-10 text-muted-foreground hover:text-foreground flex-shrink-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
              <CartIcon />
            </button>
            <button className="h-10 w-10 text-muted-foreground hover:text-foreground flex-shrink-0 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
              <NotificationIcon />
            </button>
            {session?.user ? (
              <div className="flex items-center space-x-4 p-2 rounded-lg transition-colors">
                {session.user.image && (
                  <span className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </span>
                )}
                <div className="text-sm hidden md:block">
                  <p className="font-semibold text-foreground">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="ml-2 px-4 py-2 text-base font-weight-500 text-red-500 rounded transition hover:bg-accent"
                  
                >
                 Logout
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Login
              </Link>
            )}
          </div>
        </header>

        {/* --- PAGE CONTENT --- */}
        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
