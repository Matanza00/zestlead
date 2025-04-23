// layouts/AdminLayout.js
import AdminSidebar from "@/components/AdminSidebar";
import Navbar from "@/components/Navbar"; // Shared Navbar for now

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar (shared for now) */}
        <Navbar />

        {/* Page content */}
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
