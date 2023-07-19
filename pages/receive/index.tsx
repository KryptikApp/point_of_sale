import { useAuthContext } from "@/ui/components/AuthProvider";
import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import VerticalSpace from "@/ui/components/VerticalSpace";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Receive() {
  const { merchant } = useAuthContext();
  const router = useRouter();
  const { primaryColor } = useThemeContext();
  const [paymentPageUrl, setPaymentPageUrl] = useState<string>("");
  useEffect(() => {
    if (!merchant) {
      router.push("/");
    }
    const newPaymentPageUrl = `${window.location.origin}/receive/${merchant?.slug}`;
    setPaymentPageUrl(newPaymentPageUrl);
  }, [merchant]);
  return (
    <div>
      <VerticalSpace />
      {merchant?.id && (
        <div>
          <QRCode
            text={merchant?.id}
            color={primaryColor}
            name={merchant?.businessName}
            pageUrl={paymentPageUrl}
          />
        </div>
      )}
      {!merchant?.id && (
        <p className="text-red-500">Merchant ID not available.</p>
      )}
    </div>
  );
}
