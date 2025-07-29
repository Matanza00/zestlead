import { SessionProvider } from "next-auth/react";
import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';
<Toaster position="top-right" />
import type { AppProps } from "next/app";

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
