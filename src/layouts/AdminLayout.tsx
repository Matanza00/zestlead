// // layouts/AdminLayout.js
// 'use client'

// import { useState } from 'react'
// import AdminSidebar from '@/components/AdminSidebar'
// import Navbar from '@/components/Navbar'

// export default function AdminLayout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   return (
//     <div className="flex min-h-screen bg-gray-100">

//       {/* Mobile: hamburger + backdrop + sliding drawer */}
//       <button
//         className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
//         onClick={() => setSidebarOpen(true)}
//       >
//         {/* menu icon */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-6 w-6 text-gray-700"
//           fill="none" viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//             d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
//         />
//       )}
      
//       {/* Sidebar (desktop: static, mobile: off-canvas) */}
//       <aside
//         className={`
//           fixed top-0 left-0 z-50 h-full w-64 bg-white border-r shadow-sm
//           transform transition-transform duration-200 ease-in-out
//           ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//           lg:translate-x-0 lg:static lg:shadow-none
//         `}
//       >
//         <AdminSidebar />
//       </aside>

//       {/* Main area */}
//       <div className="flex flex-col flex-1 lg:ml-64">
//         {/* Sticky top navbar */}
//         <Navbar />

//         {/* Page content */}
//         <main className="p-6 flex-1 overflow-y-auto">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }
