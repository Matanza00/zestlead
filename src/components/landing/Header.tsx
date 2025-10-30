'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui2/button';

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ');
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Leads', href: '/leads' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    const handle = () => setOpen(false);
    router.events.on('routeChangeStart', handle);
    return () => router.events.off('routeChangeStart', handle);
  }, [router.events]);

  // Close on outside click / ESC
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    if (open) {
      document.addEventListener('mousedown', onClick);
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleDashboardRedirect = () => {
    if (session?.user?.role === 'ADMIN') router.push('/admin');
    else router.push('/user/dashboard');
  };

  const firstName =
    session?.user?.name?.split(' ')[0] ||
    session?.user?.email?.split('@')[0] ||
    'User';
  const roleLabel = (session?.user as any)?.role?.toLowerCase?.() || 'customer';

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/10 bg-white/60 dark:bg-neutral-900/60">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="
                text-2xl md:text-3xl font-semibold tracking-tight
                bg-[radial-gradient(115%_180%_at_-4%_130%,#82E15A_0%,#0A7894_100%)]
                bg-clip-text text-transparent
              "
            >
              ZestLeads
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right area */}
          <div className="hidden md:flex items-center gap-3">
            {!session?.user ? (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="rounded-xl">Log In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="hero"
                    className="rounded-xl shadow-[0_8px_30px_rgb(10,120,148,0.25)]"
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                {/* Profile button */}
                <button
                  onClick={() => setOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={open}
                  className={classNames(
                    'group flex items-center gap-2 rounded-full border border-white/40 dark:border-white/10',
                    'bg-white/80 dark:bg-neutral-900/80 backdrop-blur px-3 py-1.5 transition-shadow',
                    'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500/50'
                  )}
                >
                  <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 text-white shadow-inner">
                    <UserRound className="h-4 w-4 opacity-95" />
                  </div>
                  <span className="text-sm font-medium text-foreground/90">
                    {firstName}
                  </span>

                  {/* Role badge */}
                  <span className="ml-1 rounded-full border px-2 py-0.5 text-xs font-medium
                    border-emerald-500/30 text-emerald-700 dark:text-emerald-300
                    bg-emerald-50/80 dark:bg-emerald-900/20">
                    {roleLabel}
                  </span>

                  <ChevronDown
                    className={classNames(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      open && 'rotate-180'
                    )}
                  />
                </button>

                {/* Dropdown */}
                {open && (
                  <div
                    role="menu"
                    className="
                      absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl
                      border border-white/40 dark:border-white/10
                      bg-white/90 dark:bg-neutral-900/90 backdrop-blur
                      shadow-xl ring-1 ring-black/5
                    "
                  >
                    {/* Top accent ring */}
                    <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-cyan-500 to-sky-500" />

                    <button
                      onClick={handleDashboardRedirect}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </button>

                    <Link href="/user/account/profile" className="block">
                      <div className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition">
                        <UserIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </div>
                    </Link>

                    <Link href="/user/settings" className="block">
                      <div className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/[0.03] dark:hover:bg-white/[0.03] transition">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </div>
                    </Link>

                    <div className="mx-3 my-1 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggler */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-white/30 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur shadow-lg">
            <div className="flex flex-col p-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-foreground/90 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] rounded-xl"
                >
                  {item.label}
                </Link>
              ))}

              {!session?.user ? (
                <div className="flex flex-col gap-2 p-2">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start rounded-xl">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="hero" className="w-full justify-start rounded-xl">
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="mt-2 border-t border-white/30 dark:border-white/10">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDashboardRedirect();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>
                  <Link href="/user/account/profile" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                      <UserIcon className="h-4 w-4" />
                      Profile
                    </div>
                  </Link>
                  <Link href="/user/settings" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
                      <Settings className="h-4 w-4" />
                      Settings
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
