/**
 * Custom API error response handler
 * @param {Error} error - The error object
 * @param {string} operation - The operation that caused the error
 * @returns {Object} The error details
 */
const handleApiError = (error, operation) => {
  console.error(`Error during ${operation}:`, error);

  // Create a standardized error response
  const errorDetails = {
    success: false,
    message: error.message || 'An unexpected error occurred',
    operation,
  };

  // Handle specific known errors
  if (error.name === 'ValidationError') {
    errorDetails.message = Object.values(error.errors)
      .map((val) => val.message)
      .join(', ');
    errorDetails.type = 'validation_error';
  } else if (error.name === 'MongoError' && error.code === 11000) {
    errorDetails.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )} field`;
    errorDetails.type = 'duplicate_error';
  } else if (error.name === 'JsonWebTokenError') {
    errorDetails.message = 'Invalid token. Please log in again.';
    errorDetails.type = 'authentication_error';
  } else if (error.name === 'TokenExpiredError') {
    errorDetails.message = 'Your token has expired. Please log in again.';
    errorDetails.type = 'authentication_error';
  }

  return errorDetails;
};

module.exports = { handleApiError }; 