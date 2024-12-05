import { Connection, PublicKey } from '@solana/web3.js';

const HELIUS_RPC_URL = "https://mainnet.helius-rpc.com/?api-key=e4e7f06a-1e90-4628-8b07-d4f3c30fc5c9";
const TARGET_WALLET = new PublicKey("H7uDD9zj9ENdi5f3GtZ46JHgYrh4vjXw1WqSeoAz11Jk");

const connection = new Connection(HELIUS_RPC_URL);

export async function getWalletBalance(): Promise<number> {
  try {
    const balance = await connection.getBalance(TARGET_WALLET);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error("Error fetching balance:", error);
    return 0;
  }
}

export async function verifyHoldings(walletAddress: string): Promise<boolean> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance > 0; // Modify threshold as needed
  } catch (error) {
    console.error("Error verifying holdings:", error);
    return false;
  }
}

export async function subscribeToBalanceUpdates(
  callback: (balance: number) => void
) {
  return connection.onAccountChange(TARGET_WALLET, (account) => {
    callback(account.lamports / 1e9);
  });
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
