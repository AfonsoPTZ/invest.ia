const pool = require("../config/db");

class PerfilFinanceiroRepository {
  /**
   * Cria perfil financeiro do usuário
   */
  async create(usuarioId, perfilData) {
    try {
      const {
        renda_mensal,
        saldo_inicial,
        possui_investimentos,
        possui_patrimonio,
        objetivo_financeiro,
        perfil_comportamento
      } = perfilData;

      const [result] = await pool.query(
        `INSERT INTO perfil_financeiro 
        (usuario_id, renda_mensal, saldo_inicial, possui_investimentos, 
         possui_patrimonio, objetivo_financeiro, perfil_comportamento) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          usuarioId,
          renda_mensal,
          saldo_inicial,
          possui_investimentos,
          possui_patrimonio,
          objetivo_financeiro,
          perfil_comportamento
        ]
      );

      return {
        id: result.insertId,
        usuario_id: usuarioId,
        ...perfilData
      };
    } catch (error) {
      throw new Error(`Erro ao criar perfil financeiro: ${error.message}`);
    }
  }

  /**
   * Busca perfil financeiro por usuário
   */
  async findByUsuarioId(usuarioId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM perfil_financeiro WHERE usuario_id = ?",
        [usuarioId]
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Erro ao buscar perfil financeiro: ${error.message}`);
    }
  }

  /**
   * Atualiza perfil financeiro
   */
  async update(usuarioId, perfilData) {
    try {
      const {
        renda_mensal,
        saldo_inicial,
        possui_investimentos,
        possui_patrimonio,
        objetivo_financeiro,
        perfil_comportamento
      } = perfilData;

      const [result] = await pool.query(
        `UPDATE perfil_financeiro 
        SET renda_mensal = ?, saldo_inicial = ?, possui_investimentos = ?,
            possui_patrimonio = ?, objetivo_financeiro = ?, perfil_comportamento = ?
        WHERE usuario_id = ?`,
        [
          renda_mensal,
          saldo_inicial,
          possui_investimentos,
          possui_patrimonio,
          objetivo_financeiro,
          perfil_comportamento,
          usuarioId
        ]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Erro ao atualizar perfil financeiro: ${error.message}`);
    }
  }
}

module.exports = new PerfilFinanceiroRepository();
