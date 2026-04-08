// Login Service - Autenticação de usuário
import bcrypt from "bcryptjs";
import tokenService from "./token.service.js";
import authRepository from "../../repositories/user.repository.js";
import logger from "../../utils/logger.js";
import AppError from "../../utils/AppError.js";

/**
 * Interface para retorno de login
 */
interface ILoginResult {
  id: number;
  name: string;
  email: string;
  token: string;
}

/**
 * Autenticar usuário com email e senha
 */
async function loginUser(email: string, password: string): Promise<ILoginResult> {
  try {
    logger.info({ email }, "LoginService: Authenticating user");

    // Verificar se usuário existe
    const user: any = await authRepository.findByEmail(email);
    if (!user) {
      logger.warn({ email }, "LoginService: User not found");
      throw new AppError("Email ou senha incorretos", 401);
    }

    // Verificar senha
    const passwordMatch: boolean = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      logger.warn({ email }, "LoginService: Incorrect password");
      throw new AppError("Email ou senha incorretos", 401);
    }

    // Verificar se email foi verificado
    if (!user.emailVerified) {
      logger.warn({ email }, "LoginService: Email not verified");
      throw new AppError("Please verify your email before logging in", 403);
    }

    logger.info({ userId: user.id }, "LoginService: User authenticated, generating token");

    // Gerar JWT token usando token.service
    const token: string = tokenService.generateToken(user.id, user.email);

    logger.info({ userId: user.id, email }, "LoginService: User authenticated successfully");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token
    };

  } catch (error) {
    const errorMessage: string = error instanceof Error ? error.message : String(error);
    logger.error({ email, error: errorMessage }, "LoginService: Authentication failed");
    throw error;
  }
}

class LoginService {
  async loginUser(email: string, password: string): Promise<ILoginResult> {
    return loginUser(email, password);
  }
}

export default new LoginService();
export type { ILoginResult };
