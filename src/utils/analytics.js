// Analytics events
const EVENTS = {
  // User Events
  USER: {
    WALLET_CONNECT: 'wallet_connect',
    WALLET_DISCONNECT: 'wallet_disconnect',
    TWITTER_CONNECT: 'twitter_connect',
    PROFILE_UPDATE: 'profile_update',
  },

  // Raid Events
  RAID: {
    CREATE: 'raid_create',
    JOIN: 'raid_join',
    COMPLETE: 'raid_complete',
    REWARD_CLAIM: 'reward_claim',
    SHARE: 'raid_share',
  },

  // Transaction Events
  TRANSACTION: {
    SEND: 'transaction_send',
    RECEIVE: 'transaction_receive',
    ERROR: 'transaction_error',
  },

  // Engagement Events
  ENGAGEMENT: {
    LIKE: 'engagement_like',
    RETWEET: 'engagement_retweet',
    FOLLOW: 'engagement_follow',
    COMMENT: 'engagement_comment',
  },

  // Navigation Events
  NAVIGATION: {
    PAGE_VIEW: 'page_view',
    BUTTON_CLICK: 'button_click',
    LINK_CLICK: 'link_click',
  },
};

class Analytics {
  constructor() {
    this.initialized = false;
    this.queue = [];
    this.userId = null;
  }

  // Initialize analytics
  init() {
    if (this.initialized) return;

    // Initialize queue processor
    setInterval(() => this.processQueue(), 1000);

    this.initialized = true;
    console.log('Analytics initialized');
  }

  // Set user ID
  setUserId(id) {
    this.userId = id;
  }

  // Track event
  track(eventName, properties = {}) {
    const event = {
      eventName,
      properties: {
        ...properties,
        userId: this.userId,
        timestamp: new Date().toISOString(),
      },
    };

    if (!this.initialized) {
      this.queue.push(event);
      return;
    }

    this.sendEvent(event);
  }

  // Process queued events
  processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      this.sendEvent(event);
    }
  }

  // Send event to analytics service
  async sendEvent(event) {
    try {
      // TODO: Replace with actual analytics service implementation
      console.log('Analytics Event:', event);

      // Mock analytics service call
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error sending analytics event:', error);
      // Re-queue failed events
      this.queue.push(event);
    }
  }

  // Track page view
  trackPageView(page) {
    this.track(EVENTS.NAVIGATION.PAGE_VIEW, { page });
  }

  // Track button click
  trackButtonClick(buttonId, properties = {}) {
    this.track(EVENTS.NAVIGATION.BUTTON_CLICK, {
      buttonId,
      ...properties,
    });
  }

  // Track raid creation
  trackRaidCreation(raidId, properties = {}) {
    this.track(EVENTS.RAID.CREATE, {
      raidId,
      ...properties,
    });
  }

  // Track raid participation
  trackRaidParticipation(raidId, properties = {}) {
    this.track(EVENTS.RAID.JOIN, {
      raidId,
      ...properties,
    });
  }

  // Track reward claim
  trackRewardClaim(raidId, amount, properties = {}) {
    this.track(EVENTS.RAID.REWARD_CLAIM, {
      raidId,
      amount,
      ...properties,
    });
  }

  // Track wallet connection
  trackWalletConnection(walletAddress, properties = {}) {
    this.track(EVENTS.USER.WALLET_CONNECT, {
      walletAddress,
      ...properties,
    });
  }

  // Track Twitter connection
  trackTwitterConnection(twitterId, properties = {}) {
    this.track(EVENTS.USER.TWITTER_CONNECT, {
      twitterId,
      ...properties,
    });
  }

  // Track transaction
  trackTransaction(transactionId, type, properties = {}) {
    this.track(EVENTS.TRANSACTION[type], {
      transactionId,
      ...properties,
    });
  }

  // Track engagement
  trackEngagement(type, tweetId, properties = {}) {
    this.track(EVENTS.ENGAGEMENT[type], {
      tweetId,
      ...properties,
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// React hook for analytics
export function useAnalytics() {
  return {
    trackPageView: (page) => analytics.trackPageView(page),
    trackButtonClick: (buttonId, properties) => analytics.trackButtonClick(buttonId, properties),
    trackRaidCreation: (raidId, properties) => analytics.trackRaidCreation(raidId, properties),
    trackRaidParticipation: (raidId, properties) => analytics.trackRaidParticipation(raidId, properties),
    trackRewardClaim: (raidId, amount, properties) => analytics.trackRewardClaim(raidId, amount, properties),
    trackWalletConnection: (walletAddress, properties) => analytics.trackWalletConnection(walletAddress, properties),
    trackTwitterConnection: (twitterId, properties) => analytics.trackTwitterConnection(twitterId, properties),
    trackTransaction: (transactionId, type, properties) => analytics.trackTransaction(transactionId, type, properties),
    trackEngagement: (type, tweetId, properties) => analytics.trackEngagement(type, tweetId, properties),
  };
}

// Export events constants
export { EVENTS };
