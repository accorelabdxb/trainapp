import React, { createContext, ReactNode, useContext, useReducer } from "react";

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  streak: number;
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  theme: "light" | "dark";
  notifications: boolean;
}

type AppAction =
  | { type: "SET_USER"; payload: User }
  | { type: "UPDATE_POINTS"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_NOTIFICATIONS" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: AppState = {
  user: {
    id: "1",
    name: "Nihas",
    avatar: "profile.png",
    points: 500,
    streak: 5,
  },
  isLoading: false,
  error: null,
  theme: "dark",
  notifications: true,
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "UPDATE_POINTS":
      return {
        ...state,
        user: state.user ? { ...state.user, points: action.payload } : null,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_THEME":
      return { ...state, theme: action.payload };

    case "TOGGLE_NOTIFICATIONS":
      return { ...state, notifications: !state.notifications };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
