import { useNavigate } from "react-router-dom";
import { FaWallet, FaBuilding, FaGem, FaLock } from "react-icons/fa";
import ICON_SIZES from "../../constants/iconSizes";
import { useAuthUser } from "../../utils/useAuthUser";
import { useLogout } from "../../utils/useLogout";
import DashboardPageTemplate from "../../components/DashboardPageTemplate";

/**
 * Assets Page
 * 
 * Displays user assets and property management
 * Part of the main 4-section dashboard
 * 
 * Uses DashboardPageTemplate for consistent structure and reduced duplication
 * 
 * @component
 */
function Assets() {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const handleLogout = useLogout();

  const stats = [
    { 
      icon: <FaWallet size={ICON_SIZES.md} />, 
      label: 'Net Worth', 
      value: '$0.00', 
      meta: 'Total asset value' 
    },
    { 
      icon: <FaBuilding size={ICON_SIZES.md} />, 
      label: 'Real Estate', 
      value: '0', 
      meta: 'Properties owned' 
    },
    { 
      icon: <FaGem size={ICON_SIZES.md} />, 
      label: 'Collections', 
      value: '$0.00', 
      meta: 'Collectibles value' 
    },
    { 
      icon: <FaLock size={ICON_SIZES.md} />, 
      label: 'Protection', 
      value: '—', 
      meta: 'Insurance status' 
    }
  ];

  return (
    <DashboardPageTemplate
      title="Your Wealth"
      subtitle="Organize and protect your valuable assets with confidence"
      icon={<FaGem size={ICON_SIZES.lg} className="hero-icon" />}
      stats={stats}
      userEmail={user?.email}
      onLogout={handleLogout}
      onBackClick={() => navigate('/dashboard')}
    />
  );
}

export default Assets;
