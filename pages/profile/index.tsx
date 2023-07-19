// merchant profile page
import IdPill from "@/ui/components/IdPill";
import { useAuthContext } from "../../ui/components/AuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PhoneNumberPill from "@/ui/components/PhoneNumberPill";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import { AiOutlineEdit } from "react-icons/ai";
import VerticalSpace from "@/ui/components/VerticalSpace";
import toast from "react-hot-toast";

export default function Profile() {
  const { merchant, loading, login, logout } = useAuthContext();
  const { primaryColor } = useThemeContext();
  const [paymentPageUrl, setPaymentPageUrl] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    if (!merchant || !merchant.loggedIn) {
      console.warn("No authenticated merchant found. Redirecting to homepage.");
      router.push("/");
    }
    const newPaymentPageUrl = `${window.location.origin}/receive/${merchant?.slug}`;
    setPaymentPageUrl(newPaymentPageUrl);
  }, [merchant]);

  function handleEditRequest() {
    router.push("/profile/update");
  }

  function handleReceiveRequest() {
    router.push("/receive");
  }

  async function handleLogoutRequest() {
    try {
      const success = await logout();
      if (success) {
        router.push("/");
        return;
      } else {
        throw new Error("Unable to logout");
      }
    } catch (e) {
      toast.error("Unable to logout");
      console.error("Unable to logout.");
    }
  }

  function handleCopySlug() {
    navigator.clipboard.writeText(paymentPageUrl);
    toast.success("Copied payment page to clipboard");
  }

  return (
    <div className="mx-auto max-w-xl">
      <VerticalSpace />
      <div className="bg-gradient-to-r from-gray-300/20 to-gray-200/30 dark:from-gray-600/20 dark:to-gray-700/30 border border-gray-200 dark:border-gray-700 rounded-xl pb-2">
        <div
          className="py-2 dark:bg-gray-800/20 rounded-tl-xl rounded-tr-xl px-2 mb-2 flex flex-row"
          style={{ backgroundColor: primaryColor }}
        >
          <h1 className="text-3xl font-semibold">Profile</h1>
          <div className="flex-grow text-right text-gray-500 my-auto hover:cursor-pointer">
            <div
              className="float-right px-1 py-1 rounded-lg bg-gray-100/20 dark:bg-gray-900/20 w-fit hover:border text-white"
              onClick={() => handleEditRequest()}
            >
              <AiOutlineEdit size={24} className="text-lg" />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-2 px-1">
          <IdPill id={merchant?.id || ""} />
          <p className="text-md text-gray-500">Name</p>
          <p className="text-2xl">{merchant?.businessName}</p>
          <p className="text-md text-gray-500">Phone Number</p>
          <PhoneNumberPill number={merchant?.phoneNumber || ""} />
        </div>
      </div>
      <p
        className="text-xl hover:cursor-pointer text-center mt-4"
        style={{ color: primaryColor }}
        onClick={() => handleReceiveRequest()}
      >
        Receive Payments
      </p>
      <p
        className="text-lg hover:cursor-pointer text-center mt-4 dark:text-gray-600 text-gray-300 mt-2"
        onClick={() => handleLogoutRequest()}
      >
        Logout
      </p>
    </div>
  );
}
