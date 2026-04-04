import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaCar, FaUtensils, FaMoneyBill, FaTag } from "react-icons/fa";
import ICON_SIZES from "../../constants/iconSizes";
import { useAuthUser } from "../../utils/useAuthUser";
import { useLogout } from "../../utils/useLogout";
import DashboardPageTemplate from "../../components/DashboardPageTemplate";

/**
 * Expense Page
 * 
 * Displays user expenses tracking and management
 * Part of the main 4-section dashboard
 * 
 * Uses DashboardPageTemplate for consistent structure and reduced duplication
 * 
 * @component
 */
function Expense() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const handleLogout = useLogout();

  const stats = [
    { 
      icon: <FaShoppingCart size={ICON_SIZES.md} />, 
      label: 'Retail', 
      value: '$0.00', 
      meta: 'Shopping expenses' 
    },
    { 
      icon: <FaCar size={ICON_SIZES.md} />, 
      label: 'Transportation', 
      value: '$0.00', 
      meta: 'Travel expenses' 
    },
    { 
      icon: <FaUtensils size={ICON_SIZES.md} />, 
      label: 'Dining & Food', 
      value: '$0.00', 
      meta: 'Food & restaurants' 
    },
    { 
      icon: <FaMoneyBill size={ICON_SIZES.md} />, 
      label: 'Total Monthly', 
      value: '$0.00', 
      meta: 'All expenses combined' 
    }
  ];

  return (
    <DashboardPageTemplate
      title="Smart Spending"
      subtitle="Monitor your spending and optimize your budget for better financial health"
      icon={<FaTag size={ICON_SIZES.lg} className="hero-icon" />}
      stats={stats}
      userEmail={user?.email}
      onLogout={handleLogout}
      onBackClick={() => navigate('/dashboard')}
    />
  );
}

export default Expense;
