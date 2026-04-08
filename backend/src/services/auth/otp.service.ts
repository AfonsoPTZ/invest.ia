// OTP Service - Gerencia código OTP
import bcrypt from "bcryptjs";
import authRepository from "../../repositories/user.repository.js";
import { generateOtp } from "../../utils/generate-otp.js";
import logger from "../../utils/logger.js";

const OTP_EXPIRATION_MINUTES: number = 5;
const OTP_MAX_ATTEMPTS: number = 3;
const OTP_LOCKOUT_MINUTES: number = 15;
const HASH_ROUNDS: number = 10;

/**
 * Interface para resultado de verificação de OTP
 */
interface IOtpVerificationResult {
  isValid: boolean;
  message: string;
}

/**
 * Gerar e salvar novo OTP
 */
async function generateAndSaveOtp(userId: number): Promise<string> {
  try {
    logger.info({ userId }, "OtpService: Generating new OTP");

    const otp: string = generateOtp(6);
    const otpHash: string = await bcrypt.hash(otp, HASH_ROUNDS);
    const expiresAt: Date = new Date(Date.now() + OTP_EXPIRATION_MINUTES * 60000);

    await authRepository.updateOtp(userId, {
      otpCodeHash: otpHash,
      otpExpiresAt: expiresAt,
      otpAttempts: 0
    });

    logger.info({ userId }, "OtpService: OTP generated and saved");
    return otp; // Retornar OTP em plaintext para enviar por email
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "OtpService: Error generating OTP");
    throw new Error(`Erro ao gerar OTP: ${errorMessage}`);
  }
}

/**
 * Verificar if OTP é válido
 */
async function verifyOtp(userId: number, otpCode: string): Promise<IOtpVerificationResult> {
  try {
    logger.debug({ userId }, "OtpService: Verifying OTP");

    const user: any = await authRepository.findById(userId);
    if (!user) {
      logger.warn({ userId }, "OtpService: User not found");
      return { isValid: false, message: "Usuário não encontrado" };
    }

    // Verificar se usuário está bloqueado
    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      const timePassed: number = Date.now() - new Date(user.otpExpiresAt).getTime();
      const lockoutTime: number = OTP_LOCKOUT_MINUTES * 60000;

      if (timePassed < lockoutTime) {
        logger.warn({ userId }, "OtpService: User locked out due to max attempts");
        const minutesRemaining: number = Math.ceil((lockoutTime - timePassed) / 60000);
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
    const isOtpValid: boolean = await bcrypt.compare(otpCode, user.otpCodeHash);

    if (!isOtpValid) {
      logger.warn({ userId, attempts: user.otpAttempts + 1 }, "OtpService: Invalid OTP code");

      // Incrementar tentativas
      await authRepository.incrementOtpAttempts(userId);

      const attemptsRemaining: number = OTP_MAX_ATTEMPTS - (user.otpAttempts + 1);
      return {
        isValid: false,
        message: `Código inválido. ${attemptsRemaining} tentativa(s) restante(s)`
      };
    }

    logger.info({ userId }, "OtpService: OTP verified successfully");
    return { isValid: true, message: "Código verificado com sucesso" };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "OtpService: Error verifying OTP");
    throw new Error(`Erro ao verificar OTP: ${errorMessage}`);
  }
}

/**
 * Limpar OTP após verificação bem-sucedida
 */
async function clearOtp(userId: number): Promise<void> {
  try {
    logger.debug({ userId }, "OtpService: Clearing OTP");

    await authRepository.updateOtp(userId, {
      otpCodeHash: null,
      otpExpiresAt: null,
      otpAttempts: 0
    });

    logger.info({ userId }, "OtpService: OTP cleared");
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "OtpService: Error clearing OTP");
    throw new Error(`Erro ao limpar OTP: ${errorMessage}`);
  }
}

/**
 * Marcar email como verificado
 */
async function markEmailAsVerified(userId: number): Promise<void> {
  try {
    logger.info({ userId }, "OtpService: Marking email as verified");

    await authRepository.updateEmailVerification(userId, true);

    logger.info({ userId }, "OtpService: Email marked as verified");
  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, userId }, "OtpService: Error marking email as verified");
    throw new Error(`Erro ao marcar email como verificado: ${errorMessage}`);
  }
}

class OtpService {
  async generateAndSaveOtp(userId: number): Promise<string> {
    return generateAndSaveOtp(userId);
  }

  async verifyOtp(userId: number, otpCode: string): Promise<IOtpVerificationResult> {
    return verifyOtp(userId, otpCode);
  }

  async clearOtp(userId: number): Promise<void> {
    return clearOtp(userId);
  }

  async markEmailAsVerified(userId: number): Promise<void> {
    return markEmailAsVerified(userId);
  }
}

export default new OtpService();
export type { IOtpVerificationResult };
