import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { getPayoutStats } from '@/lib/solana';

interface PayoutStats {
  totalPaidOut: number;
  remainingToEarn: number;
}

export default function PayoutTracker() {
  const [stats, setStats] = useState<PayoutStats>({
    totalPaidOut: 0,
    remainingToEarn: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const payoutStats = await getPayoutStats();
      setStats(payoutStats);
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 bg-black/30 border-purple-500/30">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Total Paid Out</div>
          <div className="text-2xl font-bold text-purple-400">
            {stats.totalPaidOut.toFixed(4)} SOL
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm text-gray-400">Remaining to Earn</div>
          <div className="text-2xl font-bold text-green-400">
            {stats.remainingToEarn.toFixed(4)} SOL
          </div>
        </div>
      </div>
    </Card>
  );
}
