const pool = require("../config/db");

class AuthRepository {
  /**
   * Busca usuário por email
   */
  async findByEmail(email) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por email: ${error.message}`);
    }
  }

  /**
   * Busca usuário por ID
   */
  async findById(id) {
    try {
      const [rows] = await pool.query(
        "SELECT id, nome, email, cpf, telefone, criado_em FROM usuarios WHERE id = ?",
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  /**
   * Cria novo usuário
   */
  async create(userData) {
    try {
      const { nome, email, cpf, telefone, senhaHash } = userData;
      const [result] = await pool.query(
        "INSERT INTO usuarios (nome, email, cpf, telefone, senha_hash) VALUES (?, ?, ?, ?, ?)",
        [nome, email, cpf, telefone, senhaHash]
      );
      return {
        id: result.insertId,
        nome,
        email,
        cpf,
        telefone
      };
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Verifica se email já existe
   */
  async emailExists(email) {
    try {
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE email = ?",
        [email]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar email: ${error.message}`);
    }
  }

  /**
   * Verifica se CPF já existe
   */
  async cpfExists(cpf) {
    try {
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE cpf = ?",
        [cpf]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar CPF: ${error.message}`);
    }
  }

  /**
   * Verifica se telefone já existe
   */
  async phoneExists(telefone) {
    try {
      const [rows] = await pool.query(
        "SELECT id FROM usuarios WHERE telefone = ?",
        [telefone]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar telefone: ${error.message}`);
    }
  }

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(userId, senhaHash) {
    try {
      const [result] = await pool.query(
        "UPDATE usuarios SET senha_hash = ? WHERE id = ?",
        [senhaHash, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar senha: ${error.message}`);
    }
  }
}

module.exports = new AuthRepository();
