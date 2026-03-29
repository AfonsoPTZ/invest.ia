const pool = require("../config/db");
const logger = require("../utils/logger");

class DashboardRepository {
  /**
   * Busca usuário por ID (para dashboard)
   */
  async getUserById(userId) {
    try {
      logger.debug({ userId }, "Repository: Searching user by ID for dashboard");

      const [rows] = await pool.query(
        "SELECT id, nome as name, email, cpf, telefone as phone FROM usuarios WHERE id = ?",
        [userId]
      );

      if (!rows[0]) {
        logger.debug({ userId }, "Repository: User not found");
        return null;
      }

      logger.debug({ userId }, "Repository: User found");
      return rows[0];
    } catch (error) {
      logger.error({ error: error.message, userId }, "Repository: Error searching user");
      throw new Error(`Erro ao buscar usuário: ${error.message}`);
    }
  }

  /**
   * Busca perfil financeiro por usuário ID (para dashboard)
   */
  async getFinancialProfileByUserId(userId) {
    try {
      logger.debug({ userId }, "Repository: Searching financial profile for dashboard");

      const [rows] = await pool.query(
        "SELECT * FROM perfil_financeiro WHERE usuario_id = ?",
        [userId]
      );

      if (!rows[0]) {
        logger.debug({ userId }, "Repository: Financial profile not found");
        return null;
      }

      logger.debug({ userId }, "Repository: Financial profile found");
      return rows[0];
    } catch (error) {
      logger.error({ error: error.message, userId }, "Repository: Error searching financial profile");
      throw new Error(`Erro ao buscar perfil financeiro: ${error.message}`);
    }
  }

  /**
   * Busca dados completos da dashboard (usuário + investimentos)
   */
  async getDashboardData(userId) {
    try {
      logger.debug({ userId }, "Repository: Fetching complete dashboard data");

      // Query usuário
      const [userRows] = await pool.query(
        "SELECT id, nome as name, email, cpf, telefone as phone FROM usuarios WHERE id = ?",
        [userId]
      );

      if (!userRows[0]) {
        logger.debug({ userId }, "Repository: User not found");
        return null;
      }

      // Query perfil financeiro
      const [profileRows] = await pool.query(
        "SELECT * FROM perfil_financeiro WHERE usuario_id = ?",
        [userId]
      );

      logger.debug({ userId }, "Repository: Dashboard data fetched");

      return {
        user: userRows[0],
        financialProfile: profileRows[0] || null
      };
    } catch (error) {
      logger.error({ error: error.message, userId }, "Repository: Error fetching dashboard data");
      throw new Error(`Erro ao buscar dados da dashboard: ${error.message}`);
    }
  }
}

module.exports = new DashboardRepository();
