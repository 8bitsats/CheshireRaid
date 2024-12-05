// This file safely exposes environment variables to the client
export const env = {
  ELEVEN_LABS_API_KEY: import.meta.env.VITE_ELEVEN_LABS_API_KEY as string,
  ELEVEN_LABS_AGENT_ID: import.meta.env.VITE_ELEVEN_LABS_AGENT_ID as string,
  OPEN_AI_API_KEY: import.meta.env.VITE_OPEN_AI_API_KEY as string,
};
