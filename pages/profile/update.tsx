// merchant profile page
import { useAuthContext } from "../../ui/components/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useThemeContext } from "../../ui/components/ThemeProvider";
import { useEffect, useState } from "react";
import InputText from "@/ui/components/InputText";
import { SETUP_PROGRESS } from "@/ui/types/flow";
import LoadingSpinner from "@/ui/components/LoadingSpinner";
import VerticalSpace from "@/ui/components/VerticalSpace";

export default function Index() {
  const { merchant, loading, login, updateMerchant } = useAuthContext();
  const router = useRouter();
  const [newBusinessname, setNewBusinessName] = useState(
    merchant?.businessName || "Business Name"
  );
  const [newPhoneNumber, setNewPhoneNumber] = useState(
    merchant?.phoneNumber || "Your Phone Number"
  );
  const [newPhoneNotification, setNewPhoneNotification] = useState<boolean>(
    merchant?.phoneNotifications || false
  );
  const [progress, setProgress] = useState<SETUP_PROGRESS>(
    SETUP_PROGRESS.ENTER_BUSINESS_NAME
  );
  const [loadingUpload, setLoadingUpload] = useState(false);
  const { primaryColor } = useThemeContext();

  useEffect(() => {
    if (!merchant) {
      console.warn("No merchant found. Redirecting to homepage.");
      router.push("/");
    }
  }, [merchant]);
  function handleBusinessNameDone(name: string) {
    if (!merchant) {
      toast.error("No merchant found");
      return;
    }
    setNewBusinessName(name);
    setProgress(SETUP_PROGRESS.ENTER_PHONE_NUMBER);
  }
  async function handlePhoneNumberDone(number: string) {
    if (!merchant) {
      toast.error("No merchant found");
      return;
    }
    setNewPhoneNumber(number);
    setNewPhoneNotification(true);
    setProgress(SETUP_PROGRESS.REVIEW);
  }
  function skipPhoneNumber() {
    if (!merchant) {
      toast.error("No merchant found");
      return;
    }
    const newMerchant = merchant;
    newMerchant.phoneNumber = "";
    setNewPhoneNumber("");
    setNewPhoneNotification(false);
    setProgress(SETUP_PROGRESS.REVIEW);
  }
  async function handleUpload() {
    if (!merchant) {
      toast.error("No merchant found");
      return;
    }
    setLoadingUpload(true);
    const newMerchant = merchant;
    newMerchant.businessName = newBusinessname;
    newMerchant.phoneNumber = newPhoneNumber;
    newMerchant.phoneNotifications = newPhoneNotification;
    const success = await updateMerchant(newMerchant);
    if (success) {
      toast.success("Profile updated");
      router.push("/profile");
      setLoadingUpload(false);
    } else {
      toast.error("Profile update failed");
      setLoadingUpload(false);
    }
  }
  return (
    <div className="mx-auto max-w-2xl">
      <VerticalSpace />
      {progress === SETUP_PROGRESS.ENTER_BUSINESS_NAME && (
        <InputText
          placeholder={newBusinessname}
          onDone={handleBusinessNameDone}
          color={primaryColor}
        />
      )}
      {progress === SETUP_PROGRESS.ENTER_PHONE_NUMBER && (
        <div>
          <InputText
            placeholder={newPhoneNumber}
            onDone={handlePhoneNumberDone}
            color={primaryColor}
          />
          <p className="dark:text-gray-500 text-gray-400 text-lg">
            Add your phone number to receive payment notifications.
          </p>
          <p
            className="dark:text-gray-500 text-gray-400 text-lg hover:font-bold underline hover:cursor-pointer"
            onClick={skipPhoneNumber}
          >
            Skip
          </p>
        </div>
      )}
      {progress === SETUP_PROGRESS.REVIEW && (
        <div>
          <p className="text-3xl font-semibold">Review Profile</p>
          <p className="text-md text-gray-500">Name</p>
          <p className="text-2xl">{newBusinessname}</p>
          <p className="text-md text-gray-500">Phone Number</p>
          <div className="p-2 rounded-md dark:bg-gray-700/30 bg-gray-200/30 w-fit text-2xl">
            {newPhoneNumber != "" ? newPhoneNumber : "None"}
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-4 flex flex-row space-x-2"
            onClick={handleUpload}
          >
            Confirm
            {loadingUpload && <LoadingSpinner />}
          </button>
        </div>
      )}
    </div>
  );
}
