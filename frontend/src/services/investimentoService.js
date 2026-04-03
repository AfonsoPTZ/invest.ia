/**
 * Investment Service
 * 
 * HTTP client for investment management operations
 * Handles CRUD operations for user investments
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token retrieval from localStorage
 * - Error transformation to/from API format
 * 
 * DO NOT:
 * - Business logic (calculations, analysis)
 * - UI state management
 * - Page redirects
 * 
 * @module investimentoService
 */

import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Get all investments for authenticated user
 * 
 * Fetches list of investments with optional filtering/pagination
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<Object>} { investments: Array, total: number, ... }
 * @throws {Error} If not authenticated or API error
 */
export async function getInvestments() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "InvestmentService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({}, "InvestmentService: Fetching investments");

    const response = await fetch(`${API_URL}/investimentos`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `InvestmentService: getInvestments failed - ${data.message}`);
      throw new Error(data.message || "Error fetching investments");
    }

    logger.info({}, "InvestmentService: Investments fetched successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "InvestmentService: Error fetching investments");
    throw error;
  }
}


/**
 * Update existing investment
 * 
 * @async
 * @param {string|number} id - Investment ID
 * @param {Object} investmentData - Updated investment data
 * @returns {Promise<Object>} Updated investment object
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function updateInvestment(id, investmentData) {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "InvestmentService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "InvestmentService: Updating investment");

    const response = await fetch(`${API_URL}/investimentos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(investmentData)
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ id }, `InvestmentService: updateInvestment failed - ${data.message}`);
      throw new Error(data.message || "Error updating investment");
    }

    logger.info({ id }, "InvestmentService: Investment updated successfully");

    return data.data;
  } catch (error) {
    logger.error({ error: error.message }, "InvestmentService: Error updating investment");
    throw error;
  }
}

/**
 * Delete investment
 * 
 * @async
 * @param {string|number} id - Investment ID
 * @returns {Promise<void>}
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function deleteInvestment(id) {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "InvestmentService: Token not found");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "InvestmentService: Deleting investment");

    const response = await fetch(`${API_URL}/investimentos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({ id }, `InvestmentService: deleteInvestment failed - ${data.message}`);
      throw new Error(data.message || "Error deleting investment");
    }

    logger.info({ id }, "InvestmentService: Investment deleted successfully");
  } catch (error) {
    logger.error({ error: error.message }, "InvestmentService: Error deleting investment");
    throw error;
  }
}
