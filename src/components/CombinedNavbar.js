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

/** Nav link with ZestLeads active styling */
const NavLink = ({ href, children, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      <span
        className={[
          "group flex items-center gap-2 py-2 px-3 rounded-lg transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#22c55e]/40",
          isActive
            ? "bg-sidebar-active-background/50 text-sidebar-active-foreground shadow-[inset_0_0_0_1px_rgba(34,197,94,.25)]"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        ].join(" ")}
      >
        <Icon
          className={[
            "h-5 w-5",
            isActive ? "text-sidebar-active-foreground" : "text-muted-foreground group-hover:text-foreground"
          ].join(" ")}
        />
        {children}
      </span>
    </Link>
  );
};

export default function CombinedNavSidebar({ children }) {
  const pathname = usePathname();
  const isLeadsIndex = pathname?.startsWith("/user/leads") || pathname === "/user/my-leads";
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

  // close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // load persisted sidebar state
  useEffect(() => {
    const s = typeof window !== "undefined" ? window.localStorage.getItem("sidebar-open") : null;
    if (s !== null) setSidebarOpen(s === "true");
    const l = typeof window !== "undefined" ? window.localStorage.getItem("sidebar-leads-open") : null;
    if (l !== null) setLeadsOpen(l === "true");
  }, []);

  // auto-close sidebar on route change (mobile)
  useEffect(() => {
    if (isSidebarOpen) setSidebarOpen(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") window.localStorage.setItem("sidebar-open", String(next));
      return next;
    });
  };

  const toggleLeads = () => {
    setLeadsOpen((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") window.localStorage.setItem("sidebar-leads-open", String(next));
      return next;
    });
  };

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      // TODO: hook up your search
    }, 300);
  }, []);

  return (
    <div className="flex w-full min-h-screen bg-background p-4 lg:p-2">
      {/* SIDEBAR */}
      <aside
        className={[
          "fixed top-4 left-4 z-40 w-64 h-[calc(100vh-2rem)] bg-card/95 backdrop-blur rounded-2xl shadow-sm border border-gray-100",
          "flex flex-col justify-between transition-transform duration-300",
          "lg:static lg:w-60 lg:h-[calc(100vh-3rem)] lg:shrink-0 lg:mr-2 lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        ].join(" ")}
      >
        <div className="px-5 pt-4 pb-2">
          {/* Brand */}
          <div className="flex items-center h-14 mb-2">
            <Link href="/" className="select-none">
              <span
                className={[
                  "text-[20px] font-semibold leading-[25px]",
                  "bg-[radial-gradient(135.64%_109.6%_at_-3.96%_130%,#82E15A_0%,#0A7894_100%)]",
                  "bg-clip-text text-transparent"
                ].join(" ")}
              >
                ZestLeads
              </span>
            </Link>
          </div>

          {/* Overview */}
          <nav className="space-y-1">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Overview</h3>
            <NavLink href="/user/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>

            {/* Leads group */}
            <button
              onClick={toggleLeads}
              className={[
                "w-full flex items-center gap-2 py-2 px-3 rounded-lg transition-colors",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isLeadsIndex ? "bg-sidebar-active-background/40 text-sidebar-active-foreground" : ""
              ].join(" ")}
            >
              <Users className="h-5 w-5" />
              <span className="flex-1 text-left">Leads</span>
              <ChevronDown className={["h-4 w-4 transition-transform", leadsOpen ? "rotate-180" : "rotate-0"].join(" ")} />
            </button>

            <div
              className={[
                "ml-2 mt-1 space-y-1 overflow-hidden transition-all duration-300",
                leadsOpen ? "max-h-40" : "max-h-0"
              ].join(" ")}
            >
              <NavLink href="/user/leads" icon={ShoppingCart}>
                <span className="pl-1">Buy</span>
              </NavLink>
              <NavLink href="/user/my-leads" icon={UserRound}>Owned</NavLink>
            </div>

            <NavLink href="/user/wishlist" icon={Heart}>Wishlist</NavLink>
          </nav>

          {/* Profile */}
          <nav className="space-y-1 mt-5">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Profile</h3>
            <NavLink href="/user/account/profile" icon={UserRound}>Profile</NavLink>
            <NavLink href="/user/subscription" icon={CreditCard}>Subscription</NavLink>
            
            <NavLink href="/user/activity" icon={Activity}>Activity</NavLink>
            <NavLink href="/user/settings" icon={Settings}>Settings</NavLink>
          </nav>

          {/* Support */}
          <nav className="space-y-1 mt-5">
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Support</h3>
            <NavLink href="/user/support/help" icon={HelpCircle}>Help & FAQ</NavLink>
            <NavLink href="/about" icon={Info}>About</NavLink>
          </nav>
        </div>

        {/* Promo */}
        <div className="p-5">
          <div className="bg-plan rounded-xl p-4 text-center text-primary-foreground shadow-sm">
            <h3 className="font-semibold text-sm mb-1">Upgrade your plan</h3>
            <p className="text-xs/5 opacity-90 mb-4">Get early access and discounts on every hot lead.</p>
            <Link
              href="/user/subscription"
              className="inline-flex items-center justify-center bg-white text-plan rounded-full px-4 py-2 text-sm font-medium hover:opacity-95"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Glassy header */}
        <header className="h-16 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 bg-card/90 backdrop-blur rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-accent text-muted-foreground"
              onClick={toggleSidebar}
              aria-label="Toggle Menu"
            >
              <Menu />
            </button>

            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <div className={`relative transition-all duration-300 ${showSearch ? "w-[520px]" : "w-[320px]"}`}>
                <input
                  type="text"
                  placeholder="Search leads, orders, settings…"
                  className="h-10 w-full rounded-xl border bg-secondary/60 backdrop-blur px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40"
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

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">
            <Link
              href="/user/notification"
              className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-accent text-muted-foreground"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {/* User menu */}
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowUserMenu((p) => !p)}
                className="flex items-center gap-2 text-left p-1 rounded-xl hover:bg-accent"
                aria-haspopup="menu"
                aria-expanded={showUserMenu}
              >
                <img className="h-9 w-9 rounded-full object-cover" src={userImage} alt={userName} />
                <div className="hidden md:block">
                  <p className="text-sm font-semibold leading-4">{userName}</p>
                  <p className="text-[11px] text-muted-foreground">{userEmail}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
              </button>

              {showUserMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                  role="menu"
                >
                  <Link href="/" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" role="menuitem">
                    <LayoutDashboard className="h-4 w-4" /> Home
                  </Link>
                  <Link href="/user/account/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" role="menuitem">
                    <UserRound className="h-4 w-4" /> Profile
                  </Link>
                  <Link href="/user/subscription" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" role="menuitem">
                    <CreditCard className="h-4 w-4" /> Subscription
                  </Link>
                  <Link href="/user/settings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50" role="menuitem">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
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
