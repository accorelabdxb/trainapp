import { useCallback } from "react";
import { useAppContext } from "../AppContext";

export const useTheme = () => {
  const { state, dispatch } = useAppContext();

  const setTheme = useCallback(
    (theme: "light" | "dark") => {
      dispatch({ type: "SET_THEME", payload: theme });
    },
    [dispatch]
  );

  const toggleTheme = useCallback(() => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    dispatch({ type: "SET_THEME", payload: newTheme });
  }, [state.theme, dispatch]);

  return {
    theme: state.theme,
    setTheme,
    toggleTheme,
  };
};
