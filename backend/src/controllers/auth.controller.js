// Authentication Controller - Simple request/response handler
const registerService = require("../services/auth/register.service");
const loginService = require("../services/auth/login.service");
const verifyEmailService = require("../services/auth/verify-email.service");
const RegisterDTO = require("../dtos/register.dto");
const LoginDTO = require("../dtos/login.dto");
const VerifyOtpDTO = require("../dtos/verify-otp.dto");

class AuthController {
  // Register new user
  async register(request, response) {
    try {
      // Create DTO from validated data (from middleware)
      const registerDTO = RegisterDTO.fromRequest(request.validatedData || request.body);

      const registerResult = await registerService.registerUser(
        registerDTO.name,
        registerDTO.email,
        registerDTO.cpf,
        registerDTO.phone,
        registerDTO.password
      );

      return response.status(201).json({
        status: "success",
        message: registerResult.message,
        userId: registerResult.userId
      });

    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Login user
  async login(request, response) {
    try {
      // Create DTO from validated data (from middleware)
      const loginDTO = LoginDTO.fromRequest(request.validatedData || request.body);

      const loginResult = await loginService.loginUser(loginDTO.email, loginDTO.password);

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

      return response.status(200).json({
        status: "success",
        message: "Logout successful"
      });
    } catch (error) {
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

      return response.status(200).json({
        status: "success",
        user: request.user
      });
    } catch (error) {
      return response.status(500).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Register with OTP verification
  async registerWithOtp(request, response) {
    try {
      // Create DTO from request (validated data from middleware)
      const registerDTO = RegisterDTO.fromRequest(request.validatedData || request.body);

      const result = await registerService.registerUser(
        registerDTO.name,
        registerDTO.email,
        registerDTO.cpf,
        registerDTO.phone,
        registerDTO.password
      );

      return response.status(201).json({
        status: "success",
        userId: result.userId,
        message: result.message
      });

    } catch (error) {
      return response.status(400).json({
        status: "error",
        message: error.message
      });
    }
  }

  // Verify email with OTP
  async verifyEmail(request, response) {
    try {
      // Create DTO from validated data (from middleware)
      const verifyOtpDTO = VerifyOtpDTO.fromRequest(request.validatedData || request.body);

      const result = await verifyEmailService.confirmEmailWithOtp(
        verifyOtpDTO.userId,
        verifyOtpDTO.otpCode
      );

      if (!result.success) {
        return response.status(400).json({
          success: false,
          message: result.message
        });
      }

      return response.status(200).json({
        success: true,
        message: result.message,
        token: result.token,
        redirectUrl: result.redirectUrl
      });

    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Resend OTP code
  async resendOtp(request, response) {
    try {
      // Create DTO from validated data (from middleware)
      const { userId } = request.validatedData || request.body;

      const result = await verifyEmailService.resendOtpCode(userId);

      return response.status(200).json(result);

    } catch (error) {
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