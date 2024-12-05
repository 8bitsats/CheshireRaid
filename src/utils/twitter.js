import { notifications } from './notifications';

export class TwitterUtils {
  constructor(api) {
    this.api = api;
  }

  // Verify multiple Twitter actions
  async verifyActions(tweetId, actions, toast) {
    try {
      notifications.info.verifyingActions(toast);

      const verificationPromises = actions.map(action => {
        switch (action) {
          case 'like':
            return this.verifyLike(tweetId);
          case 'retweet':
            return this.verifyRetweet(tweetId);
          case 'follow':
            return this.verifyFollow(tweetId);
          case 'comment':
            return this.verifyComment(tweetId);
          default:
            return Promise.resolve({ action, verified: false });
        }
      });

      const results = await Promise.all(verificationPromises);
      
      const verificationMap = results.reduce((acc, result) => {
        acc[result.action] = result.verified;
        return acc;
      }, {});

      const allVerified = results.every(result => result.verified);

      return {
        verified: allVerified,
        actions: verificationMap
      };
    } catch (error) {
      notifications.error.generic(toast, error);
      throw error;
    }
  }

  // Verify like action
  async verifyLike(tweetId) {
    try {
      const response = await this.api.post('/twitter/verify/like', { tweetId });
      return {
        action: 'like',
        verified: response.data.verified
      };
    } catch (error) {
      console.error('Error verifying like:', error);
      return {
        action: 'like',
        verified: false,
        error: error.message
      };
    }
  }

  // Verify retweet action
  async verifyRetweet(tweetId) {
    try {
      const response = await this.api.post('/twitter/verify/retweet', { tweetId });
      return {
        action: 'retweet',
        verified: response.data.verified
      };
    } catch (error) {
      console.error('Error verifying retweet:', error);
      return {
        action: 'retweet',
        verified: false,
        error: error.message
      };
    }
  }

  // Verify follow action
  async verifyFollow(userId) {
    try {
      const response = await this.api.post('/twitter/verify/follow', { userId });
      return {
        action: 'follow',
        verified: response.data.verified
      };
    } catch (error) {
      console.error('Error verifying follow:', error);
      return {
        action: 'follow',
        verified: false,
        error: error.message
      };
    }
  }

  // Verify comment action
  async verifyComment(tweetId) {
    try {
      const response = await this.api.post('/twitter/verify/comment', { tweetId });
      return {
        action: 'comment',
        verified: response.data.verified
      };
    } catch (error) {
      console.error('Error verifying comment:', error);
      return {
        action: 'comment',
        verified: false,
        error: error.message
      };
    }
  }

  // Get tweet metrics
  async getTweetMetrics(tweetId) {
    try {
      const response = await this.api.get(`/twitter/metrics/${tweetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tweet metrics:', error);
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const response = await this.api.get(`/twitter/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Create tweet
  async createTweet(content) {
    try {
      const response = await this.api.post('/twitter/tweet', { content });
      return response.data;
    } catch (error) {
      console.error('Error creating tweet:', error);
      throw error;
    }
  }

  // Get tweet engagement history
  async getEngagementHistory(tweetId) {
    try {
      const response = await this.api.get(`/twitter/engagement/${tweetId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching engagement history:', error);
      throw error;
    }
  }

  // Format tweet text
  formatTweetText(text, options = {}) {
    const {
      maxLength = 280,
      includeTimestamp = false,
      hashtags = [],
      mentions = []
    } = options;

    let formattedText = text;

    // Add mentions
    if (mentions.length > 0) {
      formattedText = `${mentions.map(m => `@${m}`).join(' ')} ${formattedText}`;
    }

    // Add hashtags
    if (hashtags.length > 0) {
      formattedText = `${formattedText} ${hashtags.map(h => `#${h}`).join(' ')}`;
    }

    // Add timestamp
    if (includeTimestamp) {
      formattedText = `${formattedText} • ${new Date().toLocaleTimeString()}`;
    }

    // Ensure tweet doesn't exceed max length
    if (formattedText.length > maxLength) {
      formattedText = formattedText.substring(0, maxLength - 3) + '...';
    }

    return formattedText;
  }

  // Parse tweet entities (mentions, hashtags, urls)
  parseTweetEntities(tweet) {
    const entities = {
      mentions: [],
      hashtags: [],
      urls: [],
      media: []
    };

    if (tweet.entities) {
      if (tweet.entities.user_mentions) {
        entities.mentions = tweet.entities.user_mentions.map(mention => ({
          username: mention.screen_name,
          name: mention.name,
          id: mention.id_str
        }));
      }

      if (tweet.entities.hashtags) {
        entities.hashtags = tweet.entities.hashtags.map(hashtag => hashtag.text);
      }

      if (tweet.entities.urls) {
        entities.urls = tweet.entities.urls.map(url => ({
          url: url.url,
          expandedUrl: url.expanded_url,
          displayUrl: url.display_url
        }));
      }

      if (tweet.entities.media) {
        entities.media = tweet.entities.media.map(media => ({
          type: media.type,
          url: media.media_url_https,
          displayUrl: media.display_url
        }));
      }
    }

    return entities;
  }
}

// Export singleton instance
export const twitterUtils = new TwitterUtils();
