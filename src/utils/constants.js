// Raid Status
export const RAID_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  EXPIRED: 'expired',
};

// Raid Requirements
export const RAID_REQUIREMENTS = {
  LIKE: 'like',
  RETWEET: 'retweet',
  FOLLOW: 'follow',
  COMMENT: 'comment',
};

// Raid Limits
export const RAID_LIMITS = {
  MIN_REWARD: 0.01, // Minimum reward in SOL
  MAX_REWARD: 10,   // Maximum reward in SOL
  MIN_PARTICIPANTS: 1,
  MAX_PARTICIPANTS: 1000,
  MIN_DURATION: 1,   // hours
  MAX_DURATION: 168, // 7 days in hours
};

// Time Constants
export const TIME = {
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TWITTER_AUTH_REDIRECT: 'twitter_auth_redirect',
  WALLET_AUTO_CONNECT: 'wallet_auto_connect',
};

// API Endpoints
export const API_ENDPOINTS = {
  BASE: '/api',
  RAIDS: '/raids',
  AUTH: '/auth',
  TWITTER: '/twitter',
  SOLANA: '/solana',
};

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  TWITTER_NOT_CONNECTED: 'Please connect your Twitter account to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance to create raid',
  RAID_FULL: 'This raid has reached its maximum participants',
  RAID_EXPIRED: 'This raid has expired',
  ALREADY_PARTICIPATED: 'You have already participated in this raid',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully',
  TWITTER_CONNECTED: 'Twitter account connected successfully',
  RAID_CREATED: 'Raid created successfully',
  RAID_JOINED: 'Successfully joined the raid',
  REWARDS_DISTRIBUTED: 'Rewards distributed successfully',
};

// Format Functions
export const formatters = {
  // Format SOL amount with appropriate decimals
  formatSOL: (amount) => {
    return parseFloat(amount).toFixed(4) + ' SOL';
  },

  // Format large numbers with commas
  formatNumber: (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // Format date to local string
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // Format time remaining
  formatTimeRemaining: (endTime) => {
    const now = Date.now();
    const end = new Date(endTime).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / TIME.HOUR);
    const minutes = Math.floor((diff % TIME.HOUR) / 60000);

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }

    return `${hours}h ${minutes}m`;
  },

  // Format wallet address
  formatAddress: (address, chars = 4) => {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  },
};

// Validation Functions
export const validators = {
  // Validate SOL amount
  isValidAmount: (amount) => {
    return amount >= RAID_LIMITS.MIN_REWARD && amount <= RAID_LIMITS.MAX_REWARD;
  },

  // Validate participant count
  isValidParticipantCount: (count) => {
    return count >= RAID_LIMITS.MIN_PARTICIPANTS && count <= RAID_LIMITS.MAX_PARTICIPANTS;
  },

  // Validate duration
  isValidDuration: (hours) => {
    return hours >= RAID_LIMITS.MIN_DURATION && hours <= RAID_LIMITS.MAX_DURATION;
  },

  // Validate Solana address
  isValidSolanaAddress: (address) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  },

  // Validate tweet content
  isValidTweetContent: (content) => {
    return content.length > 0 && content.length <= 280;
  },
};

// Theme Constants
export const THEME = {
  colors: {
    brand: {
      50: '#f0e4ff',
      100: '#cbb2ff',
      200: '#a480ff',
      300: '#7b4dff',
      400: '#531bff',
      500: '#3a01e6',
      600: '#2d00b4',
      700: '#200082',
      800: '#130051',
      900: '#070021',
    },
  },
  gradients: {
    brand: 'linear(to-r, brand.300, purple.400)',
    dark: 'linear(to-r, gray.800, gray.900)',
  },
};
