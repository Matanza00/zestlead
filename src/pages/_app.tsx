import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { SocketContext } from '@/contexts/SocketContext'; // we'll create this

export default function App({ Component, pageProps }) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
  // Ensure this only runs on the client
  if (typeof window === 'undefined') return;

  const socketInstance = io(); // ❌ no custom path
  setSocket(socketInstance);

  return () => {
    socketInstance.disconnect();
  };
}, []);



  return (
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus={true}
      refetchInterval={5 * 60}
    >
      <SocketContext.Provider value={socket}>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </SocketContext.Provider>
    </SessionProvider>
  );
}
