import { useCallback } from "react";
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
    (user: any) => {
      dispatch({ type: "SET_USER", payload: user });
    },
    [dispatch]
  );

  const updateProfile = useCallback(
    (updates: any) => {
      dispatch({ type: "UPDATE_PROFILE", payload: updates });
    },
    [dispatch]
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

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
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
