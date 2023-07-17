import { KryptikFetch } from "../krytpikFetch";
import { CkBtcTransaction } from "../types/transaction";

/**
 * Fetches the ckBTC transactions for a given account.
 * @param id ckbtc account id
 * @param limit maximum number of transactions to fetch
 */
export async function fetchCkBtcTransactions(id: string, limit = 0) {
  const res = await KryptikFetch(
    `/ledgers/${process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER}/accounts/${id}/transactions?limit=${limit}`,
    {}
  );
  const transactions: CkBtcTransaction[] = await res.data;
  return transactions;
}
