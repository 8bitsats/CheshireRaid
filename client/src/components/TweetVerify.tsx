import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyTweet } from '@/lib/twitter';
import { Loader2, Check, X } from 'lucide-react';

interface Props {
  isWalletConnected: boolean;
}

export default function TweetVerify({ isWalletConnected }: Props) {
  const [username, setUsername] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!username) return;
    
    setIsVerifying(true);
    setError('');

    try {
      const verified = await verifyTweet(username);
      if (verified) {
        setIsVerified(true);
      } else {
        setError('Tweet verification failed. Make sure you tweeted with #$grin and mentioned @cheshiregpt');
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
