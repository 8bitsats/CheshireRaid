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
          <img 
            src="https://guzlanuvzfgcekmupcrx.supabase.co/storage/v1/object/public/Ammo/dope.png"
            alt="Grin Logo"
            className="mx-auto mt-4 h-24 w-auto"
          />
          <div className="flex justify-center items-center mt-6">
            <div className="relative group">
              <div className="bg-black/30 border border-purple-500/50 rounded-lg p-4 backdrop-blur-sm animate-pulse">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400 font-mono">
                    7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("7JofsgKgD3MerQDa7hEe4dfkY3c3nMnsThZzUuYyTFpE");
                    }}
                    className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            </div>
          </div>
        </header>

        <Dashboard />
      </div>
    </div>
  );
}
