import React, { createContext, useContext } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useTwitterAuth } from '../hooks/useTwitterAuth';
import { useRaids } from '../hooks/useRaids';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Initialize hooks
  const {
    wallet,
    balance,
    loading: walletLoading,
    connect: connectWallet,
    disconnect: disconnectWallet,
    refreshBalance,
  } = useWallet();

  const {
    isAuthenticated: isTwitterAuthed,
    userInfo: twitterUser,
    loading: twitterLoading,
    authenticate: connectTwitter,
    verifyActions: verifyTwitterActions,
    getTweetMetrics,
    refreshAuthStatus: refreshTwitterAuth,
  } = useTwitterAuth();

  const {
    activeRaids,
    createdRaids,
    participatedRaids,
    userStats,
    loading: raidsLoading,
    createRaid,
    participateInRaid,
    refreshRaids,
    refreshUserRaids,
    refreshStats,
  } = useRaids();

  // Combine loading states
  const isLoading = walletLoading || twitterLoading || raidsLoading;

  // Combine all authentication states
  const isFullyAuthenticated = wallet?.isConnected && isTwitterAuthed;

  // Global refresh function
  const refreshAll = async () => {
    await Promise.all([
      refreshBalance(),
      refreshTwitterAuth(),
      refreshRaids(),
      refreshUserRaids(),
      refreshStats(),
    ]);
  };

  const value = {
    // Wallet state and functions
    wallet,
    balance,
    connectWallet,
    disconnectWallet,
    refreshBalance,

    // Twitter state and functions
    isTwitterAuthed,
    twitterUser,
    connectTwitter,
    verifyTwitterActions,
    getTweetMetrics,
    refreshTwitterAuth,

    // Raids state and functions
    activeRaids,
    createdRaids,
    participatedRaids,
    userStats,
    createRaid,
    participateInRaid,
    refreshRaids,
    refreshUserRaids,
    refreshStats,

    // Global state and functions
    isLoading,
    isFullyAuthenticated,
    refreshAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Custom hook for authentication requirements
export function useRequireAuth() {
  const { wallet, isTwitterAuthed, connectWallet, connectTwitter } = useApp();

  const authenticate = async () => {
    if (!wallet?.isConnected) {
      await connectWallet();
    }
    if (!isTwitterAuthed) {
      await connectTwitter();
    }
  };

  return {
    isAuthenticated: wallet?.isConnected && isTwitterAuthed,
    authenticate,
    wallet,
    isTwitterAuthed,
  };
}

// Custom hook for raid creation requirements
export function useRaidCreation() {
  const { balance, createRaid } = useApp();
  const { isAuthenticated, authenticate } = useRequireAuth();

  const createRaidWithAuth = async (raidData) => {
    if (!isAuthenticated) {
      await authenticate();
    }

    const totalCost = raidData.rewardAmount * raidData.maxParticipants;
    if (balance < totalCost) {
      throw new Error(`Insufficient balance. Required: ${totalCost} SOL`);
    }

    return createRaid(raidData);
  };

  return {
    createRaid: createRaidWithAuth,
    balance,
    isAuthenticated,
  };
}

// Custom hook for raid participation requirements
export function useRaidParticipation() {
  const { participateInRaid, verifyTwitterActions } = useApp();
  const { isAuthenticated, authenticate } = useRequireAuth();

  const participateWithAuth = async (raidId) => {
    if (!isAuthenticated) {
      await authenticate();
    }

    return participateInRaid(raidId);
  };

  return {
    participateInRaid: participateWithAuth,
    verifyTwitterActions,
    isAuthenticated,
  };
}
