// Authentication Routes
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const userValidator = require("../validators/userValidator");
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require("../validators/authValidator");

// Helper: wrap userValidator functions to accept data object
const validateRegistrationWithOtp = (data) => {
  return userValidator.validateUserRegistration(
    data.name,
    data.email,
    data.cpf,
    data.phone,
    data.password
  );
};

// Public routes with validation
router.post(
  "/register",
  registerValidationRules(),
  handleValidationErrors,
  authController.register.bind(authController)
);

router.post(
  "/login",
  loginValidationRules(),
  handleValidationErrors,
  authController.login.bind(authController)
);

// Email verification with OTP - using validator middleware
router.post(
  "/register-with-otp",
  validatorMiddleware(validateRegistrationWithOtp, "Register with OTP"),
  authController.registerWithOtp.bind(authController)
);

router.post(
  "/verify-email",
  authController.verifyEmail.bind(authController)
);

router.post(
  "/resend-otp",
  authController.resendOtp.bind(authController)
);

// Protected (require token)
router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);

router.get(
  "/me",
  authMiddleware,
  authController.getMe.bind(authController)
);

module.exports = router;