import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardName } from '../services/dashboardService';
import logger from './logger';

/**
 * Custom hook for fetching authenticated user data
 * 
 * Handles:
 * - Token validation from localStorage
 * - API call to fetch user info
 * - Redirect to login if unauthorized
 * - Loading and error states
 * 
 * @returns {Object} { user, loading, error }
 *   - user: { name, email, ... } or null
 *   - loading: boolean indicating fetch state
 *   - error: error message or empty string
 */
export function useAuthUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const token = localStorage.getItem('token');

        // Redirect to login if no token
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch authenticated user data from dashboard endpoint
        const userData = await getDashboardName();
        setUser(userData);
      } catch (err) {
        logger.error('Failed to fetch user data', {
          component: 'useAuthUser',
          error: err.message
        });

        // Clear invalid token and redirect
        localStorage.removeItem('token');
        navigate('/login');

        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [navigate]);

  return { user, loading, error };
}
