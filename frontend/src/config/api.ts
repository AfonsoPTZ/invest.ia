/**
 * Shared API Configuration
 * 
 * Centralized API settings and helper functions
 * Reduces repetition across services
 * 
 * @module config/api
 */

/** Base API URL from environment or default */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Get authorization headers with Bearer token
 * 
 * @param {string | null} token - JWT token from storage
 * @returns {Object} Headers object with Authorization
 */
export function getAuthHeaders(token: string | null): Record<string, string> {
  if (!token) {
    return {};
  }
  return {
    "Authorization": `Bearer ${token}`
  };
}

/**
 * Get headers for JSON requests with optional authorization
 * 
 * @param {string | null} token - JWT token from storage
 * @returns {Object} Headers object with Content-Type and Authorization
 */
export function getJsonHeaders(token: string | null): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(token)
  };
}
