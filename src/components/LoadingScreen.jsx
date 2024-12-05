import React from 'react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';

export default function LoadingScreen() {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="9999"
    >
      <VStack spacing={4}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.700"
          color="brand.300"
          size="xl"
        />
        <Text color="gray.300" fontSize="lg">
          Loading CheshireRaid...
        </Text>
      </VStack>
    </Box>
  );
}
