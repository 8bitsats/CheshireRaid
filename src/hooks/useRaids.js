import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { raidApi, solanaApi } from '../utils/api';
import { useApp } from '../context/AppContext';

export function useRaids() {
  const [activeRaids, setActiveRaids] = useState([]);
  const [createdRaids, setCreatedRaids] = useState([]);
  const [participatedRaids, setParticipatedRaids] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { wallet } = useApp();
  const toast = useToast();

  // Fetch active raids
  const fetchActiveRaids = useCallback(async () => {
    try {
      const raids = await raidApi.getActiveRaids();
      setActiveRaids(raids);
    } catch (error) {
      console.error('Error fetching active raids:', error);
      toast({
        title: 'Error fetching raids',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Fetch user's created raids
  const fetchCreatedRaids = useCallback(async () => {
    if (!wallet?.isConnected) return;
    try {
      const raids = await raidApi.getCreatedRaids();
      setCreatedRaids(raids);
    } catch (error) {
      console.error('Error fetching created raids:', error);
      toast({
        title: 'Error fetching your raids',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [wallet?.isConnected, toast]);

  // Fetch user's participated raids
  const fetchParticipatedRaids = useCallback(async () => {
    if (!wallet?.isConnected) return;
    try {
      const raids = await raidApi.getParticipatedRaids();
      setParticipatedRaids(raids);
    } catch (error) {
      console.error('Error fetching participated raids:', error);
      toast({
        title: 'Error fetching participation history',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [wallet?.isConnected, toast]);

  // Fetch user stats
  const fetchUserStats = useCallback(async () => {
    if (!wallet?.isConnected) return;
    try {
      const stats = await raidApi.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast({
        title: 'Error fetching statistics',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [wallet?.isConnected, toast]);

  // Create new raid
  const createRaid = async (raidData) => {
    try {
      // Check wallet balance first
      const balance = await solanaApi.checkBalance(wallet.publicKey);
      const totalCost = raidData.rewardAmount * raidData.maxParticipants;

      if (balance < totalCost) {
        throw new Error(`Insufficient balance. Required: ${totalCost} SOL`);
      }

      const newRaid = await raidApi.createRaid(raidData);
      
      toast({
        title: 'Raid created successfully',
        description: 'Your raid campaign is now live',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh raids lists
      await Promise.all([
        fetchActiveRaids(),
        fetchCreatedRaids(),
      ]);

      return newRaid;
    } catch (error) {
      console.error('Error creating raid:', error);
      toast({
        title: 'Error creating raid',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Participate in raid
  const participateInRaid = async (raidId) => {
    try {
      if (!wallet?.isConnected) {
        throw new Error('Please connect your wallet first');
      }

      await raidApi.participateInRaid(raidId, wallet.publicKey);
      
      toast({
        title: 'Joined raid successfully',
        description: 'Complete the required actions to earn rewards',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Refresh raids lists
      await Promise.all([
        fetchActiveRaids(),
        fetchParticipatedRaids(),
      ]);
    } catch (error) {
      console.error('Error participating in raid:', error);
      toast({
        title: 'Error joining raid',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchActiveRaids(),
          fetchCreatedRaids(),
          fetchParticipatedRaids(),
          fetchUserStats(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchActiveRaids, fetchCreatedRaids, fetchParticipatedRaids, fetchUserStats]);

  return {
    activeRaids,
    createdRaids,
    participatedRaids,
    userStats,
    loading,
    createRaid,
    participateInRaid,
    refreshRaids: fetchActiveRaids,
    refreshUserRaids: () => Promise.all([fetchCreatedRaids(), fetchParticipatedRaids()]),
    refreshStats: fetchUserStats,
  };
}
