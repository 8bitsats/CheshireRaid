import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  Stack,
  Link,
  useColorModeValue,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { FaTwitter, FaWallet } from 'react-icons/fa';

export default function Navbar() {
  const [walletAddress, setWalletAddress] = React.useState('');
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const connectWallet = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } else {
        window.open('https://phantom.app/', '_blank');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const authenticateTwitter = () => {
    window.location.href = '/auth/twitter';
  };

  return (
    <Box bg={useColorModeValue('gray.800', 'gray.900')} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <RouterLink to="/">
          <Text fontSize="xl" fontWeight="bold" color="brand.300">
            CheshireRaid
          </Text>
        </RouterLink>

        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={4}>
            <Link as={RouterLink} to="/active-raids" color="gray.200" _hover={{ color: 'brand.300' }}>
              Active Raids
            </Link>
            <Link as={RouterLink} to="/create-raid" color="gray.200" _hover={{ color: 'brand.300' }}>
              Create Raid
            </Link>
            <Link as={RouterLink} to="/my-raids" color="gray.200" _hover={{ color: 'brand.300' }}>
              My Raids
            </Link>
          </Stack>

          <Stack direction={'row'} spacing={4} ml={8}>
            {!isAuthenticated ? (
              <Button
                leftIcon={<FaTwitter />}
                colorScheme="twitter"
                variant="solid"
                onClick={authenticateTwitter}
              >
                Connect Twitter
              </Button>
            ) : (
              <IconButton
                icon={<FaTwitter />}
                colorScheme="twitter"
                variant="solid"
                isRound
                size="md"
              />
            )}

            {!walletAddress ? (
              <Button
                leftIcon={<FaWallet />}
                colorScheme="purple"
                variant="solid"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            ) : (
              <Menu>
                <MenuButton
                  as={Button}
                  leftIcon={<FaWallet />}
                  colorScheme="purple"
                  variant="solid"
                >
                  {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setWalletAddress('')}>Disconnect</MenuItem>
                </MenuList>
              </Menu>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
}
