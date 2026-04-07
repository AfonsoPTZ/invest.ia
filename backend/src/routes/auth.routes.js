// Authentication Routes
import express from "express";
const router = express.Router();

import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validatorMiddleware from "../middlewares/validator.middleware.js";
import { validateUserRegistration, validateUserLogin, validateOtpVerification, validateResendOtp } from "../validators/user.validator.js";

// Helper: wrap userValidator functions to accept data object
const validateRegistrationWithOtp = (data) => {
  return validateUserRegistration(
    data.name,
    data.email,
    data.cpf,
    data.phone,
    data.password
  );
};

// Helper: wrap login validator
const validateLoginHelper = (data) => {
  return validateUserLogin(data.email, data.password);
};

// Helper: wrap OTP verification validator
const validateOtpVerificationHelper = (data) => {
  return validateOtpVerification(data.userId, data.otpCode);
};

// Helper: wrap resend OTP validator
const validateResendOtpHelper = (data) => {
  return validateResendOtp(data.userId);
};

// Public routes with validation middleware
router.post(
  "/register",
  validatorMiddleware(validateRegistrationWithOtp, "User Registration"),
  authController.register.bind(authController)
);

router.post(
  "/login",
  validatorMiddleware(validateLoginHelper, "User Login"),
  authController.login.bind(authController)
);

router.post(
  "/register-with-otp",
  validatorMiddleware(validateRegistrationWithOtp, "Register with OTP"),
  authController.registerWithOtp.bind(authController)
);

router.post(
  "/verify-email",
  validatorMiddleware(validateOtpVerificationHelper, "Email Verification"),
  authController.verifyEmail.bind(authController)
);

router.post(
  "/resend-otp",
  validatorMiddleware(validateResendOtpHelper, "Resend OTP"),
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

export default router;