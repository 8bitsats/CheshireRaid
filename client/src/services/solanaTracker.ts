import { env } from '../lib/env';

export interface Token {
  address: string;
  name: string;
  symbol: string;
  price: number;
  price_change: number;
  volume: number;
  market_cap: number;
  holders: number;
  image?: string;
}

const SOLANA_TRACKER_API = 'https://pro-api.solscan.io/v1';

export async function fetchTrendingTokens(timeframe: '15m' | '1h' | '24h'): Promise<Token[]> {
  try {
    const response = await fetch(`${SOLANA_TRACKER_API}/trending?timeframe=${timeframe}`, {
      headers: {
        'Authorization': `Bearer ${env.SOLANA_TRACKER_API_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.tokens;
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    throw error;
  }
}

export async function fetchTokenPrice(tokenAddress: string): Promise<Token> {
  try {
    const response = await fetch(`${SOLANA_TRACKER_API}/token/meta?tokenAddress=${tokenAddress}`, {
      headers: {
        'token': env.SOLANA_TRACKER_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the response to match our Token interface
    return {
      address: tokenAddress,
      name: data.name || 'Unknown',
      symbol: data.symbol || 'Unknown',
      price: data.priceUsdt || 0,
      price_change: data.priceChange24h || 0,
      volume: data.volume24h || 0,
      market_cap: data.marketCapFD || 0,
      holders: data.holder || 0,
      image: data.icon || undefined
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    throw error;
  }
}
