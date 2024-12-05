import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-green-400 to-purple-400 text-transparent bg-clip-text animate-gradient">
            Cheshire Terminal
          </h1>
          <p className="text-gray-400 mt-4">
            Your gateway to the Solana wonderland
          </p>
        </header>

        <Dashboard />
      </div>
    </div>
  );
}
