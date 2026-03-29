/**
 * Financial Profile Form Validators
 * 
 * Frontend validation for financial operations like investments and expenses
 * Backend validation is the authoritative source for business rules
 * 
 * Usage:
 *   const error = validateInvestmentForm(data);
 *   if (error) setError(error);
 */

import { validateNotEmpty, validateNumber } from './sharedValidator';

/**
 * Validate investment form
 * @param {object} investment - Investment data object
 * @returns {string|null} Error message or null if valid
 */
export function validateInvestmentForm(investment) {
  if (!validateNotEmpty(investment?.name)) {
    return 'Investment name is required';
  }

  if (!validateNotEmpty(investment?.type)) {
    return 'Investment type is required';
  }

  if (!validateNumber(investment?.amount)) {
    return 'Please enter a valid investment amount';
  }

  if (parseFloat(investment.amount) <= 0) {
    return 'Investment amount must be greater than zero';
  }

  return null;
}

/**
 * Validate expense form
 * @param {object} expense - Expense data object
 * @returns {string|null} Error message or null if valid
 */
export function validateExpenseForm(expense) {
  if (!validateNotEmpty(expense?.description)) {
    return 'Expense description is required';
  }

  if (!validateNotEmpty(expense?.category)) {
    return 'Expense category is required';
  }

  if (!validateNumber(expense?.amount)) {
    return 'Please enter a valid expense amount';
  }

  if (parseFloat(expense.amount) <= 0) {
    return 'Expense amount must be greater than zero';
  }

  return null;
}

/**
 * Validate asset form
 * @param {object} asset - Asset data object
 * @returns {string|null} Error message or null if valid
 */
export function validateAssetForm(asset) {
  if (!validateNotEmpty(asset?.name)) {
    return 'Asset name is required';
  }

  if (!validateNotEmpty(asset?.type)) {
    return 'Asset type is required';
  }

  if (!validateNumber(asset?.value)) {
    return 'Please enter a valid asset value';
  }

  if (parseFloat(asset.value) <= 0) {
    return 'Asset value must be greater than zero';
  }

  return null;
}

/**
 * Validate income form
 * @param {object} income - Income data object
 * @returns {string|null} Error message or null if valid
 */
export function validateIncomeForm(income) {
  if (!validateNotEmpty(income?.source)) {
    return 'Income source is required';
  }

  if (!validateNumber(income?.amount)) {
    return 'Please enter a valid income amount';
  }

  if (parseFloat(income.amount) <= 0) {
    return 'Income amount must be greater than zero';
  }

  return null;
}
