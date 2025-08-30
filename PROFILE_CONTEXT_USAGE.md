# ProfileContext Usage Guide

## Overview

The ProfileContext provides authentication and user profile management functionality for the TrainApp. It follows the same pattern as the existing AppContext and integrates with the authentication API.

## Setup

The ProfileContext is already set up in the app layout (`app/_layout.tsx`) and is available throughout the app.

## Available Hooks

### useProfile()

The main hook that provides access to profile state and actions.

```typescript
import { useProfile } from "../context/hooks/useProfile";

const {
  user,
  isLoading,
  error,
  otpSent,
  otpVerified,
  setLoading,
  setError,
  setUser,
  updateProfile,
  setOtpSent,
  setOtpVerified,
  logout,
  resetState,
} = useProfile();
```

## State Properties

- `user`: User profile data (null if not authenticated)
- `isLoading`: Loading state for API calls
- `error`: Error message from API calls
- `otpSent`: Whether OTP has been sent
- `otpVerified`: Whether OTP has been verified

## Actions

- `setLoading(boolean)`: Set loading state
- `setError(string | null)`: Set error message
- `setUser(userData)`: Set user profile data
- `updateProfile(updates)`: Update specific profile fields
- `setOtpSent(boolean)`: Set OTP sent state
- `setOtpVerified(boolean)`: Set OTP verified state
- `logout()`: Clear user data and reset authentication state
- `resetState()`: Reset all state to initial values

## User Profile Structure

```typescript
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
```

## Authentication Flow

1. **Login Screen** (`app/index.tsx`):

   - User enters phone number
   - Calls `authAPI.sendOtp(phoneNumber)`
   - Stores phone number and `isProfileExist` status in context
   - Navigates to onboarding

2. **OTP Verification** (`app/onboarding.tsx`):

   - User enters 5-digit OTP
   - Calls `authAPI.verifyOtp(mobileNumber, otp)`
   - Updates user with authentication data and `isProfileExist` status
   - **If `isProfileExist` is false**: Navigates to create-account screen
   - **If `isProfileExist` is true**: Navigates to dashboard

3. **Account Creation** (`app/create-account.tsx`) - _Only when `isProfileExist` is false_:
   - **Step 1**: User enters GYM Code
   - **Step 2**: User enters Full Name and Username
   - Calls `authAPI.register(userData)`
   - Updates user with complete profile data
   - Navigates to dashboard

## API Integration

The authentication API is configured in `utils/api.ts` with the following endpoints:

- `POST /api/v1/Accounts/send-otp`: Send OTP to phone number
- `POST /api/v1/Accounts/verify-otp`: Verify OTP
- `POST /api/v1/Accounts/register`: Register new user

## Example Usage

### Basic Profile Display

```typescript
import { useProfile } from "../context/hooks/useProfile";

const MyComponent = () => {
  const { user, isLoading } = useProfile();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return <Text>Please log in</Text>;
  }

  return (
    <View>
      <Text>Welcome, {user.mobileNumber}</Text>
      <Text>
        Status: {user.isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </Text>
    </View>
  );
};
```

### Logout Functionality

```typescript
import { useProfile } from "../context/hooks/useProfile";

const LogoutButton = () => {
  const { logout, isLoading } = useProfile();

  return (
    <TouchableOpacity
      onPress={logout}
      disabled={isLoading}>
      <Text>{isLoading ? "Logging out..." : "Logout"}</Text>
    </TouchableOpacity>
  );
};
```

### Error Handling

```typescript
import { useProfile } from "../context/hooks/useProfile";

const MyComponent = () => {
  const { error, setError } = useProfile();

  const handleAction = async () => {
    try {
      // API call
    } catch (error) {
      setError(error.message);
    }
  };

  return <View>{error && <Text style={{ color: "red" }}>{error}</Text>}</View>;
};
```

## Integration with Existing Context

The ProfileContext works alongside the existing AppContext. You can use both contexts in the same component:

```typescript
import { useProfile } from "../context/hooks/useProfile";
import { useUser } from "../context/hooks/useUser";

const MyComponent = () => {
  const { user: profileUser } = useProfile();
  const { user: appUser } = useUser();

  return (
    <View>
      <Text>Profile: {profileUser?.mobileNumber}</Text>
      <Text>App User: {appUser?.name}</Text>
    </View>
  );
};
```

## Notes

- The ProfileContext follows the same reducer pattern as AppContext
- All API calls are handled through the `utils/api.ts` service
- Loading states are managed automatically
- Error handling is consistent across all authentication flows
- The context is type-safe with TypeScript interfaces
