import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import api from "./Api";
import CheckDevice from "./mobileOrDesktop";
import MobileConnectButton from "./mobileWalletConnect";
import { useWalletError } from "./WalletErrorContext";
import checkAndRefreshToken from "./CheckRegistration";
import SolanaInvestmentMobile from "./mobileWalletTransacion"
import { investmentTasksPlaceholder } from "./PlaceholderProvider";


const BackEndUrl = import.meta.env.VITE_BACKEND_URL;
const Rpc_Url = import.meta.env.VITE_RPC_URL;
const connection = new Connection(Rpc_Url, "confirmed");
const receiverAddress = "ABV6arHyPaFdcrXCAWT6L6BAHHwd4L1Fp6RFhr6EjXB1";

const SolanaInvestment = () => {
  const wallet = useWallet();
  const { error } = useWalletError();
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [completedTasks, setCompletedTasks] = useState(investmentTasksPlaceholder);
  const [incompleteTasks, setIncompleteTasks] = useState(investmentTasksPlaceholder);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [status, setStatus] = useState("");
  const [errorId, setErrorId] = useState(null);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    (async () => {
      const device = await CheckDevice();
      if (!device.desktop) {
        setDesktop(false);
        setPublicKey(device.address);
        setConnected(!!device.address);
      } else {
        setDesktop(true);
        setPublicKey(wallet.publicKey);
        setConnected(wallet.connected);
      }
    })();

    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`${BackEndUrl}/investment-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setCompletedTasks(response.data.completedTasks || []);
          setIncompleteTasks(response.data.incompleteTasks || []);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [wallet.connected, wallet.publicKey, refreshFlag]);

  const handleInvest = async (taskId, amount, reward) => {
    try {
      setErrorId(taskId);
      setLoadingTaskId(taskId);
      setStatus("Sending transaction...");

      if (!publicKey) {
        setStatus("Wallet not connected.");
        return;
      }

      const fromPubkey = new PublicKey(publicKey);
      const toPubkey = new PublicKey(receiverAddress);
      const lamports = amount * 1e9;

      const transaction = new Transaction().add(
        SystemProgram.transfer({ fromPubkey, toPubkey, lamports })
      );

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      transaction.feePayer = fromPubkey;
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      let signature;

      if (desktop) {
        // For desktop wallets using Wallet Adapter
        signature = await wallet.sendTransaction(transaction, connection);
      } else {
        // For mobile deep link wallets (like Phantom)
        if (!window.solana?.signAndSendTransaction) {
          setStatus("❌ Mobile wallet not available.");
          return;
        }

        const signedTx = await window.solana.signAndSendTransaction(transaction);
        signature = signedTx.signature;
      }

      // Confirm transaction
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      // Backend verification
      await checkAndRefreshToken();
      const token = localStorage.getItem("accessToken");

      const response = await api.post(
        `${BackEndUrl}/verify-transaction`,
        {
          signature,
          amount,
          fromPubkey: fromPubkey.toBase58(),
          taskId,
          reward,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus(response.data?.message);
    } catch (err) {
      console.error(err);
      setStatus(err.response?.data?.message || "❌ Transaction failed.");
    } finally {
      setRefreshFlag((prev) => prev + 1);
      setLoadingTaskId(null);
    }
  };



  const handleDisconnect = async () => {
    if (desktop) {
      try {
        setDisconnecting(true)
        await wallet.disconnect();
      } catch (err) {
        console.error("Error disconnecting wallet:", err);
      } finally {
        setDisconnecting(false)
      }
    } else {
      try {
        setDisconnecting(true)
        await checkAndRefreshToken()
        const accessToken = localStorage.getItem("accessToken");
        await api.post(`${BackEndUrl}/disconnect-wallet`, {}, { headers: { Authorization: `Bearer ${accessToken}`, }, });
      } catch (error) {
        console.log("error on disconnecting wallet for mobile ", error)
      } finally {
        setDisconnecting(false)
        setRefreshFlag((prev) => prev + 1);
      }
    }
  };

  const renderTaskCard = (task, isCompleted) => {
    return (
      <div
        key={task.id}
        className={`rounded-xl p-4 sm:p-5 mb-4 shadow-md border text-sm sm:text-base ${isCompleted
          ? "bg-gray-800 border-gray-700"
          : "bg-gray-850 border-purple-700"
          }`}
      >
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-white break-words">
            {task.title}
          </h3>
          {!isCompleted && (
            <span className="text-purple-300 font-medium text-sm sm:text-base">
              🎁 <strong>{task.reward_point} Points</strong>
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <span className="text-gray-300">
            {!isCompleted
              ? `Amount Required: ${task.amount_required} SOL`
              : `Reward Point: ${task.reward_point} `}
          </span>

          <div className="relative flex flex-col items-start sm:items-center w-full sm:w-fit">

            {desktop ?
              <>
                <button
                  onClick={() =>
                    handleInvest(task.id, task.amount_required, task.reward_point)
                  }
                  disabled={
                    !connected || !publicKey || loadingTaskId === task.id || isCompleted
                  }
                  className={`w-full sm:w-auto text-center ${isCompleted
                    ? "bg-gray-600 cursor-not-allowed"
                    : !connected || !publicKey
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    } px-4 py-2 rounded-lg text-white font-semibold transition`}
                >
                  {loadingTaskId === task.id
                    ? "Processing..."
                    : isCompleted
                      ? "Completed"
                      : "Stake"}
                </button>

                {task.id === errorId && !isCompleted && (
                  <p
                    className={`mt-1 text-xs ${status.includes("❌")
                      ? "text-red-400"
                      : "text-white"
                      }`}
                  >
                    {status}
                  </p>
                )}
              </>
              :
              <SolanaInvestmentMobile 
              amount={task.amount_required} 
              taskId={task.id} publicKey={publicKey} 
              connected={connected} 
              reward={task.reward_point} 
              completed={isCompleted}
              refresh={() => setRefreshFlag((prev) => prev + 1)}/>
            }

            {!connected && !isCompleted && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1 text-xs text-white bg-black bg-opacity-80 rounded shadow-lg z-10 whitespace-nowrap">
                Connect wallet to stake
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-16 border-t border-gray-800 rounded-md pt-10">
      <h2 className="text-3xl font-extrabold mb-6">💸 Staking Tasks</h2>
      <div className="p-4 sm:p-6 bg-gray-900 text-white">
        <div className="w-full max-w-2xl mx-auto">
          {incompleteTasks.length > 0 && (!connected || !publicKey ? (
            <div className="mb-6">
              {desktop ? <WalletMultiButton /> : <MobileConnectButton />}
              {error ? (
                <p className="text-sm text-red-500 px-3 py-2 rounded-md mt-2 text-center">
                  {error}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Connect your wallet to enable staking
                </p>
              )}
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-sm sm:text-md text-gray-300 mb-1">
                ✅ Wallet Connected
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                <p className="text-base sm:text-lg font-mono text-purple-400 break-all">
                  <abbr
                    title={desktop ? publicKey?.toBase58() : publicKey}
                    className="cursor-pointer no-underline"
                  >
                    {desktop ? publicKey?.toBase58().slice(0, 4) : publicKey?.slice(0, 4)}...
                    {desktop ? publicKey?.toBase58().slice(-4) : publicKey?.slice(-4)}
                  </abbr>
                </p>
                <button
                  disabled={disconnecting}
                  onClick={handleDisconnect}
                  className="text-red-400 hover:text-red-600"
                  title="Disconnect Wallet"
                >
                  {disconnecting ? 'Disconnecting...' :
                    <LogOut className="w-5 h-5" />
                  }
                </button>
              </div>
            </div>
          ))}

          {incompleteTasks.length === 0 && (
            <div className="text-center text-gray-400 mx-10">
              <p>No Staking tasks available at the moment 🚧</p>
            </div>
          )}

          {incompleteTasks.length > 0 && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                🕒 Incomplete Tasks
              </h2>
              {incompleteTasks.map((task) => renderTaskCard(task, false))}
            </>
          )}

          {completedTasks.length > 0 && (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mt-10 mb-4">
                ✅ Completed Staking Tasks
              </h2>
              {completedTasks.map((task) => renderTaskCard(task, true))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolanaInvestment;