# CheshireRaid - Raid-to-Earn Platform

CheshireRaid is a decentralized raid-to-earn platform that enables users to create and participate in Twitter engagement campaigns while earning SOL rewards.

## Features

- **Wallet Integration**: Seamless integration with Phantom wallet for SOL transactions
- **Twitter Authentication**: Secure OAuth authentication for Twitter actions
- **Raid Management**: Create and participate in Twitter raid campaigns
- **Automated Rewards**: Automatic SOL distribution for successful raid participation
- **Real-time Tracking**: Monitor raid progress and engagement metrics
- **User Dashboard**: Track participation history and earned rewards

## Tech Stack

- React + Vite
- Chakra UI
- Solana Web3.js
- Twitter API v2
- Express (OAuth Server)

## Prerequisites

- Node.js 16+
- NPM or PNPM
- Phantom Wallet
- Twitter Developer Account

## Environment Setup

Create a `.env` file in the root directory:

```env
# Twitter API Credentials
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret

# Session Security
SESSION_SECRET=your_session_secret

# Solana Configuration
SOLANA_NETWORK=devnet # or mainnet-beta
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cheshire-raid.git
cd cheshire-raid
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

## Project Structure

```
CheshireRaid/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── utils/         # Utility functions and helpers
├── public/            # Static assets
└── index.html         # Entry HTML file
```

## Core Components

### Wallet Integration
- Connects to Phantom wallet
- Manages SOL transactions
- Tracks wallet balance

### Twitter Integration
- OAuth authentication
- Action verification (likes, retweets)
- Engagement metrics tracking

### Raid System
- Create raid campaigns
- Set reward amounts
- Define participation requirements
- Automated reward distribution

## Development

### Running Tests
```bash
npm test
# or
pnpm test
```

### Building for Production
```bash
npm run build
# or
pnpm build
```

### Local Development
The development server runs on port 3001 to avoid conflicts with the OAuth server (port 3000).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All sensitive data is stored securely
- OAuth implementation follows security best practices
- Session management with secure cookies
- Input validation and sanitization
- Rate limiting on API endpoints

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Solana Foundation
- Twitter API Team
- Phantom Wallet Team
- ChakraUI Team

## Roadmap

- [ ] Mobile responsive design
- [ ] Multi-wallet support
- [ ] Advanced analytics dashboard
- [ ] Custom raid templates
- [ ] Community features
- [ ] Integration with more social platforms
