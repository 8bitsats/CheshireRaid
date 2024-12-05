import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
);

export const raidApi = {
  // Raid Management
  createRaid: async (raidData) => {
    return api.post('/raids', raidData);
  },

  getActiveRaids: async () => {
    return api.get('/raids/active');
  },

  getRaidById: async (raidId) => {
    return api.get(`/raids/${raidId}`);
  },

  participateInRaid: async (raidId, walletAddress) => {
    return api.post(`/raids/${raidId}/participate`, { walletAddress });
  },

  // User Raids
  getCreatedRaids: async () => {
    return api.get('/raids/created');
  },

  getParticipatedRaids: async () => {
    return api.get('/raids/participated');
  },

  // Statistics
  getUserStats: async () => {
    return api.get('/users/stats');
  },

  getRaidStats: async (raidId) => {
    return api.get(`/raids/${raidId}/stats`);
  },

  // Authentication
  getAuthStatus: async () => {
    return api.get('/auth/status');
  },

  // Wallet
  getWalletBalance: async () => {
    return api.get('/wallet/balance');
  },

  verifyWalletConnection: async (publicKey) => {
    return api.post('/wallet/verify', { publicKey });
  }
};

export const twitterApi = {
  // Twitter Authentication
  getAuthUrl: async () => {
    return api.get('/auth/twitter/url');
  },

  // Twitter Actions Verification
  verifyLike: async (tweetId) => {
    return api.post('/twitter/verify/like', { tweetId });
  },

  verifyRetweet: async (tweetId) => {
    return api.post('/twitter/verify/retweet', { tweetId });
  },

  verifyFollow: async (userId) => {
    return api.post('/twitter/verify/follow', { userId });
  },

  // Twitter Metrics
  getTweetMetrics: async (tweetId) => {
    return api.get(`/twitter/metrics/${tweetId}`);
  }
};

export const solanaApi = {
  // Transaction History
  getTransactionHistory: async () => {
    return api.get('/solana/transactions');
  },

  // Reward Distribution
  distributeRewards: async (raidId) => {
    return api.post(`/solana/distribute/${raidId}`);
  },

  // Balance Check
  checkBalance: async (address) => {
    return api.get(`/solana/balance/${address}`);
  }
};

// Error handling utility
export const handleApiError = (error) => {
  console.error('API Error:', error);
  return {
    error: true,
    message: error.message || 'An unexpected error occurred'
  };
};

// Success response utility
export const createSuccessResponse = (data) => {
  return {
    error: false,
    data
  };
};
