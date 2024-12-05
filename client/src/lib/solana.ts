import { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import bs58 from 'bs58';
import { env } from './env';

const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=e4e7f06a-1e90-4628-8b07-d4f3c30fc5c9";
const TARGET_WALLET = new PublicKey("H7uDD9zj9ENdi5f3GtZ46JHgYrh4vjXw1WqSeoAz11Jk");

const connection = new Connection(HELIUS_RPC_URL);

let payoutWallet: Keypair | null = null;

export function initializePayoutWallet(privateKeyString: string) {
  try {
    const privateKeyBytes = bs58.decode(privateKeyString);
    payoutWallet = Keypair.fromSecretKey(privateKeyBytes);
    return true;
  } catch (error) {
    console.error('Error initializing payout wallet:', error);
    return false;
  }
}

export async function getWalletBalance(): Promise<number> {
  try {
    const balance = await connection.getBalance(TARGET_WALLET);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return 0;
  }
}

export async function verifyHoldings(walletAddress: string): Promise<boolean> {
  try {
    const pubKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(pubKey);
    return balance > 0;
  } catch (error) {
    console.error("Error verifying holdings:", error);
    return false;
  }
}

export async function subscribeToBalanceUpdates(
  callback: (balance: number) => void
) {
  try {
    const id = connection.onAccountChange(
      TARGET_WALLET,
      (accountInfo) => {
        callback(accountInfo.lamports / 1e9);
      },
      'confirmed'
    );

    return () => {
      connection.removeAccountChangeListener(id);
    };
  } catch (error) {
    console.error("Error subscribing to balance updates:", error);
    return () => {};
  }
}

export async function getPayoutStats(): Promise<{
  totalPaidOut: number;
  remainingToEarn: number;
}> {
  try {
    const response = await fetch('/api/payout-stats');
    const stats = await response.json();
    return {
      totalPaidOut: stats.totalPaidOut / 1e9, // Convert from lamports to SOL
      remainingToEarn: stats.remainingToEarn / 1e9
    };
  } catch (error) {
    console.error("Error fetching payout stats:", error);
    return {
      totalPaidOut: 0,
      remainingToEarn: 0
    };
  }
}

export async function sendPayout(
  recipientAddress: string,
  amountInSOL: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    if (!payoutWallet) {
      return { success: false, error: 'Payout wallet not initialized' };
    }

    const recipient = new PublicKey(recipientAddress);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payoutWallet.publicKey,
        toPubkey: recipient,
        lamports: amountInSOL * 1e9 // Convert SOL to lamports
      })
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [payoutWallet]
    );

    return { success: true, txHash: signature };
  } catch (error) {
    console.error('Error sending payout:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function getPayoutWalletBalance(): Promise<number> {
  try {
    if (!payoutWallet) {
      return 0;
    }
    const balance = await connection.getBalance(payoutWallet.publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching payout wallet balance:", error);
    return 0;
  }
}
