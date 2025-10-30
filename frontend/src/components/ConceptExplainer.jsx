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
      <div className="card text-center py-16">
        <div className="animate-spin text-6xl mb-4">💡</div>
        <p className="text-xl text-white/70">Preparing your explanation...</p>
      </div>
    );
  }
  if (!explanation) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-text mb-3 flex items-center justify-center gap-3">
              <span>💡</span> Concept Explainer
            </h2>
            <p className="text-white/70 text-lg">Get clear, detailed explanations for any concept</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">What concept do you want to understand?</label>
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., Recursion, Photosynthesis, Blockchain"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Subject Area:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Science, Biology, Economics"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-3">Explanation Depth:</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setDepth('simple')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                    depth === 'simple' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                      : 'glass hover:bg-white/20'
                  }`}
                >
                  Simple (ELI5)
                </button>
                <button
                  onClick={() => setDepth('detailed')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                    depth === 'detailed' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                      : 'glass hover:bg-white/20'
                  }`}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setDepth('advanced')}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                    depth === 'advanced' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg' 
                      : 'glass hover:bg-white/20'
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
            <button className="btn-primary w-full text-lg py-4" onClick={explainConcept}>
              Explain This Concept 🔍
            </button>
          </div>
        </div>
        {history.length > 0 && (
          <div className="card">
            <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
              <span>📜</span> Recent Explanations
            </h3>
            <div className="space-y-2">
              {history.slice(-5).reverse().map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setExplanation(item)}
                  className="glass p-4 rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                >
                  <strong className="text-white">{item.concept}</strong>
                  <span className="text-white/70"> in {item.subject}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-2">{explanation.concept}</h2>
            <div className="flex items-center gap-3">
              <span className="glass px-3 py-1 rounded-full text-sm">{explanation.subject}</span>
              <span className="glass px-3 py-1 rounded-full text-sm capitalize">{explanation.depth}</span>
            </div>
          </div>
        </div>
        <div className="prose prose-invert max-w-none space-y-4">
          {explanation.explanation.split('\n').map((line, index) => {
            if (line.startsWith('**')) {
              return <h3 key={index} className="text-2xl font-bold gradient-text mt-6 mb-3">{line.replace(/\*\*/g, '')}</h3>;
            } else if (line.startsWith('•') || line.startsWith('✓') || line.startsWith('→')) {
              return <li key={index} className="ml-6 text-white/80">{line.substring(1).trim()}</li>;
            } else if (line.trim()) {
              return <p key={index} className="text-white/80 leading-relaxed">{line}</p>;
            }
            return <br key={index} />;
          })}
        </div>
      </div>
      <div className="flex gap-4">
        <button className="btn-primary flex-1" onClick={newExplanation}>
          Explain Another Concept
        </button>
        <button className="btn-secondary flex-1">
          Practice This Concept
        </button>
      </div>
      <div className="card">
        <h3 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
          <span>🔗</span> Continue Learning
        </h3>
        <div className="flex flex-wrap gap-3">
          <span className="glass px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all">
            Advanced {explanation.concept}
          </span>
          <span className="glass px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all">
            Practical Applications
          </span>
          <span className="glass px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all">
            Common Mistakes
          </span>
          <span className="glass px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all">
            Related Topics
          </span>
        </div>
      </div>
    </div>
  );
};
export default ConceptExplainer;
