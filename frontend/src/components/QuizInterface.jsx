import { useState } from 'react';
import enhancedAIService from '../services/enhancedAIService';


const QuizInterface = () => {
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async () => {
    if (!subject) {
      alert('Please enter a subject!');
      return;
    }

    setLoading(true);
    try {
      const questions = await enhancedAIService.generateQuiz(subject, difficulty, questionCount);
      setQuiz(questions);
      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: answer
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setQuiz(null);
    setSubject('');
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (loading) {
    return (
      <div className="quiz-interface">
        <div className="loading-quiz">
          <div className="spinner"></div>
          <p>Generating your personalized quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-interface">
        <div className="quiz-setup">
          <h2>📝 Take a Quiz</h2>
          <p>Test your knowledge and track your progress</p>

          <div className="setup-form">
            <div className="form-group">
              <label>Subject/Topic:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Python Programming, Algebra, History"
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level:</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Questions:</label>
              <input
                type="number"
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                min="1"
                max="20"
              />
            </div>

            <button className="generate-btn" onClick={generateQuiz}>
              Generate Quiz 🚀
            </button>
          </div>

          <div className="quiz-benefits">
            <h3>Why Take Quizzes?</h3>
            <ul>
              <li>✅ Test your understanding</li>
              <li>📊 Track your progress</li>
              <li>🎯 Identify weak areas</li>
              <li>🏆 Earn points and certificates</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / quiz.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="quiz-interface">
        <div className="quiz-results">
          <div className={`results-header ${passed ? 'passed' : 'failed'}`}>
            <h2>{passed ? '🎉 Congratulations!' : '📚 Keep Learning!'}</h2>
            <div className="score-display">
              <span className="score">{score}</span>
              <span className="total">/ {quiz.length}</span>
            </div>
            <p className="percentage">{percentage}%</p>
            <p className="status">{passed ? 'You Passed!' : 'Try Again'}</p>
          </div>

          <div className="results-breakdown">
            <h3>Question Review</h3>
            {quiz.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={index} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="question-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`result-icon ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <p className="question-text">{q.question}</p>
                  <div className="answer-review">
                    <p><strong>Your Answer:</strong> {userAnswer || 'Not answered'}</p>
                    <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                    <div className="explanation">
                      <strong>Explanation:</strong>
                      <p>{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="results-actions">
            <button className="retry-btn" onClick={generateQuiz}>
              Retake Quiz
            </button>
            <button className="new-quiz-btn" onClick={restartQuiz}>
              New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.length) * 100;

  return (
    <div className="quiz-interface">
      <div className="quiz-header">
        <h2>{subject} Quiz</h2>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Question {currentQuestion + 1} of {quiz.length}</p>
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <h3 className="question-text">{currentQ.question}</h3>
          <div className="options-list">
            {currentQ.options.map((option, index) => {
              const optionLetter = option.charAt(0);
              const isSelected = selectedAnswers[currentQuestion] === optionLetter;

              return (
                <div
                  key={index}
                  className={`option ${isSelected ? 'selected' : ''}`}
                  onClick={() => selectAnswer(optionLetter)}
                >
                  <span className="option-text">{option}</span>
                  {isSelected && <span className="checkmark">✓</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="quiz-navigation">
          <button
            className="nav-btn prev"
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            ← Previous
          </button>

          {currentQuestion === quiz.length - 1 ? (
            <button className="submit-btn" onClick={submitQuiz}>
              Submit Quiz
            </button>
          ) : (
            <button
              className="nav-btn next"
              onClick={nextQuestion}
            >
              Next →
            </button>
          )}
        </div>

        <div className="answer-indicator">
          {quiz.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === currentQuestion ? 'active' : ''} ${selectedAnswers[index] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestion(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
