// web worker for txData

import { Transaction, defaultTx } from "../types/transaction";
import { fetchCkBtcTransactions } from "../requests/transaction";

/**
 * Handles the polling of the ledger for new transactions
 * @param id ckbtc account id
 */
function handleTxPolling(id: string) {
  fetchCkBtcTransactions(id, 20).then((txs: Transaction[]) => {
    postMessage({ txs: txs });
  });
}

/**
 * This function receives the account id from the main thread and starts the request process
 */
onmessage = async (msg) => {
  // pull account id from message
  const id = msg.data.accountId;
  console.log("Tx data worker received account id: ", id);
  // run initial fetch
  handleTxPolling(id);
  // every 30 seconds, poll the ledger for new transactions
  // send response to main thread
  setInterval(() => {
    console.log("Polling for new transactions...");
    handleTxPolling(id);
  }, 30000);
};
