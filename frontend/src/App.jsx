import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ConnectWallet from './components/ConnectWallet';
import ChatInterface from './components/ChatInterface';
import IssueCertificate from './components/IssueCertificate';
import VerifyCertificate from './components/VerifyCertificate';
import CertificateGallery from './components/CertificateGallery';
import ProgressDashboard from './components/ProgressDashboard';
import Leaderboard from './components/Leaderboard';
import QuizInterface from './components/QuizInterface';
import StudyPlanner from './components/StudyPlanner';
import ConceptExplainer from './components/ConceptExplainer';
import './styles/App.css';

function Sidebar() {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', icon: '💬', label: 'AI Chat' },
    { path: '/quiz', icon: '📝', label: 'Quiz' },
    { path: '/explain', icon: '💡', label: 'Concept Explainer' },
    { path: '/study-plan', icon: '📚', label: 'Study Planner' },
    { path: '/progress', icon: '📊', label: 'Progress' },
    { path: '/gallery', icon: '🖼️', label: 'Certificates' },
    { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
    { path: '/verify', icon: '✓', label: 'Verify Certificate' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>🎓 AI Tutor</h1>
        <p>Web3 Learning</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <p>Built with AI & Blockchain</p>
      </div>
    </aside>
  );
}

function App() {
  const [account, setAccount] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const handleWalletConnect = (connectedAccount) => {
    setAccount(connectedAccount);
  };

  const handleSessionComplete = (messages) => {
    setSessionData({
      messages,
      subject: 'General Learning',
      completedAt: new Date().toISOString()
    });
    setShowCertificateModal(true);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar />
        
        <div className="app-main">
          <nav className="navbar">
            <div className="nav-container">
              <div className="nav-info">
                <span className="nav-subtitle">Personalized Learning Platform</span>
              </div>
              <ConnectWallet onConnect={handleWalletConnect} />
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <div className="home-page">
                  <div className="content-grid">
                    <div className="chat-section">
                      <ChatInterface 
                        account={account} 
                        onSessionComplete={handleSessionComplete}
                      />
                    </div>

                    {showCertificateModal && sessionData && (
                      <div className="certificate-modal">
                        <IssueCertificate 
                          account={account} 
                          sessionData={sessionData}
                        />
                        <button 
                          className="close-modal"
                          onClick={() => setShowCertificateModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>

                  {!account && (
                    <div className="info-cards">
                      <div className="info-card">
                        <h3>🔗 Connect Wallet</h3>
                        <p>Connect MetaMask to start learning</p>
                      </div>
                      <div className="info-card">
                        <h3>🤖 AI Tutoring</h3>
                        <p>Get personalized help from AI</p>
                      </div>
                      <div className="info-card">
                        <h3>📜 Earn Certificates</h3>
                        <p>Blockchain-verified certificates</p>
                      </div>
                    </div>
                  )}
                </div>
              } />

              <Route path="/quiz" element={<QuizInterface />} />
              <Route path="/explain" element={<ConceptExplainer />} />
              <Route path="/study-plan" element={<StudyPlanner />} />
              <Route path="/gallery" element={<CertificateGallery />} />
              <Route path="/progress" element={<ProgressDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/verify" element={<VerifyCertificate />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>Contract: 0xF5689A0B960b9fED8D40422676B580FD10Ed6322 on Core Testnet2</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
