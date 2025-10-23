import React, { useState, useEffect, useRef } from 'react';
import aiService from '../services/aiService';
import '../styles/ChatInterface.css';

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
      <div className="chat-interface">
        <div className="chat-placeholder">
          <h2>🎓 AI Tutor Chat</h2>
          <p>Connect your wallet to start a personalized learning session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>🤖 AI Tutor Session</h2>
        <div className="subject-selector">
          <label>Subject: </label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="general">General</option>
            <option value="mathematics">Mathematics</option>
            <option value="programming">Programming</option>
            <option value="science">Science</option>
            <option value="language">Language</option>
            <option value="history">History</option>
          </select>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-avatar">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content loading">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask your question..."
          disabled={isLoading}
          className="chat-input"
        />
        <button type="submit" disabled={isLoading || !inputMessage.trim()} className="send-btn">
          Send
        </button>
      </form>

      {messages.length > 3 && (
        <div className="session-actions">
          <button onClick={handleCompleteSession} className="complete-btn">
            ✓ Complete Session & Get Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
