import "~/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {
  console.log("pageProps", pageProps);
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
