# 📁 Project Structure

```
SEM Project/
│
├── 📁 contracts/                    # Smart Contracts
│   ├── LearningCertificate.sol     # Main certificate NFT contract
│   ├── LearningPathManager.sol     # Learning path management
│   └── QuizSystem.sol              # Quiz functionality
│
├── 📁 scripts/                      # Deployment Scripts
│   ├── deployAll.js                # ✨ Unified deployment (USE THIS)
│   └── setupQuiz.js                # Quiz system setup
│
├── 📁 frontend/                     # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/          # React Components
│   │   │   ├── ChatInterface.jsx   # AI chat interface
│   │   │   ├── ConnectWallet.jsx   # Wallet connection
│   │   │   ├── IssueCertificate.jsx # Certificate minting
│   │   │   ├── VerifyCertificate.jsx # Certificate verification
│   │   │   ├── CertificateGallery.jsx # User's certificates
│   │   │   ├── ProgressDashboard.jsx # Progress tracking
│   │   │   ├── Leaderboard.jsx     # Global statistics
│   │   │   ├── QuizInterface.jsx   # Quiz component
│   │   │   ├── StudyPlanner.jsx    # Study planning
│   │   │   └── ConceptExplainer.jsx # Concept explanations
│   │   │
│   │   ├── 📁 services/            # Service Layer
│   │   │   ├── aiService.js        # AI provider integration
│   │   │   └── enhancedAIService.js # Advanced AI features
│   │   │
│   │   ├── 📁 config/              # Configuration
│   │   │   └── constants.js        # App constants
│   │   │
│   │   ├── 📁 styles/              # CSS Stylesheets
│   │   │   ├── index.css           # Global styles
│   │   │   ├── App.css             # App & sidebar styles
│   │   │   ├── ChatInterface.css   # Chat styles
│   │   │   └── [other component styles]
│   │   │
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # Entry point
│   │
│   ├── .env                        # Environment variables
│   ├── .env.example                # Environment template
│   ├── package.json                # Dependencies
│   └── vite.config.js              # Vite configuration
│
├── 📁 docs/                         # Documentation
│   ├── SETUP.md                    # Setup instructions
│   ├── CONTRACTS.md                # Smart contract docs
│   ├── AI_INTEGRATION.md           # AI integration guide
│   └── STRUCTURE.md                # This file
│
├── 📁 artifacts/                    # Compiled contracts (auto-generated)
├── 📁 cache/                        # Build cache (auto-generated)
├── 📁 node_modules/                 # Dependencies (auto-generated)
│
├── .env.example                     # Backend env template
├── .gitignore                       # Git ignore rules
├── hardhat.config.js                # Hardhat configuration
├── package.json                     # Backend dependencies
├── secret.json                      # Private key (DO NOT COMMIT)
└── README.md                        # Main documentation

```

## 🗂️ Key Files Explained

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `hardhat.config.js` | Blockchain network configuration |
| `package.json` | Backend dependencies |
| `secret.json` | Private key for deployment (gitignored) |

### Smart Contracts (`/contracts`)

| File | Purpose |
|------|---------|
| `LearningCertificate.sol` | ⭐ Main contract - NFT certificates with progress |
| `LearningPathManager.sol` | Learning path and milestone tracking |
| `QuizSystem.sol` | Quiz creation and verification |

### Deployment Scripts (`/scripts`)

| File | Purpose | Use Case |
|------|---------|----------|
| `deployAll.js` | ✨ **Unified deployment** | Deploy all contracts at once |
| `setupQuiz.js` | Quiz setup | Initialize quiz system |

### Frontend (`/frontend/src`)

#### Components
- `ChatInterface.jsx` - Main AI chat with subject selection
- `ConnectWallet.jsx` - MetaMask integration
- `IssueCertificate.jsx` - Mint certificates to blockchain
- `VerifyCertificate.jsx` - Verify certificate authenticity
- `CertificateGallery.jsx` - Display user's certificates
- `ProgressDashboard.jsx` - Show points, levels, achievements
- `Leaderboard.jsx` - Platform-wide statistics
- `QuizInterface.jsx` - Take quizzes
- `StudyPlanner.jsx` - Create study plans
- `ConceptExplainer.jsx` - Get concept explanations

#### Services
- `aiService.js` - Basic AI chat with fallback system
- `enhancedAIService.js` - Quiz generation, explanations, study plans

#### Styles
Each component has its own CSS file for styling.

### Documentation (`/docs`)

| File | Content |
|------|---------|
| `SETUP.md` | Complete installation guide |
| `CONTRACTS.md` | Smart contract documentation |
| `AI_INTEGRATION.md` | AI provider setup guide |
| `STRUCTURE.md` | This file - project structure |

## 🔄 File Flow

### Certificate Issuance Flow
```
User clicks "Issue Certificate"
    ↓
IssueCertificate.jsx
    ↓
Ethers.js → LearningCertificate.sol
    ↓
Blockchain transaction
    ↓
Certificate NFT minted
    ↓
Progress updated (points, level)
```

### AI Chat Flow
```
User sends message
    ↓
ChatInterface.jsx
    ↓
aiService.js
    ↓
Try Gemini → HuggingFace → Cohere → Mock
    ↓
Response displayed in chat
```

## 🎯 Important Files to Configure

1. **`frontend/.env`** - API keys and contract address
2. **`secret.json`** - Wallet private key for deployment
3. **`hardhat.config.js`** - Network settings (already configured)

## 🚫 Files to Ignore (in .gitignore)

- `node_modules/`
- `secret.json`
- `frontend/.env`
- `artifacts/`
- `cache/`

## 📊 Size Overview

| Directory | Purpose | Size Type |
|-----------|---------|-----------|
| contracts/ | ~3 files | Small |
| scripts/ | ~2 files | Small |
| frontend/src/components/ | ~10 files | Medium |
| frontend/src/services/ | ~3 files | Small |
| frontend/src/utils/ | ~1 file | Small |
| docs/ | ~5 files | Small |
| node_modules/ | Dependencies | Large |

## ✨ Next Steps

1. Read [SETUP.md](./SETUP.md) for installation
2. Review [CONTRACTS.md](./CONTRACTS.md) for contract details
3. Check [AI_INTEGRATION.md](./AI_INTEGRATION.md) for AI setup
4. Return to [README.md](../README.md) for overview
