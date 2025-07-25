"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- ICONS --- (Added Notification Icon)
const Icons = {
    // Added Notification Bell Icon
    Notification: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Cart: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>,
    Leads: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" x2="21" y1="6" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>,
    Profile: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Subscription: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><rect width="20" height="14" x="2" y="5" rx="2"></rect><line x1="2" x2="22" y1="10" y2="10"></line></svg>,
    Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>,
    Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Help: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>,
    About: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>,
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>,
};


// --- NavLink Component --- (Updated to use CSS theme variables)
const NavLink = ({ href, children, icon: Icon }) => {
  const pathname = usePathname();
// true whenever we’re on any /user/leads/* page
  
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <span
        className={`flex items-center gap-2 py-2 px-3 text-m rounded-md transition-colors  
          ${
            isActive
              ? 'bg-sidebar-active-background/40 text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal'
          }`}
      >
        <Icon />
        {children}
      </span>
    </Link>
  );
};

export default function CombinedNavSidebar({ children }) {
  const pathname = usePathname();
  const isLeadsRoute = 
  pathname.startsWith('/user/leads') || 
  pathname === '/user/my-leads'

  // Safe SSR initial state:
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [leadsOpen, setLeadsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debounceTimeoutRef = useRef(null);

  // Hydrate from localStorage on client only
  useEffect(() => {
    const storedSidebar = window.localStorage.getItem('sidebar-open');
    if (storedSidebar !== null) {
      setSidebarOpen(storedSidebar === 'true');
    }
    const storedLeads = window.localStorage.getItem('sidebar-leads-open');
    if (storedLeads !== null) {
      setLeadsOpen(storedLeads === 'true');
    }
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    if (isSidebarOpen) setSidebarOpen(false);
  }, [pathname, isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem('sidebar-open', String(next));
      return next;
    });
  };

  const toggleLeads = () => {
    setLeadsOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem('sidebar-leads-open', String(next));
      return next;
    });
  };

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      console.log('Search triggered with:', value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-background p-4 lg:p-2">
      {/* SIDEBAR */}
      <aside
        id="sidebar"
        className={`
          fixed top-4 left-4 z-40 w-64 h-[calc(100vh-2rem)]
          bg-card rounded-[16px] shadow-sm
          flex flex-col justify-between transition-transform
          lg:static lg:w-55 lg:h-[calc(100vh-3rem)] lg:shrink-0 lg:mr-2 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="lg:sticky px-6 py-2">
          <div className="flex items-center h-16 mb-4">
            <h1 className="
            w-[101px] h-[25px]
            [font-family:'Plus\ Jakarta\ Sans'] font-semibold text-[20px] leading-[25px]
            bg-[radial-gradient(135.64%_109.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
            bg-clip-text [-webkit-background-clip:text]
            text-transparent [-webkit-text-fill-color:transparent]
          ">
              ZestLeads
            </h1>
          </div>

          {/* Overview */}
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Overview
            </h3>

            <NavLink href="/user/dashboard" icon={Icons.Dashboard}>
              Dashboard
            </NavLink>

            {/* Leads parent toggle */}
            <button
        onClick={toggleLeads}
        className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors  
            ${
            isLeadsRoute
                ? 'bg-sidebar-active-background/40 text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal'
            }`}
        >
        <Icons.Leads />
        <span>Leads</span>
        </button>

            {/* Leads submenu */}
            <div
              className={`ml-6 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                ${leadsOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
            >
              <NavLink href="/user/leads" icon={Icons.Cart} >
                <span className='px-3'>Buy</span>
              </NavLink>
              <NavLink href="/user/my-leads" icon={Icons.Profile}>
                Owned
              </NavLink>
            </div>
          </nav>

          {/* Profile */}
          <nav className="space-y-1 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Profile
            </h3>
            <NavLink href="/user/account" icon={Icons.Profile}>
              Profile
            </NavLink>
            <NavLink href="/subscription" icon={Icons.Subscription}>
              Subscription
            </NavLink>
            <NavLink href="/wallet" icon={Icons.Wallet}>
              Wallet
            </NavLink>
            <NavLink href="/activity" icon={Icons.Activity}>
              Activity
            </NavLink>
            <NavLink href="/settings" icon={Icons.Settings}>
              Settings
            </NavLink>
          </nav>

          {/* Support */}
          <nav className="space-y-1 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Support
            </h3>
            <NavLink href="/help" icon={Icons.Help}>
              Help & FAQ
            </NavLink>
            <NavLink href="/about" icon={Icons.About}>
              About
            </NavLink>
          </nav>
        </div>

        {/* Promo at bottom */}
        <div className="p-6">
          <div className="bg-plan rounded-lg p-4 text-center text-primary-foreground relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-semibold text-sm mb-1">Upgrade your plan now</h3>
              <p className="text-xs opacity-90 mb-4">
                Get unlimited leads and get notified first for every hot lead.
              </p>
              <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-9 rounded-md px-3 w-full bg-white text-plan hover:bg-white/90">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div id="sidebar-backdrop" onClick={toggleSidebar} className={`fixed inset-0 bg-black/60 z-30 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}></div>

            {/* --- MAIN CONTENT WRAPPER --- (Updated with 16px radius and theme colors) */}
            <div className="
                flex-1 flex flex-col 
                
                
                 
                overflow-hidden
            ">
                {/* --- HEADER / NAVBAR --- */}
                <header className="
                    h-16 p-6 flex items-center justify-between sticky top-0 z-20
                    border-b bg-card rounded-[16px]
                ">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={toggleSidebar}><Icons.Menu /></button>
                        <div className="relative w-full max-w-sm hidden sm:block">
                            <input
                                className="flex h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-10"
                                placeholder="Search for anything in the app..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
                                <Icons.Search />
                            </div>
                        </div>
                    </div>

                    {/* Updated: Added Notification icon */}
                    <div className="flex items-center gap-x-3">
                                                <button className="h-10 w-10 text-primary  flex items-center justify-center rounded-full hover:bg-primary-dark transition-colors shrink-0">
                            <Icons.Cart />
                        </button>
                        <button className="h-10 w-10 text-muted-foreground hover:text-foreground flex items-center justify-center rounded-full hover:bg-accent transition-colors shrink-0">
                           <Icons.Notification />
                        </button>

                        <button className="flex items-center space-x-3 text-left p-1 hover:bg-accent rounded-lg transition-colors">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10">
                                <img className="aspect-square h-full w-full" src="https://i.pravatar.cc/40?u=john-alan" alt="John Alan" />
                            </span>
                            <div className="text-sm hidden md:block">
                                <p className="font-semibold text-foreground">John Alan</p>
                                <p className="text-xs text-muted-foreground">Sales Expert</p>
                            </div>
                        </button>
                    </div>
                </header>
                
                {/* --- MAIN CONTENT AREA --- (No background, as requested) */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
      </div>
    );
}