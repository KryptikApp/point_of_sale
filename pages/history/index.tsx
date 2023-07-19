import { useAuthContext } from "@/ui/components/AuthProvider";
import LoadingSpinner from "@/ui/components/LoadingSpinner";
import { useThemeContext } from "@/ui/components/ThemeProvider";
import TxOverview from "@/ui/components/TxOverview";
import { fetchCkBtcTransactions } from "@/ui/requests/transaction";
import { useEffect, useState } from "react";
import { AiOutlineRedo } from "react-icons/ai";

export default function History() {
  const { primaryColor } = useThemeContext();
  const { merchant, updateTxs, lastTxFetchTime, txs } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const ckBtcId = merchant?.id;

  async function getTxHistory() {
    if (!ckBtcId) return;
    // fetch tx history on load
    setLoading(true);
    const newTxs = await fetchCkBtcTransactions(ckBtcId);
    updateTxs(newTxs);
    setLoading(false);
  }
  async function handleManualRefresh() {
    if (loading) return;
    await getTxHistory();
  }
  useEffect(() => {
    // only fetch tx history if it hasn't been fetched yet
    if (!txs || (txs.length === 0 && lastTxFetchTime === null)) {
      getTxHistory();
    }
  }, []);
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl">Payments</h1>
        <div className="flex flex-row space-x-2">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Your recent transactions.
          </p>
          {loading && <LoadingSpinner />}
        </div>

        {lastTxFetchTime && (
          <div>
            <p className="text-gray-300 dark:text-gray-600 text-md inline">
              Last updated: {lastTxFetchTime.toLocaleString()}
            </p>
            <AiOutlineRedo
              className="inline pl-2 hover:cursor-pointer"
              onClick={() => handleManualRefresh()}
              size={25}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        {txs.map((tx) => (
          <TxOverview key={tx.transaction_hash} tx={tx} />
        ))}
      </div>
      {txs.length === 0 && !loading && (
        <div className="text-center">
          <p
            className="text-gray-900 dark:text-gray-100 text-xl foont-semibold mt-20"
            style={{ color: primaryColor }}
          >
            No transactions found.
          </p>
        </div>
      )}
    </div>
  );
}
