import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine, FaCreditCard, FaHome, FaFire } from "react-icons/fa";
import { logout } from "../../services/authService";
import { getDashboardName, getDashboardData } from "../../services/dashboardService";
import { useIntersectionAnimation } from "../../utils/useAnimations";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/app.css";

/**
 * Dashboard Page
 * 
 * Main application page after user authentication
 * Displays user financial summary and profile overview
 * 
 * Flow:
 * 1. On mount, checks if user has JWT token in localStorage
 * 2. If no token, redirects to login
 * 3. Fetches user name and dashboard data (user + financial profile)
 * 4. Displays financial overview cards (Current Balance, Monthly Income, etc)
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
                  <h1 className="hero-title">Welcome back, <span className="user-name">{user?.name}</span>! <FaFire className="hero-icon" /></h1>
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
                  {/* Current Balance */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon"><FaWallet /></div>
                      <p className="stat-label">Current Balance</p>
                      <p className="stat-value">
                        ${dashboardData?.financialProfile?.initial_balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <p className="stat-meta">Available funds</p>
                    </Card>
                  </div>

                  {/* Monthly Income */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon"><FaChartLine /></div>
                      <p className="stat-label">Monthly Income</p>
                      <p className="stat-value">
                        ${dashboardData?.financialProfile?.monthly_income?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <p className="stat-meta">Fixed monthly income</p>
                    </Card>
                  </div>

                  {/* Total Expenses */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon"><FaCreditCard /></div>
                      <p className="stat-label">Total Expenses</p>
                      <p className="stat-value">$0.00</p>
                      <p className="stat-meta">Tracked spending</p>
                    </Card>
                  </div>

                  {/* Total Assets */}
                  <div className="stat-card-wrapper">
                    <Card className="stat-card">
                      <div className="stat-icon"><FaHome /></div>
                      <p className="stat-label">Total Assets</p>
                      <p className="stat-value">$0.00</p>
                      <p className="stat-meta">Property and valuables</p>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

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
