/**
 * FinancialProfileEntity - Represents a user's financial profile
 * Encapsulates financial profile data from database into a domain object
 */
class FinancialProfileEntity {
  constructor(
    id,
    userId,
    monthly_income,
    initial_balance,
    has_investments,
    has_assets,
    financial_goal,
    behavior_profile
  ) {
    this.id = id;
    this.userId = userId;
    this.monthly_income = monthly_income;
    this.initial_balance = initial_balance;
    this.has_investments = has_investments;
    this.has_assets = has_assets;
    this.financial_goal = financial_goal;
    this.behavior_profile = behavior_profile;
  }

  /**
   * Factory method: criar entity a partir de dados do banco
   */
  static fromDatabase(dbRow) {
    if (!dbRow) return null;

    return new FinancialProfileEntity(
      dbRow.id,
      dbRow.user_id,
      dbRow.monthly_income,
      dbRow.initial_balance,
      dbRow.has_investments,
      dbRow.has_assets,
      dbRow.financial_goal,
      dbRow.behavior_profile
    );
  }

  /**
   * Retornar dados para serialização
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      monthly_income: this.monthly_income,
      initial_balance: this.initial_balance,
      has_investments: this.has_investments,
      has_assets: this.has_assets,
      financial_goal: this.financial_goal,
      behavior_profile: this.behavior_profile,
    };
  }

  /**
   * Helpers para checagens rápidas
   */
  hasInvestments() {
    return this.possui_investimentos === true || this.possui_investimentos === 1;
  }

  hasAssets() {
    return this.possui_patrimonio === true || this.possui_patrimonio === 1;
  }
}

export default FinancialProfileEntity;
