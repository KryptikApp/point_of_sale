import { Agent, HttpAgent } from "@dfinity/agent";
import { IcrcLedgerCanister } from "@dfinity/ledger";
import { Principal } from "@dfinity/principal";

export function makeCkBtcLedger(agent: Agent) {
  if (!process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER)
    throw new Error("Missing CANISTER_ID_CKBTC_LEDGER");
  const ledgerCanister = IcrcLedgerCanister.create({
    agent,
    canisterId: Principal.fromText(
      process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER
    ),
  });
  return ledgerCanister;
}

export async function getBalance(
  ledgerCanister: IcrcLedgerCanister,
  addy: string
) {
  const balance = await ledgerCanister.balance({
    owner: Principal.fromText(addy),
    certified: false,
  });
  return balance;
}
