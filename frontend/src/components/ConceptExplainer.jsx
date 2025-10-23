import React, { useState } from 'react';
import enhancedAIService from '../services/enhancedAIService';
function ConceptExplainer() {
  const [concept, setConcept] = useState('');
  const [subject, setSubject] = useState('');
  const [depth, setDepth] = useState('detailed');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const explainConcept = async () => {
    if (!concept || !subject) {
      alert('Please enter both concept and subject!');
      return;
    }
    setLoading(true);
    try {
      const result = await enhancedAIService.explainConcept(concept, subject, depth);
      setExplanation(result);
      setHistory([...history, result]);
    } catch (error) {
      console.error('Error explaining concept:', error);
      alert('Failed to explain concept. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const newExplanation = () => {
    setExplanation(null);
    setConcept('');
    setSubject('');
  };
  if (loading) {
    return (
      <div className="concept-explainer">
        <div className="loading-explanation">
          <div className="spinner"></div>
          <p>Preparing your explanation...</p>
        </div>
      </div>
    );
  }
  if (!explanation) {
    return (
      <div className="concept-explainer">
        <div className="explainer-setup">
          <h2>💡 Concept Explainer</h2>
          <p>Get clear, detailed explanations for any concept</p>
          <div className="setup-form">
            <div className="form-group">
              <label>What concept do you want to understand?</label>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., Recursion, Photosynthesis, Blockchain"
              />
            </div>
            <div className="form-group">
              <label>Subject Area:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Science, Biology, Economics"
              />
            </div>
            <div className="form-group">
              <label>Explanation Depth:</label>
              <div className="depth-selector">
                <button
                  className={`depth-btn ${depth === 'simple' ? 'active' : ''}`}
                  onClick={() => setDepth('simple')}
                >
                  Simple (ELI5)
                </button>
                <button
                  className={`depth-btn ${depth === 'detailed' ? 'active' : ''}`}
                  onClick={() => setDepth('detailed')}
                >
                  Detailed
                </button>
                <button
                  className={`depth-btn ${depth === 'advanced' ? 'active' : ''}`}
                  onClick={() => setDepth('advanced')}
                >
                  Advanced
                </button>
              </div>
            </div>
            <button className="explain-btn" onClick={explainConcept}>
              Explain This Concept 🔍
            </button>
          </div>
          {history.length > 0 && (
            <div className="history-section">
              <h3>📜 Recent Explanations</h3>
              <div className="history-list">
                {history.slice(-5).reverse().map((item, index) => (
                  <div key={index} className="history-item" onClick={() => setExplanation(item)}>
                    <strong>{item.concept}</strong> in {item.subject}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="concept-explainer">
      <div className="explanation-view">
        <div className="explanation-header">
          <h2>{explanation.concept}</h2>
          <p className="subject-tag">{explanation.subject}</p>
          <span className="depth-badge">{explanation.depth}</span>
        </div>
        <div className="explanation-content">
          {explanation.explanation.split('\n').map((line, index) => {
            if (line.startsWith('**')) {
              return <h3 key={index}>{line.replace(/\*\*/g, '')}</h3>;
            } else if (line.startsWith('•') || line.startsWith('✓') || line.startsWith('→')) {
              return <li key={index}>{line.substring(1).trim()}</li>;
            } else if (line.trim()) {
              return <p key={index}>{line}</p>;
            }
            return <br key={index} />;
          })}
        </div>
        <div className="explanation-actions">
          <button className="new-explanation-btn" onClick={newExplanation}>
            Explain Another Concept
          </button>
          <button className="practice-btn">
            Practice This Concept
          </button>
        </div>
        <div className="related-concepts">
          <h3>🔗 Continue Learning</h3>
          <div className="related-tags">
            <span className="related-tag">Advanced {explanation.concept}</span>
            <span className="related-tag">Practical Applications</span>
            <span className="related-tag">Common Mistakes</span>
            <span className="related-tag">Related Topics</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConceptExplainer;
