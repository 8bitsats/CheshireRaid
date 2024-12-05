import { STORAGE_KEYS } from './constants';

class Storage {
  constructor(prefix = 'cheshire_raid_') {
    this.prefix = prefix;
  }

  // Generate prefixed key
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  // Set item with optional expiration
  set(key, value, expirationHours = null) {
    try {
      const item = {
        value,
        timestamp: new Date().getTime(),
      };

      if (expirationHours) {
        item.expiration = new Date().getTime() + (expirationHours * 60 * 60 * 1000);
      }

      localStorage.setItem(this.getKey(key), JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error setting storage item:', error);
      return false;
    }
  }

  // Get item and check expiration
  get(key) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const parsed = JSON.parse(item);

      // Check expiration if set
      if (parsed.expiration && new Date().getTime() > parsed.expiration) {
        this.remove(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  }

  // Remove item
  remove(key) {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error('Error removing storage item:', error);
      return false;
    }
  }

  // Clear all items with prefix
  clear() {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // Check if key exists
  has(key) {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  // Get item timestamp
  getTimestamp(key) {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return null;

      const parsed = JSON.parse(item);
      return parsed.timestamp;
    } catch (error) {
      console.error('Error getting item timestamp:', error);
      return null;
    }
  }
}

// Create storage instance
const storage = new Storage();

// User preferences storage
export const userPreferences = {
  // Theme preference
  getTheme: () => storage.get('theme') || 'dark',
  setTheme: (theme) => storage.set('theme', theme),

  // Language preference
  getLanguage: () => storage.get('language') || 'en',
  setLanguage: (lang) => storage.set('language', lang),

  // Notification settings
  getNotificationSettings: () => storage.get('notifications') || {
    email: true,
    push: true,
    raids: true,
    rewards: true,
  },
  setNotificationSettings: (settings) => storage.set('notifications', settings),
};

// Auth storage
export const authStorage = {
  // Twitter auth state
  getTwitterAuthState: () => storage.get(STORAGE_KEYS.TWITTER_AUTH_REDIRECT),
  setTwitterAuthState: (state) => storage.set(STORAGE_KEYS.TWITTER_AUTH_REDIRECT, state),
  clearTwitterAuthState: () => storage.remove(STORAGE_KEYS.TWITTER_AUTH_REDIRECT),

  // Wallet auto-connect preference
  getWalletAutoConnect: () => storage.get(STORAGE_KEYS.WALLET_AUTO_CONNECT) || false,
  setWalletAutoConnect: (enabled) => storage.set(STORAGE_KEYS.WALLET_AUTO_CONNECT, enabled),
};

// Cache storage
export const cacheStorage = {
  // Set cached data with expiration
  set: (key, data, expirationHours = 1) => storage.set(`cache_${key}`, data, expirationHours),
  
  // Get cached data
  get: (key) => storage.get(`cache_${key}`),
  
  // Clear specific cache
  clear: (key) => storage.remove(`cache_${key}`),
  
  // Clear all cache
  clearAll: () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith(storage.prefix + 'cache_'))
      .forEach(key => localStorage.removeItem(key));
  },
};

// Recent raids storage
export const raidStorage = {
  // Get recent raids
  getRecentRaids: () => storage.get('recent_raids') || [],
  
  // Add raid to recent list
  addRecentRaid: (raid) => {
    const raids = storage.get('recent_raids') || [];
    const updated = [raid, ...raids].slice(0, 10); // Keep last 10 raids
    storage.set('recent_raids', updated);
  },
  
  // Clear recent raids
  clearRecentRaids: () => storage.remove('recent_raids'),
};

// Draft storage
export const draftStorage = {
  // Save raid draft
  saveDraft: (draft) => storage.set('raid_draft', draft),
  
  // Get raid draft
  getDraft: () => storage.get('raid_draft'),
  
  // Clear raid draft
  clearDraft: () => storage.remove('raid_draft'),
};

export { storage };
