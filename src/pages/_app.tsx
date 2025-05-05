import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
<Toaster position="top-right" />

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      session={pageProps.session}
      refetchOnWindowFocus={true}
      refetchInterval={5 * 60} // optional, keep session fresh
    >
      <Component {...pageProps} />
    </SessionProvider>
  );
}
