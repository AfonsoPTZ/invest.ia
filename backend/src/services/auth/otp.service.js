// OTP Service - Gerencia código OTP
import bcrypt from "bcryptjs";
import authRepository from "../../repositories/user.repository.js";
import { generateOtp } from "../../utils/generate-otp.js";
import logger from "../../utils/logger.js";

const OTP_EXPIRATION_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 3;
const OTP_LOCKOUT_MINUTES = 15;
const HASH_ROUNDS = 10;

/**
 * Gerar e salvar novo OTP
 * @param {number} userId - ID do usuário
 * @returns {Promise<string>} Código OTP gerado
 */
async function generateAndSaveOtp(userId) {
  try {
    logger.info({ userId }, "OtpService: Generating new OTP");

    const otp = generateOtp(6);
    const otpHash = await bcrypt.hash(otp, HASH_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60000);

    await authRepository.updateOtp(userId, {
      otpCodeHash: otpHash,
      otpExpiresAt: expiresAt,
      otpAttempts: 0
    });

    logger.info({ userId }, "OtpService: OTP generated and saved");
    return otp; // Retornar OTP em plaintext para enviar por email
  } catch (error) {
    logger.error({ error: error.message, userId }, "OtpService: Error generating OTP");
    throw new Error(`Erro ao gerar OTP: ${error.message}`);
  }
}

/**
 * Verificar if OTP é válido
 * @param {number} userId - ID do usuário
 * @param {string} otpCode - Código OTP fornecido pelo usuário
 * @returns {Promise<{isValid: boolean, message: string}>}
 */
async function verifyOtp(userId, otpCode) {
  try {
    logger.debug({ userId }, "OtpService: Verifying OTP");

    const user = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "OtpService: User not found");
      return { isValid: false, message: "Usuário não encontrado" };
    }

    // Verificar se usuário está bloqueado
    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      const timePassed = Date.now() - new Date(user.otpExpiresAt).getTime();
      const lockoutTime = OTP_LOCKOUT_MINUTES * 60000;

      if (timePassed < lockoutTime) {
        logger.warn({ userId }, "OtpService: User locked out due to max attempts");
        const minutesRemaining = Math.ceil((lockoutTime - timePassed) / 60000);
        return {
          isValid: false,
          message: `Muitas tentativas. Tente novamente em ${minutesRemaining} minuto(s)`
        };
      }
    }

    // Verificar expiração
    if (new Date() > new Date(user.otpExpiresAt)) {
      logger.warn({ userId }, "OtpService: OTP expired");
      return { isValid: false, message: "Código OTP expirou" };
    }

    // Verificar código
    const isOtpValid = await bcrypt.compare(otpCode, user.otpCodeHash);

    if (!isOtpValid) {
      logger.warn({ userId, attempts: user.otpAttempts + 1 }, "OtpService: Invalid OTP code");

      // Incrementar tentativas
      await authRepository.incrementOtpAttempts(userId);

      const attemptsRemaining = OTP_MAX_ATTEMPTS - (user.otpAttempts + 1);
      return {
        isValid: false,
        message: `Código inválido. ${attemptsRemaining} tentativa(s) restante(s)`
      };
    }

    logger.info({ userId }, "OtpService: OTP verified successfully");
    return { isValid: true, message: "Código verificado com sucesso" };

  } catch (error) {
    logger.error({ error: error.message, userId }, "OtpService: Error verifying OTP");
    throw new Error(`Erro ao verificar OTP: ${error.message}`);
  }
}

/**
 * Limpar OTP após verificação bem-sucedida
 * @param {number} userId - ID do usuário
 * @returns {Promise<void>}
 */
async function clearOtp(userId) {
  try {
    logger.debug({ userId }, "OtpService: Clearing OTP");

    await authRepository.updateOtp(userId, {
      otpCodeHash: null,
      otpExpiresAt: null,
      otpAttempts: 0
    });

    logger.info({ userId }, "OtpService: OTP cleared");
  } catch (error) {
    logger.error({ error: error.message, userId }, "OtpService: Error clearing OTP");
    throw new Error(`Erro ao limpar OTP: ${error.message}`);
  }
}

/**
 * Marcar email como verificado
 * @param {number} userId - ID do usuário
 * @returns {Promise<void>}
 */
async function markEmailAsVerified(userId) {
  try {
    logger.info({ userId }, "OtpService: Marking email as verified");

    await authRepository.updateEmailVerification(userId, true);

    logger.info({ userId }, "OtpService: Email marked as verified");
  } catch (error) {
    logger.error({ error: error.message, userId }, "OtpService: Error marking email as verified");
    throw new Error(`Erro ao marcar email como verificado: ${error.message}`);
  }
}

class OtpService {
  async generateAndSaveOtp(userId) {
    return generateAndSaveOtp(userId);
  }

  async verifyOtp(userId, otpCode) {
    return verifyOtp(userId, otpCode);
  }

  async clearOtp(userId) {
    return clearOtp(userId);
  }

  async markEmailAsVerified(userId) {
    return markEmailAsVerified(userId);
  }
}

export default new OtpService();
