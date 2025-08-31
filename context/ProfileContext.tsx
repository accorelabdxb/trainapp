import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { secureStorage } from "../utils/secureStorage";

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
  isInitialized: boolean; // Track if initial auth check is complete
}

type ProfileAction =
  | { type: "SET_USER"; payload: UserProfile | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_OTP_SENT"; payload: boolean }
  | { type: "SET_OTP_VERIFIED"; payload: boolean }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> }
  | { type: "SET_INITIALIZED"; payload: boolean }
  | { type: "LOGOUT" }
  | { type: "RESET_STATE" };

// Initial state
const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  isInitialized: false,
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

    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload };

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

// Provider component
export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // Initialize authentication state on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Check if user is authenticated
        const isAuthenticated = await secureStorage.isAuthenticated();

        if (isAuthenticated) {
          // Get stored user data
          const userData = await secureStorage.getUserData();
          const token = await secureStorage.getAccessToken();

          if (userData && token) {
            dispatch({
              type: "SET_USER",
              payload: {
                ...userData,
                isAuthenticated: true,
                token,
              },
            });
            dispatch({ type: "SET_OTP_VERIFIED", payload: true });
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear any corrupted data
        try {
          await secureStorage.clearAll();
        } catch (clearError) {
          console.error("Error clearing storage:", clearError);
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_INITIALIZED", payload: true });
      }
    };

    // Wrap in try-catch to prevent any unhandled errors
    try {
      initializeAuth();
    } catch (error) {
      console.error("Error in initializeAuth:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({ type: "SET_INITIALIZED", payload: true });
    }
  }, []);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook to use the context
export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};
