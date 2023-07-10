import { AgentOptions } from "http";
import {
  createActor as createHelloActor,
  canisterId as helloCanisterId,
} from "../declarations/hello";

export const makeActor = (
  canisterId: string,
  createActor: any,
  agentOptions?: AgentOptions
) => {
  return createActor(canisterId, {
    agentOptions: {
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
