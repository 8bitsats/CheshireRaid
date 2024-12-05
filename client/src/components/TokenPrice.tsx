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
        const response = await fetch('https://data.solanatracker.io/price', {
          headers: {
            'x-api-key': '91a88295-acb4-4f38-b9af-3cd58b69856b',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: 'GET'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || typeof data.price === 'undefined') {
          throw new Error('Invalid response format from API');
        }
        
        const priceData = {
          price: parseFloat(data.price || '0'),
          marketCap: parseFloat(data.marketCap || '0'),
          volume24h: parseFloat(data.volume24h || '0')
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
        ) : tokenInfo ? (
          <div className="text-2xl font-bold text-purple-400">
            ${tokenInfo.price.toFixed(4)}
          </div>
        ) : (
          <div className="text-sm text-red-400">
            Unable to fetch price data. Please try again later.
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
