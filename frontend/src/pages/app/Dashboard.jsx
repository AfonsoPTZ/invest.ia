import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaChartLine, FaCreditCard, FaHome, FaFire } from "react-icons/fa";
import { motion } from "motion/react";
import { logout } from "../../services/authService";
import { getDashboardName, getDashboardData } from "../../services/dashboardService";
import { useIntersectionAnimation } from "../../utils/useAnimations";
import Card from "../../components/Card";
import Alert from "../../components/Alert";
import AnimatedCard from "../../components/AnimatedCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
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
      <PageTransition>
        <div className="loader-container">
          <motion.div 
            className="loader-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading...
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="app-layout">
        <Navbar userEmail={user?.email} onLogout={handleLogoutClick} />
        
        <main className="app-content">
          <div className="app-container">
            {error ? (
              <Alert type="error">{error}</Alert>
            ) : (
              <>
                {/* Hero Section */}
                <motion.div 
                  className="dashboard-hero"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="hero-content">
                    <h1 className="hero-title">
                      Welcome back, <span className="user-name">{user?.name}</span>! 
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        style={{ display: 'inline-block', marginLeft: '8px' }}
                      >
                        <FaFire className="hero-icon" />
                      </motion.span>
                    </h1>
                    <p className="hero-subtitle">
                      Here's an overview of your financial profile and investment opportunities.
                    </p>
                  </div>
                </motion.div>

                {/* Stats Overview Section */}
                <motion.div 
                  className="stats-section"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="section-header">
                    <h2 className="section-title">Financial Overview</h2>
                    <p className="section-description">Your current financial snapshot</p>
                  </div>

                  <div className="stats-grid">
                    {/* Current Balance - Card 0 */}
                    <AnimatedCard delay={0} className="stat-card">
                      <div className="stat-icon"><FaWallet /></div>
                      <p className="stat-label">Current Balance</p>
                      <p className="stat-value">
                        ${dashboardData?.financialProfile?.initial_balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <p className="stat-meta">Available funds</p>
                    </AnimatedCard>

                    {/* Monthly Income - Card 1 */}
                    <AnimatedCard delay={0.1} className="stat-card">
                      <div className="stat-icon"><FaChartLine /></div>
                      <p className="stat-label">Monthly Income</p>
                      <p className="stat-value">
                        ${dashboardData?.financialProfile?.monthly_income?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
                      </p>
                      <p className="stat-meta">Fixed monthly income</p>
                    </AnimatedCard>

                    {/* Total Expenses - Card 2 */}
                    <AnimatedCard delay={0.2} className="stat-card">
                      <div className="stat-icon"><FaCreditCard /></div>
                      <p className="stat-label">Total Expenses</p>
                      <p className="stat-value">$0.00</p>
                      <p className="stat-meta">Tracked spending</p>
                    </AnimatedCard>

                    {/* Total Assets - Card 3 */}
                    <AnimatedCard delay={0.3} className="stat-card">
                      <div className="stat-icon"><FaHome /></div>
                      <p className="stat-label">Total Assets</p>
                      <p className="stat-value">$0.00</p>
                      <p className="stat-meta">Property and valuables</p>
                    </AnimatedCard>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </main>

        <Footer />

        {/* Panda Mascot - Dashboard background accent */}
        <motion.div 
          className="dashboard-panda-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <img 
            src="/panda-investments-bottom.png" 
            alt="Invest_IA Mascot"
            className="dashboard-panda-image"
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>
      </div>
    </PageTransition>
  );
}

export default Dashboard;
