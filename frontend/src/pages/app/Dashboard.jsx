import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe, logout } from "../../services/authService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import Navbar from "../../components/Navbar";
import "../../styles/app.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        const userData = await getMe();
        setUser(userData);
      } catch (catchError) {
        setError(catchError.message);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [navigate]);

  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Navbar userEmail={user?.email} onLogout={handleLogoutClick} />
      
      <main className="app-content">
        <div className="app-container">
          {error ? (
            <Alert type="error">{error}</Alert>
          ) : (
            <>
              {/* Welcome Card */}
              <Card className="mb-8">
                <h1 className="dashboard-title">
                  Welcome, {user?.name}! 👋
                </h1>
                <p className="dashboard-subtitle">
                  Track your investments and finances in one place.
                </p>
              </Card>

              {/* Quick Stats Grid */}
              <div className="stats-grid">
                {/* Total Balance */}
                <Card className="stat-card">
                  <p className="stat-label">Total Balance</p>
                  <p className="stat-value">$0.00</p>
                </Card>

                {/* Investments */}
                <Card className="stat-card">
                  <p className="stat-label">Investments</p>
                  <p className="stat-value">$0.00</p>
                </Card>

                {/* Monthly Expenses */}
                <Card className="stat-card">
                  <p className="stat-label">Expenses (Month)</p>
                  <p className="stat-value">$0.00</p>
                </Card>

                {/* Assets */}
                <Card className="stat-card">
                  <p className="stat-label">Assets</p>
                  <p className="stat-value">$0.00</p>
                </Card>
              </div>

              {/* Navigation Cards */}
              <div className="nav-cards">
                <Card className="nav-card">
                  <h3 className="nav-card-title">Expenses</h3>
                  <p className="nav-card-text">Manage your expenses</p>
                  <Button type="primary">Access</Button>
                </Card>

                <Card className="nav-card">
                  <h3 className="nav-card-title">Investments</h3>
                  <p className="nav-card-text">Track your investments</p>
                  <Button type="primary">Access</Button>
                </Card>

                <Card className="nav-card">
                  <h3 className="nav-card-title">Assets</h3>
                  <p className="nav-card-text">View your assets</p>
                  <Button type="primary">Access</Button>
                </Card>

                <Card className="nav-card">
                  <h3 className="nav-card-title">Income</h3>
                  <p className="nav-card-text">Control your income</p>
                  <Button type="primary">Access</Button>
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
