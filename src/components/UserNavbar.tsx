// src/components/Navbar.tsx
'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import NavbarNotificationDropdown from '@/components/NavbarNotificationDropdown'
import NavbarCartDropdown from '@/components/NavbarCartDropdown'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        ml-0 md:ml-64   /* clear sidebar */
        h-16 z-20
        bg-surface shadow
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-full">
        {/* Brand + Search */}
        <div className="flex items-center gap-4 h-full">
          <button className="block md:hidden">
            {/* Mobile “back” arrow or toggle… */}
          </button>
          <h1 className="text-2xl font-heading text-text">ZestLeads</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50" />
            <input
              type="text"
              placeholder="Search leads…"
              className="
                pl-10 pr-4 py-2 rounded-lg border border-gray-200
                focus:outline-none focus:ring-2 focus:ring-primary
                w-48 md:w-64
              "
            />
          </div>
        </div>

        {/* User controls */}
        {session?.user ? (
          <div className="flex items-center gap-4">
            <NavbarNotificationDropdown />
            <NavbarCartDropdown />
            {session.user.image && (
              <Image
                src={session.user.image}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
            )}
            <div className="text-right">
              <p className="font-body text-text font-semibold">
                {session.user.name}
              </p>
              <p className="font-body text-text/60 text-sm">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-accent text-text rounded-lg hover:bg-accent/90 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <a href="/auth/login" className="text-primary font-medium hover:underline">
            Login
          </a>
        )}
      </div>
    </header>
  )
}
