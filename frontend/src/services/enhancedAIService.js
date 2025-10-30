import axios from 'axios';
class EnhancedAIService {
  constructor() {
    this.geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    this.huggingfaceKey = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    this.cohereKey = process.env.NEXT_PUBLIC_COHERE_API_KEY;
    this.useMockMode = false;
    this.conversationContext = [];
    this.currentSubject = null;
    this.userLevel = 'beginner';
  }
  async teach(userMessage, context = {}) {
    const { subject, level, learningStyle, previousTopics } = context;
    this.currentSubject = subject || this.currentSubject;
    this.userLevel = level || this.userLevel;
    const systemPrompt = this.buildTeachingPrompt(subject, level, learningStyle);
    try {
      let response = await this.tryProvider('gemini', userMessage, systemPrompt);
      if (!response) response = await this.tryProvider('huggingface', userMessage, systemPrompt);
      if (!response) response = await this.tryProvider('cohere', userMessage, systemPrompt);
      if (!response) {
        this.useMockMode = true;
        response = this.getMockTeachingResponse(userMessage, subject);
      }
      this.conversationContext.push({
        role: 'user',
        content: userMessage
      }, {
        role: 'assistant',
        content: response
      });
      return {
        response,
        subject: this.currentSubject,
        usedMockMode: this.useMockMode
      };
    } catch (error) {
      console.error('Teaching error:', error);
      throw error;
    }
  }
  async generateQuiz(subject, difficulty = 'medium', questionCount = 5) {
    const prompt = `Generate ${questionCount} multiple-choice quiz questions about ${subject} at ${difficulty} difficulty level. 
    Format as JSON array with this structure:
    [
      {
        "question": "Question text",
        "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
        "correctAnswer": "B",
        "explanation": "Why this answer is correct",
        "points": 10
      }
    ]
    Make questions educational and engaging. Include explanations for learning.`;
    try {
      let response = await this.tryProvider('gemini', prompt, 'You are a quiz generator for educational purposes.');
      if (!response) response = await this.tryProvider('huggingface', prompt, 'You are a quiz generator for educational purposes.');
      if (!response) response = await this.tryProvider('cohere', prompt, 'You are a quiz generator for educational purposes.');
      if (!response) {
        return this.getMockQuiz(subject, difficulty, questionCount);
      }
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return this.getMockQuiz(subject, difficulty, questionCount);
    } catch (error) {
      console.error('Quiz generation error:', error);
      return this.getMockQuiz(subject, difficulty, questionCount);
    }
  }
  async explainConcept(concept, subject, depth = 'detailed') {
    const depthPrompts = {
      'simple': 'Explain this like I\'m 10 years old, using simple analogies',
      'detailed': 'Provide a comprehensive explanation with examples',
      'advanced': 'Give an in-depth technical explanation with real-world applications'
    };
    const prompt = `Explain the concept of "${concept}" in ${subject}. ${depthPrompts[depth] || depthPrompts['detailed']}.
    Structure your explanation:
    1. Simple Definition
    2. Key Points (3-5 bullet points)
    3. Real-world Example
    4. Common Misconceptions
    5. Related Concepts to explore next`;
    try {
      let response = await this.tryProvider('gemini', prompt, 'You are an expert educator.');
      if (!response) response = await this.tryProvider('huggingface', prompt, 'You are an expert educator.');
      if (!response) response = await this.tryProvider('cohere', prompt, 'You are an expert educator.');
      if (!response) {
        return this.getMockExplanation(concept, subject);
      }
      return {
        concept,
        subject,
        explanation: response,
        depth
      };
    } catch (error) {
      console.error('Explanation error:', error);
      return this.getMockExplanation(concept, subject);
    }
  }
  async createStudyPlan(subject, timeAvailable, currentLevel, goals) {
    const prompt = `Create a personalized ${timeAvailable} study plan for learning ${subject}.
Current level: ${currentLevel}
Goals: ${goals}
Provide a structured study plan with:
1. Week-by-week breakdown
2. Daily time allocation
3. Specific topics to cover
4. Recommended resources
5. Practice exercises
6. Milestones and checkpoints
Format as a clear, actionable plan.`;
    try {
      let response = await this.tryProvider('gemini', prompt, 'You are a learning coach and curriculum designer.');
      if (!response) response = await this.tryProvider('huggingface', prompt, 'You are a learning coach and curriculum designer.');
      if (!response) response = await this.tryProvider('cohere', prompt, 'You are a learning coach and curriculum designer.');
      if (!response) {
        return this.getMockStudyPlan(subject, timeAvailable, currentLevel);
      }
      return {
        subject,
        duration: timeAvailable,
        level: currentLevel,
        plan: response
      };
    } catch (error) {
      console.error('Study plan error:', error);
      return this.getMockStudyPlan(subject, timeAvailable, currentLevel);
    }
  }
  async analyzeProgress(userData) {
    const { completedTopics, quizScores, timeSpent, strengths, weaknesses } = userData;
    const prompt = `Analyze this learner's progress and provide personalized feedback:
Completed Topics: ${completedTopics.join(', ')}
Average Quiz Score: ${quizScores.average}%
Time Spent: ${timeSpent} hours
Strengths: ${strengths.join(', ')}
Areas for Improvement: ${weaknesses.join(', ')}
Provide:
1. Overall Progress Assessment
2. Specific Strengths to leverage
3. Targeted recommendations for weak areas
4. Next topics to focus on
5. Motivational insights
6. Adjusted learning strategy`;
    try {
      let response = await this.tryProvider('gemini', prompt, 'You are an educational analytics expert and learning coach.');
      if (!response) response = await this.tryProvider('huggingface', prompt, 'You are an educational analytics expert and learning coach.');
      if (!response) response = await this.tryProvider('cohere', prompt, 'You are an educational analytics expert and learning coach.');
      if (!response) {
        return this.getMockProgressAnalysis(userData);
      }
      return {
        analysis: response,
        recommendations: this.extractRecommendations(response),
        motivationalScore: this.calculateMotivation(quizScores.average)
      };
    } catch (error) {
      console.error('Progress analysis error:', error);
      return this.getMockProgressAnalysis(userData);
    }
  }
  async generatePracticeProblems(subject, topic, difficulty, count = 3) {
    const prompt = `Generate ${count} practice problems for ${topic} in ${subject} at ${difficulty} difficulty.
For each problem provide:
- Clear problem statement
- Step-by-step solution
- Common mistakes to avoid
- Similar problems for practice
Make problems progressively challenging and educational.`;
    try {
      let response = await this.tryProvider('gemini', prompt, 'You are a problem-based learning expert.');
      if (!response) response = await this.tryProvider('huggingface', prompt, 'You are a problem-based learning expert.');
      if (!response) response = await this.tryProvider('cohere', prompt, 'You are a problem-based learning expert.');
      if (!response) {
        return this.getMockPracticeProblems(subject, topic, count);
      }
      return {
        subject,
        topic,
        difficulty,
        problems: response
      };
    } catch (error) {
      console.error('Practice problems error:', error);
      return this.getMockPracticeProblems(subject, topic, count);
    }
  }
  buildTeachingPrompt(subject, level, learningStyle) {
    return `You are an expert AI tutor specializing in ${subject || 'various subjects'}.
Teaching Parameters:
- Student Level: ${level || 'beginner'}
- Learning Style: ${learningStyle || 'balanced'}
Your teaching approach:
1. Break down complex concepts into digestible parts
2. Use analogies and real-world examples
3. Check for understanding before moving forward
4. Encourage questions and critical thinking
5. Provide positive reinforcement
6. Adapt explanations based on student responses
Be patient, encouraging, and thorough. Your goal is mastery, not just information transfer.`;
  }
  async tryProvider(provider, userMessage, systemPrompt) {
    try {
      if (provider === 'gemini' && this.geminiKey) {
        return await this.callGemini(userMessage, systemPrompt);
      } else if (provider === 'huggingface' && this.huggingfaceKey) {
        return await this.callHuggingFace(userMessage, systemPrompt);
      } else if (provider === 'cohere' && this.cohereKey) {
        return await this.callCohere(userMessage, systemPrompt);
      }
      return null;
    } catch (error) {
      console.error(`${provider} error:`, error);
      return null;
    }
  }
  async callGemini(message, systemPrompt) {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiKey}`,
      {
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nStudent: ${message}`
          }]
        }]
      }
    );
    return response.data.candidates[0]?.content?.parts[0]?.text;
  }
  async callHuggingFace(message, systemPrompt) {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-base',
      {
        inputs: `${systemPrompt}\n\nQuestion: ${message}\n\nAnswer:`,
        parameters: {
          max_length: 2048,
          temperature: 0.7,
          top_p: 0.95
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${this.huggingfaceKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data[0]?.generated_text || response.data.generated_text || 'Response generated successfully.';
  }
  async callCohere(message, systemPrompt) {
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
          'Authorization': `Bearer ${this.cohereKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.message?.content[0]?.text || response.data.text;
  }
  getMockTeachingResponse(message, subject) {
    const responses = {
      'Mathematics': `Great question about ${subject}! Let me break this down step by step:
1. **Core Concept**: ${message.includes('how') ? 'Let me explain the process' : 'Here\'s what you need to know'}
2. **Example**: Imagine you have a real-world problem where this applies...
3. **Practice**: Try solving: If x = 5, what would happen next?
4. **Key Takeaway**: Remember, the most important thing is to understand WHY, not just HOW.
Would you like me to explain any part in more detail?`,
      'Programming': `Excellent! Let's tackle this programming concept:
\`\`\`
function example() {
}
\`\`\`
**Key Points**:
- Always write clean, readable code
- Test your code thoroughly
- Comment your logic
Try coding this yourself and let me know if you get stuck!`,
      'default': `That's a great question! Here's how I'd explain it:
📚 **Concept**: Let me start with the basics...
💡 **Example**: Think of it like this - imagine you're...
🎯 **Application**: In real life, you'd use this when...
✅ **Quick Check**: Can you tell me what you understand so far?
I'm here to help you master this topic!`
    };
    return responses[subject] || responses['default'];
  }
  getMockQuiz(subject, difficulty, count) {
    const baseQuestions = [
      {
        question: `What is a fundamental concept in ${subject}?`,
        options: ['A) Basic principle', 'B) Advanced theory', 'C) Practical application', 'D) Historical context'],
        correctAnswer: 'A',
        explanation: 'Understanding fundamental concepts is the foundation of learning.',
        points: 10
      },
      {
        question: `Which approach works best for learning ${subject}?`,
        options: ['A) Memorization only', 'B) Practice and application', 'C) Reading theory only', 'D) Guessing'],
        correctAnswer: 'B',
        explanation: 'Practice and application help solidify understanding.',
        points: 10
      },
      {
        question: `What's an important skill in ${subject}?`,
        options: ['A) Problem solving', 'B) Pattern recognition', 'C) Critical thinking', 'D) All of the above'],
        correctAnswer: 'D',
        explanation: 'All these skills work together for mastery.',
        points: 15
      }
    ];
    return baseQuestions.slice(0, count);
  }
  getMockExplanation(concept, subject) {
    return {
      concept,
      subject,
      explanation: `**${concept}** in ${subject}
**Simple Definition**: ${concept} is a core principle that helps you understand...
**Key Points**:
• It forms the foundation for advanced topics
• Used in practical applications daily
• Essential for problem-solving
• Connects to other important concepts
**Real-world Example**: Think of when you...
**Common Misconceptions**: Many learners think... but actually...
**Related Concepts**: Next, explore: Advanced ${concept}, Applied ${concept}, ${concept} in practice`,
      depth: 'detailed'
    };
  }
  getMockStudyPlan(subject, duration, level) {
    return {
      subject,
      duration,
      level,
      plan: `**${duration} Study Plan for ${subject}** (${level} level)
**Week 1-2: Foundations**
- Daily: 1 hour
- Topics: Core concepts, basic terminology
- Practice: 30 mins/day
- Checkpoint: Complete basic quiz
**Week 3-4: Building Skills**
- Daily: 1.5 hours  
- Topics: Intermediate concepts, applications
- Practice: Hands-on exercises
- Checkpoint: Mini-project
**Week 5-6: Advanced Application**
- Daily: 2 hours
- Topics: Complex problems, real scenarios
- Practice: Challenge problems
- Checkpoint: Final assessment
**Resources**:
• Interactive tutorials
• Practice problems database
• Community forums
• Video explanations
**Success Tips**:
✓ Practice daily for consistency
✓ Don't skip fundamentals
✓ Ask questions when stuck
✓ Track your progress`
    };
  }
  getMockProgressAnalysis(userData) {
    return {
      analysis: `**Progress Analysis**
**Overall Performance**: You're making solid progress! 
**Strengths**:
${userData.strengths.map(s => `✓ ${s}`).join('\n')}
**Areas for Growth**:
${userData.weaknesses.map(w => `→ ${w} (Focus here next)`).join('\n')}
**Recommendations**:
1. Continue practicing your strong areas
2. Dedicate 30% more time to weak areas
3. Try different learning approaches
4. Join study groups for support
**Next Steps**: Focus on ${userData.weaknesses[0]}, then move to advanced topics.
Keep up the great work! 🎯`,
      recommendations: userData.weaknesses,
      motivationalScore: 75
    };
  }
  getMockPracticeProblems(subject, topic, count) {
    return {
      subject,
      topic,
      difficulty: 'medium',
      problems: `**Practice Problems for ${topic}**
**Problem 1**: Basic Application
- Question: Apply the concept of ${topic} to solve...
- Solution: Step 1... Step 2... Step 3...
- Common Mistake: Don't forget to...
**Problem 2**: Intermediate Challenge
- Question: Given this scenario, how would you...
- Solution: Approach: First analyze... Then...
- Common Mistake: Many overlook...
**Problem 3**: Advanced Application
- Question: Combine ${topic} with other concepts to...
- Solution: This requires understanding... 
- Common Mistake: Remember to validate...
**Practice Tip**: Work through each problem slowly, understand each step!`
    };
  }
  extractRecommendations(analysisText) {
    return ['Focus on weak areas', 'Practice daily', 'Review fundamentals'];
  }
  calculateMotivation(averageScore) {
    if (averageScore >= 90) return 95;
    if (averageScore >= 75) return 80;
    if (averageScore >= 60) return 65;
    return 50;
  }
  clearContext() {
    this.conversationContext = [];
  }
  getContext() {
    return this.conversationContext;
  }
}
export default new EnhancedAIService();
