import React, { useEffect, useMemo, useState, useContext } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@solana/wallet-adapter-react";
import api from "./Api";
import { WalletErrorContext } from "./WalletErrorContext";
import checkAndRefreshToken from "./CheckRegistration";
import CheckDevice from "./mobileOrDesktop";
const BackEndUrl = import.meta.env.VITE_BACKEND_URL;



// This component will handle the wallet context and the wallet address display
const WalletContextConsumer = ({ children }) => {
  const [error, setError] = useState(null);

  const { wallet, connected, publicKey, disconnect } = useWallet();

  const handleDisconnect = async () => {
    try {
      await checkAndRefreshToken()
      const accessToken = localStorage.getItem("accessToken");
      await api.post(`${BackEndUrl}/disconnect-wallet`, {}, { headers: { Authorization: `Bearer ${accessToken}`, }, });
      await disconnect();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      const device = await CheckDevice();

      if (device.desktop) {
        if (connected && publicKey) {
          const walletAddress = publicKey.toBase58();
          const name = wallet?.adapter?.name;

          try {
            await checkAndRefreshToken();
            const accessToken = localStorage.getItem("accessToken");
            const response = await api.post(`${BackEndUrl}/connect-wallet`, {
              address: walletAddress,
              walletName: name,
            }, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!response.data.success) {
              setError(response.data.message);
              await handleDisconnect();
              return;
            }

            setError(null);
          } catch (error) {
            setError("Failed to connect wallet");
            console.error("Error sending wallet address:", error);
          }
        }
      }
    })();
  }, [connected, publicKey]);


  return (
    <WalletErrorContext.Provider value={{ error, setError }}>
      {children}
    </WalletErrorContext.Provider>
  );
};


// This component will wrap the app in the necessary providers
const WalletProviderComponent = ({ children }) => {
  const endpoint = clusterApiUrl("mainnet-beta");
  const wallet = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallet} autoConnect>
        <WalletModalProvider>
          <WalletContextConsumer>
            {children}
          </WalletContextConsumer>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};


export default WalletProviderComponent;