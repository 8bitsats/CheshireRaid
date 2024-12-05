import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { verifyHoldings } from '@/lib/solana';
import { Loader2, Check, X } from 'lucide-react';

interface Props {
  onVerified: () => void;
}

export default function WalletConnect({ onVerified }: Props) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const connectWallet = async () => {
    setIsConnecting(true);
    setError('');

    try {
      // Connect wallet using Phantom or other adapter
      const wallet = (window as any).solana;
      if (!wallet) {
        throw new Error('Please install Phantom wallet');
      }

      await wallet.connect();
      const walletAddress = wallet.publicKey.toString();
      
      // Verify holdings
      const hasHoldings = await verifyHoldings(walletAddress);
      if (hasHoldings) {
        setIsVerified(true);
        onVerified();
      } else {
        setError('No required holdings found');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={connectWallet}
        disabled={isConnecting || isVerified}
        className={`w-full ${
          isVerified ? 'bg-green-500' : 'bg-purple-500'
        } hover:bg-opacity-90`}
      >
        {isConnecting ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : isVerified ? (
          <Check className="h-4 w-4 mr-2" />
        ) : null}
        {isVerified
          ? 'Wallet Verified'
          : isConnecting
          ? 'Connecting...'
          : 'Connect Wallet'}
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
