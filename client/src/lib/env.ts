// This file safely exposes environment variables to the client
export const env = {
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY as string,
  ELEVEN_LABS_AGENT_ID: import.meta.env.VITE_ELEVEN_LABS_AGENT_ID as string,
  OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY as string,
  SOLANA_PAYOUT_PRIVATE_KEY: import.meta.env.VITE_SOLANA_PAYOUT_PRIVATE_KEY as string,
  TWITTER_API_KEY: import.meta.env.VITE_TWITTER_API_KEY as string,
  TWITTER_API_KEY_SECRET: import.meta.env.VITE_TWITTER_API_KEY_SECRET as string,
  TWITTER_BEARER_TOKEN: import.meta.env.VITE_TWITTER_BEARER_TOKEN as string,
  TWITTER_ACCESS_TOKEN: import.meta.env.VITE_TWITTER_ACCESS_TOKEN as string,
  TWITTER_ACCESS_TOKEN_SECRET: import.meta.env.VITE_TWITTER_ACCESS_TOKEN_SECRET as string,
  TWITTER_OAUTH_CLIENT_ID: import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string,
  TWITTER_CLIENT_SECRET: import.meta.env.VITE_TWITTER_CLIENT_SECRET as string,
};
