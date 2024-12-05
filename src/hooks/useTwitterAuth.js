import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { twitterApi } from '../utils/api';

export function useTwitterAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      const { isAuthenticated: authStatus, user } = await twitterApi.getAuthUrl();
      setIsAuthenticated(authStatus);
      if (user) {
        setUserInfo(user);
      }
    } catch (error) {
      console.error('Error checking Twitter auth status:', error);
      setIsAuthenticated(false);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle Twitter authentication
  const authenticate = async () => {
    try {
      const { url } = await twitterApi.getAuthUrl();
      
      // Store current path for redirect after auth
      sessionStorage.setItem('twitter_auth_redirect', window.location.pathname);
      
      // Redirect to Twitter auth
      window.location.href = url;
    } catch (error) {
      console.error('Error initiating Twitter auth:', error);
      toast({
        title: 'Authentication Error',
        description: error.message || 'Failed to connect with Twitter',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Verify Twitter actions
  const verifyActions = async (tweetId, actions) => {
    try {
      const verificationPromises = [];

      if (actions.includes('like')) {
        verificationPromises.push(twitterApi.verifyLike(tweetId));
      }
      if (actions.includes('retweet')) {
        verificationPromises.push(twitterApi.verifyRetweet(tweetId));
      }
      if (actions.includes('follow')) {
        verificationPromises.push(twitterApi.verifyFollow(tweetId));
      }

      const results = await Promise.all(verificationPromises);
      const allVerified = results.every(result => result.verified);

      return {
        verified: allVerified,
        results: results.reduce((acc, curr, index) => {
          acc[actions[index]] = curr.verified;
          return acc;
        }, {})
      };
    } catch (error) {
      console.error('Error verifying Twitter actions:', error);
      toast({
        title: 'Verification Error',
        description: error.message || 'Failed to verify Twitter actions',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Get tweet metrics
  const getTweetMetrics = async (tweetId) => {
    try {
      return await twitterApi.getTweetMetrics(tweetId);
    } catch (error) {
      console.error('Error fetching tweet metrics:', error);
      toast({
        title: 'Error fetching metrics',
        description: error.message || 'Failed to fetch tweet metrics',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Handle auth callback
  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (error) {
        toast({
          title: 'Authentication Error',
          description: error,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (code && state) {
        try {
          // Clear URL parameters without refreshing the page
          window.history.replaceState({}, document.title, window.location.pathname);
          
          await checkAuthStatus();
          
          // Redirect back to original page if stored
          const redirectPath = sessionStorage.getItem('twitter_auth_redirect');
          if (redirectPath) {
            sessionStorage.removeItem('twitter_auth_redirect');
            window.location.href = redirectPath;
          }

          toast({
            title: 'Authentication Successful',
            description: 'Your Twitter account has been connected',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        } catch (error) {
          console.error('Error handling auth callback:', error);
          toast({
            title: 'Authentication Error',
            description: error.message || 'Failed to complete authentication',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    if (window.location.search.includes('code=')) {
      handleAuthCallback();
    }
  }, [checkAuthStatus, toast]);

  return {
    isAuthenticated,
    userInfo,
    loading,
    authenticate,
    verifyActions,
    getTweetMetrics,
    refreshAuthStatus: checkAuthStatus,
  };
}
