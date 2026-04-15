/**
 * API Type Definitions
 * 
 * Comprehensive TypeScript interfaces for all frontend-backend API interactions.
 * Provides full type safety and IDE autocomplete for API operations.
 * 
 * Organized by domain:
 * - Auth: Login, Register, OTP verification, token management
 * - Dashboard: User profile, financial summaries
 * - Financial Profile: Investment preferences, financial goals
 * - Common: Shared types, enums, utility types
 */

import React from 'react';

/**
 * ==================== COMMON TYPES ====================
 */

/** Standard API response wrapper for all endpoints */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode: number;
}

/** Standard error response from API */
export interface ApiErrorResponse {
  success: false;
  message: string;
  data?: null;
  statusCode: number;
}

/** Type guard to check if response is successful */
export const isApiSuccess = <T>(data: any): data is ApiResponse<T> => {
  return (
    typeof data === 'object' &&
    'success' in data &&
    data.success === true &&
    'message' in data &&
    'statusCode' in data
  );
};

/** Type guard to check if response is an error */
export const isApiError = (data: any): data is ApiErrorResponse => {
  return (
    typeof data === 'object' &&
    'success' in data &&
    data.success === false &&
    'message' in data &&
    'statusCode' in data
  );
};

/**
 * ==================== AUTH DOMAIN ====================
 */

/** Login request payload */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Login response with user data and token */
export interface LoginResponse {
  id: string | number;
  name: string;
  email: string;
  token: string;
}

/** Register request payload */
export interface RegisterRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  password: string;
}

/** Register response */
export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string | number;
  redirectTo?: string;
}

/** OTP verification request */
export interface VerifyOtpRequest {
  userId?: string | number;
  email?: string;
  otp?: string;
  otpCode?: string;
}

/** OTP verification response with temporary token for profile setup */
export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  tempProfileToken?: string;
  userId?: string | number;
  email?: string;
}

/** Email verification response */
export interface EmailVerificationResponse {
  success: boolean;
  message: string;
  registerToken?: string;
  profileToken?: string;
  redirectTo?: string;
}

/** Authentication state in application */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  tempProfileToken?: string | null;
  error?: string | null;
}

/**
 * ==================== DASHBOARD DOMAIN ====================
 */

/** User object from dashboard */
export interface User {
  id: string | number;
  name: string;
  email: string;
  cpf?: string;
  phone?: string;
  emailVerificado?: boolean;
}

/** Dashboard response with user and profile data */
export interface DashboardResponse {
  user?: User;
  financialProfile?: FinancialProfile;
}

/** Dashboard name response (lightweight endpoint) */
export interface DashboardNameResponse {
  id: string | number;
  name: string;
  email: string;
}

/**
 * ==================== FINANCIAL PROFILE DOMAIN ====================
 */

/** Financial profile creation/update request */
export interface FinancialProfileRequest {
  monthly_income: number | string;
  initial_balance: number | string;
  has_investments: boolean | string;
  has_assets: boolean | string;
  financial_goal: string;
  behavior_profile: 'conservative' | 'moderate' | 'aggressive' | string;
}

/** Financial profile response data */
export interface FinancialProfile {
  id?: string | number;
  userId?: string | number;
  monthly_income: number | string;
  initial_balance: number | string;
  has_investments: boolean | string;
  has_assets: boolean | string;
  financial_goal: string;
  behavior_profile: string;
  created_at?: string;
  updated_at?: string;
}

/** Financial profile creation response */
export interface FinancialProfileResponse {
  success: boolean;
  message: string;
  userId?: string | number;
  profileId?: string | number;
  data?: FinancialProfile;
}

/**
 * ==================== INVESTMENT DOMAIN ====================
 */

/** Investment/Asset creation request */
export interface CreateInvestmentRequest {
  name: string;
  type: string;
  value: number | string;
  purchase_date: string;
  description?: string;
}

/** Investment/Asset response */
export interface Investment {
  id: string | number;
  userId: string | number;
  name: string;
  type: string;
  value: number;
  purchase_date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * ==================== TASK/EXPENSE DOMAIN ====================
 */

/** Task/Expense request payload */
export interface CreateTaskRequest {
  title: string;
  description?: string;
  category?: string;
  amount?: number | string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
}

/** Task/Expense response */
export interface Task {
  id: string | number;
  userId: string | number;
  title: string;
  description?: string;
  category?: string;
  amount?: number;
  dueDate?: string;
  priority?: string;
  status?: 'pending' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

/**
 * ==================== SERVICE RESPONSE TYPES ====================
 */

/** Generic list response */
export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  total?: number;
  page?: number;
  pageSize?: number;
}

/** Generic single item response */
export interface ItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Delete operation response */
export interface DeleteResponse {
  success: boolean;
  message: string;
  deletedId?: string | number;
}

/**
 * ==================== UTILITY TYPES ====================
 */

/** API request options */
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  token?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
}

/** Storage keys for authentication */
export enum StorageKeys {
  TOKEN = 'token',
  USER = 'user',
  TEMP_PROFILE_TOKEN = 'tempProfileToken',
  TEMP_EMAIL = 'tempEmail'
}

/** Financial behavior profiles */
export enum BehaviorProfile {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive'
}

/** Investment types */
export enum InvestmentType {
  STOCKS = 'stocks',
  BONDS = 'bonds',
  FUNDS = 'funds',
  REAL_ESTATE = 'real_estate',
  CRYPTOCURRENCY = 'cryptocurrency',
  OTHER = 'other'
}

/** Financial goals */
export enum FinancialGoal {
  RETIREMENT = 'retirement',
  HOME = 'home',
  EDUCATION = 'education',
  TRAVEL = 'travel',
  SAVINGS = 'savings',
  WEALTH_BUILD = 'wealth_building',
  OTHER = 'other'
}

/**
 * ==================== COMPONENT PROPS ====================
 */

/** Statistical card data for dashboard displays */
export interface StatCard {
  id: string;
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number | string;
}

/** Dashboard page template props (shared by multiple pages) */
export interface DashboardPageTemplateProps {
  /** Page heading */
  title: string;
  /** Subheading or description */
  subtitle?: string;
  /** Icon/visual element for page header */
  icon?: React.ReactNode;
  /** Statistics cards to display */
  stats?: StatCard[];
  /** User email for navbar */
  userEmail: string;
  /** Callback for logout action */
  onLogout: () => void;
  /** Optional callback for back button */
  onBackClick?: () => void;
  /** Child content to render */
  children?: React.ReactNode;
  /** Custom class name */
  className?: string;
  /** Whether to show header */
  showHeader?: boolean;
}

/** Reusable button component props */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Button style variant */
  type?: 'primary' | 'secondary' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show loading spinner */
  isLoading?: boolean;
  /** Button content */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
}

/** Form input component props */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Custom class name */
  className?: string;
  /** Icon element */
  icon?: React.ReactNode;
}

/** Alert/notification component props */
export interface AlertProps {
  /** Alert type */
  type: 'error' | 'success' | 'info' | 'warning';
  /** Alert content */
  children: React.ReactNode;
  /** Callback when alert is closed */
  onClose?: () => void;
  /** Custom class name */
  className?: string;
  /** Auto-hide duration in milliseconds */
  autoHideDuration?: number;
}

/**
 * ==================== FORM STATE TYPES ====================
 */

/** Field-level error mapping */
export type FieldErrorMap = Record<string, string>;

/** Financial profile form data shape */
export interface FinancialProfileFormData {
  monthly_income: string;
  has_monthly_income: boolean;
  initial_balance: string;
  has_initial_balance: boolean;
  has_investments: boolean;
  has_assets: boolean;
  financial_goal: string;
  behavior_profile: 'conservative' | 'moderate' | 'aggressive';
}

/** Generic form state for auth pages */
export interface FormState {
  error: string;
  success: string;
  fieldErrors: FieldErrorMap;
  isLoading: boolean;
}

/**
 * Type guards for runtime checking
 */

export const isLoginResponse = (data: any): data is LoginResponse => {
  return (
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'email' in data &&
    'token' in data
  );
};

export const isUser = (data: any): data is User => {
  return (
    typeof data === 'object' &&
    'id' in data &&
    'name' in data &&
    'email' in data
  );
};

export const isFinancialProfile = (data: any): data is FinancialProfile => {
  return (
    typeof data === 'object' &&
    'monthly_income' in data &&
    'initial_balance' in data &&
    'behavior_profile' in data
  );
};
