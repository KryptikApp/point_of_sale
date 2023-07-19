import IdPill from "@/ui/components/IdPill";
import InputText from "@/ui/components/InputText";
import LoadingSpinner from "@/ui/components/LoadingSpinner";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import VerticalSpace from "@/ui/components/VerticalSpace";
import KryptikScanner from "@/ui/components/kryptikScanner";
import { PAYMENT_PROGRESS } from "@/ui/types/flow";
import { isValidPrincipal } from "@/ui/utils/identity";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillCheckCircle } from "react-icons/ai";
import { IcrcLedgerCanister } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";
import { convertToBigInt } from "@/ui/utils/numbers";
import { getBalance, makeCkBtcLedger } from "@/ui/canisters/CkBtcLedger";
import { useAuthContext } from "@/ui/components/AuthProvider";

export default function Send() {
  const [showScanner, setShowScanner] = useState(false);
  const [toAddy, setToAddy] = useState("");
  const [amount, setAmount] = useState(0);
  const [ticker, setTicker] = useState("ckBtc");
  const [progress, setProgress] = useState<PAYMENT_PROGRESS>(
    PAYMENT_PROGRESS.START
  );
  const [balance, setBalance] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState(25);
  const [loadingSend, setLoadingSend] = useState(false);
  const { primaryColor } = useThemeContext();
  const { merchant, agent } = useAuthContext();
  const [ledgerCanister, setLedgerCanister] =
    useState<IcrcLedgerCanister | null>(null);
  async function handleSend() {
    if (!ledgerCanister) {
      toast.error("Ledger not connected");
      return;
    }
    setLoadingSend(true);
    try {
      const amountBigInt = convertToBigInt(amount);
      const res = await ledgerCanister.transfer({
        to: {
          owner: Principal.fromText(toAddy),
          subaccount: [],
        },
        amount: amountBigInt,
      });
      // ensure we get a response
      if (!res) {
        throw new Error("No response from ledger");
      }
      setProgressPercent(100);
      setProgress(PAYMENT_PROGRESS.DONE);
    } catch (e) {
      console.error(e);
      toast.error("Error sending payment");
    }
    setLoadingSend(false);
  }

  function toggleScanner() {
    setShowScanner(!showScanner);
  }

  function handleNewAddress(text: string) {
    if (!text) return;
    setShowScanner(false);
    const isValid = isValidPrincipal(text);
    if (!isValid) {
      toast.error("Invalid address");
      return;
    }
    setToAddy(text);
    setProgress(PAYMENT_PROGRESS.ENTER_AMOUNT);
    setProgressPercent(50);
    setShowScanner(false);
  }

  function validateAmount(text: string): { valid: boolean; amountNum: number } {
    if (!text) {
      toast.error("Undefined amount");
      return { valid: false, amountNum: 0 };
    }
    let amountNum: number = 0;
    try {
      amountNum = parseFloat(text);
      if (Number.isNaN(amountNum)) {
        throw new Error("NaN");
      }
      if (amountNum <= 0) {
        toast.error("Amount must be greater than 0");
        return { valid: false, amountNum: 0 };
      }
      if (balance != null && amountNum > balance) {
        toast.error("Insufficient balance");
        return { valid: false, amountNum: 0 };
      }
    } catch (e) {
      toast.error("Invalid amount");
      return { valid: false, amountNum: 0 };
    }
    return { valid: true, amountNum: amountNum };
  }

  function handleNewAmount(text: string) {
    if (!text) return;
    const { valid, amountNum } = validateAmount(text);
    if (!valid) return;
    setAmount(amountNum);
    setProgress(PAYMENT_PROGRESS.REVIEW);
    setProgressPercent(75);
  }

  function handleBack() {
    switch (progress) {
      case PAYMENT_PROGRESS.ENTER_RECEIVER:
        setProgress(PAYMENT_PROGRESS.ENTER_AMOUNT);
        setProgressPercent(25);
        break;
      case PAYMENT_PROGRESS.ENTER_AMOUNT:
        setProgress(PAYMENT_PROGRESS.START);
        setProgressPercent(25);
        break;
      case PAYMENT_PROGRESS.REVIEW:
        setProgress(PAYMENT_PROGRESS.ENTER_AMOUNT);
        setProgressPercent(75);
        break;
      case PAYMENT_PROGRESS.DONE:
        setProgress(PAYMENT_PROGRESS.START);
        setProgressPercent(25);
        break;
      default:
        break;
    }
  }

  async function handleGetBalance(ledgerCanisterToUse: IcrcLedgerCanister) {
    if (!merchant?.id) {
      return;
    }
    try {
      const newBalance = await getBalance(ledgerCanisterToUse, merchant.id);
      const newBalanceNum = Number(newBalance.toString());
      console.log("Balance Value:", newBalanceNum);
      setBalance(newBalanceNum);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!agent) return;
    // ledger not available on client
    if (process.env.NEXT_PUBLIC_APP_MODE == "dev") {
      return;
    }
    try {
      const newLedger = makeCkBtcLedger(agent);
      setLedgerCanister(newLedger);
      handleGetBalance(newLedger);
    } catch (e) {
      console.warn(e);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <VerticalSpace />
      <div>
        {progress != PAYMENT_PROGRESS.DONE && (
          <div className="flex flex-row space-x-3 mb-2">
            <h1 className="text-2xl font-bold">Send</h1>
            <img src="/tokens/ckBtc.svg" className="w-8 h-8 my-auto" />
          </div>
        )}
        {progress === PAYMENT_PROGRESS.DONE && (
          <div className="flex flex-row space-x-3">
            <h1 className="text-2xl font-bold">Payment Sent</h1>
            <AiFillCheckCircle size={28} className="text-green-400 my-auto" />
          </div>
        )}
        <div className="max-w-full bg-gray-200 dark:bg-[#141414] rounded-full h-2 mt-2">
          <div
            id="progressBar"
            className="h-2 rounded-full text-gray-700"
            style={{
              width: `${progressPercent}%`,
              maxWidth: `100%`,
              paddingLeft: "2%",
              backgroundColor: primaryColor,
            }}
          >
            {/* {progressPercent > 5 ? `${progressPercent.toFixed(2)}%` : ""} */}
          </div>
        </div>
      </div>

      {progress === PAYMENT_PROGRESS.START && (
        <div>
          <InputText
            color={primaryColor}
            onDone={handleNewAddress}
            placeholder="To Address"
          />
          <p className="dark:text-gray-500 text-gray-400 text-lg">
            Add recipient. Must be a valid ckBtc address.
          </p>
          <p
            className="dark:text-gray-500 text-gray-400 text-lg hover:font-bold underline hover:cursor-pointer"
            onClick={() => toggleScanner()}
          >
            Scan
          </p>
          <KryptikScanner onScan={handleNewAddress} show={showScanner} />
        </div>
      )}
      {progress === PAYMENT_PROGRESS.ENTER_AMOUNT && (
        <div>
          <InputText
            color={primaryColor}
            onDone={handleNewAmount}
            placeholder="Amount"
          />
          <p className="dark:text-gray-500 text-gray-400 text-lg">
            Add amount. Must be greater than 0.
          </p>
        </div>
      )}
      {progress === PAYMENT_PROGRESS.REVIEW && (
        <div>
          <p className="text-3xl font-semibold">Review Transfer</p>
          <p className="text-md text-gray-500">To</p>
          <IdPill id={toAddy} />
          <p className="text-md text-gray-500">Amount</p>
          <p className="text-2xl">
            {amount}
            {ticker}
          </p>
          <button
            className="bg-blue-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-md mt-4 flex flex-row space-x-2"
            style={{ backgroundColor: primaryColor }}
            onClick={handleSend}
          >
            Confirm
            {loadingSend && <LoadingSpinner />}
          </button>
        </div>
      )}
      {progress === PAYMENT_PROGRESS.DONE && (
        <div className="mt-2">
          <p className="text-center text-xl">
            Your transaction has been sent to the network. It may take a few
            minutes to finalize.
          </p>
        </div>
      )}

      {progress != PAYMENT_PROGRESS.START && (
        <button
          className="w-full h-12 px-4 py-2 text-base text-gray-700 hover:text-green-500 rounded-lg focus:outline-none"
          onClick={handleBack}
        >
          Back
        </button>
      )}
    </div>
  );
}
