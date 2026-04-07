// Login Service - Autenticação de usuário
import bcrypt from "bcryptjs";
import tokenService from "./token.service.js";
import authRepository from "../../repositories/user.repository.js";
import logger from "../../utils/logger.js";
import AppError from "../../utils/AppError.js";

// Validação de tokenService não é mais necessária (é instância de classe)

/**
 * Autenticar usuário com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Promise<{id: number, name: string, email: string, token: string}>}
 */
async function loginUser(email, password) {
  try {
    logger.info({ email }, "LoginService: Authenticating user");

    // Verificar se usuário existe
    const user = await authRepository.findByEmail(email);
    if (!user) {
      logger.warn({ email }, "LoginService: User not found");
      throw new AppError("Email ou senha incorretos", 401);
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      logger.warn({ email }, "LoginService: Incorrect password");
      throw new AppError("Email ou senha incorretos", 401);
    }

    // Verificar se email foi verificado
    if (!user.emailVerified) {
      logger.warn({ email }, "LoginService: Email not verified");
      throw new AppError("Please verify your email before logging in", 403);
    }

    logger.info({ userId: user.id, userEmail: user.email, userObj: user }, "LoginService: User object before token generation");

    // Gerar JWT token usando token.service (mesmo secret em todo o app)
    const token = tokenService.generateToken(user.id, user.email);

    logger.info({ userId: user.id, email }, "LoginService: User authenticated successfully");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token
    };

  } catch (error) {
    logger.error({ email, error: error.message }, "LoginService: Authentication failed");
    throw error;
  }
}

class LoginService {
  async loginUser(email, password) {
    return loginUser(email, password);
  }
}

export default new LoginService();
