import { useRouter } from 'expo-router';
import { secureStorage } from '../utils/secureStorage';
import { useProfileContext } from '../context/ProfileContext';

export const useAuth = () => {
  const router = useRouter();
  const { dispatch } = useProfileContext();

  const logout = async () => {
    try {
      // Clear all secure storage
      await secureStorage.clearAll();
      
      // Reset the profile context state
      dispatch({ type: 'LOGOUT' });
      
      // Navigate to the login screen
      router.replace('/');
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return {
    logout,
  };
};
