import { Actor, Agent, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { _SERVICE } from "../declarations/frontend/frontend.did";
import { useEffect, useRef, useState } from "react";
import { IMerchant } from "./types";
import { makeMerchantBackendActor } from "../helpers/actors";
import { removeAllSpaces } from "../utils/text";
import { Transaction } from "../types/transaction";
import { toast } from "react-hot-toast";
import { formatCkBtc, isTxCkBtc } from "../utils/tokens";

export interface ILoginResponse {
  success: boolean;
  newMerchant: IMerchant | null;
}

export function useAuth() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  // user
  const [merchant, setMerchant] = useState<IMerchant | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [merchantActor, setMerchantActor] = useState<any | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [lastTxFetchTime, setLastTxFetchTime] = useState<Date | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const txDataWorker = useRef<Worker>();

  /**
   * Handle authenticated response
   * @param authClient new auth client to use for initialization
   * @returns true if authenticated, false if not
   */
  async function handleAuthenticated(
    authClient: AuthClient | null
  ): Promise<ILoginResponse> {
    if (!authClient) {
      console.error("Auth client not provided. Cannot handle authenticated.");
      return { success: false, newMerchant: null };
    }
    const identity: Identity = authClient.getIdentity();
    // create a new actor to communicate with mertchant backend
    const newMerchantActor = makeMerchantBackendActor();
    const defaultAgent: Agent | undefined = Actor.agentOf(newMerchantActor);
    if (!defaultAgent || !defaultAgent.replaceIdentity) {
      console.error("Default agent not found. Cannot replace identity.");
      return { success: false, newMerchant: null };
    }
    defaultAgent.replaceIdentity(identity);
    setAgent(defaultAgent);
    setMerchantActor(newMerchantActor);
    let newMerchant: IMerchant;
    // try to get the merchant
    try {
      const res = await newMerchantActor.get();
      newMerchant = res.data[0];
      newMerchant.id = identity.getPrincipal().toString();
      newMerchant.loggedIn = true;
      console.log("Merchant found: ", newMerchant);
    } catch (e) {
      console.warn("Merchant not initialized. Creating local version.");
      newMerchant = {
        id: identity.getPrincipal().toString(),
        loggedIn: true,
      };
    }
    // clear and initialize data workers
    clearDataWorkers();
    initDataWorkers(newMerchant.id);
    setMerchant(newMerchant);
    return { success: true, newMerchant };
  }

  /**
   * Start data workers
   * @param accountId ckBtc account id
   */
  function initDataWorkers(accountId: string) {
    // init tx data worker
    txDataWorker.current = new Worker(
      new URL("../workers/txDataWorker.ts", import.meta.url)
    );
    txDataWorker.current.postMessage({ accountId: accountId });
    txDataWorker.current.onmessage = (msg) => {
      handleTxDataMsg(msg);
    };
  }

  /**
   * Initialize the auth client
   */
  async function init() {
    setLoading(true);
    const newAuthClient: AuthClient = await AuthClient.create();
    if (await newAuthClient.isAuthenticated()) {
      handleAuthenticated(newAuthClient);
    }
    setAuthClient(newAuthClient);
    setLoading(false);
    return newAuthClient;
  }

  /**
   * Handle message from tx data worker
   * @param msg message event
   */
  function handleTxDataMsg(msg: MessageEvent) {
    // pull txs from message
    const newTxs: Transaction[] = msg.data.txs;
    console.log("Polling Result: ", newTxs);
    const lastTx = newTxs[newTxs.length - 1];
    // try to only notify if the tx is new
    if (lastTx.created_at_time) {
      const lastTxTime = new Date(lastTx.created_at_time);
      // only notify if the tx is newer than five minutes
      if (lastTxTime.getTime() > new Date().getTime() - 5 * 60 * 1000) {
        notifyClient(lastTx);
      }
    } else {
      notifyClient(lastTx);
    }
    setLastTxFetchTime(new Date());
    setTxs(newTxs);
  }

  function notifyClient(tx: Transaction) {
    let msg = "";
    const isCkBtc = isTxCkBtc(tx);
    const formattedAmount: string = isCkBtc
      ? formatCkBtc(tx.amount)
      : tx.amount.toString();
    if (tx.incoming) {
      msg = `Incoming transaction of ${formattedAmount} ${tx.ticker}`;
    } else {
      msg = `Outgoing transaction of ${formattedAmount} ${tx.ticker}`;
    }
    toast.success(msg, { duration: 5000, icon: "💰" });
    // play sound
    const audio = new Audio("../sounds/txChime.mp3");
    audio.play();
  }

  /**
   * Clear data workers
   */
  function clearDataWorkers() {
    if (txDataWorker.current) {
      txDataWorker.current.terminate();
      txDataWorker.current = undefined;
    }
  }

  /**
   * Login with internet identity
   * @param doneHandler method to call when login is done
   */
  async function login(doneHandler: (res: ILoginResponse) => void) {
    let authClientToUse: AuthClient | null = authClient;
    if (!authClientToUse) {
      // this case should not happen
      // we initialize the authClient in the init function on startup
      console.warn("Auth client not initialized. Initializing now.");
      try {
        authClientToUse = await init();
      } catch (e) {
        console.error("Error initializing auth client");
        console.error(e);
        doneHandler({ success: false, newMerchant: null });
        return;
      }
    }
    if (!authClientToUse) {
      console.error("Auth client not initialized. Cannot login.");
      doneHandler({ success: false, newMerchant: null });
      return;
    }
    setLoading(true);
    // use local internet identity when testing on local device
    if (process.env.NEXT_PUBLIC_APP_MODE == "dev") {
      await authClientToUse.login({
        onSuccess: async () => {
          setLoading(false);
          const authResult = await handleAuthenticated(authClientToUse);
          doneHandler(authResult);
        },
        identityProvider: `${process.env.NEXT_PUBLIC_IC_HOST}/?canisterId=${process.env.NEXT_PUBLIC_CANISTER_ID_Internet_Identity}`,
      });
    } else {
      await authClientToUse.login({
        onSuccess: async () => {
          setLoading(false);
          const res = await handleAuthenticated(authClientToUse);
          doneHandler(res);
        },
      });
    }

    setLoading(false);
  }

  /**
   * Logout the current user
   * @returns true if logout was successful, false otherwise
   */
  async function logout(): Promise<boolean> {
    let success = false;
    try {
      await authClient?.logout();
      success = true;
    } catch (e) {
      // pass for now
    }
    setMerchant(null);
    setLoading(false);
    setAuthClient(null);
    setMerchantActor(null);
    setAgent(null);
    // clear tx data worker
    clearDataWorkers();
    return success;
  }

  /**
   * Update local and remote merchant data
   * @param newMerchant New values for the merchant
   * @returns true if the update was successful, false otherwise
   */
  async function updateMerchant(newMerchant: IMerchant): Promise<boolean> {
    if (!merchantActor) {
      console.error("Merchant actor not initialized. Cannot update merchant.");
      return false;
    }
    // format slug
    let slugToUpload = "";
    if (merchant?.businessName) {
      slugToUpload = removeAllSpaces(merchant?.businessName);
    }
    // format the merchant for persistence
    const merchantToUpload = {
      businessName: newMerchant.businessName,
      phoneNumber: newMerchant.phoneNumber,
      phoneNotifications: newMerchant.phoneNotifications,
      slug: slugToUpload,
      id: newMerchant.id,
    };
    if (merchant) {
      newMerchant.id = merchant.id;
    }
    console.log("Trying to upload the following merchant:");
    console.log(newMerchant);
    try {
      const res = await merchantActor.update(merchantToUpload);
      console.log("Merchant updated with result: ", res);
      newMerchant.loggedIn = true;
      if (res.data[0] && res.data[0].slug) {
        newMerchant.slug = res.data[0].slug;
      }
      setMerchant(newMerchant);
      return true;
    } catch (e) {
      console.error("Error updating merchant.");
      console.error(e);
      return false;
    }
  }
  /**
   * Updates the local state with new transactions and current time
   * @param newTxs new transactions to update the local state with
   */
  function updateTxs(newTxs: Transaction[]) {
    setTxs(newTxs);
    setLastTxFetchTime(new Date());
  }

  function updateLocalMerchant(newMerchant: IMerchant) {
    // clear old tx data workers
    clearDataWorkers();
    // init new tx data workers
    initDataWorkers(newMerchant.id);
    // update local merchant
    setMerchant(newMerchant);
    // reset auth client and backend connector which are linked to identity
    setMerchantActor(null);
    setAuthClient(null);
    setAgent(null);
  }

  useEffect(() => {
    init();
  }, []);

  return {
    agent,
    authClient,
    merchant,
    login,
    loading,
    updateMerchant,
    logout,
    setMerchant,
    txs,
    lastTxFetchTime,
    updateLocalMerchant,
    updateTxs,
  };
}
