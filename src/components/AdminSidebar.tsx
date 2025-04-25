// components/AdminSidebar.js
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  Users,
  FileText,
  CreditCard,
  FileEdit,
  FileCode,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: <Home size={18} /> },
  { label: "User Management", path: "/admin/users", icon: <Users size={18} /> },
  { label: "Lead Management", path: "/admin/leads", icon: <FileText size={18} /> },
  { label: "Referrals Management", path: "/admin/referrals", icon: <FileCode size={18} /> },
  { label: "Transaction Management", path: "/admin/transactions", icon: <CreditCard size={18} /> },
  { label: "Content Management", path: "/admin/content", icon: <FileEdit size={18} /> },
];

export default function AdminSidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 h-full bg-gray-900 text-white shadow-lg flex flex-col">
      <div className="text-xl font-bold px-6 py-4 border-b border-gray-700">
        Admin Panel
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {menuItems.map(({ label, path, icon }) => (
            <li key={path}>
              <Link
                href={path}
                className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition-colors ${
                    router.pathname === path ? "bg-gray-800" : ""
                }`}
                >
                  {icon}
                  <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
