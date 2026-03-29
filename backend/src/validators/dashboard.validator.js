// Dashboard Validator - Validates dashboard request parameters
// APENAS VALIDA - Não faz ações
// Retorna {isValid, error, cleanedData}

/**
 * Validate User ID for dashboard requests
 * Designed to work with generic validatorMiddleware
 * 
 * @param {Object} data - Data object (passed by validatorMiddleware from request.body)
 * @param {number} userId - User ID to validate (from request.user.id in middleware)
 * @returns {Object} {isValid: boolean, error?: string, cleanedData?: {userId: number}}
 */
function validateDashboardUserId(data, userId) {
  if (!userId) {
    return {
      isValid: false,
      error: "User ID is required"
    };
  }

  const id = parseInt(userId);

  if (isNaN(id)) {
    return {
      isValid: false,
      error: "User ID must be a valid number"
    };
  }

  if (id <= 0) {
    return {
      isValid: false,
      error: "User ID must be greater than 0"
    };
  }

  return {
    isValid: true,
    cleanedData: { userId: id }
  };
}

module.exports = {
  validateDashboardUserId
};
