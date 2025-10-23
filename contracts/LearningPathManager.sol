// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LearningPathManager
 * @dev Manages structured learning paths, courses, and modules on blockchain
 */
contract LearningPathManager is Ownable {
    
    struct Module {
        string title;
        string description;
        string contentHash; // IPFS hash for detailed content
        uint256 estimatedMinutes;
        uint256 difficulty; // 1-5 scale
        bool isActive;
    }
    
    struct Course {
        string title;
        string description;
        string category;
        uint256[] moduleIds;
        uint256 totalPoints;
        bool isActive;
        address creator;
    }
    
    struct UserModuleProgress {
        bool completed;
        uint256 completedAt;
        uint256 score; // 0-100
        uint256 timeSpent; // in minutes
        uint256 attempts;
    }
    
    struct UserCourseProgress {
        bool enrolled;
        uint256 enrolledAt;
        uint256 completedModules;
        uint256 totalScore;
        bool completed;
        uint256 completedAt;
    }
    
    // Storage
    uint256 private nextModuleId;
    uint256 private nextCourseId;
    
    mapping(uint256 => Module) public modules;
    mapping(uint256 => Course) public courses;
    
    // User progress tracking
    mapping(address => mapping(uint256 => UserModuleProgress)) public userModuleProgress;
    mapping(address => mapping(uint256 => UserCourseProgress)) public userCourseProgress;
    mapping(address => uint256[]) public userEnrolledCourses;
    
    // Course creators (educators)
    mapping(address => bool) public educators;
    
    // Events
    event ModuleCreated(uint256 indexed moduleId, string title, uint256 difficulty);
    event CourseCreated(uint256 indexed courseId, string title, address creator);
    event UserEnrolled(address indexed user, uint256 indexed courseId);
    event ModuleCompleted(address indexed user, uint256 indexed moduleId, uint256 score);
    event CourseCompleted(address indexed user, uint256 indexed courseId, uint256 totalScore);
    event EducatorAdded(address indexed educator);
    
    constructor() {
        nextModuleId = 1;
        nextCourseId = 1;
    }
    
    // Educator management
    function addEducator(address educator) external onlyOwner {
        educators[educator] = true;
        emit EducatorAdded(educator);
    }
    
    function removeEducator(address educator) external onlyOwner {
        educators[educator] = false;
    }
    
    modifier onlyEducator() {
        require(educators[msg.sender] || msg.sender == owner(), "Not an educator");
        _;
    }
    
    // Module management
    function createModule(
        string memory title,
        string memory description,
        string memory contentHash,
        uint256 estimatedMinutes,
        uint256 difficulty
    ) external onlyEducator returns (uint256) {
        require(difficulty >= 1 && difficulty <= 5, "Difficulty must be 1-5");
        
        uint256 moduleId = nextModuleId++;
        
        modules[moduleId] = Module({
            title: title,
            description: description,
            contentHash: contentHash,
            estimatedMinutes: estimatedMinutes,
            difficulty: difficulty,
            isActive: true
        });
        
        emit ModuleCreated(moduleId, title, difficulty);
        return moduleId;
    }
    
    function updateModule(
        uint256 moduleId,
        string memory title,
        string memory description,
        string memory contentHash,
        uint256 estimatedMinutes,
        uint256 difficulty,
        bool isActive
    ) external onlyEducator {
        require(modules[moduleId].isActive || !isActive, "Module doesn't exist");
        require(difficulty >= 1 && difficulty <= 5, "Difficulty must be 1-5");
        
        Module storage module = modules[moduleId];
        module.title = title;
        module.description = description;
        module.contentHash = contentHash;
        module.estimatedMinutes = estimatedMinutes;
        module.difficulty = difficulty;
        module.isActive = isActive;
    }
    
    // Course management
    function createCourse(
        string memory title,
        string memory description,
        string memory category,
        uint256[] memory moduleIds,
        uint256 totalPoints
    ) external onlyEducator returns (uint256) {
        uint256 courseId = nextCourseId++;
        
        courses[courseId] = Course({
            title: title,
            description: description,
            category: category,
            moduleIds: moduleIds,
            totalPoints: totalPoints,
            isActive: true,
            creator: msg.sender
        });
        
        emit CourseCreated(courseId, title, msg.sender);
        return courseId;
    }
    
    function getCourseModules(uint256 courseId) external view returns (uint256[] memory) {
        return courses[courseId].moduleIds;
    }
    
    // Enrollment
    function enrollInCourse(uint256 courseId) external {
        require(courses[courseId].isActive, "Course not active");
        require(!userCourseProgress[msg.sender][courseId].enrolled, "Already enrolled");
        
        userCourseProgress[msg.sender][courseId] = UserCourseProgress({
            enrolled: true,
            enrolledAt: block.timestamp,
            completedModules: 0,
            totalScore: 0,
            completed: false,
            completedAt: 0
        });
        
        userEnrolledCourses[msg.sender].push(courseId);
        emit UserEnrolled(msg.sender, courseId);
    }
    
    // Complete module
    function completeModule(
        uint256 moduleId,
        uint256 score,
        uint256 timeSpent
    ) external {
        require(modules[moduleId].isActive, "Module not active");
        require(score <= 100, "Score must be 0-100");
        
        UserModuleProgress storage progress = userModuleProgress[msg.sender][moduleId];
        
        if (!progress.completed) {
            progress.completed = true;
            progress.completedAt = block.timestamp;
        }
        
        progress.score = score;
        progress.timeSpent = timeSpent;
        progress.attempts += 1;
        
        emit ModuleCompleted(msg.sender, moduleId, score);
        
        // Check if this completes any enrolled courses
        _updateCourseProgress(msg.sender, moduleId, score);
    }
    
    function _updateCourseProgress(address user, uint256 moduleId, uint256 score) internal {
        uint256[] memory enrolledCourses = userEnrolledCourses[user];
        
        for (uint256 i = 0; i < enrolledCourses.length; i++) {
            uint256 courseId = enrolledCourses[i];
            UserCourseProgress storage courseProgress = userCourseProgress[user][courseId];
            
            if (courseProgress.completed) continue;
            
            Course storage course = courses[courseId];
            bool moduleInCourse = false;
            
            // Check if module is in this course
            for (uint256 j = 0; j < course.moduleIds.length; j++) {
                if (course.moduleIds[j] == moduleId) {
                    moduleInCourse = true;
                    break;
                }
            }
            
            if (!moduleInCourse) continue;
            
            // Update course progress
            uint256 completedCount = 0;
            uint256 totalScore = 0;
            
            for (uint256 j = 0; j < course.moduleIds.length; j++) {
                uint256 mid = course.moduleIds[j];
                if (userModuleProgress[user][mid].completed) {
                    completedCount++;
                    totalScore += userModuleProgress[user][mid].score;
                }
            }
            
            courseProgress.completedModules = completedCount;
            courseProgress.totalScore = totalScore;
            
            // Check if course is completed
            if (completedCount == course.moduleIds.length && !courseProgress.completed) {
                courseProgress.completed = true;
                courseProgress.completedAt = block.timestamp;
                emit CourseCompleted(user, courseId, totalScore);
            }
        }
    }
    
    // View functions
    function getUserEnrolledCourses(address user) external view returns (uint256[] memory) {
        return userEnrolledCourses[user];
    }
    
    function getUserCourseProgress(address user, uint256 courseId) 
        external 
        view 
        returns (
            bool enrolled,
            uint256 enrolledAt,
            uint256 completedModules,
            uint256 totalModules,
            uint256 totalScore,
            bool completed,
            uint256 completedAt
        ) 
    {
        UserCourseProgress memory progress = userCourseProgress[user][courseId];
        Course memory course = courses[courseId];
        
        return (
            progress.enrolled,
            progress.enrolledAt,
            progress.completedModules,
            course.moduleIds.length,
            progress.totalScore,
            progress.completed,
            progress.completedAt
        );
    }
    
    function getUserModuleProgress(address user, uint256 moduleId)
        external
        view
        returns (
            bool completed,
            uint256 completedAt,
            uint256 score,
            uint256 timeSpent,
            uint256 attempts
        )
    {
        UserModuleProgress memory progress = userModuleProgress[user][moduleId];
        return (
            progress.completed,
            progress.completedAt,
            progress.score,
            progress.timeSpent,
            progress.attempts
        );
    }
    
    function getModuleDetails(uint256 moduleId)
        external
        view
        returns (
            string memory title,
            string memory description,
            string memory contentHash,
            uint256 estimatedMinutes,
            uint256 difficulty,
            bool isActive
        )
    {
        Module memory module = modules[moduleId];
        return (
            module.title,
            module.description,
            module.contentHash,
            module.estimatedMinutes,
            module.difficulty,
            module.isActive
        );
    }
    
    function getCourseDetails(uint256 courseId)
        external
        view
        returns (
            string memory title,
            string memory description,
            string memory category,
            uint256 moduleCount,
            uint256 totalPoints,
            bool isActive,
            address creator
        )
    {
        Course memory course = courses[courseId];
        return (
            course.title,
            course.description,
            course.category,
            course.moduleIds.length,
            course.totalPoints,
            course.isActive,
            course.creator
        );
    }
}
