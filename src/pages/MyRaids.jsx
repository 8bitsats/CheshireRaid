import React from 'react';
import {
  Box,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Stack,
  SimpleGrid,
  Badge,
  Progress,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTwitter, FaSol, FaUsers, FaTrophy } from 'react-icons/fa';

const StatCard = ({ label, number, helpText, icon }) => {
  return (
    <Box
      p={6}
      bg={useColorModeValue('gray.800', 'gray.700')}
      rounded="xl"
      borderWidth="1px"
      borderColor="brand.500"
      shadow="xl"
    >
      <Stack spacing={2} align="center">
        <Icon as={icon} w={8} h={8} color="brand.300" />
        <Stat>
          <StatLabel fontSize="lg" color="gray.400">{label}</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="white">{number}</StatNumber>
          <StatHelpText color="gray.400">{helpText}</StatHelpText>
        </Stat>
      </Stack>
    </Box>
  );
};

const RaidCard = ({ raid }) => {
  const statusColor = {
    active: 'green',
    completed: 'blue',
    expired: 'gray'
  };

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
          <Badge colorScheme={statusColor[raid.status]} px={2} py={1} rounded="md">
            {raid.status.charAt(0).toUpperCase() + raid.status.slice(1)}
          </Badge>
          <Text color="gray.400" fontSize="sm">
            {new Date(raid.createdAt).toLocaleDateString()}
          </Text>
        </Flex>

        <Text fontSize="lg" fontWeight="bold" noOfLines={2}>
          {raid.content}
        </Text>

        <Stack direction="row" spacing={4} align="center">
          <Flex align="center">
            <Icon as={FaSol} color="yellow.400" mr={1} />
            <Text>{raid.rewardAmount} SOL</Text>
          </Flex>
          <Flex align="center">
            <Icon as={FaUsers} color="blue.400" mr={1} />
            <Text>{raid.currentParticipants}/{raid.maxParticipants}</Text>
          </Flex>
          <Flex align="center">
            <Icon as={FaTrophy} color="purple.400" mr={1} />
            <Text>{raid.rewardsDistributed} SOL</Text>
          </Flex>
        </Stack>

        <Progress value={progress} colorScheme="purple" rounded="md" />
      </Stack>
    </Box>
  );
};

export default function MyRaids() {
  const [stats, setStats] = React.useState({
    totalRaids: 0,
    totalParticipants: 0,
    totalRewardsEarned: 0,
    totalRewardsDistributed: 0,
  });

  const [createdRaids, setCreatedRaids] = React.useState([]);
  const [participatedRaids, setParticipatedRaids] = React.useState([]);

  React.useEffect(() => {
    fetchStats();
    fetchRaids();
  }, []);

  const fetchStats = async () => {
    // TODO: Replace with actual API call
    setStats({
      totalRaids: 15,
      totalParticipants: 1234,
      totalRewardsEarned: 5.5,
      totalRewardsDistributed: 25.5,
    });
  };

  const fetchRaids = async () => {
    // TODO: Replace with actual API calls
    const mockCreatedRaids = [
      {
        id: 1,
        content: 'Join our amazing community! Like & RT to earn rewards! #CheshireRaid',
        rewardAmount: 0.1,
        currentParticipants: 45,
        maxParticipants: 100,
        status: 'active',
        createdAt: new Date().toISOString(),
        rewardsDistributed: 4.5
      },
      // Add more mock data as needed
    ];

    const mockParticipatedRaids = [
      {
        id: 2,
        content: 'Participate in our community event! #CheshireRaid',
        rewardAmount: 0.2,
        currentParticipants: 75,
        maxParticipants: 100,
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        rewardsDistributed: 15
      },
      // Add more mock data as needed
    ];

    setCreatedRaids(mockCreatedRaids);
    setParticipatedRaids(mockParticipatedRaids);
  };

  return (
    <Container maxW="container.xl">
      <Stack spacing={8}>
        <Stack spacing={4}>
          <Heading size="xl">My Raids</Heading>
          <Text color="gray.400">
            Track your raid participation and management history.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard
            label="Total Raids"
            number={stats.totalRaids}
            helpText="Created & Participated"
            icon={FaTwitter}
          />
          <StatCard
            label="Total Participants"
            number={stats.totalParticipants}
            helpText="Across all raids"
            icon={FaUsers}
          />
          <StatCard
            label="Rewards Earned"
            number={`${stats.totalRewardsEarned} SOL`}
            helpText="From participation"
            icon={FaTrophy}
          />
          <StatCard
            label="Rewards Distributed"
            number={`${stats.totalRewardsDistributed} SOL`}
            helpText="To participants"
            icon={FaSol}
          />
        </SimpleGrid>

        <Tabs colorScheme="purple" variant="enclosed">
          <TabList>
            <Tab>Created Raids</Tab>
            <Tab>Participated Raids</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {createdRaids.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {createdRaids.map((raid) => (
                    <RaidCard key={raid.id} raid={raid} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text color="gray.500">You haven't created any raids yet.</Text>
                </Box>
              )}
            </TabPanel>

            <TabPanel px={0}>
              {participatedRaids.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {participatedRaids.map((raid) => (
                    <RaidCard key={raid.id} raid={raid} />
                  ))}
                </SimpleGrid>
              ) : (
                <Box textAlign="center" py={10}>
                  <Text color="gray.500">You haven't participated in any raids yet.</Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Stack>
    </Container>
  );
}
