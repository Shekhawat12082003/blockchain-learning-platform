import React, { useState, useEffect } from 'react';
import contractService from '../services/contractService';
import { formatAddress } from '../utils/helpers';
function ConnectWallet({ onConnect }) {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    checkConnection();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await contractService.connectWallet();
          setAccount(accounts[0]);
          if (onConnect) onConnect(accounts[0]);
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      if (onConnect) onConnect(null);
    } else {
      setAccount(accounts[0]);
      if (onConnect) onConnect(accounts[0]);
    }
  };
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const connectedAccount = await contractService.connectWallet();
      setAccount(connectedAccount);
      if (onConnect) onConnect(connectedAccount);
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };
  const disconnectWallet = () => {
    setAccount(null);
    if (onConnect) onConnect(null);
  };
  return (
    <div className="relative">
      {!account ? (
        <button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-lg">🔗</span>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span className="font-mono text-sm text-white">{formatAddress(account)}</span>
          </div>
          <button 
            onClick={disconnectWallet} 
            className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-500/20 transition-colors" 
            title="Disconnect"
          >
            <span className="text-red-400 text-sm">✕</span>
          </button>
        </div>
      )}
      {error && (
        <div className="absolute top-full mt-2 right-0 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm backdrop-blur-lg">
          {error}
        </div>
      )}
    </div>
  );
};
export default ConnectWallet;
