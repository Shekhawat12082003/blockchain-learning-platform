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

      // Get all certificate token IDs for the user
      const tokenIds = await contract.getUserCertificates(address);
      
      // Fetch details for each certificate
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
      
      // Filter out revoked certificates
      const validCerts = certs.filter(cert => !cert.revoked);
      setCertificates(validCerts);

      // Extract unique subjects
      const uniqueSubjects = ['All', ...new Set(validCerts.map(cert => cert.subject))];
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
    // Create a simple certificate HTML
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
      <div className="certificate-gallery">
        <div className="loading">Loading your certificates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="certificate-gallery">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="certificate-gallery">
      <div className="gallery-header">
        <h1>🏆 My Certificate Gallery</h1>
        <p className="gallery-subtitle">Your blockchain-verified achievements</p>
        
        <div className="filter-bar">
          <label>Filter by Subject:</label>
          <select 
            value={filterSubject} 
            onChange={(e) => setFilterSubject(e.target.value)}
            className="subject-filter"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="gallery-stats">
          <div className="stat-item">
            <span className="stat-value">{certificates.length}</span>
            <span className="stat-label">Total Certificates</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{subjects.length - 1}</span>
            <span className="stat-label">Subjects Mastered</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {certificates.reduce((sum, cert) => sum + cert.sessionCount, 0)}
            </span>
            <span className="stat-label">Total Sessions</span>
          </div>
        </div>
      </div>

      {filteredCertificates.length === 0 ? (
        <div className="no-certificates">
          <p>📚 No certificates found{filterSubject !== 'All' ? ` for ${filterSubject}` : ''}.</p>
          <p>Complete learning sessions to earn your first certificate!</p>
        </div>
      ) : (
        <div className="certificates-grid">
          {filteredCertificates.map((cert) => (
            <div key={cert.tokenId} className="certificate-card">
              <div className="certificate-badge">
                <div className="badge-icon">🎓</div>
              </div>
              <h3 className="certificate-subject">{cert.subject}</h3>
              <div className="certificate-details">
                <p><strong>Token ID:</strong> #{cert.tokenId}</p>
                <p><strong>Sessions:</strong> {cert.sessionCount}</p>
                <p><strong>Issued:</strong> {cert.timestamp.toLocaleDateString()}</p>
                <p className="certificate-status">✅ Verified on Blockchain</p>
              </div>
              <button 
                className="download-btn"
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
