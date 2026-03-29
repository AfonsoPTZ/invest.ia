// Authentication Service
import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// User login with email and password
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

    // Store JWT token
    localStorage.setItem("token", data.token);

    logger.info({ email }, "AuthService: User logged in successfully");

    return data.user;
  } catch (error) {
    logger.error({ email, error: error.message }, "AuthService: Error on login");
    throw error;
  }
}

// Register new user
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

// User logout
export async function logout() {
  const token = localStorage.getItem("token");

  try {
    logger.info({}, "AuthService: User attempting logout");

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    logger.info({}, "AuthService: User logged out successfully");
  } catch (error) {
    logger.error({ error: error.message }, "AuthService: Error on logout");
  }

  // Remove JWT token
  localStorage.removeItem("token");
}

// Get authenticated user data
export async function getMe() {
  const token = localStorage.getItem("token");

  try {
    if (!token) {
      logger.warn({}, "AuthService: Token not found for getMe");
      throw new Error("Token not found");
    }

    logger.debug({}, "AuthService: Fetching authenticated user data");

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      logger.warn({}, `AuthService: getMe failed - ${data.message}`);
      throw new Error(data.message || "Error fetching user data");
    }

    logger.info({ userId: data.user?.id }, "AuthService: User data fetched successfully");

    return data.user;
  } catch (error) {
    logger.error({ error: error.message }, "AuthService: Error fetching user data");
    throw error;
  }
}

// Check if user is authenticated
export async function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    logger.debug({}, "AuthService: No token found");
    return false;
  }

  try {
    logger.debug({}, "AuthService: Checking authentication status");

    const response = await fetch(`${API_URL}/auth/check`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.authenticated) {
      logger.debug({}, "AuthService: User is authenticated");
    } else {
      logger.warn({}, "AuthService: User is not authenticated");
    }

    return data.authenticated;
  } catch (error) {
    logger.error({ error: error.message }, "AuthService: Error checking authentication");
    return false;
  }
}