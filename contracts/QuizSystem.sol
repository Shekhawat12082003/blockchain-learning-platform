// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuizSystem
 * @dev Blockchain-based quiz and assessment system for learning verification
 */
contract QuizSystem is Ownable {
    
    struct Question {
        string questionText;
        string questionHash; // IPFS hash for detailed question content
        uint256 points;
        uint256 difficulty; // 1-5
        string subject;
        bool isActive;
    }
    
    struct Quiz {
        string title;
        string subject;
        uint256[] questionIds;
        uint256 passingScore; // Percentage (0-100)
        uint256 timeLimit; // in minutes, 0 = unlimited
        bool isActive;
        address creator;
    }
    
    struct QuizAttempt {
        uint256 quizId;
        uint256 attemptNumber;
        uint256 startTime;
        uint256 endTime;
        uint256 score;
        uint256 totalPoints;
        bool passed;
        bool completed;
        bytes32 answerHash; // Hash of answers for verification
    }
    
    struct UserQuizStats {
        uint256 totalAttempts;
        uint256 bestScore;
        uint256 lastAttemptTime;
        bool everPassed;
    }
    
    // Storage
    uint256 private nextQuestionId;
    uint256 private nextQuizId;
    uint256 private nextAttemptId;
    
    mapping(uint256 => Question) public questions;
    mapping(uint256 => Quiz) public quizzes;
    mapping(uint256 => QuizAttempt) public attempts;
    
    // User stats
    mapping(address => mapping(uint256 => UserQuizStats)) public userQuizStats;
    mapping(address => uint256[]) public userAttemptIds;
    mapping(address => mapping(uint256 => uint256[])) public userQuizAttempts; // user => quizId => attemptIds
    
    // Quiz creators
    mapping(address => bool) public quizCreators;
    
    // Events
    event QuestionCreated(uint256 indexed questionId, string subject, uint256 difficulty);
    event QuizCreated(uint256 indexed quizId, string title, address creator);
    event QuizStarted(uint256 indexed attemptId, address indexed user, uint256 indexed quizId);
    event QuizCompleted(uint256 indexed attemptId, address indexed user, uint256 score, bool passed);
    event QuizCreatorAdded(address indexed creator);
    
    constructor() {
        nextQuestionId = 1;
        nextQuizId = 1;
        nextAttemptId = 1;
    }
    
    // Creator management
    function addQuizCreator(address creator) external onlyOwner {
        quizCreators[creator] = true;
        emit QuizCreatorAdded(creator);
    }
    
    function removeQuizCreator(address creator) external onlyOwner {
        quizCreators[creator] = false;
    }
    
    modifier onlyCreator() {
        require(quizCreators[msg.sender] || msg.sender == owner(), "Not a quiz creator");
        _;
    }
    
    // Question management
    function createQuestion(
        string memory questionText,
        string memory questionHash,
        uint256 points,
        uint256 difficulty,
        string memory subject
    ) external onlyCreator returns (uint256) {
        require(difficulty >= 1 && difficulty <= 5, "Difficulty must be 1-5");
        require(points > 0, "Points must be greater than 0");
        
        uint256 questionId = nextQuestionId++;
        
        questions[questionId] = Question({
            questionText: questionText,
            questionHash: questionHash,
            points: points,
            difficulty: difficulty,
            subject: subject,
            isActive: true
        });
        
        emit QuestionCreated(questionId, subject, difficulty);
        return questionId;
    }
    
    function updateQuestion(
        uint256 questionId,
        string memory questionText,
        string memory questionHash,
        uint256 points,
        uint256 difficulty,
        string memory subject,
        bool isActive
    ) external onlyCreator {
        require(questions[questionId].isActive || !isActive, "Question doesn't exist");
        
        Question storage question = questions[questionId];
        question.questionText = questionText;
        question.questionHash = questionHash;
        question.points = points;
        question.difficulty = difficulty;
        question.subject = subject;
        question.isActive = isActive;
    }
    
    // Quiz management
    function createQuiz(
        string memory title,
        string memory subject,
        uint256[] memory questionIds,
        uint256 passingScore,
        uint256 timeLimit
    ) external onlyCreator returns (uint256) {
        require(passingScore <= 100, "Passing score must be <= 100");
        require(questionIds.length > 0, "Quiz must have questions");
        
        uint256 quizId = nextQuizId++;
        
        quizzes[quizId] = Quiz({
            title: title,
            subject: subject,
            questionIds: questionIds,
            passingScore: passingScore,
            timeLimit: timeLimit,
            isActive: true,
            creator: msg.sender
        });
        
        emit QuizCreated(quizId, title, msg.sender);
        return quizId;
    }
    
    function getQuizQuestions(uint256 quizId) external view returns (uint256[] memory) {
        return quizzes[quizId].questionIds;
    }
    
    // Start quiz attempt
    function startQuiz(uint256 quizId) external returns (uint256) {
        require(quizzes[quizId].isActive, "Quiz not active");
        
        uint256 attemptId = nextAttemptId++;
        
        attempts[attemptId] = QuizAttempt({
            quizId: quizId,
            attemptNumber: userQuizStats[msg.sender][quizId].totalAttempts + 1,
            startTime: block.timestamp,
            endTime: 0,
            score: 0,
            totalPoints: 0,
            passed: false,
            completed: false,
            answerHash: bytes32(0)
        });
        
        userAttemptIds[msg.sender].push(attemptId);
        userQuizAttempts[msg.sender][quizId].push(attemptId);
        userQuizStats[msg.sender][quizId].totalAttempts++;
        userQuizStats[msg.sender][quizId].lastAttemptTime = block.timestamp;
        
        emit QuizStarted(attemptId, msg.sender, quizId);
        return attemptId;
    }
    
    // Submit quiz (off-chain grading, on-chain recording)
    function submitQuiz(
        uint256 attemptId,
        uint256 score,
        uint256 totalPoints,
        bytes32 answerHash
    ) external {
        QuizAttempt storage attempt = attempts[attemptId];
        require(!attempt.completed, "Quiz already submitted");
        require(attempt.startTime > 0, "Quiz not started");
        
        Quiz memory quiz = quizzes[attempt.quizId];
        
        // Check time limit
        if (quiz.timeLimit > 0) {
            require(
                block.timestamp <= attempt.startTime + (quiz.timeLimit * 60),
                "Time limit exceeded"
            );
        }
        
        attempt.endTime = block.timestamp;
        attempt.score = score;
        attempt.totalPoints = totalPoints;
        attempt.answerHash = answerHash;
        attempt.completed = true;
        
        // Calculate percentage
        uint256 percentage = (score * 100) / totalPoints;
        attempt.passed = percentage >= quiz.passingScore;
        
        // Update user stats
        UserQuizStats storage stats = userQuizStats[msg.sender][attempt.quizId];
        if (score > stats.bestScore) {
            stats.bestScore = score;
        }
        if (attempt.passed) {
            stats.everPassed = true;
        }
        
        emit QuizCompleted(attemptId, msg.sender, score, attempt.passed);
    }
    
    // View functions
    function getUserAttempts(address user) external view returns (uint256[] memory) {
        return userAttemptIds[user];
    }
    
    function getUserQuizAttempts(address user, uint256 quizId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userQuizAttempts[user][quizId];
    }
    
    function getAttemptDetails(uint256 attemptId)
        external
        view
        returns (
            uint256 quizId,
            uint256 attemptNumber,
            uint256 startTime,
            uint256 endTime,
            uint256 score,
            uint256 totalPoints,
            bool passed,
            bool completed
        )
    {
        QuizAttempt memory attempt = attempts[attemptId];
        return (
            attempt.quizId,
            attempt.attemptNumber,
            attempt.startTime,
            attempt.endTime,
            attempt.score,
            attempt.totalPoints,
            attempt.passed,
            attempt.completed
        );
    }
    
    function getUserQuizStats(address user, uint256 quizId)
        external
        view
        returns (
            uint256 totalAttempts,
            uint256 bestScore,
            uint256 lastAttemptTime,
            bool everPassed
        )
    {
        UserQuizStats memory stats = userQuizStats[user][quizId];
        return (
            stats.totalAttempts,
            stats.bestScore,
            stats.lastAttemptTime,
            stats.everPassed
        );
    }
    
    function getQuizDetails(uint256 quizId)
        external
        view
        returns (
            string memory title,
            string memory subject,
            uint256 questionCount,
            uint256 passingScore,
            uint256 timeLimit,
            bool isActive,
            address creator
        )
    {
        Quiz memory quiz = quizzes[quizId];
        return (
            quiz.title,
            quiz.subject,
            quiz.questionIds.length,
            quiz.passingScore,
            quiz.timeLimit,
            quiz.isActive,
            quiz.creator
        );
    }
    
    function getQuestionDetails(uint256 questionId)
        external
        view
        returns (
            string memory questionText,
            string memory questionHash,
            uint256 points,
            uint256 difficulty,
            string memory subject,
            bool isActive
        )
    {
        Question memory question = questions[questionId];
        return (
            question.questionText,
            question.questionHash,
            question.points,
            question.difficulty,
            question.subject,
            question.isActive
        );
    }
}
