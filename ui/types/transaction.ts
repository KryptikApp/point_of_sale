import { NonNullExpression } from "typescript";

export interface Transaction {
  amount: number;
  fee: number;
  ticker: string;
  to_owner: string;
  from_owner: string;
  transaction_hash: string | null;
  // whether the transaction is incoming or outgoing
  incoming: boolean;
}

export interface CkBtcTransaction extends Transaction {
  ledger_canister_id: string;
  from_subaccount: string;
  created_at_time: string | null;
  index: number;
  from_account: string;
  timestamp: number;
  block_hash: string | null;
  fee_collector_block: string | null;
  block_phash: string | null;
  to_subaccount: string;
  updated_at: string;
  to_account: string;
  raw: Record<string, unknown>; // The type of this can be modified as per the actual data
  kind: string;
  memo: string | null;
  ticker: "ckBtc";
}

export const defaultTx: Transaction = {
  amount: 0,
  fee: 0,
  ticker: "",
  to_owner: "",
  from_owner: "",
  transaction_hash: "",
  incoming: false,
};
