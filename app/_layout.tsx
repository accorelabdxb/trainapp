import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { ErrorBoundary } from "../components/common/ErrorBoundary";
import SplashScreen from "../components/common/SplashScreen";
import { AppProvider } from "../context/AppContext";
import { ProfileProvider, useProfileContext } from "../context/ProfileContext";
import { store } from "../store";
import "./globals.css";

// Component to handle authentication routing
const AuthRouter = () => {
  const router = useRouter();
  const segments = useSegments();
  const { state } = useProfileContext();
  const { user, isInitialized, isLoading } = state;
  const [showSplash, setShowSplash] = useState(true);

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    // Don't redirect while still initializing or showing splash
    if (!isInitialized || isLoading || showSplash) {
      return;
    }

    // Ensure segments is available
    if (!segments) {
      return;
    }

    const currentRoute = segments[0];
    const inAuthGroup = currentRoute === "(tabs)";
    const inLoginFlow =
      currentRoute === "onboarding" || currentRoute === "create-account";
    const isOnLoginScreen = !currentRoute;

    // If user is authenticated and trying to access login screens, redirect to dashboard
    if (
      user?.isAuthenticated &&
      user?.token &&
      (inLoginFlow || isOnLoginScreen)
    ) {
      router.replace("/(tabs)/dashboard");
      return;
    }

    // If user is NOT authenticated and trying to access protected routes, redirect to login
    if (!user?.isAuthenticated && inAuthGroup) {
      router.replace("/");
      return;
    }
  }, [user, isInitialized, isLoading, segments, router, showSplash]);

  // Show splash screen while initializing or during splash animation
  if (showSplash || (!isInitialized && isLoading)) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <AppProvider>
              <ProfileProvider>
                <AuthRouter />
              </ProfileProvider>
            </AppProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
