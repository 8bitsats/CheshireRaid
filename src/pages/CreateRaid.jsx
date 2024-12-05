import React from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  FormHelperText,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  Text,
  Textarea,
  useToast,
  Checkbox,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';

export default function CreateRaid() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    content: '',
    rewardAmount: 0.1,
    maxParticipants: 100,
    duration: 24,
    requirements: {
      like: true,
      retweet: true,
      follow: false,
      comment: false
    }
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form data
      if (!formData.content.trim()) {
        throw new Error('Tweet content is required');
      }

      if (formData.rewardAmount <= 0) {
        throw new Error('Reward amount must be greater than 0');
      }

      // Calculate total cost
      const totalCost = formData.rewardAmount * formData.maxParticipants;

      // TODO: Check wallet balance
      // TODO: Create raid through API

      toast({
        title: 'Raid created successfully!',
        description: 'Your raid campaign is now live.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        content: '',
        rewardAmount: 0.1,
        maxParticipants: 100,
        duration: 24,
        requirements: {
          like: true,
          retweet: true,
          follow: false,
          comment: false
        }
      });
    } catch (error) {
      console.error('Error creating raid:', error);
      toast({
        title: 'Error creating raid',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = formData.rewardAmount * formData.maxParticipants;

  return (
    <Container maxW="container.md">
      <Stack spacing={8}>
        <Stack spacing={4}>
          <Heading size="xl">Create Raid</Heading>
          <Text color="gray.400">
            Create a new raid campaign to engage with your community and distribute rewards.
          </Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Tweet Content</FormLabel>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter your tweet content..."
                maxLength={280}
                h={32}
              />
              <FormHelperText>
                {280 - formData.content.length} characters remaining
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Reward Amount (SOL per participant)</FormLabel>
              <NumberInput
                value={formData.rewardAmount}
                onChange={(value) => setFormData({ ...formData, rewardAmount: parseFloat(value) })}
                min={0.01}
                max={10}
                step={0.01}
                precision={2}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Maximum Participants</FormLabel>
              <NumberInput
                value={formData.maxParticipants}
                onChange={(value) => setFormData({ ...formData, maxParticipants: parseInt(value) })}
                min={1}
                max={1000}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Duration (hours)</FormLabel>
              <NumberInput
                value={formData.duration}
                onChange={(value) => setFormData({ ...formData, duration: parseInt(value) })}
                min={1}
                max={168}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel>Requirements</FormLabel>
              <Stack spacing={2}>
                <Checkbox
                  isChecked={formData.requirements.like}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: { ...formData.requirements, like: e.target.checked }
                  })}
                >
                  Like the tweet
                </Checkbox>
                <Checkbox
                  isChecked={formData.requirements.retweet}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: { ...formData.requirements, retweet: e.target.checked }
                  })}
                >
                  Retweet the tweet
                </Checkbox>
                <Checkbox
                  isChecked={formData.requirements.follow}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: { ...formData.requirements, follow: e.target.checked }
                  })}
                >
                  Follow your account
                </Checkbox>
                <Checkbox
                  isChecked={formData.requirements.comment}
                  onChange={(e) => setFormData({
                    ...formData,
                    requirements: { ...formData.requirements, comment: e.target.checked }
                  })}
                >
                  Comment on the tweet
                </Checkbox>
              </Stack>
            </FormControl>

            <Divider />

            <Alert status="info" rounded="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Total Cost: {totalCost.toFixed(2)} SOL</AlertTitle>
                <AlertDescription>
                  This amount will be reserved from your wallet to distribute rewards.
                </AlertDescription>
              </Box>
            </Alert>

            <Button
              type="submit"
              colorScheme="purple"
              size="lg"
              isLoading={isLoading}
              leftIcon={<FaTwitter />}
            >
              Create Raid
            </Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  );
}
