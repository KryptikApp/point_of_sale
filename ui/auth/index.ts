import { HttpAgent, Actor, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory } from "../declarations/frontend";
import { _SERVICE } from "../declarations/frontend/frontend.did";
import { use, useEffect, useState } from "react";
import { IMerchant } from "./types";
import { makeMerchantBackendActor } from "../helpers/actors";

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
    const defaultAgent = Actor.agentOf(newMerchantActor);
    if (!defaultAgent || !defaultAgent.replaceIdentity) {
      console.error("Default agent not found. Cannot replace identity.");
      return { success: false, newMerchant: null };
    }
    console.log("Identity: ", identity);
    defaultAgent.replaceIdentity(identity);
    setMerchantActor(newMerchantActor);
    let newMerchant: IMerchant;
    // try to get the merchant
    try {
      const res = await newMerchantActor.get();
      newMerchant = res.data[0];
      newMerchant.id = identity.getPrincipal().toString();
      console.log("Merchant found: ", newMerchant);
    } catch (e) {
      console.warn("Merchant not initialized. Creating local version.");
      newMerchant = {
        id: identity.getPrincipal().toString(),
      };
    }
    setMerchant(newMerchant);
    return { success: true, newMerchant };
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
   * Update local and remote merchant data
   * @param newMerchant New values for the merchant
   * @returns true if the update was successful, false otherwise
   */
  async function updateMerchant(newMerchant: IMerchant): Promise<boolean> {
    if (!merchantActor) {
      console.error("Merchant actor not initialized. Cannot update merchant.");
      return false;
    }
    // format the merchant for persisisence
    const merchantToUpload = {
      businessName: newMerchant.businessName,
      phoneNumber: newMerchant.phoneNumber,
      phoneNotifications: newMerchant.phoneNotifications,
    };
    if (merchant) {
      newMerchant.id = merchant.id;
    }

    try {
      const res = await merchantActor.update(merchantToUpload);
      console.log("Merchant updated with result: ", res);
      setMerchant(newMerchant);
      return true;
    } catch (e) {
      console.error("Error updating merchant.");
      console.error(e);
      return false;
    }
  }
  useEffect(() => {
    init();
  }, []);

  return { authClient, merchant, login, loading, updateMerchant };
}
