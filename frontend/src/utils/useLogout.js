import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService.ts';

/**
 * Custom hook for logout functionality
 * 
 * Handles:
 * - Calling logout service
 * - Clearing localStorage token
 * - Redirecting to login page
 * 
 * Usage:
 *   const handleLogout = useLogout();
 *   <Button onClick={handleLogout}>Sign Out</Button>
 * 
 * @returns {Function} Logout handler
 */
export function useLogout() {
  const navigate = useNavigate();

  return () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };
}
