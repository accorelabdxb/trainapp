import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useProfile } from "../../context/hooks/useProfile";

export const ProfileInfo: React.FC = () => {
  const { user, logout, isLoading } = useProfile();

  if (!user) {
    return (
      <View className='bg-red-500/20 p-4 rounded-xl'>
        <Text className='text-red-400 text-sm'>Not authenticated</Text>
      </View>
    );
  }

  return (
    <View className='bg-green-500/20 p-4 rounded-xl'>
      <Text className='text-green-400 text-sm font-bold mb-2'>
        Profile Info
      </Text>
      <Text className='text-white text-xs mb-1'>
        Mobile: {user.mobileNumber}
      </Text>
      <Text className='text-white text-xs mb-1'>
        Status: {user.isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </Text>
      <Text className='text-white text-xs mb-1'>
        Profile Exists: {user.isProfileExist ? "Yes" : "No"}
      </Text>
      {user.username && (
        <Text className='text-white text-xs mb-1'>
          Username: {user.username}
        </Text>
      )}
      {user.fullName && (
        <Text className='text-white text-xs mb-1'>Name: {user.fullName}</Text>
      )}
      {user.gymId && (
        <Text className='text-white text-xs mb-1'>GYM Code: {user.gymId}</Text>
      )}
      <TouchableOpacity
        className='bg-red-500 mt-2 py-2 px-4 rounded-lg'
        onPress={logout}
        disabled={isLoading}>
        <Text className='text-white text-xs text-center'>
          {isLoading ? "Logging out..." : "Logout"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
