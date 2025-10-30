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
      <div className="max-w-6xl mx-auto">
        <div className="card mb-5">
          <ChatInterface account={account} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold mb-2" style={{color: '#7c8ef5'}}>Connect Wallet</h3>
            <p className="text-sm" style={{color: 'rgba(232, 234, 246, 0.7)'}}>Link your MetaMask wallet to get started</p>
          </div>
          
          <div className="card">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2" style={{color: '#7c8ef5'}}>AI-Powered Learning</h3>
            <p className="text-sm" style={{color: 'rgba(232, 234, 246, 0.7)'}}>Chat with AI tutors on any topic</p>
          </div>
          
          <div className="card">
            <div className="text-3xl mb-3">📜</div>
            <h3 className="text-lg font-semibold mb-2" style={{color: '#7c8ef5'}}>NFT Certificates</h3>
            <p className="text-sm" style={{color: 'rgba(232, 234, 246, 0.7)'}}>Earn verifiable blockchain certificates</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
