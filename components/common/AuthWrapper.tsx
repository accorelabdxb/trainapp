import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useProfile } from "../../context/hooks/useProfile";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter();
  const { user, isInitialized, isLoading } = useProfile();

  // Show loading screen while checking authentication status
  if (!isInitialized || isLoading) {
    return (
      <View className='flex-1 bg-black items-center justify-center'>
        <ActivityIndicator
          size='large'
          color='#ffffff'
        />
      </View>
    );
  }

  // If user is authenticated, show the app content
  if (user?.isAuthenticated && user?.token) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  // We'll handle this in the main layout instead of here
  // to avoid infinite redirects
  return <>{children}</>;
};
