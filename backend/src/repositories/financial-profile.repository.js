const pool = require("../config/db");
const logger = require("../utils/logger");

class FinancialProfileRepository {
  /**
   * Cria perfil financeiro do usuário
   */
  async create(userId, profileData) {
    try {
      logger.info({ userId }, "Creating financial profile");
      
      const {
        monthly_income,
        initial_balance,
        has_investments,
        has_assets,
        financial_goal,
        behavior_profile
      } = profileData;

      const [result] = await pool.query(
        `INSERT INTO financial_profiles 
        (user_id, monthly_income, initial_balance, has_investments, 
         has_assets, financial_goal, behavior_profile) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          monthly_income,
          initial_balance,
          has_investments,
          has_assets,
          financial_goal,
          behavior_profile
        ]
      );

      logger.info({ userId, profileId: result.insertId }, "Financial profile created successfully");

      return {
        id: result.insertId,
        user_id: userId,
        ...profileData
      };
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error creating financial profile");
      throw new Error(`Error creating financial profile: ${error.message}`);
    }
  }

  /**
   * Busca perfil financeiro por usuário
   */
  async findByUserId(userId) {
    try {
      logger.debug({ userId }, "Searching financial profile by user ID");
      
      const [rows] = await pool.query(
        "SELECT * FROM financial_profiles WHERE user_id = ?",
        [userId]
      );
      
      if (!rows[0]) {
        logger.debug({ userId }, "Financial profile not found");
        return null;
      }
      
      logger.debug({ userId }, "Financial profile found");
      return rows[0];
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error searching financial profile");
      throw new Error(`Error searching financial profile: ${error.message}`);
    }
  }

  /**
   * Cria ou atualiza perfil financeiro (CREATE or UPDATE)
   * Verifica se existe, se sim UPDATE, se não CREATE
   */
  async createOrUpdate(userId, profileData) {
    try {
      logger.debug({ userId }, "Repository: Checking if profile exists");
      
      // Verificar se já existe
      const existing = await this.findByUserId(userId);
      
      if (existing) {
        logger.info({ userId }, "Repository: Profile exists, updating");
        const result = await this.update(userId, profileData);
        if (!result) {
          throw new Error("Error updating financial profile");
        }
        // Retornar perfil atualizado
        return {
          id: existing.id,
          user_id: userId,
          ...profileData
        };
      }
      
      // Se não existe, criar
      logger.info({ userId }, "Repository: Profile does not exist, creating");
      return await this.create(userId, profileData);
      
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error in createOrUpdate");
      throw new Error(`Error in createOrUpdate: ${error.message}`);
    }
  }

  /**
   * Atualiza perfil financeiro
   */
  async update(userId, profileData) {
    try {
      logger.info({ userId }, "Updating financial profile");
      
      const {
        monthly_income,
        initial_balance,
        has_investments,
        has_assets,
        financial_goal,
        behavior_profile
      } = profileData;

      const [result] = await pool.query(
        `UPDATE financial_profiles 
        SET monthly_income = ?, initial_balance = ?, has_investments = ?,
            has_assets = ?, financial_goal = ?, behavior_profile = ?
        WHERE user_id = ?`,
        [
          monthly_income,
          initial_balance,
          has_investments,
          has_assets,
          financial_goal,
          behavior_profile,
          userId
        ]
      );

      logger.info({ userId, updated: result.affectedRows > 0 }, "Financial profile updated");

      return result.affectedRows > 0;
    } catch (error) {
      logger.error({ error: error.message, userId }, "Error updating financial profile");
      throw new Error(`Error updating financial profile: ${error.message}`);
    }
  }
}

module.exports = new FinancialProfileRepository();
