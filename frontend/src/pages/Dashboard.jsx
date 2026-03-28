// frontend/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";

function Dashboard() {
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/");
          return;
        }

        const usuario = await getMe();
        setNome(usuario.nome);
      } catch (error) {
        setErro(error.message);
        localStorage.removeItem("token");
        navigate("/");
      }
    }

    carregarUsuario();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Dashboard</h1>
        {erro ? <p>{erro}</p> : <p>Bem-vindo, {nome}</p>}
      </div>
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
    background: "#fff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
  }
};

export default Dashboard;