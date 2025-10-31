// pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { SocketContext } from '@/contexts/SocketContext';

export default function App({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (bootedRef.current) return;
    bootedRef.current = true;

    // 👇 ensures /pages/api/socket.ts runs and attaches io to res.socket.server
    fetch('/api/socket').catch(() => {});

    // 👇 create one client-side connection (default path `/socket.io` matches your server)
    const sock = io({
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });
    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, []);

  return (
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus
      refetchInterval={5 * 60}
    >
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </SocketContext.Provider>
    </SessionProvider>
  );
}
