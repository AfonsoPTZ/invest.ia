/**
 * Shared Frontend Validators
 * 
 * Simple, quick validation functions for common input types
 * These are UI-level validators only - backend validation is authoritative
 * 
 * Usage:
 *   if (!validateEmail(email)) setError("Invalid email");
 *   if (!validateNotEmpty(name)) setError("Name is required");
 */

/**
 * Check if value is not empty
 * @param {string} value - Value to check
 * @returns {boolean} True if value is not empty
 */
export function validateNotEmpty(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

/**
 * Check if email format is valid (simple check)
 * @param {string} email - Email to validate
 * @returns {boolean} True if email format seems valid
 */
export function validateEmail(email) {
  if (!validateNotEmpty(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if password meets minimum requirements
 * @param {string} password - Password to validate
 * @returns {boolean} True if password is at least 6 characters
 */
export function validatePassword(password) {
  return validateNotEmpty(password) && password.length >= 6;
}

/**
 * Check if passwords match
 * @param {string} password1 - First password
 * @param {string} password2 - Second password
 * @returns {boolean} True if passwords match
 */
export function validatePasswordMatch(password1, password2) {
  return validateNotEmpty(password1) && validateNotEmpty(password2) && password1 === password2;
}

/**
 * Check if value is a valid number
 * @param {any} value - Value to validate
 * @returns {boolean} True if value is a valid number
 */
export function validateNumber(value) {
  if (!validateNotEmpty(value)) return false;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

/**
 * Check if CPF format is valid
 * Detects invalid CPFs like: all same digits (111.111.111-11), wrong digit count
 * Note: Full CPF algorithm validation is done by backend
 * @param {string} cpf - CPF to validate
 * @returns {boolean} True if CPF format is valid
 */
export function validateCPF(cpf) {
  if (!validateNotEmpty(cpf)) return false;
  
  const digitsOnly = cpf.replace(/\D/g, '');
  
  // Must have exactly 11 digits
  if (digitsOnly.length !== 11) return false;
  
  // Reject if all digits are the same (111.111.111-11, 222.222.222-22, etc)
  // These are known invalid CPF patterns
  if (/^(\d)\1{10}$/.test(digitsOnly)) return false;
  
  return true;
}



/**
 * Check if OTP code has correct length (6 digits)
 * @param {string} otp - OTP code to validate
 * @returns {boolean} True if OTP is 6 digits
 */
export function validateOTP(otp) {
  if (!validateNotEmpty(otp)) return false;
  const digitsOnly = otp.replace(/\D/g, '');
  return digitsOnly.length === 6;
}


