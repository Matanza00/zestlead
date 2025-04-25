// src/layouts/UserLayout.tsx
'use client';
import UserNavbar from '@/components/UserNavbar';
import UserSidebar from '@/components/UserSidebar';
import { ReactNode, useEffect, useState } from 'react';

export default function UserLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  return (
    // <div className="flex h-screen overflow-hidden">
    //   <aside className="hidden md:block">
    //     <UserSidebar />
    //   </aside>
    //   <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
    //     {children}
    //   </main>
    // </div>


    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar (shared for now) */}
        <UserNavbar />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
