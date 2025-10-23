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
    <div className="connect-wallet">
      {!account ? (
        <button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="connect-btn"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info">
            <span className="wallet-icon">🔒</span>
            <span className="wallet-address">{formatAddress(account)}</span>
          </div>
          <button onClick={disconnectWallet} className="disconnect-btn" title="Disconnect">
            ✕
          </button>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ConnectWallet;
