import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaGift, FaChartBar, FaDollarSign, FaRocket } from "react-icons/fa";
import ICON_SIZES from "../../constants/iconSizes";
import { useAuthUser } from "../../utils/useAuthUser";
import { useLogout } from "../../utils/useLogout";
import DashboardPageTemplate from "../../components/DashboardPageTemplate";

/**
 * Income Page
 * 
 * Displays user income streams and management
 * Part of the main 4-section dashboard
 * 
 * Uses DashboardPageTemplate for consistent structure and reduced duplication
 * 
 * @component
 */
function Income() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const handleLogout = useLogout();

  const stats = [
    { 
      icon: <FaBriefcase size={ICON_SIZES.md} />, 
      label: 'Primary Income', 
      value: '$0.00', 
      meta: 'Main job salary' 
    },
    { 
      icon: <FaGift size={ICON_SIZES.md} />, 
      label: 'Bonuses & Rewards', 
      value: '$0.00', 
      meta: 'Extra earnings' 
    },
    { 
      icon: <FaChartBar size={ICON_SIZES.md} />, 
      label: 'Side Income', 
      value: '$0.00', 
      meta: 'Secondary sources' 
    },
    { 
      icon: <FaDollarSign size={ICON_SIZES.md} />, 
      label: 'Total Monthly', 
      value: '$0.00', 
      meta: 'All income combined' 
    }
  ];

  return (
    <DashboardPageTemplate
      title="Your Earnings"
      subtitle="Track all your income streams and maximize your earning potential"
      icon={<FaRocket size={ICON_SIZES.lg} className="hero-icon" />}
      stats={stats}
      userEmail={user?.email}
      onLogout={handleLogout}
      onBackClick={() => navigate('/dashboard')}
    />
  );
}

export default Income;
