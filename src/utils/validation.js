import { RAID_LIMITS, validators } from './constants';

// Form validation schemas
export const schemas = {
  // Raid creation form validation
  raidCreation: {
    content: {
      required: 'Tweet content is required',
      validate: {
        length: (value) => {
          if (value.length === 0) return 'Tweet content cannot be empty';
          if (value.length > 280) return 'Tweet content cannot exceed 280 characters';
          return true;
        },
        format: (value) => {
          if (!/^[\w\s\d!@#$%^&*(),.?":{}|<>]+$/i.test(value)) {
            return 'Tweet contains invalid characters';
          }
          return true;
        }
      }
    },
    rewardAmount: {
      required: 'Reward amount is required',
      validate: {
        range: (value) => {
          if (value < RAID_LIMITS.MIN_REWARD) {
            return `Minimum reward is ${RAID_LIMITS.MIN_REWARD} SOL`;
          }
          if (value > RAID_LIMITS.MAX_REWARD) {
            return `Maximum reward is ${RAID_LIMITS.MAX_REWARD} SOL`;
          }
          return true;
        }
      }
    },
    maxParticipants: {
      required: 'Maximum participants is required',
      validate: {
        range: (value) => {
          if (value < RAID_LIMITS.MIN_PARTICIPANTS) {
            return `Minimum participants is ${RAID_LIMITS.MIN_PARTICIPANTS}`;
          }
          if (value > RAID_LIMITS.MAX_PARTICIPANTS) {
            return `Maximum participants is ${RAID_LIMITS.MAX_PARTICIPANTS}`;
          }
          return true;
        }
      }
    },
    duration: {
      required: 'Duration is required',
      validate: {
        range: (value) => {
          if (value < RAID_LIMITS.MIN_DURATION) {
            return `Minimum duration is ${RAID_LIMITS.MIN_DURATION} hour`;
          }
          if (value > RAID_LIMITS.MAX_DURATION) {
            return `Maximum duration is ${RAID_LIMITS.MAX_DURATION} hours`;
          }
          return true;
        }
      }
    }
  }
};

// Form validation functions
export const validateForm = {
  // Validate raid creation form
  raidCreation: (data) => {
    const errors = {};

    // Validate tweet content
    if (!data.content) {
      errors.content = schemas.raidCreation.content.required;
    } else {
      const contentValidation = schemas.raidCreation.content.validate;
      const lengthResult = contentValidation.length(data.content);
      const formatResult = contentValidation.format(data.content);

      if (lengthResult !== true) errors.content = lengthResult;
      if (formatResult !== true) errors.content = formatResult;
    }

    // Validate reward amount
    if (!data.rewardAmount) {
      errors.rewardAmount = schemas.raidCreation.rewardAmount.required;
    } else {
      const rewardValidation = schemas.raidCreation.rewardAmount.validate.range(data.rewardAmount);
      if (rewardValidation !== true) errors.rewardAmount = rewardValidation;
    }

    // Validate max participants
    if (!data.maxParticipants) {
      errors.maxParticipants = schemas.raidCreation.maxParticipants.required;
    } else {
      const participantsValidation = schemas.raidCreation.maxParticipants.validate.range(data.maxParticipants);
      if (participantsValidation !== true) errors.maxParticipants = participantsValidation;
    }

    // Validate duration
    if (!data.duration) {
      errors.duration = schemas.raidCreation.duration.required;
    } else {
      const durationValidation = schemas.raidCreation.duration.validate.range(data.duration);
      if (durationValidation !== true) errors.duration = durationValidation;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};

// Input validation functions
export const validateInput = {
  // Validate SOL amount
  solAmount: (amount) => {
    if (!amount) return 'Amount is required';
    if (isNaN(amount)) return 'Amount must be a number';
    if (amount <= 0) return 'Amount must be greater than 0';
    return null;
  },

  // Validate Solana address
  solanaAddress: (address) => {
    if (!address) return 'Address is required';
    if (!validators.isValidSolanaAddress(address)) return 'Invalid Solana address';
    return null;
  },

  // Validate tweet content
  tweetContent: (content) => {
    if (!content) return 'Content is required';
    if (content.length > 280) return 'Content exceeds 280 characters';
    return null;
  },

  // Validate participant count
  participantCount: (count) => {
    if (!count) return 'Participant count is required';
    if (isNaN(count)) return 'Participant count must be a number';
    if (!validators.isValidParticipantCount(count)) {
      return `Participant count must be between ${RAID_LIMITS.MIN_PARTICIPANTS} and ${RAID_LIMITS.MAX_PARTICIPANTS}`;
    }
    return null;
  },

  // Validate duration
  duration: (hours) => {
    if (!hours) return 'Duration is required';
    if (isNaN(hours)) return 'Duration must be a number';
    if (!validators.isValidDuration(hours)) {
      return `Duration must be between ${RAID_LIMITS.MIN_DURATION} and ${RAID_LIMITS.MAX_DURATION} hours`;
    }
    return null;
  }
};

// Form data transformation functions
export const transformFormData = {
  // Transform raid creation form data
  raidCreation: (data) => {
    return {
      content: data.content.trim(),
      rewardAmount: parseFloat(data.rewardAmount),
      maxParticipants: parseInt(data.maxParticipants),
      duration: parseInt(data.duration),
      requirements: {
        like: data.requirements?.like || false,
        retweet: data.requirements?.retweet || false,
        follow: data.requirements?.follow || false,
        comment: data.requirements?.comment || false
      }
    };
  }
};

// Form error handling
export const handleFormErrors = (errors, setError) => {
  Object.keys(errors).forEach(field => {
    setError(field, {
      type: 'manual',
      message: errors[field]
    });
  });
};
