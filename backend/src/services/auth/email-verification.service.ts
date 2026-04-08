// Email Verification Service - Fluxo de verificação de email
import emailService from "./email.service.js";
import otpService from "./otp.service.js";
import logger from "../../utils/logger.js";

/**
 * Interface para resultado de verificação
 */
interface IVerificationResult {
  isValid: boolean;
  message: string;
}

/**
 * Enviar OTP para verificação de email
 */
async function sendVerificationCode(userId: number, email: string): Promise<void> {
  try {
    logger.info({ userId, email }, "EmailVerificationService: Sending verification code");

    // Gerar e salvar OTP
    const otp: string = await otpService.generateAndSaveOtp(userId);

    // Enviar OTP por email
    await emailService.sendOtpEmail(email, otp);

    logger.info({ userId, email }, "EmailVerificationService: Verification code sent successfully");
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId, email }, "EmailVerificationService: Error sending verification code");
    throw error;
  }
}

/**
 * Verificar código OTP fornecido pelo usuário
 */
async function verifyEmailWithOtp(userId: number, otpCode: string): Promise<IVerificationResult> {
  try {
    logger.debug({ userId }, "EmailVerificationService: Verifying email with OTP");

    // Validar OTP
    const verification: IVerificationResult = await otpService.verifyOtp(userId, otpCode);

    if (!verification.isValid) {
      return verification;
    }

    // Marcar email como verificado
    await otpService.markEmailAsVerified(userId);

    // Limpar OTP
    await otpService.clearOtp(userId);

    logger.info({ userId }, "EmailVerificationService: Email verified successfully");
    return {
      isValid: true,
      message: "Email verificado com sucesso!"
    };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "EmailVerificationService: Error verifying email");
    throw error;
  }
}

/**
 * Reenviar código OTP
 */
async function resendVerificationCode(userId: number, email: string): Promise<void> {
  try {
    logger.info({ userId, email }, "EmailVerificationService: Resending verification code");

    // Gerar novo OTP
    const otp: string = await otpService.generateAndSaveOtp(userId);

    // Enviar OTP por email
    await emailService.sendOtpEmail(email, otp);

    logger.info({ userId, email }, "EmailVerificationService: Verification code resent successfully");
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId, email }, "EmailVerificationService: Error resending verification code");
    throw error;
  }
}

class EmailVerificationService {
  async sendVerificationCode(userId: number, email: string): Promise<void> {
    return sendVerificationCode(userId, email);
  }

  async verifyEmailWithOtp(userId: number, otpCode: string): Promise<IVerificationResult> {
    return verifyEmailWithOtp(userId, otpCode);
  }

  async resendVerificationCode(userId: number, email: string): Promise<void> {
    return resendVerificationCode(userId, email);
  }
}

export default new EmailVerificationService();
export type { IVerificationResult };
