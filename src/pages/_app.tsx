import "~/styles/globals.css";
import type { AppProps } from "next/app";
// import { SessionProvider } from "next-auth/react";

import { UserProvider as SessionProvider } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
