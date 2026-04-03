const prisma = require("../config/db");
const logger = require("../utils/logger");

class UserRepository {
  async findByEmail(email) {
    try {
      logger.debug({ email }, "Searching user by email");
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      logger.error({ error: error.message, email }, "Error searching user by email");
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      logger.debug({ id }, "Searching user by ID");
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      logger.error({ error: error.message, id }, "Error searching user by ID");
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const { name, email, cpf, phone, passwordHash } = userData;
      logger.info({ email, cpf }, "Creating new user");
      
      const user = await prisma.user.create({
        data: { name, email, cpf, phone, passwordHash }
      });
      
      logger.info({ userId: user.id, email }, "User created successfully");
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        phone: user.phone
      };
    } catch (error) {
      logger.error({ error: error.message, email: userData.email }, "Error creating user");
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  async emailExists(email) {
    try {
      logger.debug({ email }, "Checking if email exists");
      const user = await prisma.user.findUnique({ where: { email } });
      return user !== null;
    } catch (error) {
      logger.error({ error: error.message, email }, "Error checking email existence");
      throw new Error(`Erro ao verificar email: ${error.message}`);
    }
  }

  async cpfExists(cpf) {
    try {
      logger.debug({ cpf }, "Checking if CPF exists");
      const user = await prisma.user.findUnique({ where: { cpf } });
      return user !== null;
    } catch (error) {
      logger.error({ error: error.message, cpf }, "Error checking CPF existence");
      throw new Error(`Erro ao verificar CPF: ${error.message}`);
    }
  }

  async phoneExists(phone) {
    try {
      logger.debug({ phone }, "Checking if phone exists");
      const user = await prisma.user.findUnique({ where: { phone } });
      return user !== null;
    } catch (error) {
      logger.error({ error: error.message, phone }, "Error checking phone existence");
      throw new Error(`Error checking phone existence: ${error.message}`);
    }
  }

  async updatePassword(userId, passwordHash) {
    try {
      logger.info({ userId }, "Updating user password");
      
      const result = await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      });
      
      logger.info({ userId }, "User password updated");
      return result !== null;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating user password");
      throw new Error(`Erro ao atualizar senha: ${error.message}`);
    }
  }

  async updateOtp(userId, otpData) {
    try {
      const { otpCodeHash, otpExpiresAt, otpAttempts } = otpData;
      logger.debug({ userId }, "Updating OTP");

      const result = await prisma.user.update({
        where: { id: userId },
        data: {
          otpCodeHash,
          otpExpiresAt,
          otpAttempts: otpAttempts || 0
        }
      });

      logger.debug({ userId }, "OTP updated");
      return result !== null;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating OTP");
      throw new Error(`Erro ao atualizar OTP: ${error.message}`);
    }
  }

  async incrementOtpAttempts(userId) {
    try {
      logger.debug({ userId }, "Incrementing OTP attempts");

      const result = await prisma.user.update({
        where: { id: userId },
        data: { otpAttempts: { increment: 1 } }
      });

      logger.debug({ userId }, "OTP attempts incremented");
      return result !== null;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error incrementing OTP attempts");
      throw new Error(`Erro ao incrementar tentativas: ${error.message}`);
    }
  }

  async updateEmailVerification(userId, verified) {
    try {
      logger.info({ userId, verified }, "Updating email verification status");

      const result = await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: verified }
      });

      logger.info({ userId, verified }, "Email verification status updated");
      return result !== null;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating email verification");
      throw new Error(`Erro ao atualizar verificação: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();
