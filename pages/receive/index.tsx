import { useAuthContext } from "@/ui/components/AuthProvider";
import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Receive() {
  const { merchant } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!merchant) {
      router.push("/");
    }
  }, [merchant]);
  return (
    <div>
      {merchant?.id && <QRCode text={merchant?.id} />}
      {!merchant?.id && (
        <p className="text-red-500">Merchant ID not available.</p>
      )}
    </div>
  );
}
