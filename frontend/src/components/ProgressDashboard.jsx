import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/constants';
const ProgressDashboard = () => {
  const [progress, setProgress] = useState(null);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  useEffect(() => {
    loadProgress();
  }, []);
  const loadProgress = async () => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const [totalCertificates, totalSessions, points, level] = await contract.getUserProgress(userAddress);
      setProgress({
        totalCertificates: totalCertificates.toNumber(),
        totalSessions: totalSessions.toNumber(),
        points: points.toNumber(),
        level: level.toNumber()
      });
      const tokenIds = await contract.getUserCertificates(userAddress);
      const subjectMap = {};
      for (let tokenId of tokenIds) {
        const [, subject, , sessionCount, revoked] = await contract.getCertificateData(tokenId);
        if (!revoked) {
          if (!subjectMap[subject]) {
            subjectMap[subject] = { count: 0, sessions: 0 };
          }
          subjectMap[subject].count++;
          subjectMap[subject].sessions += sessionCount.toNumber();
        }
      }
      const breakdown = Object.entries(subjectMap).map(([subject, data]) => ({
        subject,
        certificates: data.count,
        sessions: data.sessions
      })).sort((a, b) => b.certificates - a.certificates);
      setSubjectBreakdown(breakdown);
      setLoading(false);
    } catch (err) {
      console.error('Error loading progress:', err);
      setError(err.message || 'Failed to load progress');
      setLoading(false);
    }
  };
  const getNextLevelPoints = () => {
    if (!progress) return 0;
    return (progress.level + 1) * 100;
  };
  const getLevelProgress = () => {
    if (!progress) return 0;
    const currentLevelPoints = progress.level * 100;
    const pointsInCurrentLevel = progress.points - currentLevelPoints;
    return (pointsInCurrentLevel / 100) * 100;
  };
  if (loading) {
    return (
      <div className="card text-center py-16">
        <div className="animate-spin text-6xl mb-4">📊</div>
        <p className="text-xl text-white/70">Loading your progress...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card border-red-500/50">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg">{error}</p>
          <button onClick={loadProgress} className="btn-primary mt-4">Retry</button>
        </div>
      </div>
    );
  }
  if (!progress) {
    return (
      <div className="card text-center py-16">
        <div className="text-6xl mb-4">🎓</div>
        <p className="text-xl text-white/70">Start learning to track your progress!</p>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
            <span>📊</span> Learning Progress Dashboard
          </h1>
          <span className="glass px-4 py-2 rounded-full text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50">
        <div className="text-center mb-8">
          <div className="text-8xl font-bold gradient-text mb-2">{progress.level}</div>
          <div className="text-2xl font-semibold text-white/70">LEVEL</div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">{progress.points}</div>
            <div className="text-white/70">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">{progress.totalCertificates}</div>
            <div className="text-white/70">Certificates</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">{progress.totalSessions}</div>
            <div className="text-white/70">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">{subjectBreakdown.length}</div>
            <div className="text-white/70">Subjects</div>
          </div>
        </div>
        
        <div>
          <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-white to-white/70 transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
          <p className="text-center text-white/90 font-semibold">
            {progress.points} / {getNextLevelPoints()} points to next level
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
          <span>📖</span> Subject Breakdown
        </h2>
        {subjectBreakdown.length === 0 ? (
          <p className="text-center text-white/70 py-8">No subjects studied yet. Start learning!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectBreakdown.map((item, index) => (
              <div key={item.subject} className="glass p-6 rounded-xl hover:bg-white/20 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                    #{index + 1}
                  </span>
                  <div className="text-xl font-bold">{item.subject}</div>
                </div>
                <div className="space-y-2 text-white/80">
                  <div className="flex items-center gap-2">
                    <span>🎓</span>
                    <span>{item.certificates} certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📚</span>
                    <span>{item.sessions} sessions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-6 flex items-center gap-2">
          <span>🏅</span> Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className={`card text-center transition-all ${progress.totalCertificates >= 1 ? 'border-yellow-500/50 bg-yellow-500/10' : 'opacity-40'}`}>
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm font-semibold">First Certificate</div>
          </div>
          <div className={`card text-center transition-all ${progress.totalCertificates >= 5 ? 'border-yellow-500/50 bg-yellow-500/10' : 'opacity-40'}`}>
            <div className="text-4xl mb-2">🌟</div>
            <div className="text-sm font-semibold">5 Certificates</div>
          </div>
          <div className={`card text-center transition-all ${progress.totalCertificates >= 10 ? 'border-yellow-500/50 bg-yellow-500/10' : 'opacity-40'}`}>
            <div className="text-4xl mb-2">💎</div>
            <div className="text-sm font-semibold">10 Certificates</div>
          </div>
          <div className={`card text-center transition-all ${progress.level >= 5 ? 'border-yellow-500/50 bg-yellow-500/10' : 'opacity-40'}`}>
            <div className="text-4xl mb-2">🚀</div>
            <div className="text-sm font-semibold">Level 5 Master</div>
          </div>
          <div className={`card text-center transition-all ${subjectBreakdown.length >= 3 ? 'border-yellow-500/50 bg-yellow-500/10' : 'opacity-40'}`}>
            <div className="text-4xl mb-2">📚</div>
            <div className="text-sm font-semibold">Multi-Subject</div>
          </div>
          <div className={`card text-center transition-all ${progress.totalSessions >= 50 ? 'border-yellow-500/50 bg-yellow-500/10' : 'opacity-40'}`}>
            <div className="text-4xl mb-2">⏰</div>
            <div className="text-sm font-semibold">50 Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProgressDashboard;
