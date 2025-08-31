import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useProfile } from "../../context/hooks/useProfile";
import { secureStorage } from "../../utils/secureStorage";

export const AuthTest: React.FC = () => {
  const { user, isInitialized, isLoading, logout } = useProfile();
  const [storageStatus, setStorageStatus] = useState<string>("Checking...");

  useEffect(() => {
    const checkStorage = async () => {
      try {
        const token = await secureStorage.getAccessToken();
        const userData = await secureStorage.getUserData();
        const isAuth = await secureStorage.isAuthenticated();

        setStorageStatus(
          `Token: ${token ? "Present" : "None"}, ` +
            `User: ${userData ? "Present" : "None"}, ` +
            `Auth: ${isAuth ? "Yes" : "No"}`
        );
      } catch (error) {
        setStorageStatus(`Error: ${error}`);
      }
    };

    checkStorage();
  }, [user]);

  const handleTestLogout = async () => {
    try {
      await logout();
      Alert.alert("Success", "Logged out successfully");
    } catch (error) {
      Alert.alert("Error", `Logout failed: ${error}`);
    }
  };

  const handleClearStorage = async () => {
    try {
      await secureStorage.clearAll();
      Alert.alert("Success", "Storage cleared successfully");
      setStorageStatus("Storage cleared");
    } catch (error) {
      Alert.alert("Error", `Clear failed: ${error}`);
    }
  };

  if (!isInitialized) {
    return (
      <View className='p-4 bg-yellow-100'>
        <Text className='text-yellow-800'>Initializing authentication...</Text>
      </View>
    );
  }

  return (
    <View className='p-4 bg-gray-100'>
      <Text className='text-lg font-bold mb-2'>Authentication Test</Text>
      <Text className='mb-1'>Initialized: {isInitialized ? "Yes" : "No"}</Text>
      <Text className='mb-1'>Loading: {isLoading ? "Yes" : "No"}</Text>
      <Text className='mb-1'>User: {user ? "Present" : "None"}</Text>
      <Text className='mb-1'>
        Authenticated: {user?.isAuthenticated ? "Yes" : "No"}
      </Text>
      <Text className='mb-1'>Token: {user?.token ? "Present" : "None"}</Text>
      <Text className='mb-2'>Storage: {storageStatus}</Text>

      <View className='flex-row space-x-2'>
        <TouchableOpacity
          className='bg-red-500 px-4 py-2 rounded'
          onPress={handleTestLogout}>
          <Text className='text-white'>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className='bg-orange-500 px-4 py-2 rounded'
          onPress={handleClearStorage}>
          <Text className='text-white'>Clear Storage</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
