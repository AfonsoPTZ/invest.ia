/**
 * FinancialProfileEntity - Represents a user's financial profile
 * Encapsulates financial profile data from database into a domain object
 */

interface IFinancialProfileDatabaseRow {
  id?: string | number;
  user_id?: string | number;
  monthly_income?: number | string;
  initial_balance?: number | string;
  has_investments?: boolean | number;
  has_assets?: boolean | number;
  financial_goal?: string;
  behavior_profile?: string;
  [key: string]: any;
}

class FinancialProfileEntity {
  id: string | number;
  userId: string | number;
  monthly_income: number | string;
  initial_balance: number | string;
  has_investments: boolean | number;
  has_assets: boolean | number;
  financial_goal: string;
  behavior_profile: string;

  constructor(
    id: string | number,
    userId: string | number,
    monthly_income: number | string,
    initial_balance: number | string,
    has_investments: boolean | number,
    has_assets: boolean | number,
    financial_goal: string,
    behavior_profile: string
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
  static fromDatabase(dbRow: IFinancialProfileDatabaseRow | null | undefined): FinancialProfileEntity | null {
    if (!dbRow) return null;

    return new FinancialProfileEntity(
      dbRow.id ?? "",
      dbRow.user_id ?? "",
      dbRow.monthly_income ?? 0,
      dbRow.initial_balance ?? 0,
      dbRow.has_investments ?? false,
      dbRow.has_assets ?? false,
      dbRow.financial_goal ?? "",
      dbRow.behavior_profile ?? ""
    );
  }

  /**
   * Retornar dados para serialização
   */
  toJSON(): object {
    return {
      id: this.id,
      userId: this.userId,
      monthly_income: this.monthly_income,
      initial_balance: this.initial_balance,
      has_investments: this.has_investments,
      has_assets: this.has_assets,
      financial_goal: this.financial_goal,
      behavior_profile: this.behavior_profile
    };
  }

  /**
   * Helpers para checagens rápidas
   * FIXED: Usava campos inexistentes (possui_investimentos, possui_patrimonio)
   * Agora usa campos corretos (has_investments, has_assets)
   */
  hasInvestments(): boolean {
    return this.has_investments === true || this.has_investments === 1;
  }

  hasAssets(): boolean {
    return this.has_assets === true || this.has_assets === 1;
  }
}

export default FinancialProfileEntity;
export type { IFinancialProfileDatabaseRow };
