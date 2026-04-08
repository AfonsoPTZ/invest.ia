/**
 * FinancialProfileResponseDTO - Data Transfer Object para resposta de perfil financeiro
 * Estrutura os dados de perfil financeiro para resposta ao cliente
 * Filtra campos internos não necessários e padroniza a saída
 */

interface IFinancialProfile {
  id?: string | number;
  userId?: string | number;
  monthlyIncome?: number | string;
  initialBalance?: number | string;
  hasInvestments?: boolean | string;
  hasAssets?: boolean | string;
  financialGoal?: string;
  behaviorProfile?: string;
  monthly_income?: number | string;
  initial_balance?: number | string;
  has_investments?: boolean | string;
  has_assets?: boolean | string;
  financial_goal?: string;
  behavior_profile?: string;
  [key: string]: any;
}

class FinancialProfileResponseDTO {
  id: string | number;
  userId: string | number;
  monthlyIncome: number | string;
  initialBalance: number | string;
  hasInvestments: boolean | string;
  hasAssets: boolean | string;
  financialGoal: string;
  behaviorProfile: string;

  constructor(
    id: string | number,
    userId: string | number,
    monthlyIncome: number | string,
    initialBalance: number | string,
    hasInvestments: boolean | string,
    hasAssets: boolean | string,
    financialGoal: string,
    behaviorProfile: string
  ) {
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
   * Suporta tanto nomenclatura snake_case quanto camelCase
   * @param profile - Objeto de perfil financeiro do banco/entity
   * @returns FinancialProfileResponseDTO ou null se vazio
   */
  static fromProfile(profile: IFinancialProfile | null | undefined): FinancialProfileResponseDTO | null {
    if (!profile) return null;

    return new FinancialProfileResponseDTO(
      profile.id ?? "",
      profile.userId ?? profile.user_id ?? "",
      profile.monthlyIncome ?? profile.monthly_income ?? 0,
      profile.initialBalance ?? profile.initial_balance ?? 0,
      profile.hasInvestments ?? profile.has_investments ?? false,
      profile.hasAssets ?? profile.has_assets ?? false,
      profile.financialGoal ?? profile.financial_goal ?? "",
      profile.behaviorProfile ?? profile.behavior_profile ?? ""
    );
  }

  /**
   * Retornar dados para serialização JSON
   */
  toJSON(): object {
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
export type { IFinancialProfile };
