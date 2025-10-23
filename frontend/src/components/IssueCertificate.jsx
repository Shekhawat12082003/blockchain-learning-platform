import React, { useState } from 'react';
import contractService from '../services/contractService';

const IssueCertificate = ({ account, sessionData }) => {
  const [isIssuing, setIsIssuing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState('');
  const [sessionCount, setSessionCount] = useState(1);

  const uploadToIPFS = async (data) => {
    // Mock IPFS upload - In production, use Pinata, NFT.Storage, or IPFS directly
    const metadata = {
      name: `Skill Certificate - ${data.subject || 'General'}`,
      description: `Certificate of completion for AI tutoring session in ${data.subject || 'general'} learning.`,
      image: 'https://via.placeholder.com/400x300?text=Certificate',
      attributes: [
        { trait_type: 'Subject', value: data.subject || 'General' },
        { trait_type: 'Session Date', value: new Date().toISOString() },
        { trait_type: 'Messages Exchanged', value: data.messageCount || 0 }
      ],
      session_summary: data.summary || 'Completed personalized learning session'
    };

    // In production, replace with actual IPFS upload
    // For now, return a mock URI
    const mockUri = `ipfs://QmMockHash${Date.now()}`;
    console.log('Certificate Metadata:', metadata);
    
    return mockUri;
  };

  const handleIssueCertificate = async () => {
    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    if (!subject || subject.trim() === '') {
      setError('Please enter a subject');
      return;
    }

    setIsIssuing(true);
    setError(null);
    setResult(null);

    try {
      // Ensure wallet is connected
      await contractService.connectWallet();

      // Prepare session data
      const certData = {
        subject: subject,
        messageCount: sessionData?.messages?.length || 0,
        sessionCount: sessionCount,
        summary: 'Successfully completed AI tutoring session'
      };

      // Upload metadata to IPFS (mock for now)
      const tokenURI = await uploadToIPFS(certData);

      // Issue certificate on blockchain with new parameters
      const result = await contractService.issueCertificate(account, subject, tokenURI, sessionCount);

      const pointsEarned = sessionCount * 10;
      const level = Math.floor((result.totalPoints || pointsEarned) / 100);

      setResult({
        success: true,
        tokenId: result.tokenId,
        txHash: result.txHash,
        pointsEarned: pointsEarned,
        level: level,
        message: 'Certificate issued successfully! 🎉'
      });

    } catch (err) {
      console.error('Error issuing certificate:', err);
      setError(err.message || 'Failed to issue certificate');
    } finally {
      setIsIssuing(false);
    }
  };

  if (!sessionData) {
    return null;
  }

  return (
    <div className="issue-certificate">
      <div className="certificate-card">
        <h3>📜 Issue Learning Certificate</h3>
        <p>Complete your learning session with a blockchain certificate!</p>
        
        <div className="certificate-form">
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Python, History"
              disabled={isIssuing || result}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sessionCount">Sessions Completed:</label>
            <input
              type="number"
              id="sessionCount"
              value={sessionCount}
              onChange={(e) => setSessionCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              disabled={isIssuing || result}
            />
          </div>

          {sessionData && (
            <div className="session-summary">
              <p><strong>Chat Messages:</strong> {sessionData.messages?.length || 0}</p>
              <p><strong>Points to Earn:</strong> {sessionCount * 10} ⭐</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleIssueCertificate}
          disabled={isIssuing || result || !subject}
          className="issue-btn"
        >
          {isIssuing ? 'Issuing...' : result ? 'Certificate Issued ✓' : 'Issue Certificate'}
        </button>

        {result && (
          <div className="success-message">
            <p>✅ {result.message}</p>
            <p><strong>Token ID:</strong> #{result.tokenId}</p>
            <p><strong>Points Earned:</strong> {result.pointsEarned} ⭐</p>
            <p><strong>Current Level:</strong> {result.level}</p>
            <p><strong>Transaction:</strong> <a href={`https://scan.test2.btcs.network/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer">View on Explorer</a></p>
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCertificate;
