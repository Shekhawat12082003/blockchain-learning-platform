import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN_ID } from '../config/constants';
const CertificateGallery = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');
  const [subjects, setSubjects] = useState(['All']);
  useEffect(() => {
    loadCertificates();
  }, []);
  const loadCertificates = async () => {
    try {
      setLoading(true);
      setError('');
      if (!window.ethereum) {
        throw new Error('Please install MetaMask');
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tokenIds = await contract.getUserCertificates(address);
      const certPromises = tokenIds.map(async (tokenId) => {
        const [holder, subject, timestamp, sessionCount, revoked, uri] = await contract.getCertificateData(tokenId);
        return {
          tokenId: tokenId.toString(),
          subject,
          timestamp: new Date(timestamp.toNumber() * 1000),
          sessionCount: sessionCount.toNumber(),
          revoked,
          uri
        };
      });
      const certs = await Promise.all(certPromises);
      const validCerts = certs.filter(cert => !cert.revoked);
      setCertificates(validCerts);
      const uniqueSubjects = [...new Set(validCerts.map(c => c.subject))];
      setSubjects(uniqueSubjects);
      setLoading(false);
    } catch (err) {
      console.error('Error loading certificates:', err);
      setError(err.message || 'Failed to load certificates');
      setLoading(false);
    }
  };
  const filteredCertificates = filterSubject === 'All' 
    ? certificates 
    : certificates.filter(cert => cert.subject === filterSubject);
  const downloadCertificate = (cert) => {
    const certHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Georgia', serif; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .certificate { background: white; padding: 60px; border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.3); max-width: 800px; margin: auto; border: 10px solid gold; }
          h1 { color: #667eea; font-size: 48px; margin-bottom: 10px; }
          .subject { color: #764ba2; font-size: 36px; font-weight: bold; margin: 30px 0; }
          .info { font-size: 18px; color: #666; margin: 10px 0; }
          .signature { margin-top: 50px; border-top: 2px solid #333; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h1>🎓 Certificate of Achievement</h1>
          <p class="info">This certifies that</p>
          <div class="subject">${cert.subject}</div>
          <p class="info">has been successfully completed</p>
          <p class="info">Sessions Completed: ${cert.sessionCount}</p>
          <p class="info">Issued: ${cert.timestamp.toLocaleDateString()}</p>
          <p class="info">Token ID: #${cert.tokenId}</p>
          <div class="signature">
            <p><strong>AI Learning Tutor Platform</strong></p>
            <p>Verified on Core Blockchain</p>
          </div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([certHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${cert.subject.replace(/\s+/g, '-')}-${cert.tokenId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (loading) {
    return (
      <div className="card text-center py-16">
        <div className="animate-spin text-6xl mb-4">🎓</div>
        <p className="text-xl text-white/70">Loading your certificates...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card border-red-500/50">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg">{error}</p>
          <button onClick={loadCertificates} className="btn-primary mt-4">Retry</button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card">
        <h1 className="text-4xl font-bold gradient-text mb-3 flex items-center gap-3">
          <span>🏆</span> My Certificate Gallery
        </h1>
        <p className="text-white/70 text-lg mb-6">Your blockchain-verified achievements</p>
        
        <div className="flex items-center gap-3 mb-6">
          <label className="text-white font-semibold">Filter by Subject:</label>
          <select 
            value={filterSubject} 
            onChange={(e) => setFilterSubject(e.target.value)}
            className="glass px-4 py-2 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-4xl font-bold gradient-text mb-2">{certificates.length}</div>
            <div className="text-white/70">Total Certificates</div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-4xl font-bold gradient-text mb-2">{subjects.length - 1}</div>
            <div className="text-white/70">Subjects Mastered</div>
          </div>
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-4xl font-bold gradient-text mb-2">
              {certificates.reduce((sum, cert) => sum + cert.sessionCount, 0)}
            </div>
            <div className="text-white/70">Total Sessions</div>
          </div>
        </div>
      </div>

      {filteredCertificates.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl text-white mb-2">No certificates found{filterSubject !== 'All' ? ` for ${filterSubject}` : ''}.</p>
          <p className="text-white/70">Complete learning sessions to earn your first certificate!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => (
            <div key={cert.tokenId} className="card border-yellow-500/50 hover:scale-105 transition-all duration-300">
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">🎓</div>
                <h3 className="text-2xl font-bold gradient-text">{cert.subject}</h3>
              </div>
              <div className="space-y-2 mb-6">
                <div className="glass p-3 rounded-lg">
                  <p className="text-sm text-white/70">Token ID</p>
                  <p className="font-semibold">#{cert.tokenId}</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-sm text-white/70">Sessions Completed</p>
                  <p className="font-semibold">{cert.sessionCount}</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <p className="text-sm text-white/70">Issue Date</p>
                  <p className="font-semibold">{cert.timestamp.toLocaleDateString()}</p>
                </div>
                <div className="bg-green-500/20 border border-green-500/50 p-3 rounded-lg text-center">
                  <p className="text-green-400 font-semibold flex items-center justify-center gap-2">
                    <span>✅</span> Verified on Blockchain
                  </p>
                </div>
              </div>
              <button 
                className="btn-primary w-full"
                onClick={() => downloadCertificate(cert)}
              >
                📥 Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default CertificateGallery;
