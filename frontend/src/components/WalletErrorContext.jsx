import { createContext, useContext } from "react";

export const WalletErrorContext = createContext({
  error: null,
  setError: () => {}
});

export const useWalletError = () => useContext(WalletErrorContext);
