import React, { useState, useEffect, useRef } from 'react';
import aiService from '../services/aiService';

const ChatInterface = ({ account, onSessionComplete }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subject, setSubject] = useState('general');
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (account && !sessionStarted) {
      const welcomeMessage = {
        role: 'assistant',
        content: `Welcome to your personalized learning session! 🎓\n\nI'm your AI tutor. What would you like to learn about today? Choose a subject or ask me anything!`
      };
      setMessages([welcomeMessage]);
      setSessionStarted(true);
    }
  }, [account]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    try {
      const response = await aiService.sendMessage(inputMessage, subject);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCompleteSession = () => {
    if (messages.length > 3) { // At least some conversation happened
      if (onSessionComplete) {
        onSessionComplete(messages);
      }
    } else {
      alert('Please have a longer tutoring session before requesting a certificate.');
    }
  };
  if (!account) {
    return (
      <div className="card text-center py-16">
        <div className="text-6xl mb-6">🎓</div>
        <h2 className="text-3xl font-bold gradient-text mb-4">AI Tutor Chat</h2>
        <p className="text-white/70 text-lg">Connect your wallet to start a personalized learning session</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-[600px] space-y-4">
      <div className="card flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <span>🤖</span> AI Tutor Session
        </h2>
        <div className="flex items-center gap-3">
          <label className="text-white/70 font-medium">Subject:</label>
          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="glass px-4 py-2 rounded-lg text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="general">General</option>
            <option value="mathematics">Mathematics</option>
            <option value="programming">Programming</option>
            <option value="science">Science</option>
            <option value="language">Language</option>
            <option value="history">History</option>
          </select>
        </div>
      </div>
      <div className="card flex-1 overflow-y-auto space-y-4 p-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-2xl">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                : 'glass'
            }`}>
              <p className="text-white whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-2xl">🤖</div>
            <div className="glass rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="card flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask your question..."
          disabled={isLoading}
          className="flex-1 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputMessage.trim()} 
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-8"
        >
          Send
        </button>
      </form>
      {messages.length > 3 && (
        <button onClick={handleCompleteSession} className="btn-primary w-full flex items-center justify-center gap-2">
          <span>✓</span> Complete Session & Get Certificate
        </button>
      )}
    </div>
  );
};
export default ChatInterface;
