import React from 'react';
import {
  Box,
  Button,
  Badge,
  Progress,
  Stack,
  Text,
  Flex,
  Icon,
  Link,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FaTwitter, FaSol, FaUsers, FaExternalLinkAlt } from 'react-icons/fa';
import { useApp } from '../context/AppContext';
import { raidApi } from '../utils/api';

export default function RaidCard({ raid, onParticipate, showActions = true }) {
  const { wallet, isTwitterAuthed } = useApp();
  const toast = useToast();

  const timeLeft = React.useMemo(() => {
    const endTime = new Date(raid.endTime).getTime();
    const now = new Date().getTime();
    const diff = endTime - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  }, [raid.endTime]);

  const progress = (raid.currentParticipants / raid.maxParticipants) * 100;

  const handleParticipate = async () => {
    try {
      if (!wallet?.isConnected) {
        toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet to participate',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (!isTwitterAuthed) {
        toast({
          title: 'Twitter not connected',
          description: 'Please connect your Twitter account to participate',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await raidApi.participateInRaid(raid.id, wallet.publicKey);
      
      if (onParticipate) {
        onParticipate(raid);
      }

      toast({
        title: 'Joined raid successfully',
        description: 'Complete the required actions to earn rewards',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error participating in raid:', error);
      toast({
        title: 'Failed to join raid',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const statusColor = {
    active: 'green',
    completed: 'blue',
    expired: 'gray'
  };

  return (
    <Box
      p={6}
      bg="gray.800"
      rounded="xl"
      borderWidth="1px"
      borderColor="brand.500"
      shadow="xl"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      <Stack spacing={4}>
        <Flex justify="space-between" align="center">
          <Badge colorScheme={statusColor[raid.status]} px={2} py={1} rounded="md">
            {raid.status === 'active' ? timeLeft : raid.status.charAt(0).toUpperCase() + raid.status.slice(1)}
          </Badge>
          <Text color="gray.400" fontSize="sm">
            {new Date(raid.createdAt).toLocaleDateString()}
          </Text>
        </Flex>

        <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
          {raid.content}
        </Text>

        <Stack direction="row" spacing={4} align="center">
          <Tooltip label="Reward amount">
            <Flex align="center">
              <Icon as={FaSol} color="yellow.400" mr={1} />
              <Text>{raid.rewardAmount} SOL</Text>
            </Flex>
          </Tooltip>
          <Tooltip label="Participants">
            <Flex align="center">
              <Icon as={FaUsers} color="blue.400" mr={1} />
              <Text>{raid.currentParticipants}/{raid.maxParticipants}</Text>
            </Flex>
          </Tooltip>
        </Stack>

        <Progress value={progress} colorScheme="purple" rounded="md" />

        {showActions && (
          <Stack direction="row" spacing={4}>
            <Link
              href={`https://twitter.com/twitter/status/${raid.tweetId}`}
              isExternal
              flex={1}
            >
              <Button
                w="full"
                leftIcon={<FaTwitter />}
                rightIcon={<FaExternalLinkAlt />}
                colorScheme="twitter"
                variant="outline"
              >
                View Tweet
              </Button>
            </Link>
            {raid.status === 'active' && (
              <Button
                flex={1}
                colorScheme="purple"
                onClick={handleParticipate}
                isDisabled={raid.currentParticipants >= raid.maxParticipants}
              >
                Participate
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
