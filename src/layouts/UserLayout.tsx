// src/layouts/UserLayout.tsx
'use client'
import UserSidebar from '@/components/UserSidebar'
import Navbar from '@/components/Navbar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* fixed sidebar */}
      <UserSidebar />

      {/* content wrapper: margin-left on md+ to clear sidebar */}
      <div className="ml-0 md:ml-64">
        {/* fixed navbar: height 64px, offset by same sidebar margin */}
        <Navbar />

        {/* main content: pushed down by navbar height */}
        <main className="mt-16">
          {children}
        </main>
      </div>
    </>
  )
}
