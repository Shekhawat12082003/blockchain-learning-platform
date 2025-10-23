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

      // Get global stats
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
      <div className="leaderboard">
        <div className="loading">Loading global statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h1>🏆 Global Leaderboard</h1>
        <p className="leaderboard-subtitle">Platform-wide learning achievements</p>
      </div>

      <div className="global-stats">
        <div className="global-stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h2>{globalStats.totalCertificates}</h2>
            <p>Total Certificates Issued</p>
          </div>
        </div>

        <div className="global-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h2>{globalStats.totalUsers}</h2>
            <p>Total Learners</p>
          </div>
        </div>

        <div className="global-stat-card">
          <div className="stat-icon">🔢</div>
          <div className="stat-content">
            <h2>{globalStats.totalTokens}</h2>
            <p>Unique NFT Tokens</p>
          </div>
        </div>

        <div className="global-stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h2>
              {globalStats.totalUsers > 0 
                ? (globalStats.totalCertificates / globalStats.totalUsers).toFixed(1) 
                : 0}
            </h2>
            <p>Avg. Certificates/User</p>
          </div>
        </div>
      </div>

      <div className="platform-info">
        <h2>🌐 Platform Overview</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>About This Platform</h3>
            <p>
              AI-powered personalized learning with blockchain-verified certificates. 
              All achievements are permanently recorded on the Core Blockchain as soulbound NFTs.
            </p>
          </div>

          <div className="info-card">
            <h3>How It Works</h3>
            <ul>
              <li>💬 Chat with AI tutors on any subject</li>
              <li>📚 Complete learning sessions</li>
              <li>🎓 Earn certificates as NFTs</li>
              <li>⭐ Gain points and level up</li>
              <li>🔒 Certificates are soulbound (non-transferable)</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>Points & Levels</h3>
            <p>
              <strong>Points:</strong> Earn 10 points per session completed<br/>
              <strong>Levels:</strong> 100 points = 1 level<br/>
              <strong>Certificates:</strong> Issued after completing sessions<br/>
              <strong>Blockchain:</strong> All data stored on Core Testnet2
            </p>
          </div>

          <div className="info-card">
            <h3>Your Current Rank</h3>
            <p className="user-wallet">
              Connected: {currentUserAddress.slice(0, 10)}...{currentUserAddress.slice(-8)}
            </p>
            <p>Check your Progress Dashboard to see detailed stats!</p>
          </div>
        </div>
      </div>

      <div className="coming-soon">
        <h2>🔜 Coming Soon</h2>
        <div className="features-list">
          <div className="feature-item">
            <span className="feature-icon">📈</span>
            <div>
              <h4>Top Learners Ranking</h4>
              <p>See who's leading in certificates and points</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <div>
              <h4>Subject-Specific Leaderboards</h4>
              <p>Compete in your favorite subjects</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏅</span>
            <div>
              <h4>Weekly Challenges</h4>
              <p>Time-limited learning challenges with rewards</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🤝</span>
            <div>
              <h4>Peer Learning</h4>
              <p>Collaborate with other learners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="blockchain-info">
        <h3>⛓️ Blockchain Details</h3>
        <div className="blockchain-details">
          <p><strong>Network:</strong> Core Testnet2</p>
          <p><strong>Contract:</strong> {CONTRACT_ADDRESS}</p>
          <p><strong>Token Standard:</strong> ERC-721 (NFT)</p>
          <p><strong>Special Feature:</strong> Soulbound (non-transferable)</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
