import React, { useState } from 'react';
import contractService from '../services/contractService';


const VerifyCertificate = () => {
  const [tokenId, setTokenId] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tokenId) return;

    setIsVerifying(true);
    setError(null);
    setCertificate(null);

    try {
      const result = await contractService.verifyCertificate(tokenId);
      setCertificate(result);
    } catch (err) {
      setError('Certificate not found or invalid token ID');
      console.error('Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="verify-certificate">
      <h2>🔍 Verify Certificate</h2>
      <p>Enter a certificate Token ID to verify its authenticity</p>

      <form onSubmit={handleVerify} className="verify-form">
        <input
          type="text"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          placeholder="Enter Token ID (e.g., 1)"
          className="verify-input"
        />
        <button type="submit" disabled={isVerifying || !tokenId} className="verify-btn">
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {certificate && (
        <div className="certificate-details">
          <div className={`status-badge ${certificate.isValid ? 'valid' : 'invalid'}`}>
            {certificate.isValid ? '✓ Valid Certificate' : '✗ Invalid/Revoked'}
          </div>

          <div className="detail-row">
            <span className="detail-label">Token ID:</span>
            <span className="detail-value">#{certificate.tokenId}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Subject:</span>
            <span className="detail-value">{certificate.subject}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Owner:</span>
            <span className="detail-value owner-address">{certificate.owner}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Sessions Completed:</span>
            <span className="detail-value">{certificate.sessionCount}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Issued Date:</span>
            <span className="detail-value">{certificate.timestamp?.toLocaleDateString()}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Token URI:</span>
            <span className="detail-value token-uri">{certificate.tokenURI}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="detail-value">
              {certificate.revoked ? '🚫 Revoked' : '✅ Active'}
            </span>
          </div>

          {certificate.tokenURI && (
            <div className="metadata-section">
              <h4>Certificate Metadata</h4>
              <p className="metadata-note">
                This certificate is stored on the Core Blockchain as a soulbound NFT (non-transferable). 
                The holder earned it through {certificate.sessionCount} completed learning session{certificate.sessionCount > 1 ? 's' : ''}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyCertificate;
