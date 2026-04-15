/**
 * Investment Service (TypeScript)
 * 
 * Centralized HTTP client for investment management operations
 * Fully typed with API contract interfaces
 * Handles CRUD operations for user investments
 * Utilizes frontend logger for debugging
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token retrieval from localStorage
 * - Error transformation to/from API format
 * - Type-safe API interactions
 * 
 * DO NOT:
 * - Business logic (calculations, analysis)
 * - UI state management
 * - Page redirects
 * 
 * @module investimentoService
 */

import logger from "../utils/logger";
import { API_URL, getAuthHeaders, getJsonHeaders } from "../config/api";
import type {
  Investment,
  CreateInvestmentRequest,
  ApiResponse,
} from "../types/api";

/**
 * Get all investments for authenticated user
 * 
 * Fetches list of investments with optional filtering/pagination
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<Investment[]>} Array of investment objects
 * @throws {Error} If not authenticated or API error
 */
export async function getInvestments(): Promise<Investment[]> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "InvestmentService: Token not found for getInvestments");
      throw new Error("Token not found");
    }

    logger.debug({}, "InvestmentService: Fetching investments");

    const response = await fetch(`${API_URL}/investimentos`, {
      headers: getAuthHeaders(token)
    });

    const data: ApiResponse<Investment[]> = await response.json();

    if (!data.success) {
      logger.warn({}, `InvestmentService: getInvestments failed - ${data.message}`);
      throw new Error(data.message || "Error fetching investments");
    }

    logger.info({}, "InvestmentService: Investments fetched successfully");

    return data.data || [];
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "InvestmentService: Error fetching investments");
    throw error;
  }
}

/**
 * Update existing investment
 * 
 * @async
 * @param {string|number} id - Investment ID
 * @param {CreateInvestmentRequest} investmentData - Updated investment data
 * @returns {Promise<Investment>} Updated investment object
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function updateInvestment(id: string | number, investmentData: CreateInvestmentRequest): Promise<Investment> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({ id }, "InvestmentService: Token not found for updateInvestment");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "InvestmentService: Updating investment");

    const response = await fetch(`${API_URL}/investimentos/${id}`, {
      method: "PUT",
      headers: getJsonHeaders(token),
      body: JSON.stringify(investmentData)
    });

    const data: ApiResponse<Investment> = await response.json();

    if (!data.success) {
      logger.warn({ id }, `InvestmentService: updateInvestment failed - ${data.message}`);
      throw new Error(data.message || "Error updating investment");
    }

    logger.info({ id }, "InvestmentService: Investment updated successfully");

    return data.data as Investment;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "InvestmentService: Error updating investment");
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
export async function deleteInvestment(id: string | number): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({ id }, "InvestmentService: Token not found for deleteInvestment");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "InvestmentService: Deleting investment");

    const response = await fetch(`${API_URL}/investimentos/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token)
    });

    const data: ApiResponse<unknown> = await response.json();

    if (!data.success) {
      logger.warn({ id }, `InvestmentService: deleteInvestment failed - ${data.message}`);
      throw new Error(data.message || "Error deleting investment");
    }

    logger.info({ id }, "InvestmentService: Investment deleted successfully");
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "InvestmentService: Error deleting investment");
    throw error;
  }
}
