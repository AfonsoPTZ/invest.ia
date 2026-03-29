const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const dashboardValidator = require("../validators/dashboardValidator");

/**
 * Dashboard Routes - All GET only
 * Order: authMiddleware -> validatorMiddleware -> Controller
 */

// Helper: Create validator wrapper that uses authenticated user ID
const validateDashboardRequest = (data) => {
  // Will be filled by middleware with request.user.id
  return dashboardValidator.validateDashboardUserId(data, this.userId);
};

// Middleware wrapper that extracts userId from auth and validates
const dashboardValidationMiddleware = (request, response, next) => {
  // Attach userId to validatorMiddleware context
  const userData = {};
  const validation = dashboardValidator.validateDashboardUserId(userData, request.user?.id);
  
  if (!validation.isValid) {
    return response.status(400).json({
      status: "error",
      message: validation.error
    });
  }

  request.validatedData = validation.cleanedData;
  next();
};

// GET - Dashboard completa (usuário + investimentos)
router.get(
  "/",
  authMiddleware,
  dashboardValidationMiddleware,
  dashboardController.getDashboard
);

// GET - Apenas nome do usuário
router.get(
  "/name",
  authMiddleware,
  dashboardValidationMiddleware,
  dashboardController.getUserName
);

// GET - Apenas dados de investimentos
router.get(
  "/investments",
  authMiddleware,
  dashboardValidationMiddleware,
  dashboardController.getInvestments
);

module.exports = router;
