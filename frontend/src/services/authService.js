// Authentication Service
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// User login with email and password
export async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login error");
  }

  // Store JWT token
  localStorage.setItem("token", data.token);

  return data.user;
}

// Register new user
export async function register(name, email, cpf, phone, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, cpf, phone, password })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration error");
  }

  // Store JWT token
  localStorage.setItem("token", data.token);

  return data.user;
}

// User logout
export async function logout() {
  const token = localStorage.getItem("token");

  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Logout error:", error);
  }

  // Remove JWT token
  localStorage.removeItem("token");
}

// Get authenticated user data
export async function getMe() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not found");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error fetching user data");
  }

  return data.user;
}

// Check if user is authenticated
export async function checkAuth() {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}/auth/check`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    return data.authenticated;
  } catch (error) {
    return false;
  }
}