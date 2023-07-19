import { IMerchant } from "@/ui/auth/types";
import { useAuthContext } from "@/ui/components/AuthProvider";
import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import VerticalSpace from "@/ui/components/VerticalSpace";
import { makeMerchantBackendActor } from "@/ui/helpers/actors";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CustomReceive() {
  const { merchant } = useAuthContext();
  const [slug, setSlug] = useState<string>("");
  const [tempMerchant, setTempMerchant] = useState<IMerchant | null>(null);
  const { primaryColor } = useThemeContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [paymentPageUrl, setPaymentPageUrl] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleGetMerchant(slugToCheck: string) {
    if (!slugToCheck) return;
    setLoading(true);
    const actor = makeMerchantBackendActor();
    const res = await actor.getMerchantBySlug(slugToCheck);
    if (res && res.data[0]) {
      const newMerchant: IMerchant = res.data[0];
      newMerchant.loggedIn = false;
      setTempMerchant(newMerchant);
    }
    setLoading(false);
    return merchant;
  }
  useEffect(() => {
    const newSlug = searchParams.get("to");
    if (!newSlug) {
      return;
    }
    setSlug(newSlug);
    handleGetMerchant(newSlug);
    const newPaymentPageUrl = `${window.location.origin}/pay/?to=${newSlug}`;
    setPaymentPageUrl(newPaymentPageUrl);
  }, [router.query]);
  return (
    <div>
      <VerticalSpace />
      {loading && (
        <div>
          <p className="text-gray-500 text-center">Finding Merchant...</p>
        </div>
      )}
      {!loading && tempMerchant && (
        <QRCode
          name={tempMerchant.businessName}
          text={tempMerchant.id}
          pageUrl={paymentPageUrl}
          color={primaryColor}
        />
      )}
      {!loading && !tempMerchant && (
        <p className="text-gray-500 text-center">
          👻 This slug is a ghost! No merchant found with slug: &apos;{slug}
          &apos;
        </p>
      )}
    </div>
  );
}
