import { useAuthContext } from "@/ui/components/AuthProvider";
import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Receive() {
  const { merchant } = useAuthContext();
  const router = useRouter();
  const { primaryColor } = useThemeContext();
  useEffect(() => {
    if (!merchant) {
      router.push("/");
    }
  }, [merchant]);
  return (
    <div>
      {merchant?.id && <QRCode text={merchant?.id} color={primaryColor} />}
      {!merchant?.id && (
        <p className="text-red-500">Merchant ID not available.</p>
      )}
    </div>
  );
}
