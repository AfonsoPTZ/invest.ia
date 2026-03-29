// Login Service - Autenticação de usuário
const bcrypt = require("bcryptjs");
const tokenService = require("./token.service");
const authRepository = require("../../repositories/user.repository");
const logger = require("../../utils/logger");

// Validar que tokenService tem a função generateToken
if (!tokenService || !tokenService.generateToken) {
  throw new Error("TokenService não carregou corretamente - generateToken não existe");
}

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
      throw new Error("Email ou senha incorretos");
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      logger.warn({ email }, "LoginService: Incorrect password");
      throw new Error("Email ou senha incorretos");
    }

    // Verificar se email foi verificado
    if (!user.emailVerified) {
      logger.warn({ email }, "LoginService: Email not verified");
      throw new Error("Please verify your email before logging in");
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

module.exports = {
  loginUser
};
