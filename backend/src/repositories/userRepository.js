const pool = require("../config/db");
const logger = require("../utils/logger");

class AuthRepository {
  /**
   * Busca usuário por email
   */
  async findByEmail(email) {
    try {
      logger.debug({ email }, "Searching user by email");
      
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      
      if (!rows[0]) {
        logger.debug({ email }, "User not found by email");
        return null;
      }
      
      logger.debug({ email }, "User found by email");
      return this._mapColumns(rows[0]);
    } catch (error) {
      logger.error({ error: error.message, email }, "Error searching user by email");
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  /**
   * Busca usuário por ID
   */
  async findById(id) {
    try {
      logger.debug({ id }, "Searching user by ID");
      
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [id]
      );
      
      if (!rows[0]) {
        logger.debug({ id }, "User not found by ID");
        return null;
      }
      
      logger.debug({ id }, "User found by ID");
      return this._mapColumns(rows[0]);
    } catch (error) {
      logger.error({ error: error.message, id }, "Error searching user by ID");
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  /**
   * Cria novo usuário
   */
  async create(userData) {
    try {
      const { name, email, cpf, phone, passwordHash } = userData;
      
      logger.info({ email, cpf }, "Creating new user");
      
      const [result] = await pool.query(
        "INSERT INTO usuarios (nome, email, cpf, telefone, senha_hash) VALUES (?, ?, ?, ?, ?)",
        [name, email, cpf, phone, passwordHash]
      );
      
      logger.info({ userId: result.insertId, email }, "User created successfully");
      
      return {
        id: result.insertId,
        name,
        email,
        cpf,
        phone
      };
    } catch (error) {
      logger.error({ error: error.message, email: userData.email }, "Error creating user");
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Verifica se email já existe
   */
  async emailExists(email) {
    try {
      logger.debug({ email }, "Checking if email exists");
      
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
      );
      
      const exists = rows.length > 0;
      logger.debug({ email, exists }, "Email existence check completed");
      
      return exists;
    } catch (error) {
      logger.error({ error: error.message, email }, "Error checking email existence");
      throw new Error(`Erro ao verificar email: ${error.message}`);
    }
  }

  /**
   * Verifica se CPF já existe
   */
  async cpfExists(cpf) {
    try {
      logger.debug({ cpf }, "Checking if CPF exists");
      
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE cpf = ?",
        [cpf]
      );
      
      const exists = rows.length > 0;
      logger.debug({ cpf, exists }, "CPF existence check completed");
      
      return exists;
    } catch (error) {
      logger.error({ error: error.message, cpf }, "Error checking CPF existence");
      throw new Error(`Erro ao verificar CPF: ${error.message}`);
    }
  }

  /**
   * Verifica se telefone já existe
   */
  async phoneExists(telefone) {
    try {
      logger.debug({ telefone }, "Checking if phone exists");
      
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE telefone = ?",
        [telefone]
      );
      
      const exists = rows.length > 0;
      logger.debug({ telefone, exists }, "Phone existence check completed");
      
      return exists;
    } catch (error) {
      logger.error({ error: error.message, telefone }, "Error checking phone existence");
      throw new Error(`Erro ao verificar telefone: ${error.message}`);
    }
  }

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(userId, senhaHash) {
    try {
      logger.info({ userId }, "Updating user password");
      
      const [result] = await pool.query(
        "UPDATE usuarios SET senha_hash = ? WHERE id = ?",
        [senhaHash, userId]
      );
      
      logger.info({ userId, updated: result.affectedRows > 0 }, "User password updated");
      
      return result.affectedRows > 0;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating user password");
      throw new Error(`Erro ao atualizar senha: ${error.message}`);
    }
  }

  /**
   * Atualizar OTP do usuário
   */
  async updateOtp(userId, otpData) {
    try {
      const { otpCodeHash, otpExpiresAt, otpAttempts } = otpData;

      logger.debug({ userId }, "Updating OTP");

      const [result] = await pool.query(
        "UPDATE usuarios SET otp_codigo_hash = ?, otp_expira_em = ?, otp_tentativas = ? WHERE id = ?",
        [otpCodeHash, otpExpiresAt, otpAttempts || 0, userId]
      );

      logger.debug({ userId, updated: result.affectedRows > 0 }, "OTP updated");

      return result.affectedRows > 0;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating OTP");
      throw new Error(`Erro ao atualizar OTP: ${error.message}`);
    }
  }

  /**
   * Incrementar tentativas de OTP
   */
  async incrementOtpAttempts(userId) {
    try {
      logger.debug({ userId }, "Incrementing OTP attempts");

      const [result] = await pool.query(
        "UPDATE usuarios SET otp_tentativas = otp_tentativas + 1 WHERE id = ?",
        [userId]
      );

      logger.debug({ userId, incremented: result.affectedRows > 0 }, "OTP attempts incremented");

      return result.affectedRows > 0;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error incrementing OTP attempts");
      throw new Error(`Erro ao incrementar tentativas: ${error.message}`);
    }
  }

  /**
   * Marcar email como verificado
   */
  async updateEmailVerification(userId, verified) {
    try {
      logger.info({ userId, verified }, "Updating email verification status");

      const [result] = await pool.query(
        "UPDATE usuarios SET email_verificado = ? WHERE id = ?",
        [verified ? 1 : 0, userId]
      );

      logger.info({ userId, verified, updated: result.affectedRows > 0 }, "Email verification status updated");

      return result.affectedRows > 0;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating email verification");
      throw new Error(`Erro ao atualizar verificação: ${error.message}`);
    }
  }

  /**
   * Mapeia colunas do banco (snake_case) para o padrão JS (camelCase)
   */
  _mapColumns(row) {
    if (!row) return null;
    return {
      id: row.id,
      name: row.nome,
      email: row.email,
      cpf: row.cpf,
      phone: row.telefone,
      passwordHash: row.senha_hash,
      emailVerificado: row.email_verificado,
      otp_codigo_hash: row.otp_codigo_hash,
      otp_expira_em: row.otp_expira_em,
      otp_tentativas: row.otp_tentativas,
      createdAt: row.criado_em,
      updatedAt: row.atualizado_em
    };
  }
}

module.exports = new AuthRepository();
