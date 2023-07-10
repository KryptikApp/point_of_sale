import { HttpAgent, Actor, Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { idlFactory } from "../declarations/frontend";
import { _SERVICE } from "../declarations/frontend/frontend.did";
import { use, useEffect, useState } from "react";
import { IIUser } from "./types";

export function useAuth() {
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  // user
  const [user, setUser] = useState<IIUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleAuthenticated(authClient: AuthClient | null) {
    if (!authClient) {
      console.error("Auth client not provided. Cannot handle authenticated.");
      return;
    }
    const identity: Identity = authClient.getIdentity();
    // uncomment below to create new agent with identity
    // const agent = new HttpAgent({ identity });
    const newUser: IIUser = {
      id: identity.getPrincipal().toString(),
    };
    setUser(newUser);
  }

  async function init() {
    setLoading(true);
    const newAuthClient: AuthClient = await AuthClient.create();
    if (await newAuthClient.isAuthenticated()) {
      handleAuthenticated(newAuthClient);
    }
    setLoading(false);
    return newAuthClient;
  }

  async function login(doneHandler: (success: boolean) => void) {
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
        doneHandler(false);
        return;
      }
    }
    if (!authClientToUse) {
      console.error("Auth client not initialized. Cannot login.");
      doneHandler(false);
      return;
    }
    setLoading(true);
    // use local internet identity when testing on local device
    if (process.env.NEXT_PUBLIC_APP_MODE == "dev") {
      await authClientToUse.login({
        onSuccess: async () => {
          setLoading(false);
          await handleAuthenticated(authClientToUse);
          doneHandler(true);
        },
        identityProvider:
          "http://127.0.0.1:4943/?canisterId=aovwi-4maaa-aaaaa-qaagq-cai",
      });
    } else {
      await authClientToUse.login({
        onSuccess: async () => {
          setLoading(false);
          await handleAuthenticated(authClientToUse);
          doneHandler(true);
        },
      });
    }

    setLoading(false);
  }

  function updateLocalUser(newUser: IIUser) {
    setUser(newUser);
  }
  useEffect(() => {
    init();
  }, []);

  return { authClient, user, login, loading, updateLocalUser };
}
