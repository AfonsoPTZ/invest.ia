// Verify Email Service - Confirmação de email com OTP
import emailVerificationService from "./email-verification.service.js";
import tokenService from "./token.service.js";
import authRepository from "../../repositories/user.repository.js";
import logger from "../../utils/logger.js";

/**
 * Interface para confirmação de email
 */
interface IConfirmEmailResult {
  success: boolean;
  message: string;
  token?: string | null;
  redirectUrl?: string;
}

/**
 * Interface para resend OTP
 */
interface IResendResult {
  success: boolean;
  message: string;
}

/**
 * Confirmar email com código OTP
 * Dados já validados pelo middleware
 */
async function confirmEmailWithOtp(userId: number, otpCode: string): Promise<IConfirmEmailResult> {
  try {
    logger.info({ userId }, "VerifyEmailService: Confirming email with OTP");

    // Verificar OTP
    const verification: any = await emailVerificationService.verifyEmailWithOtp(userId, otpCode);

    if (!verification.isValid) {
      logger.warn({ userId }, "VerifyEmailService: OTP verification failed");
      return {
        success: false,
        message: verification.message,
        token: null
      };
    }

    // Buscar dados do usuário para gerar token
    const user: any = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "VerifyEmailService: User not found after OTP verification");
      throw new Error("User not found");
    }

    // Gerar token temporário para completar perfil financeiro
    const tempToken: string = tokenService.generateTempToken(userId, user.email);

    logger.info({ userId }, "VerifyEmailService: Email confirmed successfully with temporary token generated");

    return {
      success: true,
      message: "Email verified successfully!",
      token: tempToken,
      redirectUrl: "/financial-profile"
    };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "VerifyEmailService: Error confirming email");
    throw new Error(errorMessage);
  }
}

/**
 * Reenviar código OTP
 */
async function resendOtpCode(userId: number): Promise<IResendResult> {
  try {
    logger.info({ userId }, "VerifyEmailService: Resending OTP code");

    const user: any = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "VerifyEmailService: User not found");
      throw new Error("User not found");
    }

    await emailVerificationService.resendVerificationCode(userId, user.email);

    logger.info({ userId }, "VerifyEmailService: OTP code resent successfully");

    return {
      success: true,
      message: "Code resent! Check your email."
    };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "VerifyEmailService: Error resending OTP");
    throw new Error(errorMessage);
  }
}

class VerifyEmailService {
  async confirmEmailWithOtp(userId: number, otpCode: string): Promise<IConfirmEmailResult> {
    return confirmEmailWithOtp(userId, otpCode);
  }

  async resendOtpCode(userId: number): Promise<IResendResult> {
    return resendOtpCode(userId);
  }
}

export default new VerifyEmailService();
export type { IConfirmEmailResult, IResendResult };
