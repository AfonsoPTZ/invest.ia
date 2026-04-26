/**
 * Authentication Service (TypeScript)
 * 
 * Centralized HTTP client for all authentication operations
 * Fully typed with API contract interfaces
 * Handles login, registration, logout, token management
 * Utilizes frontend logger for debugging
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token lifecycle management (storing, retrieving)
 * - Error transformation to/from API format
 * - Type-safe API interactions
 * 
 * DO NOT:
 * - Business logic (validation, role checking)
 * - UI state management
 * - Page redirects
 * 
 * @module authService
 */

import logger from "../utils/logger";
import { API_URL, getAuthHeaders } from "../config/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  User,
  ApiResponse,
  ApiErrorResponse,
  StorageKeys
} from "../types/api";

/**
 * User login with email and password
 * 
 * Sends credentials to backend, receives JWT token
 * Stores token in localStorage for authenticated requests
 * 
 * @async
 * @param {LoginRequest} credentials - Email and password
 * @returns {Promise<User>} User data object { id, name, email }
 * @throws {Error} Login error from API or network
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    logger.info({ email }, "AuthService: Attempting user login");

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password } as LoginRequest)
    });

    const data: ApiResponse<LoginResponse> = await response.json();

    if (!data.success) {
      logger.warn({ email }, `AuthService: Login failed - ${data.message}`);
      throw new Error(data.message || "Login error");
    }

    // Store JWT token for authenticated requests
    const loginResponse = data.data as LoginResponse;
    localStorage.setItem("token", loginResponse.token);

    logger.info({ email }, "AuthService: User logged in successfully");

    return {
      id: loginResponse.id,
      name: loginResponse.name,
      email: loginResponse.email
    };
  } catch (error) {
    logger.error({ email, error: error instanceof Error ? error.message : String(error) }, "AuthService: Error on login");
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
 * @param {RegisterRequest} data - Registration data
 * @returns {Promise<RegisterResponse>} { userId, email } for next step
 * @throws {Error} Registration error from API or network
 */
export async function register(
  name: string,
  email: string,
  cpf: string,
  phone: string,
  password: string
): Promise<RegisterResponse> {
  try {
    logger.info({ email }, "AuthService: Attempting user registration");

    const response = await fetch(`${API_URL}/auth/register-with-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, cpf, phone, password } as RegisterRequest)
    });

    const data: ApiResponse<RegisterResponse> = await response.json();

    if (!data.success) {
      logger.warn({ email }, `AuthService: Registration failed - ${data.message}`);
      throw new Error(data.message || "Registration error");
    }

    logger.info({ email, userId: data.data?.userId }, "AuthService: User registered successfully. OTP sent");

    return data.data as RegisterResponse;
  } catch (error) {
    logger.error({ email, error: error instanceof Error ? error.message : String(error) }, "AuthService: Error on registration");
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
export async function logout(): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    logger.info({}, "AuthService: User attempting logout");

    // Notify backend (best effort)
    if (token) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "DELETE",
        headers: getAuthHeaders(token)
      });
    }

    logger.info({}, "AuthService: User logged out successfully");
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "AuthService: Error on logout");
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
 * @returns {Promise<VerifyOtpResponse>} { success, message, tempProfileToken }
 * @throws {Error} Verification error from API or network
 */
export async function verifyEmail(userId: string | number, otpCode: string): Promise<VerifyOtpResponse> {
  try {
    logger.info({ userId }, "AuthService: Attempting email verification with OTP");

    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId, otpCode } as VerifyOtpRequest)
    });

    const data: ApiResponse<VerifyOtpResponse> = await response.json();

    if (!data.success) {
      logger.warn({ userId }, `AuthService: Email verification failed - ${data.message}`);
      throw new Error(data.message || "Email verification error");
    }

    logger.info({ userId }, "AuthService: Email verified successfully. Token generated");

    // Store temporary profile token for next step
    const verifyResponse = data.data as VerifyOtpResponse;
    if (!verifyResponse.tempProfileToken) {
      logger.error({ userId }, "AuthService: Server did not return tempProfileToken");
      throw new Error("Invalid server response: missing authentication token");
    }
    sessionStorage.setItem("tempProfileToken", verifyResponse.tempProfileToken);

    return verifyResponse;
  } catch (error) {
    logger.error({ userId, error: error instanceof Error ? error.message : String(error) }, "AuthService: Error on email verification");
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
 * @returns {Promise<ApiResponse>} { success, message }
 * @throws {Error} Resend error from API or network
 */
export async function resendOtp(userId: string | number): Promise<ApiResponse<unknown>> {
  try {
    logger.info({ userId }, "AuthService: Attempting to resend OTP");

    const response = await fetch(`${API_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userId })
    });

    const data: ApiResponse<unknown> = await response.json();

    if (!data.success) {
      logger.warn({ userId }, `AuthService: Resend OTP failed - ${data.message}`);
      throw new Error(data.message || "Resend OTP error");
    }

    logger.info({ userId }, "AuthService: OTP resent successfully");

    return data;
  } catch (error) {
    logger.error({ userId, error: error instanceof Error ? error.message : String(error) }, "AuthService: Error on OTP resend");
    throw error;
  }
}

/**
 * Get current authenticated user from token
 * Returns user data without making API call (from stored token)
 * 
 * @returns {User | null} Current user or null if not authenticated
 */
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    return JSON.parse(userStr) as User;
  } catch (error) {
    logger.warn({}, "AuthService: Error parsing stored user");
    return null;
  }
}

/**
 * Check if user is authenticated (token exists)
 * 
 * @returns {boolean} True if token exists in localStorage
 */
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

/**
 * Get stored authentication token
 * 
 * @returns {string | null} JWT token or null if not authenticated
 */
export function getToken(): string | null {
  return localStorage.getItem("token");
}

/**
 * Store user data in localStorage
 * Called after successful login
 * 
 * @param {User} user - User data to store
 */
export function storeUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}
