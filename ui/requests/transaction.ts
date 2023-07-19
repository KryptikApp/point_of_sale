import { API_IC } from "../constants/explorers";
import { KryptikFetch } from "../krytpikFetch";
import { CkBtcTransaction } from "../types/transaction";

/**
 * Fetches the ckBTC transactions for a given account.
 * @param id ckbtc account id
 * @param limit maximum number of transactions to fetch, defaults to 10
 */
export async function fetchCkBtcTransactions(id: string, limit = 10) {
  const res = await KryptikFetch(
    `${API_IC}/ledgers/${process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER}/accounts/${id}/transactions?limit=${limit}`,
    {}
  );
  const transactions: CkBtcTransaction[] = await res.data.data;
  // add ticker to each transaction
  transactions.forEach((transaction) => {
    transaction.ticker = "ckBtc";
    transaction.incoming = transaction.to_account === id;
  });
  return transactions;
}
