/**
 * Authentication Form Validators
 * 
 * Frontend validation for auth pages: Login, Register, VerifyOtp, FinancialProfile
 * These are UI-level validators to improve UX - backend validation is authoritative
 * 
 * Usage:
 *   const error = validateLoginForm(email, password);
 *   if (error) setError(error);
 */

import {
  validateNotEmpty,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateOTP,
  validateCPF
} from './sharedValidator';

/**
 * Validate login form
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {string|null} Error message or null if valid
 */
export function validateLoginForm(email, password) {
  if (!validateNotEmpty(email)) {
    return 'Email is required';
  }

  if (!validateEmail(email)) {
    return 'Please enter a valid email';
  }

  if (!validateNotEmpty(password)) {
    return 'Password is required';
  }

  if (!validatePassword(password)) {
    return 'Password must be at least 6 characters';
  }

  return null;
}

/**
 * Validate register form
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} cpf - User CPF
 * @param {string} phone - User phone
 * @param {string} password - User password
 * @param {string} confirmPassword - Password confirmation
 * @returns {string|null} Error message or null if valid
 */
export function validateRegisterForm(name, email, cpf, phone, password, confirmPassword) {
  if (!validateNotEmpty(name)) {
    return 'Name is required';
  }

  if (!validateNotEmpty(email)) {
    return 'Email is required';
  }

  if (!validateEmail(email)) {
    return 'Please enter a valid email';
  }

  if (!validateNotEmpty(cpf)) {
    return 'CPF is required';
  }

  // Use new CPF validation with algorithm check
  if (!validateCPF(cpf)) {
    return 'CPF format is invalid';
  }

  if (!validateNotEmpty(phone)) {
    return 'Phone is required';
  }

  if (!validatePhoneDigits(phone)) {
    return 'Phone must have 11 digits';
  }

  if (!validatePassword(password)) {
    return 'Password must be at least 6 characters';
  }

  if (!validatePasswordMatch(password, confirmPassword)) {
    return 'Passwords do not match';
  }

  return null;
}

/**
 * Validate OTP code (6 digits)
 * @param {string} otp - OTP code (concatenated)
 * @returns {string|null} Error message or null if valid
 */
export function validateOTPCode(otp) {
  if (!validateOTP(otp)) {
    return 'Please enter all 6 digits';
  }

  return null;
}

/**
 * Validate financial profile form
 * @param {object} formData - Form data object
 * @returns {string|null} Error message or null if valid
 */
export function validateFinancialProfileForm(formData) {
  if (!validateNotEmpty(formData.financial_goal)) {
    return 'Please select a financial goal';
  }

  if (formData.has_monthly_income && !validatePositiveNumber(formData.monthly_income)) {
    return 'Please enter a valid monthly income';
  }

  if (formData.has_initial_balance && !validatePositiveNumber(formData.initial_balance)) {
    return 'Please enter a valid initial balance';
  }

  return null;
}

/**
 * Helper: Validate phone digit count only
 * @param {string} phone - Phone string
 * @returns {boolean}
 */
function validatePhoneDigits(phone) {
  if (!validateNotEmpty(phone)) return false;
  // Reject if contains any non-numeric characters
  if (!/^\d+$/.test(phone)) return false;
  return phone.length === 11;
}

/**
 * Helper: Validate positive number
 * @param {any} value - Value to check
 * @returns {boolean}
 */
function validatePositiveNumber(value) {
  if (!validateNotEmpty(value)) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}
