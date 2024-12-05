import { FC, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLatestTweets } from '@/lib/twitter';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    username: string;
    profile_image_url: string;
  };
  metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
  };
}

const TwitterDashboard: FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const latestTweets = await getLatestTweets();
        setTweets(latestTweets);
      } catch (err) {
        setError('Failed to load tweets');
        console.error('Twitter dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
    const interval = setInterval(fetchTweets, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6 bg-black/30 border-purple-500/50 backdrop-blur-sm">
        <div className="flex justify-center items-center h-24">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-black/30 border-purple-500/50 backdrop-blur-sm">
        <div className="text-center text-red-400 py-4">
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-purple-500/50 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Latest Tweets</h2>
      <ScrollArea className="h-[300px]">
        <AnimatePresence mode="wait">
          {tweets.map((tweet, index) => (
            <motion.div
              key={tweet.id}
              className="mb-4 p-4 bg-black/20 rounded-lg border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                {tweet.author.profile_image_url && (
                  <img
                    src={tweet.author.profile_image_url}
                    alt={tweet.author.username}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-purple-400">@{tweet.author.username}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(tweet.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-200 mt-2">{tweet.text}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                    <span>🔁 {tweet.metrics.retweet_count}</span>
                    <span>💬 {tweet.metrics.reply_count}</span>
                    <span>❤️ {tweet.metrics.like_count}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
};

export default TwitterDashboard;
