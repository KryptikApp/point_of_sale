import { useAuthContext } from "@/ui/components/AuthProvider";
import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function History() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl">Payments</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg">
        Your recent transactions.
      </p>
    </div>
  );
}
