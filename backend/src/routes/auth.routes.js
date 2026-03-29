// Authentication Routes
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const userValidator = require("../validators/user.validator");
const {
  registerValidationRules,
  loginValidationRules,
  validateEmailVerificationRules,
  validateResendOtpRules,
  handleValidationErrors
} = require("../validators/auth.validator");

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
  validateEmailVerificationRules(),
  handleValidationErrors,
  authController.verifyEmail.bind(authController)
);

router.post(
  "/resend-otp",
  validateResendOtpRules(),
  handleValidationErrors,
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