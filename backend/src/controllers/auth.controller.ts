// Authentication Controller - Simple request/response handler
import { Request, Response } from "express";
import registerService from "../services/auth/register.service.js";
import loginService from "../services/auth/login.service.js";
import verifyEmailService from "../services/auth/verify-email.service.js";
import RegisterDTO from "../dtos/register.dto.js";
import LoginDTO from "../dtos/login.dto.js";
import VerifyOtpDTO from "../dtos/verify-otp.dto.js";
import AuthResponseDTO from "../dtos/auth-response.dto.js";
import UserResponseDTO from "../dtos/user-response.dto.js";

class AuthController {
  /**
   * Register new user
   */
  async register(request: Request, response: Response): Promise<Response> {
    try {
      // Create DTO from validated data (from middleware)
      const registerDTO: any = RegisterDTO.fromRequest((request as any).validatedData || request.body);

      const registerResult: any = await registerService.registerUser(
        registerDTO.name,
        registerDTO.email,
        registerDTO.cpf,
        registerDTO.phone,
        registerDTO.password
      );

      return response.status(201).json({
        success: true,
        message: registerResult.message,
        data: {
          userId: registerResult.userId
        }
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(400).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Login user
   */
  async login(request: Request, response: Response): Promise<Response> {
    try {
      // Create DTO from validated data (from middleware)
      const loginDTO: any = LoginDTO.fromRequest((request as any).validatedData || request.body);

      const loginResult: any = await loginService.loginUser(loginDTO.email, loginDTO.password);

      // Usar AuthResponseDTO para formatar a resposta
      const authResponseDTO: any = AuthResponseDTO.fromUser(loginResult, loginResult.token);

      return response.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          ...authResponseDTO.toJSON(),
          token: authResponseDTO.token
        }
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(401).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Logout user
   */
  async logout(request: Request, response: Response): Promise<Response> {
    try {
      const userId: number = (request as any).user?.id;

      return response.status(200).json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(500).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Get authenticated user data
   */
  async getMe(request: Request, response: Response): Promise<Response> {
    try {
      const userId: number = (request as any).user?.id;

      // Transform user data with output DTO to filter sensitive fields
      const userResponseDTO: any = UserResponseDTO.fromUser((request as any).user);

      return response.status(200).json({
        success: true,
        message: "User data retrieved successfully",
        data: userResponseDTO.toJSON()
      });
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(500).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Register with OTP verification
   */
  async registerWithOtp(request: Request, response: Response): Promise<Response> {
    try {
      // Create DTO from request (validated data from middleware)
      const registerDTO: any = RegisterDTO.fromRequest((request as any).validatedData || request.body);

      const result: any = await registerService.registerUser(
        registerDTO.name,
        registerDTO.email,
        registerDTO.cpf,
        registerDTO.phone,
        registerDTO.password
      );

      return response.status(201).json({
        success: true,
        message: result.message,
        data: {
          userId: result.userId
        }
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(400).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(request: Request, response: Response): Promise<Response> {
    try {
      // Create DTO from validated data (from middleware)
      const verifyOtpDTO: any = VerifyOtpDTO.fromRequest((request as any).validatedData || request.body);

      const result: any = await verifyEmailService.confirmEmailWithOtp(
        verifyOtpDTO.userId,
        verifyOtpDTO.otpCode
      );

      if (!result.success) {
        return response.status(400).json({
          success: false,
          message: result.message,
          error: result.message
        });
      }

      return response.status(200).json({
        success: true,
        message: result.message,
        data: {
          token: result.token,
          redirectUrl: result.redirectUrl
        }
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(400).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }

  /**
   * Resend OTP code
   */
  async resendOtp(request: Request, response: Response): Promise<Response> {
    try {
      // Create DTO from validated data (from middleware)
      const { userId } = (request as any).validatedData || request.body;

      const result: any = await verifyEmailService.resendOtpCode(userId);

      return response.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : String(error);
      return response.status(400).json({
        success: false,
        message: errorMessage,
        error: errorMessage
      });
    }
  }
}

// Export controller instance
const authController: AuthController = new AuthController();

export default authController;
