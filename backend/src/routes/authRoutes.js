// Authentication Routes
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require("../validators/authValidator");

// Public routes with validation
router.post(
  "/register",
  registerValidationRules(),
  handleValidationErrors,
  authController.registerController
);

router.post(
  "/login",
  loginValidationRules(),
  handleValidationErrors,
  authController.loginController
);

// Protected (require token)
router.post("/logout", authMiddleware, authController.logoutController);
router.get("/me", authMiddleware, authController.getMeController);

module.exports = router;