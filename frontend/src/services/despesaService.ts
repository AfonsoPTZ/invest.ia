/**
 * Expense Service (TypeScript)
 * 
 * Centralized HTTP client for expense management operations
 * Fully typed with API contract interfaces
 * Handles CRUD operations for user expenses
 * Utilizes frontend logger for debugging
 * 
 * Layer Responsibility:
 * - HTTP communication only (fetch, headers, response handling)
 * - Token retrieval from localStorage
 * - Error transformation to/from API format
 * - Type-safe API interactions
 * 
 * DO NOT:
 * - Business logic (calculations, filtering)
 * - UI state management
 * - Page redirects
 * 
 * @module despesaService
 */

import logger from "../utils/logger";
import { API_URL, getAuthHeaders, getJsonHeaders } from "../config/api";
import type {
  Task,
  CreateTaskRequest,
  ApiResponse,
} from "../types/api";

/**
 * Get all expenses for authenticated user
 * 
 * Fetches list of expenses with optional filtering/pagination
 * Requires valid JWT token
 * 
 * @async
 * @returns {Promise<Task[]>} Array of expense objects
 * @throws {Error} If not authenticated or API error
 */
export async function getExpenses(): Promise<Task[]> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "ExpenseService: Token not found for getExpenses");
      throw new Error("Token not found");
    }

    logger.debug({}, "ExpenseService: Fetching expenses");

    const response = await fetch(`${API_URL}/despesas`, {
      headers: getAuthHeaders(token)
    });

    const data: ApiResponse<Task[]> = await response.json();

    if (!data.success) {
      logger.warn({}, `ExpenseService: getExpenses failed - ${data.message}`);
      throw new Error(data.message || "Error fetching expenses");
    }

    logger.info({}, "ExpenseService: Expenses fetched successfully");

    return data.data || [];
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "ExpenseService: Error fetching expenses");
    throw error;
  }
}

/**
 * Create new expense
 * 
 * @async
 * @param {CreateTaskRequest} expenseData - Expense data object
 * @returns {Promise<Task>} Created expense object with ID
 * @throws {Error} If not authenticated, validation failed, or API error
 */
export async function createExpense(expenseData: CreateTaskRequest): Promise<Task> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "ExpenseService: Token not found for createExpense");
      throw new Error("Token not found");
    }

    logger.debug({}, "ExpenseService: Creating expense");

    const response = await fetch(`${API_URL}/despesas`, {
      method: "POST",
      headers: getJsonHeaders(token),
      body: JSON.stringify(expenseData)
    });

    const data: ApiResponse<Task> = await response.json();

    if (!data.success) {
      logger.warn({}, `ExpenseService: createExpense failed - ${data.message}`);
      throw new Error(data.message || "Error creating expense");
    }

    logger.info({}, "ExpenseService: Expense created successfully");

    return data.data as Task;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "ExpenseService: Error creating expense");
    throw error;
  }
}

/**
 * Update existing expense
 * 
 * @async
 * @param {string|number} id - Expense ID
 * @param {CreateTaskRequest} expenseData - Updated expense data
 * @returns {Promise<Task>} Updated expense object
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function updateExpense(id: string | number, expenseData: CreateTaskRequest): Promise<Task> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({ id }, "ExpenseService: Token not found for updateExpense");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "ExpenseService: Updating expense");

    const response = await fetch(`${API_URL}/despesas/${id}`, {
      method: "PUT",
      headers: getJsonHeaders(token),
      body: JSON.stringify(expenseData)
    });

    const data: ApiResponse<Task> = await response.json();

    if (!data.success) {
      logger.warn({ id }, `ExpenseService: updateExpense failed - ${data.message}`);
      throw new Error(data.message || "Error updating expense");
    }

    logger.info({ id }, "ExpenseService: Expense updated successfully");

    return data.data as Task;
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "ExpenseService: Error updating expense");
    throw error;
  }
}

/**
 * Delete expense
 * 
 * @async
 * @param {string|number} id - Expense ID
 * @returns {Promise<void>}
 * @throws {Error} If not authenticated, not found, or API error
 */
export async function deleteExpense(id: string | number): Promise<void> {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({ id }, "ExpenseService: Token not found for deleteExpense");
      throw new Error("Token not found");
    }

    logger.debug({ id }, "ExpenseService: Deleting expense");

    const response = await fetch(`${API_URL}/despesas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token)
    });

    const data: ApiResponse<unknown> = await response.json();

    if (!data.success) {
      logger.warn({ id }, `ExpenseService: deleteExpense failed - ${data.message}`);
      throw new Error(data.message || "Error deleting expense");
    }

    logger.info({ id }, "ExpenseService: Expense deleted successfully");
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, "ExpenseService: Error deleting expense");
    throw error;
  }
}
