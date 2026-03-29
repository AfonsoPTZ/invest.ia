import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { getDashboardName, getDashboardData } from "../../services/dashboardService";
import { useIntersectionAnimation } from "../../utils/useAnimations";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import Navbar from "../../components/Navbar";
import "../../styles/app.css";

/**
 * Dashboard Page
 * 
 * Main application page after user authentication
 * Displays user information and financial overview
 * 
 * Flow:
 * 1. On mount, checks if user has JWT token in localStorage
 * 2. If no token, redirects to login
 * 3. Fetches user name and dashboard data (user + financial profile)
 * 4. Displays welcome card and financial stats
 * 5. Provides navigation to other features (expenses, investments, etc)
 * 
 * @component
 */
function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Load user and dashboard data on component mount
   * Verifies authentication token before fetching data
   */
  useEffect(() => {
    async function loadUserData() {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user name
        const nameData = await getDashboardName();
        setUser(nameData);

        // Fetch dashboard data (user + financial profile)
        const dashboard = await getDashboardData();
        setDashboardData(dashboard);
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

  /**
   * Apply entrance animations to dashboard elements when they appear in viewport
   */
  useIntersectionAnimation('.stat-card-wrapper', 'animate-slide-up');
  useIntersectionAnimation('.nav-card', 'animate-slide-up');

  /**
   * Handle logout action
   * Clears local storage token and redirects to login
   */
  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Loading state
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
              {/* Hero Section */}
              <div className="dashboard-hero">
                <div className="hero-content">
                  <h1 className="hero-title">Welcome back, {user?.name}! 👋</h1>
                  <p className="hero-subtitle">
                    Here's an overview of your financial profile and investment opportunities.
                  </p>
                </div>
              </div>

              {/* Stats Overview Section */}
              <div className="stats-section">
                <div className="section-header">
                  <h2 className="section-title">Financial Overview</h2>
                  <p className="section-description">Your current financial snapshot</p>
                </div>

                <div className="stats-grid">
                  {/* Total Balance */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon balance">💰</div>
                      <p className="stat-label">Total Balance</p>
                      <p className="stat-value">
                        ${dashboardData?.financialProfile?.initial_balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <p className="stat-meta">Your total savings</p>
                    </Card>
                  </div>

                  {/* Monthly Income */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon income">📈</div>
                      <p className="stat-label">Monthly Income</p>
                      <p className="stat-value">
                        ${dashboardData?.financialProfile?.monthly_income?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <p className="stat-meta">Income per month</p>
                    </Card>
                  </div>

                  {/* Monthly Expenses */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon expenses">💳</div>
                      <p className="stat-label">Monthly Expenses</p>
                      <p className="stat-value">$0.00</p>
                      <p className="stat-meta">Tracked spending</p>
                    </Card>
                  </div>

                  {/* Assets */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon assets">🏠</div>
                      <p className="stat-label">Assets</p>
                      <p className="stat-value">$0.00</p>
                      <p className="stat-meta">Real estate & items</p>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Main Actions Section */}
              <div className="actions-section">
                <div className="section-header">
                  <h2 className="section-title">Quick Actions</h2>
                  <p className="section-description">Access your financial management tools</p>
                </div>

                <div className="nav-cards">
                  <Card className="nav-card">
                    <div className="nav-card-icon">💸</div>
                    <h3 className="nav-card-title">Expenses</h3>
                    <p className="nav-card-text">Track and manage your spending</p>
                    <Button type="primary" className="nav-card-btn">View Expenses</Button>
                  </Card>

                  <Card className="nav-card">
                    <div className="nav-card-icon">📊</div>
                    <h3 className="nav-card-title">Investments</h3>
                    <p className="nav-card-text">Monitor your investment portfolio</p>
                    <Button type="primary" className="nav-card-btn">View Investments</Button>
                  </Card>

                  <Card className="nav-card">
                    <div className="nav-card-icon">🏦</div>
                    <h3 className="nav-card-title">Assets</h3>
                    <p className="nav-card-text">Manage your valuable assets</p>
                    <Button type="primary" className="nav-card-btn">View Assets</Button>
                  </Card>

                  <Card className="nav-card">
                    <div className="nav-card-icon">💹</div>
                    <h3 className="nav-card-title">Income</h3>
                    <p className="nav-card-text">Control your income streams</p>
                    <Button type="primary" className="nav-card-btn">View Income</Button>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Panda Mascot - Dashboard background accent */}
      {/* Add panda-investments-bottom.png to public folder */}
      <div className="dashboard-panda-wrapper">
        <img 
          src="/panda-investments-bottom.png" 
          alt="Invest_IA Mascot"
          className="dashboard-panda-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>
    </div>
  );
}

export default Dashboard;
