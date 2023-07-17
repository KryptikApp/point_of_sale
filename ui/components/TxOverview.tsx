import toast from "react-hot-toast";
import { useThemeContext } from "./ThemeProvider";
import { useAuthContext } from "./AuthProvider";
import { Transaction } from "../types/transaction";

// props type
interface Props {
  tx: Transaction;
}

export default function TxOverview(props: Props) {
  const { tx } = { ...props };
  const { merchant } = useAuthContext();
  const { primaryColor } = useThemeContext();
  const handleCopy = () => {
    toast.success("Tx Hash copied to clipboard.");
  };
  return (
    <div
      className="hover:opacity-100 opacity-20 rounded-lg"
      style={{ borderColor: primaryColor }}
    >
      <div
        className="flex flex-row space-x-2 px-2 py-1 dark:bg-gray-700/20 bg-gray-200/20 hover:cursor-pointer text-xl"
        onClick={() => handleCopy()}
      >
        <p>{tx.from_owner}</p>
        <p>
          {tx.amount} {tx.ticker}
        </p>
      </div>
    </div>
  );
}
