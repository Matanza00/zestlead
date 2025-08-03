'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui2/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Leads', href: '/leads' },
    { label: 'Pricing', href: 'pricing' },
    { label: 'About', href: '/about' },
  ];

  const handleDashboardRedirect = () => {
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 gradient-card backdrop-blur-md border-b border-white/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            
            <h1 className="text-center text-3xl tracking-tight align-center
            [font-family:'Plus\ Jakarta\ Sans'] font-semibold
            bg-[radial-gradient(115.64%_179.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
            bg-clip-text [-webkit-background-clip:text]
            text-transparent [-webkit-text-fill-color:transparent] 
          ">
            ZestLeads
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4 relative">
            {!session?.user ? (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            ) : (
              <div className="relative shadow-sm">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-foreground bg-white rounded-full px-3 py-1 border border-gray-200 shadow-sm hover:shadow-md transition"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                ><User className='bg-green'/>
                  <span>{session.user.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    <button
                      onClick={handleDashboardRedirect}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Dashboard
                    </button>
                    <Link href="/profile">
                      <div className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer">Profile</div>
                    </Link>
                    <Link href="/settings">
                      <div className="px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer">Settings</div>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col gap-4 mt-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              {!session?.user ? (
                <div className="flex flex-col gap-2 mt-4">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="justify-start w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="hero" className="justify-start w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-4 text-sm">
                  <button onClick={handleDashboardRedirect} className="text-left px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </button>
                  <Link href="/profile">
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</div>
                  </Link>
                  <Link href="/settings">
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</div>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
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
};

export default Header;
