import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import MainLayout from '../src/layouts/MainLayout';

const ChatInterface = dynamic(() => import('../src/components/ChatInterface'), {
  ssr: false
});

export default function Home() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, []);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="card">
          <ChatInterface account={account} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold gradient-text mb-2">Connect Wallet</h3>
            <p className="text-white/70">Connect MetaMask to start learning</p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold gradient-text mb-2">AI Tutoring</h3>
            <p className="text-white/70">Get personalized help from AI</p>
          </div>
          
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="text-4xl mb-4">📜</div>
            <h3 className="text-xl font-bold gradient-text mb-2">Earn Certificates</h3>
            <p className="text-white/70">Blockchain-verified certificates</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
