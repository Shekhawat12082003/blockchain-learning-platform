import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/constants';
const Leaderboard = () => {
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUserAddress, setCurrentUserAddress] = useState('');
  useEffect(() => {
    loadGlobalStats();
  }, []);
  const loadGlobalStats = async () => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setCurrentUserAddress(address);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const [totalCerts, totalUsersCount, totalTokens] = await contract.getGlobalStats();
      setGlobalStats({
        totalCertificates: totalCerts.toNumber(),
        totalUsers: totalUsersCount.toNumber(),
        totalTokens: totalTokens.toNumber()
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading global stats:', err);
      setError(err.message || 'Failed to load leaderboard');
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="card text-center py-16">
        <div className="animate-spin text-6xl mb-4">🏆</div>
        <p className="text-xl text-white/70">Loading global statistics...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card border-red-500/50">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg">{error}</p>
          <button onClick={loadGlobalStats} className="btn-primary mt-4">Retry</button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card text-center">
        <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center justify-center gap-3">
          <span>🏆</span> Global Leaderboard
        </h1>
        <p className="text-white/70 text-lg">Platform-wide learning achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:scale-105 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">🎓</div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">{globalStats.totalCertificates}</div>
            <p className="text-white/70">Total Certificates Issued</p>
          </div>
        </div>
        <div className="card hover:scale-105 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">👥</div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">{globalStats.totalUsers}</div>
            <p className="text-white/70">Total Learners</p>
          </div>
        </div>
        <div className="card hover:scale-105 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">🔢</div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">{globalStats.totalTokens}</div>
            <p className="text-white/70">Unique NFT Tokens</p>
          </div>
        </div>
        <div className="card hover:scale-105 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">📊</div>
          <div className="text-center">
            <div className="text-4xl font-bold gradient-text mb-2">
              {globalStats.totalUsers > 0 
                ? (globalStats.totalCertificates / globalStats.totalUsers).toFixed(1) 
                : 0}
            </div>
            <p className="text-white/70">Avg. Certificates/User</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
          <span>🌐</span> Platform Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-white">About This Platform</h3>
            <p className="text-white/70 leading-relaxed">
              AI-powered personalized learning with blockchain-verified certificates. 
              All achievements are permanently recorded on the Core Blockchain as soulbound NFTs.
            </p>
          </div>
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-white">How It Works</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">💬 Chat with AI tutors on any subject</li>
              <li className="flex items-center gap-2">📚 Complete learning sessions</li>
              <li className="flex items-center gap-2">🎓 Earn certificates as NFTs</li>
              <li className="flex items-center gap-2">⭐ Gain points and level up</li>
              <li className="flex items-center gap-2">🔒 Certificates are soulbound (non-transferable)</li>
            </ul>
          </div>
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-white">Points & Levels</h3>
            <div className="space-y-2 text-white/70">
              <p><strong className="text-white">Points:</strong> Earn 10 points per session completed</p>
              <p><strong className="text-white">Levels:</strong> 100 points = 1 level</p>
              <p><strong className="text-white">Certificates:</strong> Issued after completing sessions</p>
              <p><strong className="text-white">Blockchain:</strong> All data stored on Core Testnet2</p>
            </div>
          </div>
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-white">Your Current Rank</h3>
            <div className="bg-blue-500/20 border border-blue-500/50 p-3 rounded-lg mb-3">
              <p className="text-sm text-white/70 mb-1">Connected Wallet</p>
              <p className="text-white font-mono text-sm">
                {currentUserAddress.slice(0, 10)}...{currentUserAddress.slice(-8)}
              </p>
            </div>
            <p className="text-white/70">Check your Progress Dashboard to see detailed stats!</p>
          </div>
        </div>
      </div>

      <div className="card border-purple-500/50">
        <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
          <span>🔜</span> Coming Soon
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start gap-4">
              <span className="text-4xl">📈</span>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Top Learners Ranking</h4>
                <p className="text-white/70">See who's leading in certificates and points</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🎯</span>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Subject-Specific Leaderboards</h4>
                <p className="text-white/70">Compete in your favorite subjects</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🏅</span>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Weekly Challenges</h4>
                <p className="text-white/70">Time-limited learning challenges with rewards</p>
              </div>
            </div>
          </div>
          <div className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🤝</span>
              <div>
                <h4 className="text-xl font-bold mb-2 text-white">Peer Learning</h4>
                <p className="text-white/70">Collaborate with other learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-green-500/50">
        <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
          <span>⛓️</span> Blockchain Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-white/70 mb-1">Network</p>
            <p className="text-white font-semibold">Core Testnet2</p>
          </div>
          <div className="glass p-4 rounded-lg">
            <p className="text-sm text-white/70 mb-1">Token Standard</p>
            <p className="text-white font-semibold">ERC-721 (NFT)</p>
          </div>
          <div className="glass p-4 rounded-lg md:col-span-2">
            <p className="text-sm text-white/70 mb-1">Contract Address</p>
            <p className="text-white font-mono text-sm break-all">{CONTRACT_ADDRESS}</p>
          </div>
          <div className="glass p-4 rounded-lg md:col-span-2">
            <p className="text-sm text-white/70 mb-1">Special Feature</p>
            <p className="text-white font-semibold">🔒 Soulbound (non-transferable)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
