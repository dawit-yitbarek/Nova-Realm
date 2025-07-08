import React, { useState } from "react";
import nacl from "tweetnacl";
import bs58 from "bs58";
import LoadingSpinner from "./LoadingSpinner";

const MobileConnectButton = () => {
  const [loading, setLoading] = useState(false);

  const connectViaDeepLink = () => {
    setLoading(true);

    const dappKeyPair = nacl.box.keyPair();
    localStorage.setItem("dapp_keypair", JSON.stringify({
      publicKey: Array.from(dappKeyPair.publicKey),
      secretKey: Array.from(dappKeyPair.secretKey),
    }));

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "mainnet-beta",
      app_url: window.location.origin,
      redirect_link: `${window.location.origin}/phantom-redirect`,
    });

    const url = `phantom://v1/connect?${params.toString()}`;
    window.location.href = url;
  };

  return (
   <button
      onClick={connectViaDeepLink}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-2 font-semibold rounded-md transition-colors 
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#512da8] hover:bg-[#6a3dc9]"} 
    text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#512da8]`}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  );

};

export default MobileConnectButton;
