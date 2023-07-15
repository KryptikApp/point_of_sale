import { AgentOptions } from "http";
import {
  createActor as createHelloActor,
  canisterId as helloCanisterId,
} from "../declarations/hello";

import {
  createActor as createMerchantBackendActor,
  canisterId as merchantBackendCanisterId,
} from "../declarations/merchant_backend";

export const makeActor = (
  canisterId: string,
  createActor: any,
  agentOptions?: AgentOptions
) => {
  return createActor(canisterId, {
    agentOptions: {
      ...agentOptions, // custom agent options
      host: process.env.NEXT_PUBLIC_IC_HOST,
    },
  });
};

export function makeHelloActor() {
  return makeActor(helloCanisterId, createHelloActor);
}

export function makeIdentityActor() {
  return makeActor(helloCanisterId, createHelloActor);
}

// export function makeLedgerActor(agent:HttpAgent) {
//   return makeActor(
//     process.env.NEXT_PUBLIC_CANISTER_ID_CKBTC_LEDGER,
//     agent
//   );
// }

export function makeMerchantBackendActor(agentOptions?: AgentOptions) {
  return makeActor(
    merchantBackendCanisterId,
    createMerchantBackendActor,
    agentOptions
  );
}
