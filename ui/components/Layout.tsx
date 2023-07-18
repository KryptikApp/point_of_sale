import Head from "next/head";
import { Toaster } from "react-hot-toast";
import ColorPicker from "./ColorPicker";
import Menu from "./Nav/Menu";
import Navbar from "./Nav/Navbar";

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
        <Navbar />
        {/* bottom center color picker */}
        <div className="relative h-[5vh]">
          <div className="fixed bottom-10 inset-x-0 max-w-max mx-auto">
            <ColorPicker />
          </div>
        </div>
        <div className="min-h-[10vh] md:min-h-[4vh]" />
        {children}
        <div className="min-h-[10vh] md:min-h-0"></div>
        <Toaster />
      </main>
    </>
  );
}
