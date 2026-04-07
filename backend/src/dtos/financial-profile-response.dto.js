/**
 * FinancialProfileResponseDTO - Data Transfer Object para resposta de perfil financeiro
 * Estrutura os dados de perfil financeiro para resposta ao cliente
 * Filtra campos internos não necessários e padroniza a saída
 */
class FinancialProfileResponseDTO {
  constructor(id, userId, monthlyIncome, initialBalance, hasInvestments, hasAssets, financialGoal, behaviorProfile) {
    this.id = id;
    this.userId = userId;
    this.monthlyIncome = monthlyIncome;
    this.initialBalance = initialBalance;
    this.hasInvestments = hasInvestments;
    this.hasAssets = hasAssets;
    this.financialGoal = financialGoal;
    this.behaviorProfile = behaviorProfile;
  }

  /**
   * Factory method: criar a partir de um objeto de perfil financeiro
   * @param {object} profile - Objeto de perfil financeiro do banco/entity
   * @returns {FinancialProfileResponseDTO}
   */
  static fromProfile(profile) {
    if (!profile) return null;

    return new FinancialProfileResponseDTO(
      profile.id,
      profile.userId,
      profile.monthlyIncome || profile.monthly_income,
      profile.initialBalance || profile.initial_balance,
      profile.hasInvestments || profile.has_investments,
      profile.hasAssets || profile.has_assets,
      profile.financialGoal || profile.financial_goal,
      profile.behaviorProfile || profile.behavior_profile
    );
  }

  /**
   * Retornar dados para serialização JSON
   * @returns {object}
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      monthlyIncome: this.monthlyIncome,
      initialBalance: this.initialBalance,
      hasInvestments: this.hasInvestments,
      hasAssets: this.hasAssets,
      financialGoal: this.financialGoal,
      behaviorProfile: this.behaviorProfile
    };
  }
}

export default FinancialProfileResponseDTO;
