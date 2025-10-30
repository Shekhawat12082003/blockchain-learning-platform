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
      <div className="card text-center py-16">
        <div className="animate-spin text-6xl mb-4">⚡</div>
        <p className="text-xl text-white/70">Generating your personalized quiz...</p>
      </div>
    );
  }
  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-text mb-3 flex items-center justify-center gap-3">
              <span>📝</span> Take a Quiz
            </h2>
            <p className="text-white/70 text-lg">Test your knowledge and track your progress</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Subject/Topic:</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Python Programming, Algebra, History"
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">Difficulty Level:</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-semibold mb-2">Number of Questions:</label>
                <input
                  type="number"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))}
                  min="1"
                  max="20"
                  className="input-field"
                />
              </div>
            </div>
            <button className="btn-primary w-full text-lg py-4" onClick={generateQuiz}>
              Generate Quiz 🚀
            </button>
          </div>
        </div>
        <div className="card">
          <h3 className="text-2xl font-bold gradient-text mb-4">Why Take Quizzes?</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">✅</span>
              <span>Test your understanding</span>
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">📊</span>
              <span>Track your progress</span>
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">🎯</span>
              <span>Identify weak areas</span>
            </li>
            <li className="flex items-center gap-3 text-white/80">
              <span className="text-2xl">🏆</span>
              <span>Earn points and certificates</span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  if (showResults) {
    const percentage = Math.round((score / quiz.length) * 100);
    const passed = percentage >= 70;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`card text-center ${passed ? 'border-green-500/50' : 'border-yellow-500/50'}`}>
          <div className="text-6xl mb-4">{passed ? '🎉' : '📚'}</div>
          <h2 className="text-4xl font-bold gradient-text mb-4">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-6xl font-bold gradient-text">{score}</span>
            <span className="text-4xl text-white/50">/ {quiz.length}</span>
          </div>
          <p className="text-3xl font-bold mb-2">{percentage}%</p>
          <p className="text-xl text-white/70">{passed ? 'You Passed!' : 'Try Again'}</p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-bold gradient-text mb-6">Question Review</h3>
          <div className="space-y-4">
            {quiz.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                <div key={index} className={`card ${isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-white/70">Question {index + 1}</span>
                    <span className={`text-2xl ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                  <p className="text-lg font-semibold mb-4">{q.question}</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-white/70">
                      <span className="font-semibold">Your Answer:</span> {userAnswer || 'Not answered'}
                    </p>
                    <p className="text-green-400">
                      <span className="font-semibold">Correct Answer:</span> {q.correctAnswer}
                    </p>
                    <div className="glass p-3 rounded-lg mt-3">
                      <p className="font-semibold text-white/90 mb-1">Explanation:</p>
                      <p className="text-white/70">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-4">
          <button className="btn-primary flex-1" onClick={generateQuiz}>
            Retake Quiz
          </button>
          <button className="btn-secondary flex-1" onClick={restartQuiz}>
            New Quiz
          </button>
        </div>
      </div>
    );
  }
  const currentQ = quiz[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.length) * 100;
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold gradient-text">{subject} Quiz</h2>
          <span className="text-white/70 font-semibold">
            Question {currentQuestion + 1} of {quiz.length}
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-2xl font-semibold mb-6">{currentQ.question}</h3>
        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            const optionLetter = option.charAt(0);
            const isSelected = selectedAnswers[currentQuestion] === optionLetter;
            return (
              <div
                key={index}
                onClick={() => selectAnswer(optionLetter)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white/50 shadow-lg' 
                    : 'glass border-2 border-white/20 hover:border-white/40 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{option}</span>
                  {isSelected && <span className="text-2xl">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-4">
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        {currentQuestion === quiz.length - 1 ? (
          <button className="btn-primary flex-1" onClick={submitQuiz}>
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn-primary flex-1"
          >
            Next →
          </button>
        )}
      </div>
      <div className="flex justify-center gap-2 flex-wrap">
        {quiz.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              index === currentQuestion 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 ring-4 ring-blue-500/30 scale-125' 
                : selectedAnswers[index] 
                  ? 'bg-green-500' 
                  : 'bg-white/30'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};
export default QuizInterface;
