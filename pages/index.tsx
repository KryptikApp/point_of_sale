import { Inter } from "next/font/google";
import { makeHelloActor } from "@/ui/helpers/actors";

import QRCode from "@/ui/components/QrCode";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import { SETUP_PROGRESS } from "@/ui/types/flow";
import { useState, useEffect } from "react";
import InputText from "@/ui/components/InputText";
import { useAuthContext } from "@/ui/components/AuthProvider";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function Index() {
  const [address, setAddress] = useState("");
  const [progress, setProgress] = useState<SETUP_PROGRESS>(
    SETUP_PROGRESS.START
  );
  const { primaryColor } = useThemeContext();
  const { user, loading, login } = useAuthContext();
  const [serverMessage, setServerMessage] = useState<null | string>(null);
  const [businessName, setBusinessName] = useState("");

  function handleNewAddress(address: string) {
    setAddress(address);
    setProgress(SETUP_PROGRESS.SHOW_QR_CODE);
  }

  function handleNewBusinessName(name: string) {
    setBusinessName(name);
    setProgress(SETUP_PROGRESS.ENTER_ADDRESS);
  }

  function handleGetStarted() {
    setProgress(SETUP_PROGRESS.ENTER_BUSINESS_NAME);
  }

  function handleLoginResponse(success: boolean) {
    if (success) {
      toast.success("Login successful");
    } else {
      toast.error("Login failed");
    }
  }

  async function handleLoginRequest() {
    console.log("LOGIN REQUEST...");
    await login(handleLoginResponse);
    console.log("LOGIN REQUEST DONE");
  }

  async function handleAddressConfirmation(address: string) {
    if (address == "") return;
    // create new actor
    try {
      const helloActor = await makeHelloActor();
      const res = await helloActor.greet(address);
      setServerMessage(res);
    } catch (e) {
      console.log(e);
    }
  }

  function handleBack() {
    switch (progress) {
      case SETUP_PROGRESS.START:
        break;
      case SETUP_PROGRESS.ENTER_BUSINESS_NAME:
        setProgress(SETUP_PROGRESS.START);
        break;
      case SETUP_PROGRESS.ENTER_ADDRESS:
        setProgress(SETUP_PROGRESS.ENTER_BUSINESS_NAME);
        break;
      case SETUP_PROGRESS.SHOW_QR_CODE:
        setProgress(SETUP_PROGRESS.ENTER_ADDRESS);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    console.log("RUNNING ON ADDY CHANGE");
    if (address == "") return;
    handleAddressConfirmation(address);
  }, [address]);

  return (
    <div className="mx-auto max-w-2xl">
      {progress === SETUP_PROGRESS.START && (
        <div className="text-center flex-col space-y-2">
          <h1 className="text-3xl">Zap Pay</h1>
          <p className="text-gray-400">A simple way to accept payments.</p>
          <button
            className="w-full h-12 px-4 py-2 text-base text-gray-900 bg-gray-200 rounded-lg"
            onClick={() => {
              handleGetStarted();
            }}
          >
            Get Started
          </button>
          {/* login option */}
          <p
            className="text-gray-400 hover:cursor-pointer text-xl"
            onClick={() => handleLoginRequest()}
          >
            Login For Full Service
          </p>
        </div>
      )}
      {progress === SETUP_PROGRESS.ENTER_BUSINESS_NAME && (
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
      {progress === SETUP_PROGRESS.ENTER_ADDRESS && (
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

      {progress === SETUP_PROGRESS.SHOW_QR_CODE && (
        <QRCode text={address} color={primaryColor} name={businessName} />
      )}
      {serverMessage && (
        <p className="text-gray-400">Server message: {serverMessage}</p>
      )}
      {progress != SETUP_PROGRESS.START && (
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
