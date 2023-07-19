import "@/styles/globals.css";
import { AuthProvider } from "@/ui/components/AuthProvider";
import Layout from "@/ui/components/Layout";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import { load, trackPageview } from "fathom-client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { Router } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  // Record a pageview when route changes
  Router.events.on("routeChangeComplete", (as, routeProps) => {
    if (!routeProps.shallow) {
      trackPageview();
    }
  });
  useEffect(() => {
    load("UECUDUKZ", {
      includedDomains: ["pay.kryptik.app"],
    });
  }, []);
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem={true}
      enableColorScheme={true}
      themes={["light", "dark"]}
    >
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </NextThemeProvider>
  );
}
