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
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    const fetchTokenInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true',
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            },
            // Add timeout to prevent hanging requests
            signal: AbortSignal.timeout(5000)
          }
        );
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.solana) {
          throw new Error('Token price data not found');
        }
        
        const priceData = {
          price: data.solana.usd,
          marketCap: data.solana.usd_market_cap,
          volume24h: data.solana.usd_24h_vol
        };
        
        setTokenInfo(priceData);
        retryCount = 0; // Reset retry count on success
      } catch (error) {
        console.error('Error fetching token info:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying (${retryCount}/${maxRetries}) in ${retryDelay}ms...`);
          setTimeout(fetchTokenInfo, retryDelay * retryCount);
        } else {
          setTokenInfo(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfo();
    // Update every minute instead of 30s to avoid rate limits
    const interval = setInterval(fetchTokenInfo, 60000);

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
