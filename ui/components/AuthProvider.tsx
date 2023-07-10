import { createContext, useContext } from "react";
import { useAuth } from "../auth";
import { IIUser } from "../auth/types";
import { AuthClient } from "@dfinity/auth-client";

interface IAuthContext {
  user: IIUser | null;
  loading: boolean;
  login: (doneHandler: (success: boolean) => any) => any;
  authClient: AuthClient | null;
  updateLocalUser: (user: IIUser) => void;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  loading: false,
  login: (doneHandler: (success: boolean) => {}) => {},
  authClient: null,
  updateLocalUser: (user: IIUser) => {},
});

export function AuthProvider(props: any) {
  const { value, children } = props;
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuthContext = () => useContext(AuthContext);
