import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaTwitter, FaSol, FaTrophy, FaUsers } from 'react-icons/fa';

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

export default function Home() {
  const [stats, setStats] = React.useState({
    activeRaids: 0,
    totalParticipants: 0,
    totalRewards: 0,
    completedRaids: 0,
  });

  React.useEffect(() => {
    // TODO: Fetch actual statistics from the backend
    setStats({
      activeRaids: 5,
      totalParticipants: 1234,
      totalRewards: 100,
      completedRaids: 25,
    });
  }, []);

  return (
    <Container maxW="container.xl">
      <Stack spacing={12} align="center" py={16}>
        {/* Hero Section */}
        <Stack spacing={6} textAlign="center" maxW="2xl">
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, brand.300, purple.400)"
            bgClip="text"
          >
            Earn SOL for Twitter Engagement
          </Heading>
          <Text fontSize="xl" color="gray.400">
            Join Twitter raids, engage with content, and earn SOL rewards automatically.
            Powered by Solana blockchain and Twitter's API.
          </Text>
          <Stack direction="row" spacing={4} justify="center">
            <Button
              as={RouterLink}
              to="/active-raids"
              size="lg"
              colorScheme="purple"
              leftIcon={<FaTwitter />}
            >
              Join Raids
            </Button>
            <Button
              as={RouterLink}
              to="/create-raid"
              size="lg"
              variant="outline"
              colorScheme="purple"
            >
              Create Raid
            </Button>
          </Stack>
        </Stack>

        {/* Statistics */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
          <StatCard
            label="Active Raids"
            number={stats.activeRaids}
            helpText="Live campaigns"
            icon={FaTwitter}
          />
          <StatCard
            label="Total Participants"
            number={stats.totalParticipants}
            helpText="Engaged users"
            icon={FaUsers}
          />
          <StatCard
            label="Total Rewards"
            number={`${stats.totalRewards} SOL`}
            helpText="Distributed rewards"
            icon={FaSol}
          />
          <StatCard
            label="Completed Raids"
            number={stats.completedRaids}
            helpText="Successful campaigns"
            icon={FaTrophy}
          />
        </SimpleGrid>

        {/* How It Works */}
        <Stack spacing={8} maxW="4xl" textAlign="center">
          <Heading as="h2" size="xl" color="white">
            How It Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Box p={6} bg="gray.800" rounded="xl">
              <Stack spacing={4} align="center">
                <Icon as={FaTwitter} w={8} h={8} color="brand.300" />
                <Heading size="md">Connect</Heading>
                <Text color="gray.400">
                  Connect your Twitter account and Solana wallet to get started
                </Text>
              </Stack>
            </Box>
            <Box p={6} bg="gray.800" rounded="xl">
              <Stack spacing={4} align="center">
                <Icon as={FaUsers} w={8} h={8} color="brand.300" />
                <Heading size="md">Participate</Heading>
                <Text color="gray.400">
                  Join active raids and engage with content through likes and retweets
                </Text>
              </Stack>
            </Box>
            <Box p={6} bg="gray.800" rounded="xl">
              <Stack spacing={4} align="center">
                <Icon as={FaSol} w={8} h={8} color="brand.300" />
                <Heading size="md">Earn</Heading>
                <Text color="gray.400">
                  Receive SOL rewards automatically upon completing raid requirements
                </Text>
              </Stack>
            </Box>
          </SimpleGrid>
        </Stack>
      </Stack>
    </Container>
  );
}
