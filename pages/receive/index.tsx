import { useAuthContext } from "@/ui/components/AuthProvider";
import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import VerticalSpace from "@/ui/components/VerticalSpace";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePrinter } from "react-icons/ai";

export default function Receive() {
  const { merchant, loading } = useAuthContext();
  const router = useRouter();
  const { primaryColor } = useThemeContext();
  const [paymentPageUrl, setPaymentPageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!merchant) {
      router.push("/");
    }
    if (!merchant?.loggedIn) {
      return;
    }
    if (merchant.slug != undefined && merchant.slug != "") {
      const newPaymentPageUrl = `${window.location.origin}/pay/?to=${merchant?.slug}`;
      setPaymentPageUrl(newPaymentPageUrl);
    }
  }, [merchant, loading]);

  function handlePrint() {
    window.print();
  }
  return (
    <div>
      <VerticalSpace />
      {merchant?.id && merchant.loggedIn && (
        <div>
          {paymentPageUrl ? (
            <QRCode
              text={merchant?.id}
              color={primaryColor}
              name={merchant?.businessName}
              pageUrl={paymentPageUrl}
            />
          ) : (
            <QRCode
              text={merchant?.id}
              color={primaryColor}
              name={merchant?.businessName}
            />
          )}
          <div
            className="flex flex-row space-x-3 max-w-fit mx-auto hover:cursor-pointer dark:text-gray-200 text-gray-900 hover:font-semibold mt-4"
            onClick={() => handlePrint()}
          >
            <AiOutlinePrinter size={30} />
            <p className="text-lg my-auto">Print</p>
          </div>
        </div>
      )}
      {!merchant?.id && (
        <p className="text-red-500">Merchant ID not available.</p>
      )}
    </div>
  );
}
