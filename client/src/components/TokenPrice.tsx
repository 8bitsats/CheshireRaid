import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface TokenInfo {
  price: number;
  marketCap: number;
  volume24h: number;
}

export default function TokenPrice() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        // Using Jupiter API for token price data
        const response = await fetch('https://price.jup.ag/v4/price?ids=7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE');
        const data = await response.json();
        const tokenData = data.data['7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE'];
        
        const priceData = {
          price: tokenData?.price || 0,
          marketCap: tokenData?.marketCap || 0,
          volume24h: tokenData?.volume24h || 0
        };
        setTokenInfo(priceData);
      } catch (error) {
        console.error('Error fetching token info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfo();
    const interval = setInterval(fetchTokenInfo, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4 bg-black/30 border-purple-500/50 backdrop-blur-sm">
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Current Price</div>
        {isLoading ? (
          <div className="animate-pulse h-6 bg-purple-500/20 rounded" />
        ) : (
          <div className="text-2xl font-bold text-purple-400">
            ${tokenInfo?.price?.toFixed(4) ?? 'N/A'}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <div className="text-xs text-gray-400">Market Cap</div>
            <div className="text-sm text-purple-400">
              ${tokenInfo?.marketCap?.toLocaleString() ?? 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="text-sm text-purple-400">
              ${tokenInfo?.volume24h?.toLocaleString() ?? 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
