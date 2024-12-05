import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getWalletBalance, subscribeToBalanceUpdates } from '@/lib/solana';

export default function BalanceTracker() {
  const [balance, setBalance] = useState<number>(0);
  const [previousBalance, setPreviousBalance] = useState<number>(0);

  useEffect(() => {
    const initBalance = async () => {
      const currentBalance = await getWalletBalance();
      setBalance(currentBalance);
      setPreviousBalance(currentBalance);
    };

    initBalance();

    // Subscribe to balance updates
    subscribeToBalanceUpdates((newBalance) => {
      setPreviousBalance(balance);
      setBalance(newBalance);
    });
  }, []);

  const balanceChange = balance - previousBalance;
  const isPositive = balanceChange >= 0;

  return (
    <Card className="p-6 bg-black/30 border-green-500/30">
      <div className="space-y-2">
        <div className="text-sm text-gray-400">Current Balance</div>
        <div className="text-3xl font-bold text-green-400">
          {balance.toFixed(4)} SOL
        </div>
        
        {balanceChange !== 0 && (
          <div
            className={`text-sm ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}{balanceChange.toFixed(4)} SOL
          </div>
        )}
      </div>
    </Card>
  );
}
