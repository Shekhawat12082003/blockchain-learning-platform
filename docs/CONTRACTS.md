# 📚 Smart Contract Documentation

## Overview

The platform uses three main smart contracts deployed on Core Testnet2.

## LearningCertificate.sol

**Address**: `0xF5689A0B960b9fED8D40422676B580FD10Ed6322`

### Description
ERC-721 NFT contract for soulbound learning certificates with integrated progress tracking.

### Key Features
- **Soulbound NFTs**: Certificates cannot be transferred after minting
- **Progress Tracking**: Points, levels, achievements stored on-chain
- **Permission System**: Only authorized issuers can mint certificates
- **Subject Tracking**: Certificates categorized by learning subject
- **Global Statistics**: Platform-wide metrics

### Main Functions

#### issueCertificate
```solidity
function issueCertificate(
    address recipient,
    string memory subject,
    uint256 sessionsCompleted
) public returns (uint256)
```
Mints a new certificate NFT and updates user progress.
- **Access**: Authorized issuers only
- **Returns**: Token ID
- **Events**: `CertificateIssued`, `ProgressUpdated`

#### getUserProgress
```solidity
function getUserProgress(address user) public view returns (
    uint256 totalCertificates,
    uint256 totalSessions,
    uint256 points,
    uint256 level
)
```
Retrieves user's learning progress.

#### getCertificateDetails
```solidity
function getCertificateDetails(uint256 tokenId) public view returns (
    address owner,
    string memory subject,
    uint256 sessionsCompleted,
    uint256 issuedAt
)
```
Gets certificate metadata.

#### addIssuer / removeIssuer
```solidity
function addIssuer(address issuer) public onlyOwner
function removeIssuer(address issuer) public onlyOwner
```
Manages authorized certificate issuers.

### Events

```solidity
event CertificateIssued(uint256 indexed tokenId, address indexed recipient, string subject);
event ProgressUpdated(address indexed user, uint256 points, uint256 level);
event IssuerAdded(address indexed issuer);
event IssuerRemoved(address indexed issuer);
```

### Progress System

- **Points**: 10 points per session completed
- **Levels**: 100 points = 1 level
- **Formula**: `level = points / 100`

## LearningPathManager.sol

### Description
Manages learning paths, milestones, and educational content.

### Key Features
- Structured learning paths
- Milestone tracking
- Educator permissions
- Path recommendations

## QuizSystem.sol

### Description
Handles quiz creation, submission, and grading.

### Key Features
- Multiple choice quizzes
- On-chain answer verification
- Score tracking
- Quiz creator permissions

## Contract Interactions

### Frontend → Contract Flow

1. **Connect Wallet**
   - User connects MetaMask
   - App checks network (Chain ID 1114)
   - Switches to Core Testnet2 if needed

2. **Issue Certificate**
   ```javascript
   const contract = new ethers.Contract(address, abi, signer);
   const tx = await contract.issueCertificate(
     recipientAddress,
     "JavaScript Fundamentals",
     5 // sessions completed
   );
   await tx.wait();
   ```

3. **Query Progress**
   ```javascript
   const progress = await contract.getUserProgress(userAddress);
   console.log(`Level ${progress.level} - ${progress.points} points`);
   ```

4. **View Certificates**
   ```javascript
   const details = await contract.getCertificateDetails(tokenId);
   console.log(`Subject: ${details.subject}`);
   ```

## Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| issueCertificate | ~150,000 |
| getCertificateDetails | ~30,000 (view) |
| getUserProgress | ~25,000 (view) |
| addIssuer | ~50,000 |

## Security Features

- **Access Control**: Only authorized issuers can mint
- **Soulbound**: Transfers blocked after minting
- **Owner Controls**: Contract owner manages issuers
- **Input Validation**: Subject and session limits

## Verified Contract

View on Core Explorer:
https://scan.test2.btcs.network/address/0xF5689A0B960b9fED8D40422676B580FD10Ed6322

## ABI Location

Contract ABI available at:
`artifacts/contracts/LearningCertificate.sol/LearningCertificate.json`
