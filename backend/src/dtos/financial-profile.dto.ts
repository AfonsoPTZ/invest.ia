/**
 * FinancialProfileDTO - Data Transfer Object para perfil financeiro
 * Transporta dados de perfil financeiro entre controller e service
 */

interface IFinancialProfileRequest {
  monthly_income?: number | string;
  initial_balance?: number | string;
  has_investments?: boolean | string;
  has_assets?: boolean | string;
  financial_goal?: string;
  behavior_profile?: string;
}

class FinancialProfileDTO {
  monthly_income: number | string;
  initial_balance: number | string;
  has_investments: boolean | string;
  has_assets: boolean | string;
  financial_goal: string;
  behavior_profile: string;

  constructor(
    monthly_income: number | string,
    initial_balance: number | string,
    has_investments: boolean | string,
    has_assets: boolean | string,
    financial_goal: string,
    behavior_profile: string
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
  static fromRequest(body: IFinancialProfileRequest): FinancialProfileDTO {
    const {
      monthly_income = 0,
      initial_balance = 0,
      has_investments = false,
      has_assets = false,
      financial_goal = "",
      behavior_profile = ""
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
  toJSON(): object {
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

export default FinancialProfileDTO;
export type { IFinancialProfileRequest };
