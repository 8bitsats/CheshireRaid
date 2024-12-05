import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { notifications } from './notifications';
import { formatters, validators } from './constants';

// Default RPC endpoint (devnet for development)
const DEFAULT_RPC = 'https://api.devnet.solana.com';

export class SolanaUtils {
  constructor(rpcUrl = DEFAULT_RPC) {
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  // Get wallet provider (Phantom)
  getProvider() {
    if ('solana' in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    throw new Error('Phantom wallet not found! Please install Phantom to continue.');
  }

  // Connect to wallet
  async connect(toast) {
    try {
      const provider = this.getProvider();
      const resp = await provider.connect();
      notifications.success.walletConnected(toast);
      return resp.publicKey.toString();
    } catch (error) {
      notifications.error.walletConnection(toast, error);
      throw error;
    }
  }

  // Disconnect wallet
  async disconnect(toast) {
    try {
      const provider = this.getProvider();
      await provider.disconnect();
      notifications.info.walletDisconnected(toast);
    } catch (error) {
      notifications.error.walletConnection(toast, error);
      throw error;
    }
  }

  // Get wallet balance
  async getBalance(address) {
    try {
      const publicKey = new PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching balance:', error);
      throw error;
    }
  }

  // Send SOL
  async sendSOL(recipientAddress, amount, toast) {
    try {
      if (!validators.isValidSolanaAddress(recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      const provider = this.getProvider();
      const fromPubkey = provider.publicKey;
      const toPubkey = new PublicKey(recipientAddress);
      
      notifications.info.processingTransaction(toast);

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // Sign and send transaction
      const signed = await provider.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signed.serialize());
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature);

      return {
        signature,
        amount: formatters.formatSOL(amount),
        recipient: recipientAddress,
      };
    } catch (error) {
      notifications.error.generic(toast, error);
      throw error;
    }
  }

  // Distribute rewards to multiple recipients
  async distributeRewards(recipients, toast) {
    try {
      const provider = this.getProvider();
      const fromPubkey = provider.publicKey;

      // Create transaction
      const transaction = new Transaction();

      // Add transfer instruction for each recipient
      recipients.forEach(({ address, amount }) => {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey: new PublicKey(address),
            lamports: amount * LAMPORTS_PER_SOL,
          })
        );
      });

      // Get latest blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      notifications.info.processingTransaction(toast);

      // Sign and send transaction
      const signed = await provider.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signed.serialize());
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature);

      return {
        signature,
        recipients: recipients.map(r => ({
          address: r.address,
          amount: formatters.formatSOL(r.amount),
        })),
      };
    } catch (error) {
      notifications.error.generic(toast, error);
      throw error;
    }
  }

  // Verify transaction
  async verifyTransaction(signature) {
    try {
      const transaction = await this.connection.getTransaction(signature);
      return {
        confirmed: transaction !== null,
        transaction,
      };
    } catch (error) {
      console.error('Error verifying transaction:', error);
      throw error;
    }
  }

  // Get transaction history
  async getTransactionHistory(address, limit = 10) {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await this.connection.getSignaturesForAddress(
        publicKey,
        { limit }
      );

      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await this.connection.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            timestamp: sig.blockTime,
            ...tx,
          };
        })
      );

      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  // Airdrop SOL (devnet only)
  async requestAirdrop(address, amount = 1) {
    try {
      const publicKey = new PublicKey(address);
      const signature = await this.connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await this.connection.confirmTransaction(signature);
      return signature;
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const solanaUtils = new SolanaUtils();
