# 🚀 Setup Guide

Complete setup instructions for the AI Learning Tutor platform.

## Prerequisites

- Node.js v16+ ([Download](https://nodejs.org/))
- MetaMask browser extension ([Install](https://metamask.io/))
- Git (optional)

## Quick Start

### 1. Clone & Install
```bash
# Clone repository
git clone <your-repo-url>
cd "SEM Project"

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Blockchain

#### Get Core Testnet Tokens
1. Visit [Core Testnet Faucet](https://scan.test2.btcs.network/faucet)
2. Enter your wallet address
3. Receive test CORE tokens

#### Configure MetaMask
Network will auto-add when connecting wallet, or add manually:
- **Network Name**: Core Testnet2
- **RPC URL**: https://rpc.test2.btcs.network
- **Chain ID**: 1114
- **Currency**: CORE
- **Explorer**: https://scan.test2.btcs.network

### 3. Setup AI APIs (Optional - FREE)

All AI providers are FREE with generous limits:

#### Google Gemini (Recommended - Best)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Add to `frontend/.env`: `VITE_GEMINI_API_KEY=your_key`

#### HuggingFace (Fallback)
1. Sign up at [HuggingFace](https://huggingface.co/)
2. Go to Settings → Access Tokens
3. Create token
4. Add to `frontend/.env`: `VITE_HUGGINGFACE_API_KEY=your_key`

#### Cohere (Fallback)
1. Sign up at [Cohere](https://cohere.com/)
2. Get API key from dashboard
3. Add to `frontend/.env`: `VITE_COHERE_API_KEY=your_key`

**Note**: App works without API keys using mock mode for testing!

### 4. Configure Environment

#### Backend: `secret.json` (root directory)
```json
{
  "privateKey": "YOUR_WALLET_PRIVATE_KEY"
}
```
⚠️ Keep this file secret! It's in `.gitignore`

#### Frontend: `frontend/.env`
```env
VITE_CONTRACT_ADDRESS=0xF5689A0B960b9fED8D40422676B580FD10Ed6322
VITE_CHAIN_ID=1114
VITE_GEMINI_API_KEY=your_gemini_key
VITE_HUGGINGFACE_API_KEY=your_hf_key
VITE_COHERE_API_KEY=your_cohere_key
```

### 5. Authorize Wallet as Issuer

```bash
npx hardhat console --network testnet
```

In console:
```javascript
const LearningCertificate = await ethers.getContractFactory("LearningCertificate");
const contract = await LearningCertificate.attach("0xF5689A0B960b9fED8D40422676B580FD10Ed6322");
await contract.addIssuer("YOUR_WALLET_ADDRESS");
// Wait for tx, then: .exit
```

### 6. Run Application

```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3000**

## Deployment (Optional)

To deploy your own contract:

```bash
# Compile contracts
npx hardhat compile

# Deploy to Core Testnet
npx hardhat run scripts/deployAll.js --network testnet

# Update frontend/.env with new contract address
```

## Troubleshooting

### MetaMask Connection Issues
- Clear browser cache
- Reset MetaMask account (Settings → Advanced → Reset Account)
- Ensure Core Testnet2 is selected

### Transaction Failures
- Check you have CORE tokens
- Increase gas limit in MetaMask
- Wait for previous transaction to confirm

### AI Not Working
- Check API keys are valid
- App will use mock mode if APIs fail
- Check browser console for errors

### Contract Errors
- Verify wallet is authorized as issuer
- Check contract address in .env
- Ensure connected to correct network

## Next Steps

- [API Reference](./API.md)
- [Contract Details](./CONTRACTS.md)
- [User Guide](../README.md)
