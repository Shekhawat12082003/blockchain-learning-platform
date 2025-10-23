export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
export const formatDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
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
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
export const calculateLevel = (points) => {
  return Math.floor(points / 100);
};
export const pointsToNextLevel = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  const nextLevelPoints = (currentLevel + 1) * 100;
  return nextLevelPoints - currentPoints;
};
export const levelProgress = (currentPoints) => {
  const currentLevel = calculateLevel(currentPoints);
  const levelBasePoints = currentLevel * 100;
  const pointsInCurrentLevel = currentPoints - levelBasePoints;
  return (pointsInCurrentLevel / 100) * 100;
};
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
export const getAchievementBadge = (level) => {
  if (level >= 50) return '👑'; // Master
  if (level >= 30) return '🏆'; // Expert
  if (level >= 20) return '⭐'; // Advanced
  if (level >= 10) return '🎖️'; // Intermediate
  if (level >= 5) return '📚'; // Learning
  return '🌱'; // Beginner
};
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
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};
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
export const parseError = (error) => {
  if (error.code === 4001) return 'Transaction rejected by user';
  if (error.code === -32603) return 'Insufficient funds or not authorized';
  if (error.message?.includes('issuer')) return 'Not authorized as issuer';
  if (error.message?.includes('network')) return 'Network error. Please check connection';
  if (error.message?.includes('MetaMask')) return 'Please install MetaMask';
  return error.message || 'An error occurred';
};
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const meetsMinimumSessions = (sessions, minimum = 1) => {
  return sessions >= minimum;
};
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
