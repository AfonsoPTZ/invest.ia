/**
 * Authentication Service
 * 
 * Centralized HTTP client for all authentication operations
 * Handles login, registration, logout, token management
 * Utilizes frontend logger for debugging
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token lifecycle management (storing, retrieving)
 * - Error transformation to/from API format
 * 
 * DO NOT:
 * - Business logic (validation, role checking)
 * - UI state management
 * - Page redirects
 * 
 * @module authService
 */

import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * User login with email and password
 * 
 * Sends credentials to backend, receives JWT token
 * Stores token in localStorage for authenticated requests
 * 
 * @async
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data object { id, name, email }
 * @throws {Error} Login error from API or network
 */
export async function login(email, password) {
  try {
    logger.info({ email }, "AuthService: Attempting user login");

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ email }, `AuthService: Login failed - ${data.message}`);
      throw new Error(data.message || "Login error");
    }

    // Store JWT token for authenticated requests
    localStorage.setItem("token", data.token);

    logger.info({ email }, "AuthService: User logged in successfully");

    return data.user;
  } catch (error) {
    logger.error({ email, error: error.message }, "AuthService: Error on login");
    throw error;
  }
}

/**
 * Register new user with OTP email verification
 * 
 * Sends registration data, backend sends OTP email
 * Returns userId for next OTP verification step
 * 
 * NOTE: User is NOT authenticated yet - needs OTP verification
 * 
 * @async
 * @param {string} name - User full name
 * @param {string} email - User email
 * @param {string} cpf - User CPF (only digits will be sent)
 * @param {string} phone - User phone (only digits will be sent)
 * @param {string} password - User password (backend validates strength)
 * @returns {Promise<Object>} { userId, email } for next step
 * @throws {Error} Registration error from API or network
 */
export async function register(name, email, cpf, phone, password) {
  try {
    logger.info({ email }, "AuthService: Attempting user registration");

    const response = await fetch(`${API_URL}/auth/register-with-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, cpf, phone, password })
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ email }, `AuthService: Registration failed - ${data.message}`);
      throw new Error(data.message || "Registration error");
    }

    logger.info({ email, userId: data.userId }, "AuthService: User registered successfully. OTP sent");

    return data;
  } catch (error) {
    logger.error({ email, error: error.message }, "AuthService: Error on registration");
    throw error;
  }
}

/**
 * User logout
 * 
 * Notifies backend of logout (optional), removes token from localStorage
 * Safe to call even if token is invalid or expired
 * 
 * @async
 * @returns {Promise<void>}
 */
export async function logout() {
  const token = localStorage.getItem("token");

  try {
    logger.info({}, "AuthService: User attempting logout");

    // Notify backend (best effort)
    await fetch(`${API_URL}/auth/logout`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    logger.info({}, "AuthService: User logged out successfully");
  } catch (error) {
    logger.error({ error: error.message }, "AuthService: Error on logout");
    // Don't throw - logout should complete even if backend call fails
  }

  // Always remove token locally
  localStorage.removeItem("token");
}

/**
 * Verify email with OTP code
 * 
 * User enters OTP code received via email after registration
 * Backend validates OTP and returns temporary token for profile completion
 * 
 * @async
 * @param {number} userId - User ID from registration
 * @param {string} otpCode - 6-digit OTP code
 * @returns {Promise<Object>} { success, message, token, redirectUrl }
 * @throws {Error} Verification error from API or network
 */
export async function verifyEmail(userId, otpCode) {
  try {
    logger.info({ userId }, "AuthService: Attempting email verification with OTP");

    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, otpCode })
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ userId }, `AuthService: Email verification failed - ${data.message}`);
      throw new Error(data.message || "Email verification error");
    }

    logger.info({ userId }, "AuthService: Email verified successfully. Token generated");

    return data;
  } catch (error) {
    logger.error({ userId, error: error.message }, "AuthService: Error on email verification");
    throw error;
  }
}

/**
 * Resend OTP code to user email
 * 
 * Requested when user doesn't receive initial OTP or code expires
 * Generates new OTP and sends to registered email
 * 
 * @async
 * @param {number} userId - User ID who needs new OTP
 * @returns {Promise<Object>} { success, message }
 * @throws {Error} Resend error from API or network
 */
export async function resendOtp(userId) {
  try {
    logger.info({ userId }, "AuthService: Attempting to resend OTP");

    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ userId }, `AuthService: Resend OTP failed - ${data.message}`);
      throw new Error(data.message || "Resend OTP error");
    }

    logger.info({ userId }, "AuthService: OTP resent successfully");

    return data;
  } catch (error) {
    logger.error({ userId, error: error.message }, "AuthService: Error on resend OTP");
    throw error;
  }
}