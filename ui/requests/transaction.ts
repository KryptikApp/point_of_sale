import { KryptikFetch } from "../krytpikFetch";

export type CkBtcTransaction = {
  ledger_canister_id: string;
  from_subaccount: string;
  created_at_time: string | null;
  index: number;
  from_account: string;
  timestamp: number;
  block_hash: string | null;
  to_owner: string;
  fee_collector_block: string | null;
  block_phash: string | null;
  to_subaccount: string;
  updated_at: string;
  transaction_hash: string | null;
  to_account: string;
  raw: Record<string, unknown>; // The type of this can be modified as per the actual data
  kind: string;
  memo: string | null;
  amount: number;
  fee: number;
  from_owner: string;
};

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
