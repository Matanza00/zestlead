// src/pages/user/index.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react'; // ✅ Use client-safe function

export default function UserIndex(props) {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const session = await getSession();
      if (session?.user?.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        router.replace('/user/dashboard');
      }
    };
    redirect();
  }, [router]);

  return null;
}
