const pool = require("../config/db");
const logger = require("../utils/logger");

class PerfilFinanceiroRepository {
  /**
   * Cria perfil financeiro do usuário
   */
  async create(usuarioId, perfilData) {
    try {
      logger.info({ usuarioId }, "Creating financial profile");
      
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

      logger.info({ usuarioId, profileId: result.insertId }, "Financial profile created successfully");

      return {
        id: result.insertId,
        usuario_id: usuarioId,
        ...perfilData
      };
    } catch (error) {
      logger.error({ error: error.message, usuarioId }, "Error creating financial profile");
      throw new Error(`Erro ao criar perfil financeiro: ${error.message}`);
    }
  }

  /**
   * Busca perfil financeiro por usuário
   */
  async findByUsuarioId(usuarioId) {
    try {
      logger.debug({ usuarioId }, "Searching financial profile by user ID");
      
      const [rows] = await pool.query(
        "SELECT * FROM perfil_financeiro WHERE usuario_id = ?",
        [usuarioId]
      );
      
      if (!rows[0]) {
        logger.debug({ usuarioId }, "Financial profile not found");
        return null;
      }
      
      logger.debug({ usuarioId }, "Financial profile found");
      return rows[0];
    } catch (error) {
      logger.error({ error: error.message, usuarioId }, "Error searching financial profile");
      throw new Error(`Erro ao buscar perfil financeiro: ${error.message}`);
    }
  }

  /**
   * Atualiza perfil financeiro
   */
  async update(usuarioId, perfilData) {
    try {
      logger.info({ usuarioId }, "Updating financial profile");
      
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

      logger.info({ usuarioId, updated: result.affectedRows > 0 }, "Financial profile updated");

      return result.affectedRows > 0;
    } catch (error) {
      logger.error({ error: error.message, usuarioId }, "Error updating financial profile");
      throw new Error(`Erro ao atualizar perfil financeiro: ${error.message}`);
    }
  }
}

module.exports = new PerfilFinanceiroRepository();
