// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const usuario = await login(email, senha);

      // Sessão é armazenada automaticamente (credentials: include)
      // Não precisa armazenar em localStorage
      
      navigate("/dashboard");
    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h1>Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          autoComplete="email"
          required
        />

        <input
          type="password"
          name="senha"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={styles.input}
          autoComplete="current-password"
          required
        />

        {erro && <p style={styles.error}>{erro}</p>}

        <button type="submit" style={styles.button}>
          Entrar
        </button>

        <p style={styles.cadastro}>
          Não tem conta? <a href="/register" style={styles.link}>Cadastre-se</a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  error: {
    color: "red",
    margin: 0
  },
  cadastro: {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "14px",
    color: "#666"
  },
  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Login;