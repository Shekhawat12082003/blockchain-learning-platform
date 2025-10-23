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

      // Get user progress
      const [totalCertificates, totalSessions, points, level] = await contract.getUserProgress(userAddress);

      setProgress({
        totalCertificates: totalCertificates.toNumber(),
        totalSessions: totalSessions.toNumber(),
        points: points.toNumber(),
        level: level.toNumber()
      });

      // Get certificates to build subject breakdown
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
      <div className="progress-dashboard">
        <div className="loading-explanation">
          <div className="spinner"></div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="progress-dashboard">
        <div className="no-progress">Start learning to track your progress!</div>
      </div>
    );
  }

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <h1>📊 Learning Progress Dashboard</h1>
        <p className="user-address">Wallet: {address.slice(0, 6)}...{address.slice(-4)}</p>
      </div>

      <div className="progress-overview">
        <div className="level-card" role="region" aria-label="Level overview">
          <div className="level-number" aria-hidden>{progress.level}</div>
          <div className="level-label">LEVEL</div>

          <div className="points-info" style={{marginTop: '1.5rem'}}>
            <div className="points-stat">
              <div className="stat-value">{progress.points}</div>
              <div className="stat-label">Total Points</div>
            </div>

            <div className="points-stat">
              <div className="stat-value">{progress.totalCertificates}</div>
              <div className="stat-label">Certificates</div>
            </div>

            <div className="points-stat">
              <div className="stat-value">{progress.totalSessions}</div>
              <div className="stat-label">Sessions</div>
            </div>

            <div className="points-stat">
              <div className="stat-value">{subjectBreakdown.length}</div>
              <div className="stat-label">Subjects</div>
            </div>
          </div>

          <div className="level-progress" style={{marginTop: '1.5rem'}}>
            <div className="progress-bar" aria-hidden style={{height: '12px', borderRadius: '999px', background: 'rgba(255,255,255,0.15)'}}>
              <div
                className="progress-fill"
                style={{ width: `${getLevelProgress()}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))' }}
              />
            </div>
            <p className="progress-text" style={{marginTop: '0.75rem', color: 'rgba(255,255,255,0.95)'}}>
              {progress.points} / {getNextLevelPoints()} points to next level
            </p>
          </div>
        </div>
      </div>

      <section className="subject-breakdown">
        <h2 className="section-title">📖 Subject Breakdown</h2>
        {subjectBreakdown.length === 0 ? (
          <p className="no-subjects">No subjects studied yet. Start learning!</p>
        ) : (
          <div className="subjects-grid">
            {subjectBreakdown.map((item, index) => (
              <div key={item.subject} className="subject-card">
                <div className="subject-name">#{index + 1} {item.subject}</div>
                <div className="subject-count">
                  <span>🎓 {item.certificates} certificates</span>
                  <span>📚 {item.sessions} sessions</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="achievements">
        <h2 className="section-title">🏅 Achievements</h2>
        <div className="achievements-grid">
          <div className={`achievement-card ${progress.totalCertificates >= 1 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🎯</div>
            <div className="achievement-name">First Certificate</div>
          </div>

          <div className={`achievement-card ${progress.totalCertificates >= 5 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🌟</div>
            <div className="achievement-name">5 Certificates</div>
          </div>

          <div className={`achievement-card ${progress.totalCertificates >= 10 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">💎</div>
            <div className="achievement-name">10 Certificates</div>
          </div>

          <div className={`achievement-card ${progress.level >= 5 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">🚀</div>
            <div className="achievement-name">Level 5 Master</div>
          </div>

          <div className={`achievement-card ${subjectBreakdown.length >= 3 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">📚</div>
            <div className="achievement-name">Multi-Subject Expert</div>
          </div>

          <div className={`achievement-card ${progress.totalSessions >= 50 ? 'unlocked' : 'locked'}`}>
            <div className="achievement-icon">⏰</div>
            <div className="achievement-name">50 Sessions</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgressDashboard;
