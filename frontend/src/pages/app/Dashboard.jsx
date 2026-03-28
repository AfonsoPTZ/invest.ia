import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "../../services/authService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import Navbar from "../../components/Navbar";
import "../../styles/app.css";

function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        const data = await getMe();
        setUsuario(data);
      } catch (error) {
        setErro(error.message);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setCarregando(false);
      }
    }

    carregarUsuario();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (carregando) {
    return (
      <div className="loader-container">
        <div className="loader-text">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar userEmail={usuario?.email} onLogout={handleLogout} />
      
      <main className="app-content">
        <div className="app-container">
          {erro ? (
            <Alert type="error">{erro}</Alert>
          ) : (
            <>
              {/* Welcome Card */}
              <Card className="mb-8">
                <h1 className="dashboard-title">
                  Bem-vindo, {usuario?.nome}! 👋
                </h1>
                <p className="dashboard-subtitle">
                  Acompanhe seus investimentos e finanças em um só lugar.
                </p>
              </Card>

              {/* Quick Stats Grid */}
              <div className="stats-grid">
                {/* Saldo Total */}
                <Card className="stat-card">
                  <p className="stat-label">Saldo Total</p>
                  <p className="stat-value">R$ 0,00</p>
                </Card>

                {/* Investimentos */}
                <Card className="stat-card">
                  <p className="stat-label">Investimentos</p>
                  <p className="stat-value">R$ 0,00</p>
                </Card>

                {/* Despesas Mês */}
                <Card className="stat-card">
                  <p className="stat-label">Despesas (Mês)</p>
                  <p className="stat-value">R$ 0,00</p>
                </Card>

                {/* Patrimônio */}
                <Card className="stat-card">
                  <p className="stat-label">Patrimônio</p>
                  <p className="stat-value">R$ 0,00</p>
                </Card>
              </div>

              {/* Navigation Cards */}
              <div className="nav-cards">
                <Card className="nav-card">
                  <h3 className="nav-card-title">Despesas</h3>
                  <p className="nav-card-text">Gerencie suas despesas</p>
                  <Button type="primary">Acessar</Button>
                </Card>

                <Card className="nav-card">
                  <h3 className="nav-card-title">Investimentos</h3>
                  <p className="nav-card-text">Acompanhe seus investimentos</p>
                  <Button type="primary">Acessar</Button>
                </Card>

                <Card className="nav-card">
                  <h3 className="nav-card-title">Patrimônio</h3>
                  <p className="nav-card-text">Visualize seu patrimônio</p>
                  <Button type="primary">Acessar</Button>
                </Card>

                <Card className="nav-card">
                  <h3 className="nav-card-title">Ganhos</h3>
                  <p className="nav-card-text">Controle seus ganhos</p>
                  <Button type="primary">Acessar</Button>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
