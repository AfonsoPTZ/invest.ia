// Authentication Controller - Simple request/response handler
const registerService = require("../services/auth/register.service");
const loginService = require("../services/auth/login.service");
const verifyEmailService = require("../services/auth/verifyEmail.service");
const logger = require("../utils/logger");

class AuthController {
  // Register new user
  async register(request, response) {
    try {
      const { name, email, cpf, phone, password } = request.body;

      logger.info({ email }, "Attempting user registration");

      const registerResult = await registerService.registerUser(name, email, cpf, phone, password);

      logger.info({ userId: registerResult.userId, email }, "User registered successfully");

      return response.status(201).json({
        status: "success",
        message: registerResult.message,
        userId: registerResult.userId
      });

    } catch (error) {
      logger.error({ error: error.message, email: request.body.email }, "Error on user registration");
      return response.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Login user
  async login(request, response) {
    try {
      const { email, password } = request.body;

      logger.info({ email }, "Attempting user login");

      const loginResult = await loginService.loginUser(email, password);

      logger.info({ userId: loginResult.id, email }, "User logged in successfully");

      return response.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
          id: loginResult.id,
          name: loginResult.name,
          email: loginResult.email
        },
        token: loginResult.token
      });

    } catch (error) {
      logger.error({ error: error.message, email: request.body.email }, "Error on user login");
      return response.status(401).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Logout user
  async logout(request, response) {
    try {
      const userId = request.user?.id;
      
      logger.info({ userId }, "User attempting logout");

      logger.info({ userId }, "User logged out successfully");

      return response.status(200).json({
        status: "success",
        message: "Logout successful"
      });
    } catch (error) {
      logger.error({ error: error.message }, "Error on user logout");
      return response.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Get authenticated user data
  async getMe(request, response) {
    try {
      const userId = request.user?.id;

      logger.info({ userId }, "Fetching authenticated user data");

      return response.status(200).json({
        status: "success",
        user: request.user
      });
    } catch (error) {
      logger.error({ error: error.message, userId: request.user?.id }, "Error fetching authenticated user");
      return response.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Register with OTP verification
  async registerWithOtp(request, response) {
    try {
      // Using validated data from validatorMiddleware
      const { name, email, cpf, phone, password } = request.validatedData || request.body;

      logger.info({ email }, "Attempting user registration with OTP");

      const result = await registerService.registerUser(name, email, cpf, phone, password);

      logger.info({ userId: result.userId, email }, "User registered successfully. OTP sent");

      return response.status(201).json({
        status: "success",
        userId: result.userId,
        message: result.message
      });

    } catch (error) {
      logger.error({ error: error.message, email: request.validatedData?.email || request.body?.email }, "Error on registration with OTP");
      
      return response.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Verify email with OTP
  async verifyEmail(request, response) {
    try {
      const { userId, otpCode } = request.body;

      if (!userId || !otpCode) {
        logger.warn({ userId, otpCode }, "Missing userId or otpCode");
        return response.status(400).json({
          success: false,
          message: "userId and otpCode are required"
        });
      }

      logger.info({ userId }, "Attempting email verification");

      const result = await verifyEmailService.confirmEmailWithOtp(userId, otpCode);

      if (!result.success) {
        logger.warn({ userId }, "Email verification failed");
        return response.status(400).json({
          success: false,
          message: result.message
        });
      }

      logger.info({ userId }, "Email verified successfully with temporary token generated");

      return response.status(200).json({
        success: true,
        message: result.message,
        token: result.token,
        redirectUrl: result.redirectUrl
      });

    } catch (error) {
      logger.error({ error: error.message, userId: request.body.userId }, "Error on email verification");
      
      return response.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Resend OTP code
  async resendOtp(request, response) {
    try {
      const { userId } = request.body;

      if (!userId) {
        logger.warn({}, "Missing userId");
        return response.status(400).json({
          success: false,
          message: "userId is required"
        });
      }

      logger.info({ userId }, "Attempting to resend OTP");

      const result = await verifyEmailService.resendOtpCode(userId);

      logger.info({ userId }, "OTP resent successfully");

      return response.status(200).json(result);

    } catch (error) {
      logger.error({ error: error.message, userId: request.body.userId }, "Error on resend OTP");
      
      return response.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Export controller instance
const authController = new AuthController();

module.exports = authController;