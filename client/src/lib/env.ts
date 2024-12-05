// This file safely exposes environment variables to the client
export const env = {
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY as string,
  ELEVEN_LABS_AGENT_ID: import.meta.env.VITE_ELEVEN_LABS_AGENT_ID as string,
  OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY as string,
  SOLANA_PAYOUT_PRIVATE_KEY: import.meta.env.VITE_SOLANA_PAYOUT_PRIVATE_KEY as string,
  SOLANA_TRACKER_API_KEY: import.meta.env.VITE_SOLANA_TRACKER_API_KEY as string,
};
