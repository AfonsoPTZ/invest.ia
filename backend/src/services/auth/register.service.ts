// Register Service - Cadastro de usuário
import bcrypt from "bcryptjs";
import authRepository from "../../repositories/user.repository.js";
import emailVerificationService from "./email-verification.service.js";
import logger from "../../utils/logger.js";
import AppError from "../../utils/AppError.js";

const HASH_ROUNDS: number = 10;

/**
 * Interface para retorno de registro
 */
interface IRegisterResult {
  userId: number;
  message: string;
}

/**
 * Registrar novo usuário e enviar código de verificação
 * Dados já vêm validados do middleware
 */
async function registerUser(
  name: string,
  email: string,
  cpf: string,
  phone: string,
  password: string
): Promise<IRegisterResult> {
  try {
    logger.info({ email, cpf }, "RegisterService: Starting user registration");

    // Dados já chegam validados do middleware
    // Verificar duplicatas
    const emailExists: boolean = await authRepository.emailExists(email);
    if (emailExists) {
      logger.warn({ email }, "RegisterService: Email already registered");
      throw new AppError("Email already registered", 409);
    }

    const cpfExists: boolean = await authRepository.cpfExists(cpf);
    if (cpfExists) {
      logger.warn({ cpf }, "RegisterService: CPF already registered");
      throw new AppError("CPF already registered", 409);
    }

    const phoneExists: boolean = await authRepository.phoneExists(phone);
    if (phoneExists) {
      logger.warn({ phone }, "RegisterService: Phone already registered");
      throw new AppError("Phone already registered", 409);
    }

    // Hash de senha e criar usuário
    const passwordHash: string = await bcrypt.hash(password, HASH_ROUNDS);
    const newUser: any = await authRepository.create({
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
      const errorMessage: string = emailError instanceof Error ? emailError.message : String(emailError);
      logger.error({ error: errorMessage, userId: newUser.id }, "RegisterService: Error sending verification code");
      // Não falhar o registro se o email falhar, apenas log
    }

    return {
      userId: newUser.id,
      message: "User registered successfully! Check your email to verify."
    };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ error: errorMessage, email }, "RegisterService: Error during registration");
    throw error;
  }
}

class RegisterService {
  async registerUser(
    name: string,
    email: string,
    cpf: string,
    phone: string,
    password: string
  ): Promise<IRegisterResult> {
    return registerUser(name, email, cpf, phone, password);
  }
}

export default new RegisterService();
export type { IRegisterResult };
