import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN_ID, CHAIN_NAME, RPC_URL } from '../config/constants';

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed!');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if on correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(chainId, 16) !== CHAIN_ID) {
        await this.switchNetwork();
      }

      // Set up provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      return accounts[0];
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  async switchNetwork() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${CHAIN_ID.toString(16)}`,
            chainName: CHAIN_NAME,
            rpcUrls: [RPC_URL],
            nativeCurrency: {
              name: 'Core',
              symbol: 'CORE',
              decimals: 18
            }
          }],
        });
      } else {
        throw switchError;
      }
    }
  }

  async issueCertificate(toAddress, subject, metadataUri, sessionCount) {
    // Ensure connection if not already connected
    if (!this.contract || !this.signer) {
      console.log('Contract not initialized, connecting wallet...');
      await this.connectWallet();
    }

    if (!this.contract) {
      throw new Error('Failed to initialize contract. Please connect your wallet.');
    }

    try {
      console.log('Issuing certificate to:', toAddress);
      console.log('Subject:', subject);
      console.log('Session Count:', sessionCount);
      console.log('Metadata URI:', metadataUri);
      
      const tx = await this.contract.issueCertificate(toAddress, subject, metadataUri, sessionCount);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      // Extract tokenId and points from event
      const event = receipt.events?.find(e => e.event === 'CertificateIssued');
      const tokenId = event?.args?.tokenId?.toString();
      const points = event?.args?.points?.toString();
      
      return { success: true, tokenId, txHash: receipt.transactionHash, pointsEarned: points };
    } catch (error) {
      console.error('Error issuing certificate:', error);
      
      // Better error messages
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user');
      } else if (error.code === -32603) {
        throw new Error('Insufficient funds or not authorized as issuer');
      } else if (error.message?.includes('issuer')) {
        throw new Error('Your wallet is not authorized as an issuer. Contact the contract owner.');
      }
      
      throw error;
    }
  }

  async verifyCertificate(tokenId) {
    if (!this.contract) {
      // Use provider without signer for read-only
      this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    }

    try {
      const isValid = await this.contract.isValid(tokenId);
      const owner = await this.contract.ownerOf(tokenId);
      const tokenURI = await this.contract.tokenURI(tokenId);
      
      // Get certificate data (includes revoked status)
      const [holder, subject, timestamp, sessionCount, revoked, uri] = await this.contract.getCertificateData(tokenId);

      return {
        isValid,
        owner,
        holder,
        subject,
        timestamp: new Date(timestamp.toNumber() * 1000),
        sessionCount: sessionCount.toNumber(),
        tokenURI,
        revoked,
        tokenId: tokenId.toString()
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      throw error;
    }
  }

  async addIssuer(issuerAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Connect wallet first.');
    }

    try {
      const tx = await this.contract.addIssuer(issuerAddress);
      await tx.wait();
      return { success: true };
    } catch (error) {
      console.error('Error adding issuer:', error);
      throw error;
    }
  }

  async checkIssuer(address) {
    if (!this.contract) {
      this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    }

    return await this.contract.issuers(address);
  }

  getContract() {
    return this.contract;
  }
}

export default new ContractService();
