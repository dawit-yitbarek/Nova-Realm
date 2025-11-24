import React, { useState } from 'react';
import { PublicKey, Keypair } from '@solana/web3.js';
import checkAndRefreshToken from './CheckRegistration';
import api from './Api';

const recipient = "ABV6arHyPaFdcrXCAWT6L6BAHHwd4L1Fp6RFhr6EjXB1";
const memo = "Stake your solana.";
const label = "Stake your solana token to get more reward.";

const SolanaInvestmentMobile = (props) => {
  const [status, setStatus] = useState('');
  const [reference, setReference] = useState('');
  const [buttonState, setButtonState] = useState('stake');
  const [errorId, setErrorId] = useState(null)

  const handleInvest = () => {
    const ref = Keypair.generate().publicKey.toBase58();
    setReference(ref);
    setButtonState('confirm');
    setStatus('');
    const url = `solana:${recipient}?amount=${props.amount}&label=${label}&memo=${memo}&reference=${ref}`;
    window.open(url, '_blank');
  };

  const verifyTransaction = () => {
    setErrorId(props.taskId)
    setStatus('Verifying...');
    setButtonState('processing');
    tryVerify(0);
  };

  const tryVerify = async (retryCount) => {
    try {
      await checkAndRefreshToken();
      const token = localStorage.getItem("accessToken");

      const res = await api.post(
        `/verify-transaction`,
        {
          reference,
          amount: props.amount,
          fromPubkey: new PublicKey(props.publicKey),
          taskId: props.taskId,
          reward: props.reward,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus(res.data.message);
      setButtonState('stake');
      props.refresh()
    } catch (err) {
      if (retryCount < 2) {
        const nextRetry = retryCount + 1;
        setStatus(`Retrying... (${nextRetry}/3)`);
        setTimeout(() => tryVerify(nextRetry), 10000);
      } else {
        setStatus(err.response?.data?.message || '❌ Transaction Failed');
        setButtonState('stake');
        props.refresh()
      }
    }
  };

  const isDisabled = props.completed || !props.connected || !props.publicKey || buttonState === 'processing';

  return (
    <>
      <button
        disabled={isDisabled}
        onClick={buttonState === 'confirm' ? verifyTransaction : handleInvest}
        className={`w-full sm:w-auto text-center px-4 py-2 rounded-lg text-white font-semibold transition
  ${props.completed
            ? "bg-gray-600 cursor-not-allowed"
            : isDisabled
              ? "bg-gray-700 cursor-not-allowed"
              : buttonState === 'confirm'
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
          }`}

      >
        {props.completed
          ? 'Completed'
          : buttonState === 'stake'
            ? 'Stake'
            : buttonState === 'confirm'
              ? 'Confirm'
              : 'Processing...'}
      </button>

      {props.taskId === errorId && (
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
  );
};

export default SolanaInvestmentMobile;
