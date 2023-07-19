import { createContext, useContext } from "react";
import { ILoginResponse, useAuth } from "../auth";

import { AuthClient } from "@dfinity/auth-client";
import { IMerchant } from "../auth/types";
import { Transaction } from "../types/transaction";
import { Agent } from "@dfinity/agent";

interface IAuthContext {
  merchant: IMerchant | null;
  agent: Agent | null;
  loading: boolean;
  login: (doneHandler: (res: ILoginResponse) => any) => any;
  logout: () => Promise<boolean>;
  authClient: AuthClient | null;
  updateMerchant: (merhchant: IMerchant) => Promise<boolean>;
  updateLocalMerchant: (merhchant: IMerchant) => any;
  txs: Transaction[];
  updateTxs: (txs: Transaction[]) => any;
  lastTxFetchTime: Date | null;
}

const AuthContext = createContext<IAuthContext>({
  merchant: null,
  agent: null,
  loading: false,
  login: (doneHandler: (res: ILoginResponse) => {}) => {},
  authClient: null,
  updateMerchant: async (merchant: IMerchant) => false,
  logout: async () => false,
  updateLocalMerchant: () => {},
  txs: [],
  updateTxs: () => {},
  lastTxFetchTime: null,
});

export function AuthProvider(props: any) {
  const { value, children } = props;
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuthContext = () => useContext(AuthContext);
