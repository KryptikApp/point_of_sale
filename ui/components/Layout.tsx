import Head from "next/head";
import { Toaster } from "react-hot-toast";
import ColorPicker from "./ColorPicker";

// TODO: Update to support dynamic headers
export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <title>Payments</title>
        <meta name="description" content="Crypto made simple." />
        <link rel="icon" href="/icon.ico" />
      </Head>
      <Toaster />

      <main
        className={`
        px-2`}
      >
        {/* top right color picker */}
        <div className="relative h-[10vh]">
          <div className="fixed right-2 md:right-4">
            <ColorPicker />
          </div>
        </div>
        {children}
        <div className="min-h-[10vh] md:min-h-0"></div>
        <Toaster />
      </main>
    </>
  );
}
