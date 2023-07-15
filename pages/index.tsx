import { Inter } from "next/font/google";
import { makeHelloActor } from "@/ui/helpers/actors";

import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import { QUICKSTART_PROGRESS } from "@/ui/types/flow";
import { useState, useEffect } from "react";
import InputText from "@/ui/components/InputText";
import { useAuthContext } from "@/ui/components/AuthProvider";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ILoginResponse } from "@/ui/auth";

const inter = Inter({ subsets: ["latin"] });

export default function Index() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [progress, setProgress] = useState<QUICKSTART_PROGRESS>(
    QUICKSTART_PROGRESS.START
  );
  const { primaryColor } = useThemeContext();
  const { merchant, loading, login } = useAuthContext();
  const [serverMessage, setServerMessage] = useState<null | string>(null);
  const [businessName, setBusinessName] = useState("");

  function handleNewAddress(address: string) {
    setAddress(address);
    setProgress(QUICKSTART_PROGRESS.SHOW_QR_CODE);
  }

  function handleNewBusinessName(name: string) {
    setBusinessName(name);
    setProgress(QUICKSTART_PROGRESS.ENTER_ADDRESS);
  }

  function handleQuickStart() {
    setProgress(QUICKSTART_PROGRESS.ENTER_BUSINESS_NAME);
  }

  function handleLoginResponse({ success, newMerchant }: ILoginResponse) {
    if (!success) {
      toast.error("Login failed");
      return;
    }
    // if already has merchant, redirect to profile
    if (newMerchant) {
      router.push("/profile");
    }
    // else direct to creation flow
    else {
      router.push("/profile/update");
    }
  }

  async function handleLoginRequest() {
    console.log("LOGIN REQUEST...");
    await login(handleLoginResponse);
    console.log("LOGIN REQUEST DONE");
  }

  function handleBack() {
    switch (progress) {
      case QUICKSTART_PROGRESS.START:
        break;
      case QUICKSTART_PROGRESS.ENTER_BUSINESS_NAME:
        setProgress(QUICKSTART_PROGRESS.START);
        break;
      case QUICKSTART_PROGRESS.ENTER_ADDRESS:
        setProgress(QUICKSTART_PROGRESS.ENTER_BUSINESS_NAME);
        break;
      case QUICKSTART_PROGRESS.SHOW_QR_CODE:
        setProgress(QUICKSTART_PROGRESS.ENTER_ADDRESS);
        break;
      default:
        break;
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {progress === QUICKSTART_PROGRESS.START && (
        <div className="text-center flex-col space-y-2">
          <h1 className="text-3xl">Zap Pay</h1>
          <p className="text-gray-400">A simple way to accept payments.</p>
          <button
            className="w-full h-12 px-4 py-2 text-gray-900 bg-gray-200 rounded-lg text-2xl font-semibold"
            onClick={() => {
              handleLoginRequest();
            }}
          >
            Get Started
          </button>
          {/* login option */}
          <p
            className="text-gray-400 hover:cursor-pointer text-md"
            onClick={() => handleQuickStart()}
          >
            Quick Start
          </p>
        </div>
      )}
      {progress === QUICKSTART_PROGRESS.ENTER_BUSINESS_NAME && (
        <div>
          <InputText
            onDone={handleNewBusinessName}
            placeholder={"Business Name"}
            color={primaryColor}
          />
          <p className="text-gray-400">
            Enter the name of your business to get started.
          </p>
        </div>
      )}
      {progress === QUICKSTART_PROGRESS.ENTER_ADDRESS && (
        <div>
          <InputText
            onDone={handleNewAddress}
            placeholder={"Address"}
            color={primaryColor}
          />
          <p className="text-gray-400">
            This will generate a special code for your business.
          </p>
        </div>
      )}

      {progress === QUICKSTART_PROGRESS.SHOW_QR_CODE && (
        <QRCode text={address} color={primaryColor} name={businessName} />
      )}
      {serverMessage && (
        <p className="text-gray-400">Server message: {serverMessage}</p>
      )}
      {progress != QUICKSTART_PROGRESS.START && (
        <button
          className="w-full h-12 px-4 py-2 text-base text-gray-700 hover:text-yellow-500 rounded-lg focus:outline-none"
          onClick={handleBack}
        >
          Back
        </button>
      )}
    </div>
  );
}
