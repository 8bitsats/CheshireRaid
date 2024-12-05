import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyTweet } from '@/lib/twitter';
import { Loader2, Check, X } from 'lucide-react';

interface PointRule {
  type: string;
  value: string;
  points: number;
}

interface Props {
  isWalletConnected: boolean;
}

interface VerificationResponse {
  verified: boolean;
  points?: number;
  message?: string;
  tweet?: {
    id: string;
    text: string;
    created_at: string;
  };
}

export default function TweetVerify({ isWalletConnected }: Props) {
  const [username, setUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [error, setError] = useState('');
  const [rules, setRules] = useState<PointRule[]>([]);
  const [pointValue, setPointValue] = useState(0);

  const handleVerify = async () => {
    if (!username) return;
    
    setIsVerifying(true);
    setError('');

    try {
      const response = await verifyTweet(username);
      if (response.verified) {
        setIsVerified(true);
        setPointsEarned(response.points || 0);
      } else {
        setError(response.message || 'Tweet verification failed. Make sure you tweeted with $grin, #grin, #cheshireterminal, or @cheshiregpt');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Twitter Username"
      {isVerified && pointsEarned > 0 && (
        <div className="mt-4 p-4 bg-green-500/20 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400">Points Earned!</h3>
          <p className="text-sm text-gray-300">You earned {pointsEarned} points</p>
          <p className="text-xs text-gray-400">
            Worth approximately {((pointsEarned * pointValue) / 1e9).toFixed(4)} SOL
          </p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-semibold text-purple-400">Available Points:</h3>
        <ul className="text-xs space-y-1 text-gray-300">
          <li>$grin - 10 points</li>
          <li>#grin - 5 points</li>
          <li>#cheshireterminal - 15 points</li>
          <li>@cheshiregpt - 20 points</li>
        </ul>
      </div>
        disabled={!isWalletConnected || isVerified}
        className="bg-black/50 border-purple-500/50"
      />

      <Button
        onClick={handleVerify}
        disabled={!isWalletConnected || !username || isVerifying || isVerified}
        className={`w-full ${
          isVerified ? 'bg-green-500' : 'bg-purple-500'
        } hover:bg-opacity-90`}
      >
        {isVerifying ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : isVerified ? (
          <Check className="h-4 w-4 mr-2" />
        ) : null}
        {isVerified
          ? 'Tweet Verified'
          : isVerifying
          ? 'Verifying...'
          : 'Verify Tweet'}
      </Button>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 text-sm">
          <X className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
