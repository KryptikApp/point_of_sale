import IdPill from "@/ui/components/IdPill";
import InputText from "@/ui/components/InputText";
import LoadingSpinner from "@/ui/components/LoadingSpinner";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import KryptikScanner from "@/ui/components/kryptikScanner";
import { PAYMENT_PROGRESS } from "@/ui/types/flow";
import { isValidPrincipal } from "@/ui/utils/identity";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Send() {
  const [showScanner, setShowScanner] = useState(false);
  const [toAddy, setToAddy] = useState("");
  const [amount, setAmount] = useState(0);
  const [ticker, setTicker] = useState("ckBtc");
  const [progress, setProgress] = useState<PAYMENT_PROGRESS>(
    PAYMENT_PROGRESS.START
  );
  const [loadingSend, setLoadingSend] = useState(false);
  const { primaryColor } = useThemeContext();

  async function handleSend() {
    setLoadingSend(true);
    try {
    } catch (e) {
      console.error(e);
      toast.error("Error sending payment");
    }
    setLoadingSend(false);
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
  }

  function validateAmount(text: string): { valid: boolean; amountNum: number } {
    if (!text) {
      toast.error("Undefined amount");
      return { valid: false, amountNum: 0 };
    }
    let amountNum: number = 0;
    try {
      amountNum = parseFloat(text);
      if (amountNum <= 0) {
        toast.error("Amount must be greater than 0");
        return { valid: false, amountNum: 0 };
      }
    } catch (e) {
      toast.error("Invalid amount");
      return { valid: false, amountNum: 0 };
    }
    setProgress(PAYMENT_PROGRESS.REVIEW);
    return { valid: false, amountNum: amountNum };
  }

  function handleNewAmount(text: string) {
    if (!text) return;
    const { valid, amountNum } = validateAmount(text);
    if (!valid) return;
    setAmount(amountNum);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Send</h1>
      {progress === PAYMENT_PROGRESS.START && (
        <InputText
          color={primaryColor}
          onDone={handleNewAddress}
          placeholder="To Address"
        />
      )}
      {progress === PAYMENT_PROGRESS.ENTER_AMOUNT && (
        <InputText
          color={primaryColor}
          onDone={handleNewAmount}
          placeholder="Amount"
        />
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
      <KryptikScanner onScan={handleNewAddress} show={showScanner} />
    </div>
  );
}
