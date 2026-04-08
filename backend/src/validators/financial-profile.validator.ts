// Financial Profile Validator - Real validations for financial data

// Validate monthly income (can be 0 if unchecked)
function validateMonthlyIncome(monthlyIncome: any): any {
  if (monthlyIncome === null || monthlyIncome === undefined) {
    return {
      isValid: false,
      error: "Monthly income is required"
    };
  }

  const income: number = parseFloat(monthlyIncome);

  if (isNaN(income)) {
    return {
      isValid: false,
      error: "Monthly income must be a valid number"
    };
  }

  if (income < 0) {
    return {
      isValid: false,
      error: "Monthly income cannot be negative"
    };
  }

  if (income > 1000000000) {
    return {
      isValid: false,
      error: "Monthly income is too high (max R$1 billion)"
    };
  }

  return {
    isValid: true,
    cleanedIncome: income
  };
}

// Validate initial balance (can be 0 if unchecked)
function validateInitialBalance(initialBalance: any): any {
  if (initialBalance === null || initialBalance === undefined) {
    return {
      isValid: false,
      error: "Initial balance is required"
    };
  }

  const balance: number = parseFloat(initialBalance);

  if (isNaN(balance)) {
    return {
      isValid: false,
      error: "Initial balance must be a valid number"
    };
  }

  if (balance < 0) {
    return {
      isValid: false,
      error: "Initial balance cannot be negative"
    };
  }

  if (balance > 1000000000) {
    return {
      isValid: false,
      error: "Initial balance is too high (max R$1 billion)"
    };
  }

  return {
    isValid: true,
    cleanedBalance: balance
  };
}

// Validate has investments (boolean)
function validateHasInvestments(hasInvestments: any): any {
  if (hasInvestments === null || hasInvestments === undefined) {
    return {
      isValid: false,
      error: "Has investments flag is required"
    };
  }

  const isBool: boolean = typeof hasInvestments === "boolean" || 
                 (typeof hasInvestments === "string" && ["true", "false", "0", "1"].includes(hasInvestments.toLowerCase()));

  if (!isBool) {
    return {
      isValid: false,
      error: "Has investments must be a boolean value (true/false)"
    };
  }

  return {
    isValid: true,
    cleanedFlag: hasInvestments === "true" || hasInvestments === 1 || hasInvestments === true
  };
}

// Validate has assets (boolean)
function validateHasAssets(hasAssets: any): any {
  if (hasAssets === null || hasAssets === undefined) {
    return {
      isValid: false,
      error: "Has assets flag is required"
    };
  }

  const isBool: boolean = typeof hasAssets === "boolean" || 
                 (typeof hasAssets === "string" && ["true", "false", "0", "1"].includes(hasAssets.toLowerCase()));

  if (!isBool) {
    return {
      isValid: false,
      error: "Has assets must be a boolean value (true/false)"
    };
  }

  return {
    isValid: true,
    cleanedFlag: hasAssets === "true" || hasAssets === 1 || hasAssets === true
  };
}

// Validate financial goal
function validateFinancialGoal(financialGoal: any): any {
  if (!financialGoal || financialGoal.trim().length === 0) {
    return {
      isValid: false,
      error: "Financial goal is required"
    };
  }

  const validGoals: string[] = [
    "accumulate_wealth",
    "retirement_planning",
    "education_funding",
    "home_purchase",
    "emergency_fund",
    "debt_reduction",
    "short_term_savings",
    "wealth_transfer",
    "business_expansion",
    "other"
  ];

  const goal: string = financialGoal.toLowerCase().trim();

  if (!validGoals.includes(goal)) {
    return {
      isValid: false,
      error: `Financial goal must be one of: ${validGoals.join(", ")}`
    };
  }

  return {
    isValid: true,
    cleanedGoal: goal
  };
}

// Validate behavior profile (investor type)
function validateBehaviorProfile(behaviorProfile: any): any {
  if (!behaviorProfile || behaviorProfile.trim().length === 0) {
    return {
      isValid: false,
      error: "Behavior profile is required"
    };
  }

  const validProfiles: string[] = [
    "conservative",
    "moderate",
    "aggressive"
  ];

  const profile: string = behaviorProfile.toLowerCase().trim();

  if (!validProfiles.includes(profile)) {
    return {
      isValid: false,
      error: `Behavior profile must be one of: ${validProfiles.join(", ")}`
    };
  }

  return {
    isValid: true,
    cleanedProfile: profile
  };
}

// Validate all financial profile data
function validateFinancialProfileRegistration(
  monthlyIncome: any,
  initialBalance: any,
  hasInvestments: any,
  hasAssets: any,
  financialGoal: any,
  behaviorProfile: any
): any {
  const errors: string[] = [];

  // Validate monthly income
  const incomeValidation: any = validateMonthlyIncome(monthlyIncome);
  if (!incomeValidation.isValid) {
    errors.push(incomeValidation.error);
  }

  // Validate initial balance
  const balanceValidation: any = validateInitialBalance(initialBalance);
  if (!balanceValidation.isValid) {
    errors.push(balanceValidation.error);
  }

  // Validate has investments
  const invValidation: any = validateHasInvestments(hasInvestments);
  if (!invValidation.isValid) {
    errors.push(invValidation.error);
  }

  // Validate has assets
  const assetsValidation: any = validateHasAssets(hasAssets);
  if (!assetsValidation.isValid) {
    errors.push(assetsValidation.error);
  }

  // Validate financial goal
  const goalValidation: any = validateFinancialGoal(financialGoal);
  if (!goalValidation.isValid) {
    errors.push(goalValidation.error);
  }

  // Validate behavior profile
  const profileValidation: any = validateBehaviorProfile(behaviorProfile);
  if (!profileValidation.isValid) {
    errors.push(profileValidation.error);
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors
    };
  }

  return {
    isValid: true,
    cleanedData: {
      monthly_income: incomeValidation.cleanedIncome,
      initial_balance: balanceValidation.cleanedBalance,
      has_investments: invValidation.cleanedFlag,
      has_assets: assetsValidation.cleanedFlag,
      financial_goal: goalValidation.cleanedGoal,
      behavior_profile: profileValidation.cleanedProfile
    }
  };
}

export {
  validateMonthlyIncome,
  validateInitialBalance,
  validateHasInvestments,
  validateHasAssets,
  validateFinancialGoal,
  validateBehaviorProfile,
  validateFinancialProfileRegistration
};
