// frontend/src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Faz login do usuário
 */
export async function login(email, senha) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, senha })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao fazer login");
  }

  // Armazena o token
  localStorage.setItem("token", data.token);

  return data.usuario;
}

/**
 * Registra novo usuário
 */
export async function register(nome, email, cpf, telefone, senha) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome, email, cpf, telefone, senha })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao registrar");
  }

  // Armazena o token
  localStorage.setItem("token", data.token);

  return data.usuario;
}

/**
 * Faz logout do usuário
 */
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
    console.error("Erro ao fazer logout:", error);
  }

  // Remove o token do localStorage
  localStorage.removeItem("token");
}

/**
 * Busca dados do usuário autenticado
 */
export async function getMe() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.mensagem || "Erro ao buscar dados");
  }

  return data.usuario;
}

/**
 * Verifica se usuário está autenticado
 */
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
    return data.autenticado;
  } catch (error) {
    return false;
  }
}