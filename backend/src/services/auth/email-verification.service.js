// Email Verification Service - Fluxo de verificação de email
const { sendOtpEmail } = require("./email.service");
const { generateAndSaveOtp, verifyOtp, clearOtp, markEmailAsVerified } = require("./otp.service");
const logger = require("../../utils/logger");

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
    const otp = await generateAndSaveOtp(userId);

    // Enviar OTP por email
    await sendOtpEmail(email, otp);

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
    const verification = await verifyOtp(userId, otpCode);

    if (!verification.isValid) {
      return verification;
    }

    // Marcar email como verificado
    await markEmailAsVerified(userId);

    // Limpar OTP
    await clearOtp(userId);

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
    const otp = await generateAndSaveOtp(userId);

    // Enviar OTP por email
    await sendOtpEmail(email, otp);

    logger.info({ userId, email }, "EmailVerificationService: Verification code resent successfully");
  } catch (error) {
    logger.error({ error: error.message, userId, email }, "EmailVerificationService: Error resending verification code");
    throw error;
  }
}

module.exports = {
  sendVerificationCode,
  verifyEmailWithOtp,
  resendVerificationCode
};
