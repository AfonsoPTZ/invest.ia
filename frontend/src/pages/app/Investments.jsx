import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaChartLine, FaBullseye, FaBalanceScale, FaArrowUp } from "react-icons/fa";
import ICON_SIZES from "../../constants/iconSizes";
import { useAuthUser } from "../../utils/useAuthUser";
import { useLogout } from "../../utils/useLogout";
import DashboardPageTemplate from "../../components/DashboardPageTemplate";

/**
 * Investments Page
 * 
 * Displays user investment portfolio and management tools
 * Part of the main 4-section dashboard
 * 
 * Uses DashboardPageTemplate for consistent structure and reduced duplication
 * 
 * @component
 */
function Investments() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const handleLogout = useLogout();

  const stats = [
    { 
      icon: <FaBriefcase size={ICON_SIZES.md} />, 
      label: 'Portfolio Value', 
      value: '$0.00', 
      meta: 'Total invested amount' 
    },
    { 
      icon: <FaArrowUp size={ICON_SIZES.md} />, 
      label: 'ROI Performance', 
      value: '0%', 
      meta: 'Return on investment' 
    },
    { 
      icon: <FaBullseye size={ICON_SIZES.md} />, 
      label: 'Active Positions', 
      value: '0', 
      meta: 'Currently investing in' 
    },
    { 
      icon: <FaBalanceScale size={ICON_SIZES.md} />, 
      label: 'Risk Profile', 
      value: '—', 
      meta: 'Portfolio risk level' 
    }
  ];

  return (
    <DashboardPageTemplate
      title="Growth Opportunities"
      subtitle="Explore and manage your investment portfolio with detailed insights"
      icon={<FaChartLine size={ICON_SIZES.lg} className="hero-icon" />}
      stats={stats}
      userEmail={user?.email}
      onLogout={handleLogout}
      onBackClick={() => navigate('/dashboard')}
    />
  );
}

export default Investments;
