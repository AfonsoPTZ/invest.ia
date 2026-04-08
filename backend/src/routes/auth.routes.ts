// Authentication Routes
import { Router } from "express";
const router: Router = Router();

import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validatorMiddleware from "../middlewares/validator.middleware.js";
import { 
  validateUserRegistration, 
  validateUserLogin, 
  validateOtpVerification, 
  validateResendOtp 
} from "../validators/user.validator.js";

// Helper: wrap userValidator functions to accept data object
const validateRegistrationWithOtp = (data: any): any => {
  return validateUserRegistration(
    data.name,
    data.email,
    data.cpf,
    data.phone,
    data.password
  );
};

// Helper: wrap login validator
const validateLoginHelper = (data: any): any => {
  return validateUserLogin(data.email, data.password);
};

// Helper: wrap OTP verification validator
const validateOtpVerificationHelper = (data: any): any => {
  return validateOtpVerification(data.userId, data.otpCode);
};

// Helper: wrap resend OTP validator
const validateResendOtpHelper = (data: any): any => {
  return validateResendOtp(data.userId);
};

// Public routes with validation middleware
router.post(
  "/register",
  validatorMiddleware(validateRegistrationWithOtp, "User Registration"),
  (req, res) => authController.register(req, res)
);

router.post(
  "/login",
  validatorMiddleware(validateLoginHelper, "User Login"),
  (req, res) => authController.login(req, res)
);

router.post(
  "/register-with-otp",
  validatorMiddleware(validateRegistrationWithOtp, "Register with OTP"),
  (req, res) => authController.registerWithOtp(req, res)
);

router.post(
  "/verify-email",
  validatorMiddleware(validateOtpVerificationHelper, "Email Verification"),
  (req, res) => authController.verifyEmail(req, res)
);

router.post(
  "/resend-otp",
  validatorMiddleware(validateResendOtpHelper, "Resend OTP"),
  (req, res) => authController.resendOtp(req, res)
);

// Protected routes (require token)
router.delete(
  "/logout",
  authMiddleware,
  (req, res) => authController.logout(req, res)
);

router.get(
  "/me",
  authMiddleware,
  (req, res) => authController.getMe(req, res)
);

export default router;
