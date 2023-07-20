import toast from "react-hot-toast";
import { useThemeContext } from "./ThemeProvider";
import { useAuthContext } from "./AuthProvider";
import { Transaction } from "../types/transaction";
import { formatCkBtc, isTxCkBtc } from "../utils/tokens";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";

// props type
interface Props {
  tx: Transaction;
}

export default function TxOverview(props: Props) {
  const { tx } = { ...props };
  const { primaryColor } = useThemeContext();
  const handleCopy = () => {
    if (!tx.transaction_hash) {
      return;
    }
    navigator.clipboard.writeText(tx.transaction_hash);
    toast.success("Tx Hash copied to clipboard.");
  };
  // whether the tx is a ckbtc tx
  const isCkbtcTx = isTxCkBtc(tx);
  // format the amount to show accordingly
  const amountToShow = isCkbtcTx ? formatCkBtc(tx.amount) : tx.amount;
  return (
    <div className="rounded-lg border" style={{ borderColor: primaryColor }}>
      <div
        className="flex flex-col space-x-2 px-2 py-1 dark:bg-gray-700/20 bg-gray-200/20 hover:bg-gray-200/50 hover:dark:bg-gray-700/50 hover:cursor-pointer text-xl rounded-lg"
        onClick={() => handleCopy()}
      >
        <div className="flex flex-row">
          <div className="bg-gray-200/30 dark:bg-gray-700/30 rounded-lg p-2 h-fit my-auto">
            {tx.incoming ? (
              <AiOutlineArrowDown
                size={24}
                className="text-lg text-green-500 -rotate-45"
              />
            ) : (
              <AiOutlineArrowUp
                size={24}
                className="text-lg text-gray-500 rotate-45"
              />
            )}
          </div>
          <div className="flex flex-col ml-4">
            {tx.incoming ? (
              <p className="text-md text-gray-500">Received</p>
            ) : (
              <p className="text-md text-gray-500">Sent</p>
            )}
            <p className={`${tx.incoming ? "text-green-500" : "text-red-500"}`}>
              {amountToShow} {tx.ticker}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
