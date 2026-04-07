// Email Verification Service - Fluxo de verificação de email
import emailService from "./email.service.js";
import otpService from "./otp.service.js";
import logger from "../../utils/logger.js";

/**
 * Enviar OTP para verificação de email
 * @param {number} userId - ID do usuário
 * @param {string} email - Email do usuário
 * @returns {Promise<void>}
 */
async function sendVerificationCode(userId, email) {
  try {
    logger.info({ userId, email }, "EmailVerificationService: Sending verification code");

    // Gerar e salvar OTP
    const otp = await otpService.generateAndSaveOtp(userId);

    // Enviar OTP por email
    await emailService.sendOtpEmail(email, otp);

    logger.info({ userId, email }, "EmailVerificationService: Verification code sent successfully");
  } catch (error) {
    logger.error({ error: error.message, userId, email }, "EmailVerificationService: Error sending verification code");
    throw error;
  }
}

/**
 * Verificar código OTP fornecido pelo usuário
 * @param {number} userId - ID do usuário
 * @param {string} otpCode - Código OTP fornecido
 * @returns {Promise<{isValid: boolean, message: string}>}
 */
async function verifyEmailWithOtp(userId, otpCode) {
  try {
    logger.debug({ userId }, "EmailVerificationService: Verifying email with OTP");

    // Validar OTP
    const verification = await otpService.verifyOtp(userId, otpCode);

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
    logger.error({ error: error.message, userId }, "EmailVerificationService: Error verifying email");
    throw error;
  }
}

/**
 * Reenviar código OTP
 * @param {number} userId - ID do usuário
 * @param {string} email - Email do usuário
 * @returns {Promise<void>}
 */
async function resendVerificationCode(userId, email) {
  try {
    logger.info({ userId, email }, "EmailVerificationService: Resending verification code");

    // Gerar novo OTP
    const otp = await otpService.generateAndSaveOtp(userId);

    // Enviar OTP por email
    await emailService.sendOtpEmail(email, otp);

    logger.info({ userId, email }, "EmailVerificationService: Verification code resent successfully");
  } catch (error) {
    logger.error({ error: error.message, userId, email }, "EmailVerificationService: Error resending verification code");
    throw error;
  }
}

class EmailVerificationService {
  async sendVerificationCode(userId, email) {
    return sendVerificationCode(userId, email);
  }

  async verifyEmailWithOtp(userId, otpCode) {
    return verifyEmailWithOtp(userId, otpCode);
  }

  async resendVerificationCode(userId, email) {
    return resendVerificationCode(userId, email);
  }
}

export default new EmailVerificationService();
