import React, { createContext, ReactNode, useContext, useReducer } from "react";

// Types
interface UserProfile {
  id: string;
  mobileNumber: string;
  username?: string;
  fullName?: string;
  email?: string;
  gymId?: string;
  profileDataJson?: any;
  isAuthenticated: boolean;
  token?: string;
  isProfileExist?: boolean;
}

interface ProfileState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

type ProfileAction =
  | { type: "SET_USER"; payload: UserProfile }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_OTP_SENT"; payload: boolean }
  | { type: "SET_OTP_VERIFIED"; payload: boolean }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "LOGOUT" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};

// Reducer
const profileReducer = (
  state: ProfileState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_OTP_SENT":
      return { ...state, otpSent: action.payload };

    case "SET_OTP_VERIFIED":
      return { ...state, otpVerified: action.payload };

    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        otpSent: false,
        otpVerified: false,
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};

// Context
const ProfileContext = createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
} | null>(null);

// Provider
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook
export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  return context;
};
