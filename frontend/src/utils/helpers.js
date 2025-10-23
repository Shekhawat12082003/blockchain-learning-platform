/**
 * Utility Functions for AI Learning Tutor
 * Common helpers used across components
 */

/**
 * Format Ethereum address for display
 * @param {string} address - Full ethereum address
 * @returns {string} Formatted address (0x1234...5678)
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format date for display
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format date with time
 * @param {Date|number} date - Date object or timestamp
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculate level from points
 * @param {number} points - Total points
 * @returns {number} Current level
 */
export const calculateLevel = (points) => {
  return Math.floor(points / 100);
};

/**
 * Calculate points needed for next level
 * @param {number} currentPoints - Current total points
 * @returns {number} Points needed for next level
 */
export const pointsToNextLevel = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelPoints = (currentLevel + 1) * 100;
  return nextLevelPoints - currentPoints;
};

/**
 * Calculate progress percentage to next level
 * @param {number} currentPoints - Current total points
 * @returns {number} Percentage (0-100)
 */
export const levelProgress = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  const levelBasePoints = currentLevel * 100;
  const pointsInCurrentLevel = currentPoints - levelBasePoints;
  return (pointsInCurrentLevel / 100) * 100;
};

/**
 * Validate Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean} True if valid
 */
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Get achievement badge emoji based on level
 * @param {number} level - User level
 * @returns {string} Emoji badge
 */
export const getAchievementBadge = (level) => {
  if (level >= 50) return '👑'; // Master
  if (level >= 30) return '🏆'; // Expert
  if (level >= 20) return '⭐'; // Advanced
  if (level >= 10) return '🎖️'; // Intermediate
  if (level >= 5) return '📚'; // Learning
  return '🌱'; // Beginner
};

/**
 * Get subject emoji
 * @param {string} subject - Subject name
 * @returns {string} Emoji for subject
 */
export const getSubjectEmoji = (subject) => {
  const lowerSubject = subject.toLowerCase();
  if (lowerSubject.includes('math')) return '🔢';
  if (lowerSubject.includes('program') || lowerSubject.includes('code')) return '💻';
  if (lowerSubject.includes('science') || lowerSubject.includes('physics') || lowerSubject.includes('chemistry')) return '🔬';
  if (lowerSubject.includes('art') || lowerSubject.includes('design')) return '🎨';
  if (lowerSubject.includes('music')) return '🎵';
  if (lowerSubject.includes('language') || lowerSubject.includes('english')) return '📖';
  if (lowerSubject.includes('history')) return '📜';
  if (lowerSubject.includes('blockchain') || lowerSubject.includes('crypto')) return '⛓️';
  return '📚';
};

/**
 * Download content as file
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} type - MIME type
 */
export const downloadFile = (content, filename, type = 'text/html') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Parse error message from contract/API
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const parseError = (error) => {
  if (error.code === 4001) return 'Transaction rejected by user';
  if (error.code === -32603) return 'Insufficient funds or not authorized';
  if (error.message?.includes('issuer')) return 'Not authorized as issuer';
  if (error.message?.includes('network')) return 'Network error. Please check connection';
  if (error.message?.includes('MetaMask')) return 'Please install MetaMask';
  return error.message || 'An error occurred';
};

/**
 * Sleep/delay utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if user has completed minimum sessions
 * @param {number} sessions - Number of sessions
 * @returns {boolean} True if meets minimum
 */
export const meetsMinimumSessions = (sessions, minimum = 1) => {
  return sessions >= minimum;
};

/**
 * Calculate total quiz score
 * @param {Array} answers - User answers
 * @param {Array} correctAnswers - Correct answers
 * @returns {Object} Score data
 */
export const calculateQuizScore = (answers, correctAnswers) => {
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) correct++;
  });
  
  const total = answers.length;
  const percentage = (correct / total) * 100;
  
  return {
    correct,
    incorrect: total - correct,
    total,
    percentage: Math.round(percentage),
    passed: percentage >= 60
  };
};
