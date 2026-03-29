// Verify Email Service - Confirmação de email com OTP
const jwt = require("jsonwebtoken");
const { verifyEmailWithOtp, resendVerificationCode } = require("./email-verification.service");
const { generateTempToken } = require("./token.service");
const otpValidator = require("../../validators/otp.validator");
const authRepository = require("../../repositories/user.repository");
const logger = require("../../utils/logger");

/**
 * Confirmar email com código OTP
 * @param {number} userId - ID do usuário
 * @param {string} otpCode - Código OTP fornecido
 * @returns {Promise<{success: boolean, message: string, token: string, redirectUrl: string}>}
 */
async function confirmEmailWithOtp(userId, otpCode) {
  try {
    logger.info({ userId }, "VerifyEmailService: Confirming email with OTP");

    // Validar formato do OTP
    const validation = otpValidator.validateOtpFormat(otpCode);
    if (!validation.isValid) {
      logger.warn({ userId }, `VerifyEmailService: Invalid OTP format - ${validation.error}`);
      throw new Error(validation.error);
    }

    // Verificar OTP
    const verification = await verifyEmailWithOtp(userId, validation.cleanedOtp);

    if (!verification.isValid) {
      logger.warn({ userId }, "VerifyEmailService: OTP verification failed");
      return {
        success: false,
        message: verification.message,
        token: null
      };
    }

    // Buscar dados do usuário para gerar token
    const user = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "VerifyEmailService: User not found after OTP verification");
      throw new Error("Usuário não encontrado");
    }

    // Gerar token temporário para completar perfil financeiro
    const tempToken = generateTempToken(userId, user.email);

    logger.info({ userId }, "VerifyEmailService: Email confirmed successfully with temporary token generated");

    return {
      success: true,
      message: "Email verificado com sucesso!",
      token: tempToken,
      redirectUrl: "/financial-profile"
    };

  } catch (error) {
    logger.error({ error: error.message, userId }, "VerifyEmailService: Error confirming email");
    throw new Error(error.message);
  }
}

/**
 * Reenviar código OTP
 * @param {number} userId - ID do usuário
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function resendOtpCode(userId) {
  try {
    logger.info({ userId }, "VerifyEmailService: Resending OTP code");

    const user = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "VerifyEmailService: User not found");
      throw new Error("Usuário não encontrado");
    }

    await resendVerificationCode(userId, user.email);

    logger.info({ userId }, "VerifyEmailService: OTP code resent successfully");

    return {
      success: true,
      message: "Código reenviado! Verifique seu email."
    };

  } catch (error) {
    logger.error({ error: error.message, userId }, "VerifyEmailService: Error resending OTP");
    throw new Error(error.message);
  }
}

module.exports = {
  confirmEmailWithOtp,
  resendOtpCode
};
