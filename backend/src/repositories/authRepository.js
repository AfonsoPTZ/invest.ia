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
      if (!rows[0]) return null;
      return this._mapColumns(rows[0]);
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
      if (!rows[0]) return null;
      return this._mapColumns(rows[0]);
    } catch (error) {
      throw new Error(`Erro ao buscar usuário por ID: ${error.message}`);
    }
  }

  /**
   * Cria novo usuário
   */
  async create(userData) {
    try {
      const { name, email, cpf, phone, passwordHash } = userData;
      const [result] = await pool.query(
        "INSERT INTO usuarios (nome, email, cpf, telefone, senha_hash) VALUES (?, ?, ?, ?, ?)",
        [name, email, cpf, phone, passwordHash]
      );
      return {
        id: result.insertId,
        name,
        email,
        cpf,
        phone
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
      createdAt: row.criado_em,
      updatedAt: row.atualizado_em
    };
  }
}

module.exports = new AuthRepository();
