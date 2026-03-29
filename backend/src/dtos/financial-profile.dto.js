/**
 * FinancialProfileDTO - Data Transfer Object para perfil financeiro
 * Transporta dados de perfil financeiro entre controller e service
 */
class FinancialProfileDTO {
  constructor(
    monthly_income,
    initial_balance,
    has_investments,
    has_assets,
    financial_goal,
    behavior_profile
  ) {
    this.monthly_income = monthly_income;
    this.initial_balance = initial_balance;
    this.has_investments = has_investments;
    this.has_assets = has_assets;
    this.financial_goal = financial_goal;
    this.behavior_profile = behavior_profile;
  }

  /**
   * Factory method: criar DTO a partir do request body
   */
  static fromRequest(body) {
    const {
      monthly_income,
      initial_balance,
      has_investments,
      has_assets,
      financial_goal,
      behavior_profile
    } = body;

    return new FinancialProfileDTO(
      monthly_income,
      initial_balance,
      has_investments,
      has_assets,
      financial_goal,
      behavior_profile
    );
  }

  /**
   * Retornar dados para serialização
   */
  toJSON() {
    return {
      monthly_income: this.monthly_income,
      initial_balance: this.initial_balance,
      has_investments: this.has_investments,
      has_assets: this.has_assets,
      financial_goal: this.financial_goal,
      behavior_profile: this.behavior_profile
    };
  }
}

module.exports = FinancialProfileDTO;
