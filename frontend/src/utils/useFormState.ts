/**
 * useFormState Hook
 *
 * Centralizes repeated form state pattern used across authentication pages:
 * Login, Register, VerifyOtp, FinancialProfile
 *
 * Encapsulates:
 * - error message state
 * - success message state
 * - field-level error mapping
 * - loading state during async operations
 * - combined clear/reset utilities
 *
 * Usage:
 *   const { error, success, fieldErrors, isLoading, setError, setSuccess, clearErrors } = useFormState();
 *
 * @returns {Object} Form state and state setters
 */

import { useState } from "react";

type FieldErrorMap = Record<string, string>;

interface FormState {
  error: string;
  setError: (msg: string) => void;
  success: string;
  setSuccess: (msg: string) => void;
  fieldErrors: FieldErrorMap;
  setFieldErrors: (errors: FieldErrorMap) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearErrors: () => void;
  clearMessages: () => void;
}

export function useFormState(): FormState {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Clear all error states (error + fieldErrors)
   * Useful before form submission to reset validation errors
   */
  const clearErrors = () => {
    setError("");
    setFieldErrors({});
  };

  /**
   * Clear both error and success messages
   * Useful when user starts editing after feedback
   */
  const clearMessages = () => {
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  return {
    error,
    setError,
    success,
    setSuccess,
    fieldErrors,
    setFieldErrors,
    isLoading,
    setIsLoading,
    clearErrors,
    clearMessages
  };
}

export type { FieldErrorMap };
