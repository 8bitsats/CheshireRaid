import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import WalletConnect from './WalletConnect';
import TweetVerify from './TweetVerify';
import ChatInterface from './ChatInterface';
import BalanceTracker from './BalanceTracker';
import TokenPrice from './TokenPrice';
import PayoutTracker from './PayoutTracker';
import { getLatestTweets } from '@/lib/twitter';
import { initializePayoutWallet } from '@/lib/solana';
import { env } from '@/lib/env';

export default function Dashboard() {
  const [tweets, setTweets] = useState<any[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const fetchTweets = async () => {
      const latestTweets = await getLatestTweets();
      setTweets(latestTweets);
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 60000);

    // Initialize payout wallet
    if (env.SOLANA_PAYOUT_PRIVATE_KEY) {
      const initialized = initializePayoutWallet(env.SOLANA_PAYOUT_PRIVATE_KEY);
      if (!initialized) {
        console.error('Failed to initialize payout wallet');
      }
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/50 border-purple-500/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Verification
          </h2>
          <div className="space-y-4">
            <WalletConnect onVerified={() => setIsVerified(true)} />
            <TweetVerify isWalletConnected={isVerified} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 bg-black/50 border-green-500/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              Balance Tracker
            </h2>
            <BalanceTracker />
          </Card>
          <TokenPrice />
          <PayoutTracker />
        </div>

        <Card className="md:col-span-2 p-6 bg-black/50 border-purple-500/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4 text-purple-400">
            Cheshire Chat
          </h2>
          <ChatInterface />
        </Card>

        <Card className="md:col-span-2 p-6 bg-black/50 border-green-500/50 backdrop-blur">
          <h2 className="text-2xl font-bold mb-4 text-green-400">
            Latest Tweets
          </h2>
          <ScrollArea className="h-[300px]">
            {tweets.map((tweet, index) => (
              <div
                key={index}
                className="p-4 border border-green-500/20 rounded-lg mb-4"
              >
                <p className="text-sm text-green-300">{tweet.text}</p>
                <span className="text-xs text-gray-400">
                  {new Date(tweet.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
