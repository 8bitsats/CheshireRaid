import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { solanaApi } from '../utils/api';

export function useWallet() {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Initialize wallet state
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Check if wallet is already connected
  const checkWalletConnection = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const resp = await window.solana.connect({ onlyIfTrusted: true });
        if (resp.publicKey) {
          const publicKey = resp.publicKey.toString();
          setWallet({
            publicKey,
            isConnected: true
          });
          await fetchBalance(publicKey);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet balance
  const fetchBalance = async (publicKey) => {
    try {
      const balanceData = await solanaApi.checkBalance(publicKey);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: 'Error fetching balance',
        description: error.message || 'Unable to fetch wallet balance',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Connect wallet
  const connect = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: 'Phantom wallet not found',
          description: 'Please install Phantom wallet to continue',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const resp = await window.solana.connect();
      const publicKey = resp.publicKey.toString();

      setWallet({
        publicKey,
        isConnected: true
      });

      await fetchBalance(publicKey);

      toast({
        title: 'Wallet connected',
        description: 'Your Phantom wallet has been connected successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: 'Connection failed',
        description: error.message || 'Failed to connect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Disconnect wallet
  const disconnect = useCallback(() => {
    try {
      if (window.solana) {
        window.solana.disconnect();
      }
      setWallet(null);
      setBalance(null);
      toast({
        title: 'Wallet disconnected',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: 'Error disconnecting',
        description: error.message || 'Failed to disconnect wallet',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Listen for account changes
  useEffect(() => {
    if (window.solana) {
      window.solana.on('accountChanged', async () => {
        // Refresh connection when account changes
        await checkWalletConnection();
      });
    }

    return () => {
      if (window.solana) {
        window.solana.removeAllListeners('accountChanged');
      }
    };
  }, []);

  // Auto refresh balance periodically if connected
  useEffect(() => {
    let intervalId;

    if (wallet?.isConnected) {
      intervalId = setInterval(() => {
        fetchBalance(wallet.publicKey);
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [wallet?.isConnected, wallet?.publicKey]);

  return {
    wallet,
    balance,
    loading,
    connect,
    disconnect,
    refreshBalance: () => wallet?.publicKey && fetchBalance(wallet.publicKey),
  };
}
