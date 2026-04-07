/**
 * DashboardResponseDTO - Data Transfer Object para resposta da dashboard
 * Estrutura a resposta da dashboard com user e financial profile
 * Filtra dados sensíveis e padroniza a saída para o cliente
 */
class DashboardResponseDTO {
  constructor(user, financialProfile) {
    this.user = user;
    this.financialProfile = financialProfile;
  }

  /**
   * Factory method: criar a partir de dados da dashboard
   * @param {object} dashboardData - Objeto com { user, financialProfile }
   * @returns {DashboardResponseDTO}
   */
  static fromDashboardData(dashboardData) {
    if (!dashboardData) return null;

    return new DashboardResponseDTO(
      dashboardData.user,
      dashboardData.financialProfile
    );
  }

  /**
   * Factory method: para apenas dados do usuário
   * @param {object} userData - Objeto com dados do usuário
   * @returns {DashboardResponseDTO}
   */
  static fromUserData(userData) {
    if (!userData) return null;

    return new DashboardResponseDTO(userData, null);
  }

  /**
   * Factory method: para apenas dados de investimentos/perfil financeiro
   * @param {object} investmentData - Objeto com dados de investimento
   * @returns {DashboardResponseDTO}
   */
  static fromInvestmentData(investmentData) {
    if (!investmentData) return null;

    return new DashboardResponseDTO(null, investmentData);
  }

  /**
   * Retornar dados para serialização JSON
   * @returns {object}
   */
  toJSON() {
    const response = {};

    if (this.user) {
      response.user = this.user;
    }

    if (this.financialProfile) {
      response.financialProfile = this.financialProfile;
    }

    return response;
  }
}

export default DashboardResponseDTO;
