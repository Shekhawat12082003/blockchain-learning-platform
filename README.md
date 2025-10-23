# 🎓 Blockchain Learning Platform

<div align="center">

![Platform Banner](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) 
![Blockchain](https://img.shields.io/badge/Blockchain-Verified-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A decentralized learning platform combining AI tutoring with blockchain-verified certificates**

[Live Demo](#-live-deployment) • [Features](#-features) • [Documentation](#-documentation) • [Quick Start](#-quick-start)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Live Deployment](#-live-deployment)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Smart Contracts](#-smart-contracts)
- [AI Integration](#-ai-integration)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

This platform revolutionizes online learning by combining **AI-powered tutoring** with **blockchain technology** to create a transparent, verifiable, and gamified learning experience. Students can learn any subject with AI assistance and earn **soulbound NFT certificates** as immutable proof of their achievements.

### Why This Platform?

- ✅ **Free AI Tutoring** - Access to multiple AI providers (Gemini, HuggingFace, Cohere)
- ✅ **Blockchain Verified** - Certificates stored permanently on-chain
- ✅ **Gamification** - Points, levels, and achievements system
- ✅ **Non-Transferable** - Soulbound tokens ensure authenticity
- ✅ **Public Verification** - Anyone can verify certificate authenticity
- ✅ **Progress Tracking** - Real-time learning analytics on blockchain

---

## ✨ Features

### 🤖 AI-Powered Learning

- **Interactive Chat Interface** - Real-time AI tutoring on any subject
- **Concept Explainer** - Deep-dive explanations with multiple depth levels
- **Quiz Generator** - AI-generated quizzes with instant feedback
- **Study Planner** - Personalized learning roadmaps
- **Multi-Provider Support** - Automatic fallback between AI providers

### 📜 Blockchain Certificates

- **NFT Certificates** - ERC721 tokens for each achievement
- **Soulbound Tokens** - Non-transferable proof of learning
- **On-Chain Metadata** - Subject, sessions, timestamp, points
- **Certificate Gallery** - View all earned certificates
- **Public Verification** - Verify any certificate by Token ID

### 📊 Progress & Gamification

- **Points System** - 10 points per completed session
- **Level Progression** - Level up every 100 points
- **Achievement Badges** - Unlock achievements for milestones
- **Subject Breakdown** - Track progress by subject
- **Global Leaderboard** - Platform-wide statistics

### 🔐 Security & Transparency

- **Smart Contract Verified** - Audited Solidity contracts
- **Issuer Authorization** - Only authorized issuers can mint
- **Revocation System** - Ability to revoke invalid certificates
- **Immutable Records** - Permanent blockchain storage
- **MetaMask Integration** - Secure wallet connection

---

## 🛠️ Tech Stack

### Blockchain Layer
- **Solidity** - Smart contract development
- **Hardhat** - Ethereum development environment
- **OpenZeppelin** - Secure contract libraries
- **Ethers.js** - Blockchain interaction library
- **Core Blockchain** - Testnet2 deployment (Chain ID: 1114)

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for AI APIs

### AI Integration
- **Google Gemini** - Primary AI provider (FREE)
- **HuggingFace** - Fallback AI provider (FREE)
- **Cohere** - Secondary fallback (FREE)
- **Mock Mode** - Demo mode without API keys

### Development Tools
- **Git** - Version control
- **npm** - Package management
- **MetaMask** - Web3 wallet

---

## 🔗 Live Deployment

### Smart Contract Details

| Property | Value |
|----------|-------|
| **Contract Address** | `0xF5689A0B960b9fED8D40422676B580FD10Ed6322` |
| **Network** | Core Testnet2 |
| **Chain ID** | 1114 |
| **RPC URL** | https://rpc.test2.btcs.network |
| **Block Explorer** | [View on Explorer](https://scan.test2.btcs.network/address/0xF5689A0B960b9fED8D40422676B580FD10Ed6322) |
| **Faucet** | [Get Free Tokens](https://scan.test2.btcs.network/faucet) |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** or yarn package manager
- **MetaMask** browser extension ([Install](https://metamask.io/))
- **Git** for cloning the repository

### Installation Steps

1. **Clone the Repository**
```bash
git clone https://github.com/Shekhawat12082003/blockchain-learning-platform.git
cd blockchain-learning-platform
```

2. **Install Dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

3. **Configure Environment**

Create `frontend/.env` file:
```env
# AI Provider API Keys (Optional - works without them in mock mode)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_HUGGINGFACE_API_KEY=your_huggingface_token_here
VITE_COHERE_API_KEY=your_cohere_api_key_here

# Contract Configuration
VITE_CONTRACT_ADDRESS=0xF5689A0B960b9fED8D40422676B580FD10Ed6322
VITE_CHAIN_ID=1114
```

4. **Run Development Server**
```bash
cd frontend
npm run dev
```

5. **Open Browser**

Visit: **http://localhost:3000**

6. **Configure MetaMask**

- Network Name: `Core Testnet2`
- RPC URL: `https://rpc.test2.btcs.network`
- Chain ID: `1114`
- Currency Symbol: `CORE`

7. **Get Test Tokens**

Visit the [faucet](https://scan.test2.btcs.network/faucet) to receive free testnet tokens.

---

## 📁 Project Structure

```
blockchain-learning-platform/
│
├── contracts/                      # Smart Contracts
│   ├── LearningCertificate.sol    # Main NFT certificate contract
│   ├── LearningPathManager.sol    # Course management (future)
│   └── QuizSystem.sol             # Quiz management (future)
│
├── scripts/                       # Deployment Scripts
│   ├── deployAll.js              # Deploy all contracts
│   └── setupQuiz.js              # Setup quiz system
│
├── frontend/                      # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── App.jsx          # Main app component
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── IssueCertificate.jsx
│   │   │   ├── CertificateGallery.jsx
│   │   │   ├── ProgressDashboard.jsx
│   │   │   ├── QuizInterface.jsx
│   │   │   ├── StudyPlanner.jsx
│   │   │   ├── ConceptExplainer.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── VerifyCertificate.jsx
│   │   │
│   │   ├── services/            # Business logic
│   │   │   ├── contractService.js
│   │   │   ├── aiService.js
│   │   │   └── enhancedAIService.js
│   │   │
│   │   ├── config/              # Configuration
│   │   │   └── constants.js
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   └── helpers.js
│   │   │
│   │   ├── styles/              # CSS styling
│   │   │   ├── index.css
│   │   │   ├── App.css
│   │   │   ├── components.css
│   │   │   ├── features.css
│   │   │   └── ChatInterface.css
│   │   │
│   │   └── main.jsx             # Entry point
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docs/                         # Documentation
│   ├── SETUP.md                 # Setup instructions
│   ├── CONTRACTS.md             # Contract documentation
│   ├── AI_INTEGRATION.md        # AI setup guide
│   └── STRUCTURE.md             # Project structure
│
├── hardhat.config.js            # Hardhat configuration
├── package.json                 # Root dependencies
└── README.md                    # This file
```

---

## 📜 Smart Contracts

### LearningCertificate.sol

The main contract powering the platform.

**Key Functions:**
- `issueCertificate()` - Mint new certificate NFT
- `getUserProgress()` - Get user's points, level, stats
- `getCertificateData()` - Retrieve certificate details
- `isValid()` - Check certificate validity
- `revokeCertificate()` - Revoke a certificate (admin)

**Features:**
- ERC721 compliant NFT
- Soulbound (non-transferable)
- Points & leveling system (100 points = 1 level)
- Subject-based tracking
- Global statistics

**Events:**
- `CertificateIssued(address indexed to, uint256 indexed tokenId, string subject, uint256 points)`
- `ProgressUpdated(address indexed user, uint256 points, uint256 level)`
- `CertificateRevoked(uint256 indexed tokenId)`

---

## 🤖 AI Integration

### Supported Providers

1. **Google Gemini** (Recommended)
   - Model: `gemini-pro`
   - Rate Limit: 60 requests/minute
   - Get API Key: [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **HuggingFace**
   - Model: `google/flan-t5-base`
   - Rate Limit: 1000 requests/day
   - Get Token: [HuggingFace Settings](https://huggingface.co/settings/tokens)

3. **Cohere**
   - Model: `command-r-plus-08-2024`
   - Rate Limit: 100 calls/minute
   - Get API Key: [Cohere Dashboard](https://dashboard.cohere.com/api-keys)

### Features
- **Automatic Fallback** - Switches providers if one fails
- **Mock Mode** - Works without API keys for testing
- **Context Awareness** - Maintains conversation history
- **Multi-Subject** - Supports all learning domains

---

## 📖 Usage Guide

### For Students

1. **Connect Wallet**
   - Install MetaMask
   - Connect to Core Testnet2
   - Get free test tokens from faucet

2. **Start Learning**
   - Choose subject in chat interface
   - Ask questions to AI tutor
   - Complete learning sessions

3. **Earn Certificates**
   - Complete minimum session interactions
   - Click "Complete Session & Get Certificate"
   - Approve blockchain transaction
   - Certificate minted as NFT

4. **Track Progress**
   - View Progress Dashboard
   - Check points, level, achievements
   - See subject breakdown
   - Track all earned certificates

5. **Take Quizzes**
   - Generate AI-powered quizzes
   - Test knowledge on any subject
   - Get instant feedback
   - Earn points for performance

### For Educators

1. **Become Issuer**
   - Contact contract owner
   - Get wallet address authorized
   - Ability to issue certificates

2. **Issue Certificates**
   - Enter student's wallet address
   - Specify subject and sessions
   - Submit transaction
   - Certificate minted on-chain

### For Verifiers

1. **Verify Certificates**
   - Go to Verify page
   - Enter Token ID
   - View certificate details
   - Check validity and authenticity

---

## 📸 Screenshots

### Main Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/ffffff?text=AI+Learning+Dashboard)

### Chat Interface
![Chat](https://via.placeholder.com/800x400/764ba2/ffffff?text=AI+Tutor+Chat)

### Certificate Gallery
![Certificates](https://via.placeholder.com/800x400/10b981/ffffff?text=NFT+Certificate+Gallery)

### Progress Tracking
![Progress](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Learning+Progress)

---

## 📚 Documentation

Detailed documentation available in the `/docs` folder:

- **[Setup Guide](./docs/SETUP.md)** - Complete installation and configuration
- **[Smart Contracts](./docs/CONTRACTS.md)** - Contract architecture and API
- **[AI Integration](./docs/AI_INTEGRATION.md)** - AI provider setup and usage
- **[Project Structure](./docs/STRUCTURE.md)** - Codebase organization

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star this repository

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use ESLint for JavaScript/React
- Follow Solidity best practices
- Write clear commit messages
- Add comments for complex logic

---

## 🔒 Security

- Smart contracts use OpenZeppelin libraries
- Only authorized issuers can mint certificates
- Soulbound tokens prevent transfer fraud
- All certificate data immutably stored on-chain
- MetaMask integration for secure transactions

**Report Security Issues:** If you discover a security vulnerability, please email [your-email@example.com]

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Blockchain Learning Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **OpenZeppelin** - Secure smart contract libraries
- **Core Blockchain** - Testnet infrastructure
- **Google Gemini** - AI tutoring capabilities
- **React Team** - Frontend framework
- **Vite** - Lightning-fast build tool

---

## 📞 Contact & Support

- **GitHub Issues:** [Report Issues](https://github.com/Shekhawat12082003/blockchain-learning-platform/issues)
- **Discussions:** [Join Discussions](https://github.com/Shekhawat12082003/blockchain-learning-platform/discussions)
- **Email:** your-email@example.com

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Shekhawat12082003/blockchain-learning-platform&type=Date)](https://star-history.com/#Shekhawat12082003/blockchain-learning-platform&Date)

---

<div align="center">

**Built with ❤️ by [Shekhawat12082003](https://github.com/Shekhawat12082003)**

If you found this project helpful, please consider giving it a ⭐!

[⬆ Back to Top](#-blockchain-learning-platform)

</div>
