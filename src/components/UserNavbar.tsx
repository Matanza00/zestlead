'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Search as SearchIcon, Menu } from 'lucide-react'
import NavbarNotificationDropdown from '@/components/NavbarNotificationDropdown'
import NavbarCartDropdown from '@/components/NavbarCartDropdown'

export default function UserNavbar() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      console.log('Search:', val)
    }, 300)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <header
      className="
        fixed top-0 left-0 right-0
        ml-0 md:ml-64
        h-16 z-20
        bg-card border-b rounded-t-[16px] shadow-sm
      "
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">
        {/* Left: mobile menu + search */}
        <div className="flex items-center gap-4">
          {/* (optional) mobile back/toggle button */}
          <div className="md:hidden">
            <Menu className="h-6 w-6 cursor-pointer" />
          </div>
          <div className="relative hidden sm:block">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for anything in the app…"
              className="
                w-48 md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200
                bg-secondary text-sm placeholder:text-muted-foreground
                focus:outline-none focus:ring-1 focus:ring-primary
              "
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          </div>
        </div>

        {/* Right: cart, notifications, user */}
        <div className="flex items-center gap-4">
          <NavbarCartDropdown />
          <NavbarNotificationDropdown />

          {session?.user ? (
            <>
              <button
                className="flex items-center gap-3 p-1 rounded-lg hover:bg-accent transition-colors"
                onClick={() => signOut()}
              >
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                )}
                <div className="hidden md:block text-sm text-text">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-xs text-text/60">{session.user.email}</p>
                </div>
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
