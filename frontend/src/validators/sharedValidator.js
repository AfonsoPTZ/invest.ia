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
 * Check if CPF has correct digit count (simple check, no algorithm validation)
 * @param {string} cpf - CPF to validate
 * @returns {boolean} True if CPF has 11 digits
 */
export function validateCPF(cpf) {
  if (!validateNotEmpty(cpf)) return false;
  const digitsOnly = cpf.replace(/\D/g, '');
  return digitsOnly.length === 11;
}

/**
 * Check if phone has correct digit count (simple check, assumes 11 digits)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if phone has 11 digits
 */
export function validatePhone(phone) {
  if (!validateNotEmpty(phone)) return false;
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length === 11;
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

/**
 * Generic field validation with error message
 * @param {string} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export function validateRequired(value, fieldName) {
  if (!validateNotEmpty(value)) {
    return `${fieldName} is required`;
  }
  return null;
}
