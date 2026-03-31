import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCar, FaUtensils, FaMoneyBillWave, FaBullseye } from "react-icons/fa";
import { motion } from "motion/react";
import { logout } from "../../services/authService";
import Button from "../../components/Button";
import AnimatedCard from "../../components/AnimatedCard";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTransition from "../../components/PageTransition";
import "../../styles/app.css";

/**
 * Expense Page
 * 
 * Displays user expenses tracking and management
 * Part of the main 4-section dashboard
 * 
 * @component
 */
function Expense() {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <PageTransition>
      <div className="app-layout">
        <Navbar userEmail="user@example.com" onLogout={handleLogoutClick} />
        
        <main className="app-content">
          <div className="app-container">
            {/* Hero Section */}
            <motion.div 
              className="dashboard-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="hero-content">
                <h1 className="hero-title">Smart Spending <FaBullseye className="hero-icon" /></h1>
                <p className="hero-subtitle">
                  Monitor your spending and optimize your budget for better financial health
                </p>
              </div>
            </motion.div>

            {/* Placeholder Content */}
            <motion.div 
              className="stats-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
            <div className="section-header">
              <h2 className="section-title">Expense Breakdown 📉</h2>
              <p className="section-description">Analyze your spending by category</p>
            </div>

              <div className="stats-grid">
                <AnimatedCard delay={0} className="stat-card">
                  <div className="stat-icon"><FaShoppingCart /></div>
                  <p className="stat-label">Retail</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Shopping expenses</p>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="stat-card">
                  <div className="stat-icon"><FaCar /></div>
                  <p className="stat-label">Transportation</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Travel expenses</p>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="stat-card">
                  <div className="stat-icon"><FaUtensils /></div>
                  <p className="stat-label">Dining & Food</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Food & restaurants</p>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="stat-card">
                  <div className="stat-icon"><FaMoneyBillWave /></div>
                  <p className="stat-label">Total Monthly</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">All expenses combined</p>
                </AnimatedCard>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div 
              style={{ marginTop: '40px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button type="secondary" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
            </motion.div>
          </div>
        </main>

        <Footer />

        {/* Panda Mascot */}
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

export default Expense;
