import axios from 'axios';
import { AI_PROVIDERS } from '../config/constants';

class AIService {
  constructor() {
    this.provider = this.detectProvider();
    this.conversationHistory = [];
    this.availableProviders = this.getAvailableProviders();
    this.useMockMode = this.availableProviders.length === 0 || import.meta.env.VITE_USE_MOCK_AI === 'true';
  }

  getAvailableProviders() {
    const providers = [];
    if (import.meta.env.VITE_GEMINI_API_KEY) providers.push(AI_PROVIDERS.GEMINI);
    if (import.meta.env.VITE_HUGGINGFACE_API_KEY) providers.push(AI_PROVIDERS.HUGGINGFACE);
    if (import.meta.env.VITE_COHERE_API_KEY) providers.push(AI_PROVIDERS.COHERE);
    return providers;
  }

  detectProvider() {
    // Prioritize free providers: Gemini, HuggingFace, Cohere
    if (import.meta.env.VITE_GEMINI_API_KEY) return AI_PROVIDERS.GEMINI;
    if (import.meta.env.VITE_HUGGINGFACE_API_KEY) return AI_PROVIDERS.HUGGINGFACE;
    if (import.meta.env.VITE_COHERE_API_KEY) return AI_PROVIDERS.COHERE;
    return null;
  }

  // Mock AI responses for demo/testing
  getMockResponse(message, subject) {
    const responses = {
      mathematics: [
        "Great question! In mathematics, let's break this down step by step...",
        "That's an interesting problem! Here's how we can approach it...",
        "Mathematics is all about patterns. Let me help you understand this concept...",
      ],
      programming: [
        "Excellent programming question! Let me explain this concept with an example...",
        "In programming, we use this pattern to solve similar problems. Here's how...",
        "That's a fundamental concept in software development. Let me clarify...",
      ],
      science: [
        "Fascinating scientific question! The key principle here is...",
        "Science helps us understand the world around us. For this topic...",
        "That's a great observation! In science, we explain this phenomenon by...",
      ],
      general: [
        "That's a great question! Let me help you understand this better...",
        "I'm here to help you learn! Based on what you're asking...",
        "Interesting topic! Here's what you should know...",
      ]
    };

    const subjectResponses = responses[subject] || responses.general;
    const randomResponse = subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
    
    return `${randomResponse}\n\n[🤖 Demo Mode: Using mock AI responses. Add a valid API key in .env to use real AI tutoring!]`;
  }

  async sendMessage(userMessage, subject = 'general') {
    // Use mock mode if no providers or explicitly enabled
    if (this.useMockMode || this.availableProviders.length === 0) {
      console.log('🤖 Using Mock AI Mode');
      this.conversationHistory.push({ role: 'user', content: userMessage });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = this.getMockResponse(userMessage, subject);
      this.conversationHistory.push({ role: 'assistant', content: response });
      return { role: 'assistant', content: response };
    }

    this.conversationHistory.push({ role: 'user', content: userMessage });

    // Try providers with fallback
    for (let i = 0; i < this.availableProviders.length; i++) {
      const provider = i === 0 ? this.provider : this.availableProviders[i];
      
      try {
        let response;
        switch (provider) {
          case AI_PROVIDERS.GEMINI:
            console.log('Trying Gemini...');
            response = await this.callGemini(userMessage, subject);
            break;
          case AI_PROVIDERS.HUGGINGFACE:
            console.log('Trying HuggingFace...');
            response = await this.callHuggingFace(userMessage, subject);
            break;
          case AI_PROVIDERS.COHERE:
            console.log('Trying Cohere...');
            response = await this.callCohere(userMessage, subject);
            break;
          default:
            continue;
        }

        // Success! Update current provider and return
        this.provider = provider;
        this.conversationHistory.push({ role: 'assistant', content: response });
        return { role: 'assistant', content: response };

      } catch (error) {
        console.warn(`${provider} failed:`, error.message);
        
        // If this was the last provider, fallback to mock mode
        if (i === this.availableProviders.length - 1) {
          console.log('All providers failed, using mock mode');
          this.useMockMode = true;
          this.conversationHistory.pop(); // Remove failed user message
          return this.sendMessage(userMessage, subject); // Retry with mock mode
        }
        // Otherwise continue to next provider
      }
    }

    // Fallback to mock if loop completes without success
    this.useMockMode = true;
    this.conversationHistory.pop();
    return this.sendMessage(userMessage, subject);
  }

  async callGemini(message, subject) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = `You are a helpful tutor specializing in ${subject}. Provide clear, concise explanations. Keep responses under 200 words.\n\nUser: ${message}`;

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error.response?.data || error.message);
      throw new Error(`Gemini Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async callHuggingFace(message, subject) {
    const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
    const systemPrompt = `You are a helpful tutor specializing in ${subject}. Provide clear, concise explanations. Keep responses under 200 words.`;

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/google/flan-t5-base',
        {
          inputs: `${systemPrompt}\n\nQuestion: ${message}\n\nAnswer:`,
          parameters: {
            max_length: 300,
            temperature: 0.7,
            top_p: 0.95
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data[0]?.generated_text || response.data.generated_text || 'Response generated successfully.';
    } catch (error) {
      console.error('HuggingFace API Error:', error.response?.data || error.message);
      throw new Error(`HuggingFace Error: ${error.response?.data?.error || error.message}`);
    }
  }

  async callCohere(message, subject) {
    const apiKey = import.meta.env.VITE_COHERE_API_KEY;
    const systemPrompt = `You are a helpful and knowledgeable tutor specializing in ${subject}. Provide clear, concise explanations and encourage learning. Keep responses under 200 words.`;

    try {
      const response = await axios.post(
        'https://api.cohere.com/v2/chat',
        {
          model: 'command-r-plus-08-2024',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.message?.content[0]?.text || response.data.text;
    } catch (error) {
      console.error('Cohere API Error:', error.response?.data || error.message);
      throw new Error(`Cohere Error: ${error.response?.data?.message || error.message}`);
    }
  }

  resetConversation() {
    this.conversationHistory = [];
  }

  getConversationHistory() {
    return this.conversationHistory;
  }
}

export default new AIService();
