// Dashboard Validator - Validates dashboard request parameters
// APENAS VALIDA - Não faz ações
// Retorna {isValid, error, cleanedData}

/**
 * Validate User ID for dashboard requests
 * Designed to work with generic validatorMiddleware
 * 
 * @param data - Data object (passed by validatorMiddleware from request.body)
 * @param userId - User ID to validate (from request.user.id in middleware)
 * @returns {isValid: boolean, error?: string, cleanedData?: {userId: number}}
 */
function validateDashboardUserId(data: any, userId: any): any {
  if (!userId) {
    return {
      isValid: false,
      error: "User ID is required"
    };
  }

  const id: number = parseInt(userId);

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

export {
  validateDashboardUserId
};
