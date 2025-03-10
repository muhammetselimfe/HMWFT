/**
 * Error handling utility for the Crypto Telegram Bot
 */

// Log error details to console
const logError = (context, error) => {
  console.error(`[ERROR] ${context}: ${error.message}`);
  if (error.response) {
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  }
};

// Handle API errors with appropriate messages
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.status === 429) {
      return 'Rate limit exceeded. Please try again later.';
    } else if (error.response.status === 404) {
      return 'The requested resource was not found.';
    } else if (error.response.status >= 500) {
      return 'The server encountered an error. Please try again later.';
    }
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response received from the server. Please check your internet connection.';
  }
  
  // Something happened in setting up the request that triggered an Error
  return 'An unexpected error occurred. Please try again later.';
};

module.exports = {
  logError,
  handleApiError
}; 