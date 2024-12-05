import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

// Default toast configurations
const DEFAULT_TOAST_CONFIG = {
  duration: 5000,
  isClosable: true,
  position: 'top-right',
};

// Success toast configurations
const SUCCESS_CONFIG = {
  ...DEFAULT_TOAST_CONFIG,
  status: 'success',
};

// Error toast configurations
const ERROR_CONFIG = {
  ...DEFAULT_TOAST_CONFIG,
  status: 'error',
};

// Warning toast configurations
const WARNING_CONFIG = {
  ...DEFAULT_TOAST_CONFIG,
  status: 'warning',
};

// Info toast configurations
const INFO_CONFIG = {
  ...DEFAULT_TOAST_CONFIG,
  status: 'info',
};

export const notifications = {
  // Success notifications
  success: {
    walletConnected: (toast) => {
      toast({
        title: 'Wallet Connected',
        description: SUCCESS_MESSAGES.WALLET_CONNECTED,
        ...SUCCESS_CONFIG,
      });
    },

    twitterConnected: (toast) => {
      toast({
        title: 'Twitter Connected',
        description: SUCCESS_MESSAGES.TWITTER_CONNECTED,
        ...SUCCESS_CONFIG,
      });
    },

    raidCreated: (toast) => {
      toast({
        title: 'Raid Created',
        description: SUCCESS_MESSAGES.RAID_CREATED,
        ...SUCCESS_CONFIG,
      });
    },

    raidJoined: (toast) => {
      toast({
        title: 'Raid Joined',
        description: SUCCESS_MESSAGES.RAID_JOINED,
        ...SUCCESS_CONFIG,
      });
    },

    rewardsDistributed: (toast) => {
      toast({
        title: 'Rewards Distributed',
        description: SUCCESS_MESSAGES.REWARDS_DISTRIBUTED,
        ...SUCCESS_CONFIG,
      });
    },
  },

  // Error notifications
  error: {
    walletConnection: (toast, error) => {
      toast({
        title: 'Wallet Connection Error',
        description: error?.message || ERROR_MESSAGES.WALLET_NOT_CONNECTED,
        ...ERROR_CONFIG,
      });
    },

    twitterConnection: (toast, error) => {
      toast({
        title: 'Twitter Connection Error',
        description: error?.message || ERROR_MESSAGES.TWITTER_NOT_CONNECTED,
        ...ERROR_CONFIG,
      });
    },

    insufficientBalance: (toast, required) => {
      toast({
        title: 'Insufficient Balance',
        description: `Required balance: ${required} SOL`,
        ...ERROR_CONFIG,
      });
    },

    raidCreation: (toast, error) => {
      toast({
        title: 'Raid Creation Error',
        description: error?.message || 'Failed to create raid',
        ...ERROR_CONFIG,
      });
    },

    raidParticipation: (toast, error) => {
      toast({
        title: 'Raid Participation Error',
        description: error?.message || 'Failed to join raid',
        ...ERROR_CONFIG,
      });
    },

    generic: (toast, error) => {
      toast({
        title: 'Error',
        description: error?.message || 'An unexpected error occurred',
        ...ERROR_CONFIG,
      });
    },
  },

  // Warning notifications
  warning: {
    walletRequired: (toast) => {
      toast({
        title: 'Wallet Required',
        description: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
        ...WARNING_CONFIG,
      });
    },

    twitterRequired: (toast) => {
      toast({
        title: 'Twitter Required',
        description: ERROR_MESSAGES.TWITTER_NOT_CONNECTED,
        ...WARNING_CONFIG,
      });
    },

    raidFull: (toast) => {
      toast({
        title: 'Raid Full',
        description: ERROR_MESSAGES.RAID_FULL,
        ...WARNING_CONFIG,
      });
    },

    raidExpired: (toast) => {
      toast({
        title: 'Raid Expired',
        description: ERROR_MESSAGES.RAID_EXPIRED,
        ...WARNING_CONFIG,
      });
    },

    alreadyParticipated: (toast) => {
      toast({
        title: 'Already Participated',
        description: ERROR_MESSAGES.ALREADY_PARTICIPATED,
        ...WARNING_CONFIG,
      });
    },
  },

  // Info notifications
  info: {
    walletDisconnected: (toast) => {
      toast({
        title: 'Wallet Disconnected',
        description: 'Your wallet has been disconnected',
        ...INFO_CONFIG,
      });
    },

    processingTransaction: (toast) => {
      toast({
        title: 'Processing Transaction',
        description: 'Please wait while we process your transaction',
        ...INFO_CONFIG,
      });
    },

    verifyingActions: (toast) => {
      toast({
        title: 'Verifying Actions',
        description: 'Please wait while we verify your Twitter actions',
        ...INFO_CONFIG,
      });
    },
  },
};

// Error handler utility
export const handleError = (error, toast) => {
  console.error('Error:', error);

  if (error.message.includes('insufficient balance')) {
    notifications.error.insufficientBalance(toast);
  } else if (error.message.includes('wallet')) {
    notifications.error.walletConnection(toast, error);
  } else if (error.message.includes('twitter')) {
    notifications.error.twitterConnection(toast, error);
  } else {
    notifications.error.generic(toast, error);
  }
};
