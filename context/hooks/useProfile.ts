import { useCallback } from "react";
import { secureStorage } from "../../utils/secureStorage";
import { useProfileContext } from "../ProfileContext";

export const useProfile = () => {
  const { state, dispatch } = useProfileContext();

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: "SET_LOADING", payload: loading });
    },
    [dispatch]
  );

  const setError = useCallback(
    (error: string | null) => {
      dispatch({ type: "SET_ERROR", payload: error });
    },
    [dispatch]
  );

  const setUser = useCallback(
    async (user: any) => {
      dispatch({ type: "SET_USER", payload: user });

      // Store user data and token in secure storage
      if (user) {
        try {
          await secureStorage.setUserData(user);
          if (user.token) {
            await secureStorage.setAccessToken(user.token);
          }
        } catch (error) {
          console.error("Error storing user data:", error);
        }
      }
    },
    [dispatch]
  );

  const updateProfile = useCallback(
    async (updates: any) => {
      dispatch({ type: "UPDATE_PROFILE", payload: updates });

      // Update stored user data
      if (state.user) {
        try {
          const updatedUser = { ...state.user, ...updates };
          await secureStorage.setUserData(updatedUser);
          if (updates.token) {
            await secureStorage.setAccessToken(updates.token);
          }
        } catch (error) {
          console.error("Error updating stored user data:", error);
        }
      }
    },
    [dispatch, state.user]
  );

  const setOtpSent = useCallback(
    (sent: boolean) => {
      dispatch({ type: "SET_OTP_SENT", payload: sent });
    },
    [dispatch]
  );

  const setOtpVerified = useCallback(
    (verified: boolean) => {
      dispatch({ type: "SET_OTP_VERIFIED", payload: verified });
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      // Clear secure storage
      await secureStorage.clearAll();

      // Reset context state
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
      // Still reset context state even if storage clearing fails
      dispatch({ type: "LOGOUT" });
    }
  }, [dispatch]);

  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, [dispatch]);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    otpSent: state.otpSent,
    otpVerified: state.otpVerified,
    isInitialized: state.isInitialized,
    setLoading,
    setError,
    setUser,
    updateProfile,
    setOtpSent,
    setOtpVerified,
    logout,
    resetState,
  };
};
