// Authentication Routes
const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validatorMiddleware = require("../middlewares/validator.middleware");
const userValidator = require("../validators/user.validator");

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

// Helper: wrap login validator
const validateLogin = (data) => {
  return userValidator.validateUserLogin(data.email, data.password);
};

// Helper: wrap OTP verification validator
const validateOtpVerification = (data) => {
  return userValidator.validateOtpVerification(data.userId, data.otpCode);
};

// Helper: wrap resend OTP validator
const validateResendOtp = (data) => {
  return userValidator.validateResendOtp(data.userId);
};

// Public routes with validation middleware
router.post(
  "/register",
  validatorMiddleware(validateRegistrationWithOtp, "User Registration"),
  authController.register.bind(authController)
);

router.post(
  "/login",
  validatorMiddleware(validateLogin, "User Login"),
  authController.login.bind(authController)
);

router.post(
  "/register-with-otp",
  validatorMiddleware(validateRegistrationWithOtp, "Register with OTP"),
  authController.registerWithOtp.bind(authController)
);

router.post(
  "/verify-email",
  validatorMiddleware(validateOtpVerification, "Email Verification"),
  authController.verifyEmail.bind(authController)
);

router.post(
  "/resend-otp",
  validatorMiddleware(validateResendOtp, "Resend OTP"),
  authController.resendOtp.bind(authController)
);

// Protected routes (require token)
router.delete(
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