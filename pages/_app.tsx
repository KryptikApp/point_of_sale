import "@/styles/globals.css";
import { AuthProvider } from "@/ui/components/AuthProvider";
import Layout from "@/ui/components/Layout";
import { ThemeProvider } from "@/ui/components/ThemeProvider";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
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
