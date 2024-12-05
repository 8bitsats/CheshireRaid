import { analytics } from './analytics';

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Error categories
export const ERROR_CATEGORIES = {
  WALLET: 'wallet',
  TWITTER: 'twitter',
  RAID: 'raid',
  TRANSACTION: 'transaction',
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  UI: 'ui',
};

class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Maximum number of errors to store in memory
  }

  // Track error with metadata
  track(error, metadata = {}) {
    const errorData = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity: metadata.severity || ERROR_SEVERITY.MEDIUM,
      category: metadata.category || 'uncategorized',
      userId: metadata.userId,
      walletAddress: metadata.walletAddress,
      context: metadata.context || {},
    };

    // Add to local error log
    this.addError(errorData);

    // Track in analytics
    analytics.track('error', errorData);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error tracked:', errorData);
    }

    return errorData;
  }

  // Add error to local log
  addError(errorData) {
    this.errors.unshift(errorData);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }
  }

  // Get recent errors
  getRecentErrors(limit = 10) {
    return this.errors.slice(0, limit);
  }

  // Get errors by category
  getErrorsByCategory(category) {
    return this.errors.filter(error => error.category === category);
  }

  // Get errors by severity
  getErrorsBySeverity(severity) {
    return this.errors.filter(error => error.severity === severity);
  }

  // Clear error log
  clearErrors() {
    this.errors = [];
  }
}

// Create error tracker instance
const errorTracker = new ErrorTracker();

// Error boundary for React components
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    errorTracker.track(error, {
      severity: ERROR_SEVERITY.HIGH,
      category: ERROR_CATEGORIES.UI,
      context: {
        componentStack: errorInfo.componentStack,
        ...this.props.metadata
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error handling utilities
export const errorUtils = {
  // Handle wallet errors
  handleWalletError: (error, toast, metadata = {}) => {
    const errorData = errorTracker.track(error, {
      severity: ERROR_SEVERITY.HIGH,
      category: ERROR_CATEGORIES.WALLET,
      ...metadata
    });

    toast({
      title: 'Wallet Error',
      description: errorData.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    return errorData;
  },

  // Handle Twitter errors
  handleTwitterError: (error, toast, metadata = {}) => {
    const errorData = errorTracker.track(error, {
      severity: ERROR_SEVERITY.MEDIUM,
      category: ERROR_CATEGORIES.TWITTER,
      ...metadata
    });

    toast({
      title: 'Twitter Error',
      description: errorData.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    return errorData;
  },

  // Handle transaction errors
  handleTransactionError: (error, toast, metadata = {}) => {
    const errorData = errorTracker.track(error, {
      severity: ERROR_SEVERITY.HIGH,
      category: ERROR_CATEGORIES.TRANSACTION,
      ...metadata
    });

    toast({
      title: 'Transaction Error',
      description: errorData.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    return errorData;
  },

  // Handle network errors
  handleNetworkError: (error, toast, metadata = {}) => {
    const errorData = errorTracker.track(error, {
      severity: ERROR_SEVERITY.MEDIUM,
      category: ERROR_CATEGORIES.NETWORK,
      ...metadata
    });

    toast({
      title: 'Network Error',
      description: 'Please check your internet connection and try again',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });

    return errorData;
  },

  // Format error message for display
  formatErrorMessage: (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError: (error) => {
    return (
      error.message?.includes('network') ||
      error.message?.includes('internet') ||
      error.message?.includes('connection') ||
      error.code === 'NETWORK_ERROR'
    );
  },

  // Check if error is wallet related
  isWalletError: (error) => {
    return (
      error.message?.includes('wallet') ||
      error.message?.includes('phantom') ||
      error.code === 'WALLET_ERROR'
    );
  },
};

export { errorTracker };
