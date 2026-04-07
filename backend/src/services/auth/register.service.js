// Register Service - Cadastro de usuário
import bcrypt from "bcryptjs";
import authRepository from "../../repositories/user.repository.js";
import emailVerificationService from "./email-verification.service.js";
import logger from "../../utils/logger.js";
import AppError from "../../utils/AppError.js";

const HASH_ROUNDS = 10;

/**
 * Registrar novo usuário e enviar código de verificação
 * Dados já vêm validados do middleware
 * @param {string} name - Nome do usuário (validado)
 * @param {string} email - Email do usuário (validado)
 * @param {string} cpf - CPF do usuário (validado)
 * @param {string} phone - Telefone do usuário (validado)
 * @param {string} password - Senha do usuário (validada)
 * @returns {Promise<{userId: number, message: string}>}
 */
async function registerUser(name, email, cpf, phone, password) {
  try {
    logger.info({ email, cpf }, "RegisterService: Starting user registration");

    // Dados já chegam validados do middleware
    // Verificar duplicatas
    if (await authRepository.emailExists(email)) {
      logger.warn({ email }, "RegisterService: Email already registered");
      throw new AppError("Email already registered", 409);
    }

    if (await authRepository.cpfExists(cpf)) {
      logger.warn({ cpf }, "RegisterService: CPF already registered");
      throw new AppError("CPF already registered", 409);
    }

    if (await authRepository.phoneExists(phone)) {
      logger.warn({ phone }, "RegisterService: Phone already registered");
      throw new AppError("Phone already registered", 409);
    }

    // Hash de senha e criar usuário
    const passwordHash = await bcrypt.hash(password, HASH_ROUNDS);
    const newUser = await authRepository.create({
      name,
      email,
      cpf,
      phone,
      passwordHash
    });

    logger.info({ userId: newUser.id, email }, "RegisterService: User created");

    // Enviar código de verificação
    try {
      await emailVerificationService.sendVerificationCode(newUser.id, email);
      logger.info({ userId: newUser.id }, "RegisterService: Verification code sent");
    } catch (emailError) {
      logger.error({ error: emailError.message, userId: newUser.id }, "RegisterService: Error sending verification code");
      // Não falhar o registro se o email falhar, apenas log
    }

    return {
      userId: newUser.id,
      message: "User registered successfully! Check your email to verify."
    };

  } catch (error) {
    logger.error({ error: error.message, email }, "RegisterService: Error during registration");
    throw error;
  }
}

class RegisterService {
  async registerUser(name, email, cpf, phone, password) {
    return registerUser(name, email, cpf, phone, password);
  }
}

export default new RegisterService();
