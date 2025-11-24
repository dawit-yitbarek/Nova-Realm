import { Connection, PublicKey } from '@solana/web3.js';
import config from '../config/index.js';

const connection = new Connection(config.RPC_URL, 'confirmed');
const RECEIVER_ADDRESS = config.WALLET_ADDRESS;

export async function verifySolanaTransaction({ signature, reference, amount }) {
    try {
        if (!signature && reference) {
            const refKey = new PublicKey(reference);
            const sigInfos = await connection.getSignaturesForAddress(refKey, { limit: 1 });
            if (sigInfos.length === 0) return { success: false, message: 'No transaction found for this reference' };
            signature = sigInfos[0].signature;
        }

        if (!signature) return { success: false, message: 'Missing signature or reference' };

        const tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0 });
        if (!tx) return { success: false, message: 'Transaction not found on-chain' };
        if (tx.meta?.err) return { success: false, message: 'Transaction failed on-chain' };

        const transferIx = tx.transaction.message.instructions.find((ix) => ix.parsed?.type === 'transfer' && ix.parsed?.info?.destination === RECEIVER_ADDRESS);
        if (!transferIx) return { success: false, message: 'No matching transfer instruction' };

        const lamports = transferIx.parsed.info.lamports;
        const sol = lamports / 1e9;
        if (sol < amount) return { success: false, message: 'Insufficient SOL sent' };

        return { success: true, message: 'Transaction verified', data: { from: transferIx.parsed.info.source, lamports } };
    } catch (err) {
        console.error('verifySolanaTransaction error', err.message);
        return { success: false, message: 'Server error verifying transaction' };
    };
};
