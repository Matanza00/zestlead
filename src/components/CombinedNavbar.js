"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Heart,
  Bell,
  ShoppingCart,
  Users,
  UserRound,
  CreditCard,
  Wallet,
  Activity,
  Settings,
  HelpCircle,
  Info,
  Menu,
  Search,
  LogOut
} from "lucide-react";
import ChatSupportWidget from "./ChatSupportWidget";
import { signOut, useSession } from "next-auth/react";

const NavLink = ({ href, children, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <span
        className={`flex items-center gap-2 py-2 px-3 text-m rounded-md transition-colors  
          ${
            isActive
              ? "bg-sidebar-active-background/40 text-sidebar-active-foreground [&>svg]:text-sidebar-active-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-normal"
          }`}
      >
        <Icon className="h-5 w-5" />
        {children}
      </span>
    </Link>
  );
};

export default function CombinedNavSidebar({ children }) {
  const pathname = usePathname();
  const isLeadsRoute = pathname === "/user/my-leads";
  const { data: session } = useSession();

  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "No email";
  const userImage =
    user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`;

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [leadsOpen, setLeadsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceTimeoutRef = useRef(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Load sidebar state from localStorage
  useEffect(() => {
    const storedSidebar = window.localStorage.getItem("sidebar-open");
    if (storedSidebar !== null) setSidebarOpen(storedSidebar === "true");
    const storedLeads = window.localStorage.getItem("sidebar-leads-open");
    if (storedLeads !== null) setLeadsOpen(storedLeads === "true");
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    if (isSidebarOpen) setSidebarOpen(false);
  }, [pathname, isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem("sidebar-open", String(next));
      return next;
    });
  };

  const toggleLeads = () => {
    setLeadsOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem("sidebar-leads-open", String(next));
      return next;
    });
  };

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      console.log("Search triggered with:", value);
    }, 300);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-background p-4 lg:p-2">
      {/* SIDEBAR */}
      <aside
        className={`fixed top-4 left-4 z-40 w-64 h-[calc(100vh-2rem)] bg-card rounded-[16px] shadow-sm
        flex flex-col justify-between transition-transform lg:static lg:w-55 lg:h-[calc(100vh-3rem)] lg:shrink-0 lg:mr-2 lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="lg:sticky px-6 py-2">
          <div className="flex items-center h-16 mb-4">
            <h1
              className="w-[101px] h-[25px] font-semibold text-[20px] leading-[25px]
              bg-[radial-gradient(135.64%_109.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]
              bg-clip-text text-transparent"
            >
              ZestLeads
            </h1>
          </div>

          {/* Overview */}
          <nav className="space-y-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Overview
            </h3>
            <NavLink href="/user/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            <button
              onClick={toggleLeads}
              className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors  
                ${
                  isLeadsRoute
                    ? "bg-sidebar-active-background/40 text-sidebar-active-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <Users className="h-5 w-5" />
              <span>Leads</span>
            </button>
            <div className={`ml-6 mt-1 space-y-1 transition-all ${leadsOpen ? "max-h-40" : "max-h-0 overflow-hidden"}`}>
              <NavLink href="/user/leads" icon={ShoppingCart}><span className="px-3">Buy</span></NavLink>
              <NavLink href="/user/my-leads" icon={UserRound}>Owned</NavLink>
            </div>
            <NavLink href="/user/wishlist" icon={Heart}>Wishlist</NavLink>
          </nav>

          {/* Profile */}
          <nav className="space-y-1 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Profile
            </h3>
            <NavLink href="/user/account/profile" icon={UserRound}>Profile</NavLink>
            <NavLink href="/user/subscription" icon={CreditCard}>Subscription</NavLink>
            <NavLink href="/wallet" icon={Wallet}>Wallet</NavLink>
            <NavLink href="/user/activity" icon={Activity}>Activity</NavLink>
            <NavLink href="/user/settings" icon={Settings}>Settings</NavLink>
          </nav>

          {/* Support */}
          <nav className="space-y-1 mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Support
            </h3>
            <NavLink href="/user/support/help" icon={HelpCircle}>Help & FAQ</NavLink>
            <NavLink href="/about" icon={Info}>About</NavLink>
          </nav>
        </div>

        {/* Promo */}
        <div className="p-6">
          <div className="bg-plan rounded-lg p-4 text-center text-primary-foreground">
            <h3 className="font-semibold text-sm mb-1">Upgrade your plan now</h3>
            <p className="text-xs opacity-90 mb-4">
              Get early access and discounts on every hot lead.
            </p>
            <Link href="/user/subscription" className="bg-white text-plan rounded-md px-3 py-2 w-full block">
              Buy Now
            </Link>
          </div>
        </div>
      </aside>

      {/* Sidebar backdrop */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
      />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 p-6 flex items-center justify-between sticky top-0 z-20 border-b bg-card rounded-[16px]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={toggleSidebar}><Menu /></button>
            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <div className={`relative transition-all duration-300 ${showSearch ? "w-[500px]" : "w-[300px]"}`}>
                <input
                  type="text"
                  placeholder="Search for anything…"
                  className="h-10 w-full rounded-lg border bg-secondary px-3 py-2 text-sm pr-10"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setShowSearch(false)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center justify-center w-10">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              className="flex items-center space-x-3 text-left p-1 hover:bg-accent rounded-lg"
            >
              <img className="h-10 w-10 rounded-full" src={userImage} alt={userName} />
              <div className="text-sm hidden md:block">
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><LayoutDashboard className="h-4 w-4" />Home</Link>
                <Link href="/user/account/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><UserRound className="h-4 w-4" />Profile</Link>
                <Link href="/user/subscription" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><CreditCard className="h-4 w-4" />Subscription</Link>
                <Link href="/user/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"><Settings className="h-4 w-4" />Settings</Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
          <ChatSupportWidget />
        </main>
      </div>
    </div>
  );
}
