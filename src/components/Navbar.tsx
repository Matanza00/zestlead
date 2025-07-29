// 'use client';
// import { signOut, useSession } from "next-auth/react";
// import Image from "next/image";


// export default function Navbar() {
//   const { data: session } = useSession();

//   return (
//     <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
//       <h1 className="text-xl font-bold text-gray-800">ZestLeads</h1>

//       {session?.user ? (
//         <div className="flex items-center gap-3">
//           {session.user.image && (
//             <Image
//               src={session.user.image}
//               alt="User Avatar"
//               width={32}
//               height={32}
//               className="rounded-full"
//             />
//           )}
//           <div className="text-sm">
//             <p className="font-semibold">{session.user.name}</p>
//             <p className="text-gray-500 text-xs">{session.user.email}</p>
//           </div>
//           <button
//             onClick={() => signOut()}
//             className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         <a href="/auth/login" className="text-blue-600 font-medium hover:underline">
//           Login
//         </a>
//       )}
//     </nav>
//   );
// }
