// src/components/user/UserSidebar.tsx
'use client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils'; // or use raw string merge if utils not used

import {
  Home,
  Search,
  ListOrdered,
  Bell,
  User,
  Headset
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/user/dashboard' },
  { name: 'Leads', icon: Search, href: '/user/leads' },
  { name: 'My Leads', icon: ListOrdered, href: '/user/my-leads' },
  { name: 'Notification', icon: Bell, href: '/user/notification' },
  { name: 'Account', icon: User, href: '/user/account' },
  { name: 'Support', icon: Headset, href: '/user/support' },
];

export default function UserSidebar() {
  const router = useRouter();

  return (
    <div className="h-full w-64 bg-white border-r shadow-sm p-4">
      <h2 className="text-xl font-bold mb-6">ZestLeads</h2>
      <ul className="space-y-2">
        {navItems.map(({ name, icon: Icon, href }) => (
          <li key={href}>
            <Link
                href={href}
                className={cn(
                    'flex items-center gap-3 p-2 rounded hover:bg-gray-100',
                    router.pathname.startsWith(href) && 'bg-gray-100 font-semibold'
                )}
                >
                <Icon className="h-5 w-5" />
                {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
