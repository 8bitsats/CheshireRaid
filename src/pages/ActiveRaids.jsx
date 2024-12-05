import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Badge,
  useToast,
  Progress,
  Flex,
  Icon,
  Link,
  Tooltip,
} from '@chakra-ui/react';
import { FaTwitter, FaSol, FaUsers, FaExternalLinkAlt } from 'react-icons/fa';

const RaidCard = ({ raid, onParticipate }) => {
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

  return (
    <Box
      p={6}
      bg="gray.800"
      rounded="xl"
      borderWidth="1px"
      borderColor="brand.500"
      shadow="xl"
    >
      <Stack spacing={4}>
        <Flex justify="space-between" align="center">
          <Badge colorScheme="green" px={2} py={1} rounded="md">
            Active
          </Badge>
          <Text color="gray.400" fontSize="sm">
            {timeLeft}
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
          <Button
            flex={1}
            colorScheme="purple"
            onClick={() => onParticipate(raid)}
            isDisabled={raid.currentParticipants >= raid.maxParticipants}
          >
            Participate
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default function ActiveRaids() {
  const [raids, setRaids] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const toast = useToast();

  React.useEffect(() => {
    fetchRaids();
  }, []);

  const fetchRaids = async () => {
    try {
      // TODO: Replace with actual API call
      const mockRaids = [
        {
          id: 1,
          tweetId: '1234567890',
          content: 'Join our amazing community! Like & RT to earn rewards! #CheshireRaid',
          rewardAmount: 0.1,
          currentParticipants: 45,
          maxParticipants: 100,
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        // Add more mock raids as needed
      ];
      
      setRaids(mockRaids);
    } catch (error) {
      console.error('Error fetching raids:', error);
      toast({
        title: 'Error fetching raids',
        description: 'Please try again later',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleParticipate = async (raid) => {
    try {
      // TODO: Implement actual participation logic
      toast({
        title: 'Participating in raid',
        description: 'Please complete the required actions on Twitter',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error participating in raid:', error);
      toast({
        title: 'Error participating in raid',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Stack spacing={4}>
          <Heading size="xl">Active Raids</Heading>
          <Text color="gray.400">
            Participate in active raids to earn SOL rewards. Complete the required actions
            on Twitter to qualify for rewards.
          </Text>
        </Stack>

        {isLoading ? (
          <Progress size="xs" isIndeterminate colorScheme="purple" />
        ) : raids.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {raids.map((raid) => (
              <RaidCard
                key={raid.id}
                raid={raid}
                onParticipate={handleParticipate}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text color="gray.500">No active raids at the moment.</Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}
