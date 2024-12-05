const TWITTER_API_URL = 'https://api.twitter.com/2';

export async function verifyTweet(username: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/verify-tweet?username=${username}`);
    const data = await response.json();
    return data.verified;
  } catch (error) {
    console.error("Error verifying tweet:", error);
    return false;
  }
}

export async function getLatestTweets(): Promise<any[]> {
  try {
    const response = await fetch('/api/latest-tweets');
    const data = await response.json();
    return data.tweets;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return [];
  }
}
