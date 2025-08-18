import { useCallback } from "react";
import { useAppContext } from "../AppContext";

export const useAppState = () => {
  const { state, dispatch } = useAppContext();

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

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, [dispatch]);

  const toggleNotifications = useCallback(() => {
    dispatch({ type: "TOGGLE_NOTIFICATIONS" });
  }, [dispatch]);

  const resetApp = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, [dispatch]);

  return {
    isLoading: state.isLoading,
    error: state.error,
    notifications: state.notifications,
    setLoading,
    setError,
    clearError,
    toggleNotifications,
    resetApp,
  };
};
