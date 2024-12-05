import { FC, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { fetchTokenPrice, Token } from '../services/solanaTracker';

const SOL_ADDRESS = 'So11111111111111111111111111111111111111112';

const formatNumber = (num: number) => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
};

const TokenPrice: FC = () => {
  const [tokenInfo, setTokenInfo] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTokenInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTokenPrice(SOL_ADDRESS);
        setTokenInfo(data);
      } catch (err) {
        setError('Failed to load token information');
        console.error('Token price error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenInfo();
    const interval = setInterval(loadTokenInfo, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="p-4 bg-black/30 border-purple-500/50 backdrop-blur-sm">
        <div className="flex justify-center items-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 bg-black/30 border-purple-500/50 backdrop-blur-sm">
        <div className="text-center text-red-400 py-4">
          <p>{error}</p>
          <button 
            onClick={() => setTokenInfo(null)}
            className="mt-2 px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-black/30 border-purple-500/50 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            {tokenInfo?.image && (
              <img
                src={tokenInfo.image}
                alt="SOL"
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            )}
            <div>
              <div className="text-sm text-gray-400">Current Price</div>
              <div className="text-2xl font-bold text-purple-400">
                ${tokenInfo?.price.toFixed(6)}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-xs text-gray-400">Market Cap</div>
              <div className="text-sm text-purple-400">
                ${formatNumber(tokenInfo?.market_cap || 0)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Price Change</div>
              <div 
                className={`text-sm ${
                  (tokenInfo?.price_change || 0) >= 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}
              >
                {(tokenInfo?.price_change || 0) >= 0 ? '+' : ''}
                {(tokenInfo?.price_change || 0).toFixed(2)}%
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
};

export default TokenPrice;
