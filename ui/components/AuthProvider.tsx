import { createContext, useContext } from "react";
import { ILoginResponse, useAuth } from "../auth";

import { AuthClient } from "@dfinity/auth-client";
import { IMerchant } from "../auth/types";

interface IAuthContext {
  merchant: IMerchant | null;
  loading: boolean;
  login: (doneHandler: (res: ILoginResponse) => any) => any;
  logout: () => boolean;
  authClient: AuthClient | null;
  updateMerchant: (merhchant: IMerchant) => Promise<boolean>;
}

const AuthContext = createContext<IAuthContext>({
  merchant: null,
  loading: false,
  login: (doneHandler: (res: ILoginResponse) => {}) => {},
  authClient: null,
  updateMerchant: async (merchant: IMerchant) => false,
  logout: () => false,
});

export function AuthProvider(props: any) {
  const { value, children } = props;
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuthContext = () => useContext(AuthContext);
