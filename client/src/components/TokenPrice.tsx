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
    const baseDelay = 1000;
    let controller: AbortController;

    const fetchTokenInfo = async () => {
      try {
        setIsLoading(true);
        
        // Create new AbortController for this request
        controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // Try primary API first, then fallback
const endpoints = [
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true',
          'https://price.jup.ag/v4/price?ids=SOL'
        ];
        
let response;
let isJupiter = false;

for (const endpoint of endpoints) {
  try {
    response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      signal: controller.signal
    });
            
    if (response.ok) {
      isJupiter = endpoint.includes('jup.ag');
      break;
    }
  } catch (error) {
    console.warn(`Failed to fetch from ${endpoint}:`, error);
    continue;
  }
}

if (!response || !response.ok) {
  throw new Error('All price API endpoints failed');
}

        // Clear timeout since request completed
        clearTimeout(timeoutId);
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        let priceData;
        if (isJupiter) {
          if (!data.data?.SOL) {
            throw new Error('Token price data not found in Jupiter response');
          }
          priceData = {
            price: data.data.SOL.price,
            marketCap: 0, // Jupiter doesn't provide market cap
            volume24h: 0  // Jupiter doesn't provide volume
          };
        } else {
          if (!data?.solana) {
            throw new Error('Token price data not found in CoinGecko response');
          }
          priceData = {
            price: data.solana.usd,
            marketCap: data.solana.usd_market_cap,
            volume24h: data.solana.usd_24h_vol
          };
        }
        
        setTokenInfo(priceData);
        retryCount = 0; // Reset retry count on success
      } catch (error) {
        console.error('Error fetching token info:', error);
        if (error.name === 'AbortError') {
          console.log('Request timed out');
        }
        
        if (retryCount < maxRetries) {
          retryCount++;
          const delay = Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
          console.log(`Retrying (${retryCount}/${maxRetries}) in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchTokenInfo();
        } else {
          setTokenInfo(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenInfo();
    
    // Update every 2 minutes to avoid rate limits
    const interval = setInterval(fetchTokenInfo, 120000);

    return () => {
      clearInterval(interval);
      if (controller) {
        controller.abort();
      }
    };
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
              {tokenInfo?.marketCap ? `$${tokenInfo.marketCap.toLocaleString()}` : 'Data unavailable'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="text-sm text-purple-400">
              {tokenInfo?.volume24h ? `$${tokenInfo.volume24h.toLocaleString()}` : 'Data unavailable'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
