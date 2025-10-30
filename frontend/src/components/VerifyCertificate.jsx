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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card text-center">
        <h2 className="text-4xl font-bold gradient-text mb-3 flex items-center justify-center gap-3">
          <span>🔍</span> Verify Certificate
        </h2>
        <p className="text-white/70 text-lg">Enter a certificate Token ID to verify its authenticity</p>
      </div>

      <div className="card">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Certificate Token ID</label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter Token ID (e.g., 1)"
              className="input-field w-full"
            />
          </div>
          <button 
            type="submit" 
            disabled={isVerifying || !tokenId} 
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Verifying...
              </span>
            ) : (
              <span>🔍 Verify Certificate</span>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="card border-red-500/50 bg-red-500/10">
          <div className="text-center py-4">
            <div className="text-5xl mb-3">❌</div>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        </div>
      )}

      {certificate && (
        <div className="card border-green-500/50">
          <div className={`text-center py-4 px-6 rounded-xl mb-6 ${
            certificate.isValid 
              ? 'bg-green-500/20 border border-green-500/50' 
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            <div className="text-3xl font-bold">
              {certificate.isValid ? (
                <span className="text-green-400">✓ Valid Certificate</span>
              ) : (
                <span className="text-red-400">✗ Invalid/Revoked</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-white/70 mb-1">Token ID</p>
              <p className="text-xl font-bold gradient-text">#{certificate.tokenId}</p>
            </div>

            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-white/70 mb-1">Subject</p>
              <p className="text-xl font-bold text-white">{certificate.subject}</p>
            </div>

            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-white/70 mb-1">Owner Address</p>
              <p className="text-white font-mono text-sm break-all">{certificate.owner}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-white/70 mb-1">Sessions Completed</p>
                <p className="text-2xl font-bold text-white">{certificate.sessionCount}</p>
              </div>

              <div className="glass p-4 rounded-xl">
                <p className="text-sm text-white/70 mb-1">Issued Date</p>
                <p className="text-lg font-semibold text-white">{certificate.timestamp?.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-white/70 mb-1">Token URI</p>
              <p className="text-white font-mono text-xs break-all">{certificate.tokenURI}</p>
            </div>

            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-white/70 mb-1">Status</p>
              <p className="text-lg font-bold">
                {certificate.revoked ? (
                  <span className="text-red-400">🚫 Revoked</span>
                ) : (
                  <span className="text-green-400">✅ Active</span>
                )}
              </p>
            </div>

            {certificate.tokenURI && (
              <div className="glass p-6 rounded-xl border border-blue-500/50">
                <h4 className="text-xl font-bold gradient-text mb-3">📜 Certificate Metadata</h4>
                <p className="text-white/70 leading-relaxed">
                  This certificate is stored on the Core Blockchain as a soulbound NFT (non-transferable). 
                  The holder earned it through <strong className="text-white">{certificate.sessionCount}</strong> completed learning session{certificate.sessionCount > 1 ? 's' : ''}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default VerifyCertificate;
