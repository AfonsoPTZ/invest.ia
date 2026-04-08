/**
 * DashboardResponseDTO - Data Transfer Object para resposta da dashboard
 * Estrutura a resposta da dashboard com user e financial profile
 * Filtra dados sensíveis e padroniza a saída para o cliente
 */

interface IDashboardData {
  user?: any;
  financialProfile?: any;
}

class DashboardResponseDTO {
  user: any;
  financialProfile: any;

  constructor(user: any, financialProfile: any) {
    this.user = user;
    this.financialProfile = financialProfile;
  }

  /**
   * Factory method: criar a partir de dados da dashboard
   * @param dashboardData - Objeto com { user, financialProfile }
   * @returns DashboardResponseDTO ou null se vazio
   */
  static fromDashboardData(dashboardData: IDashboardData | null | undefined): DashboardResponseDTO | null {
    if (!dashboardData) return null;

    return new DashboardResponseDTO(
      dashboardData.user,
      dashboardData.financialProfile
    );
  }

  /**
   * Factory method: para apenas dados do usuário
   * @param userData - Objeto com dados do usuário
   * @returns DashboardResponseDTO ou null se vazio
   */
  static fromUserData(userData: any): DashboardResponseDTO | null {
    if (!userData) return null;

    return new DashboardResponseDTO(userData, null);
  }

  /**
   * Factory method: para apenas dados de investimentos/perfil financeiro
   * @param investmentData - Objeto com dados de investimento
   * @returns DashboardResponseDTO ou null se vazio
   */
  static fromInvestmentData(investmentData: any): DashboardResponseDTO | null {
    if (!investmentData) return null;

    return new DashboardResponseDTO(null, investmentData);
  }

  /**
   * Retornar dados para serialização JSON
   */
  toJSON(): object {
    const response: Record<string, any> = {};

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
export type { IDashboardData };
