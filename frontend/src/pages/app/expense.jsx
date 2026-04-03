import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCar, FaUtensils, FaMoneyBill, FaTag } from "react-icons/fa";
import { motion } from "motion/react";
import ICON_SIZES from "../../constants/iconSizes";
import { logout } from "../../services/authService";
import { useAuthUser } from "../../utils/useAuthUser";
import Button from "../../components/button";
import AnimatedCard from "../../components/animatedcard";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import PageTransition from "../../components/pagetransition";
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
  const { user } = useAuthUser();

  const handleLogoutClick = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <PageTransition>
      <div className="app-layout">
        <Navbar userEmail={user?.email} onLogout={handleLogoutClick} />
        
        <main className="app-content">
          <div className="app-container">
            {/* Hero Section */}
            <motion.div 
              className="dashboard-hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="hero-content">
                <h1 className="hero-title">Smart Spending <FaTag size={ICON_SIZES.lg} className="hero-icon" /></h1>
                <p className="hero-subtitle text-center">
                  Monitor your spending and optimize your budget for better financial health
                </p>
              </div>
            </motion.div>

            {/* Placeholder Content */}
            <motion.div 
              className="stats-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.25 }}
            >
            <div className="section-header">
              <h2 className="section-title">Expense Breakdown</h2>
              <p className="section-description">Analyze your spending by category</p>
            </div>

              <div className="stats-grid">
                <AnimatedCard delay={0} className="stat-card">
                  <div className="stat-icon"><FaShoppingCart size={ICON_SIZES.md} /></div>
                  <p className="stat-label">Retail</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Shopping expenses</p>
                </AnimatedCard>

                <AnimatedCard delay={0.1} className="stat-card">
                  <div className="stat-icon"><FaCar size={ICON_SIZES.md} /></div>
                  <p className="stat-label">Transportation</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Travel expenses</p>
                </AnimatedCard>

                <AnimatedCard delay={0.2} className="stat-card">
                  <div className="stat-icon"><FaUtensils size={ICON_SIZES.md} /></div>
                  <p className="stat-label">Dining & Food</p>
                  <p className="stat-value">$0.00</p>
                  <p className="stat-meta">Food & restaurants</p>
                </AnimatedCard>

                <AnimatedCard delay={0.3} className="stat-card">
                  <div className="stat-icon"><FaMoneyBill size={ICON_SIZES.md} /></div>
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
