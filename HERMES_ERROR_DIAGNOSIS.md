# Hermes "Exception in HostFunction" Error Diagnosis

## Potential Issues Found

### 1. ✅ SecureStore Usage (Most Likely)

**Location**: `utils/secureStorage.ts` and `store/baseQuery.ts`

**Issue**: `SecureStore.setItemAsync()` and `getItemAsync()` can throw if:

- `null` or `undefined` is passed where a string is expected
- Token is `null` but being used in Authorization header

**Fix Applied**: Added null checks in `baseQuery.ts` to ensure token is always a string or not set.

### 2. ✅ React Native Reanimated

**Location**: `app/(tabs)/challenges.tsx`

**Issue**: Using `Easing` from `react-native-reanimated` but only importing it, not using it in a worklet.

**Status**: This is likely fine, but ensure it's used correctly.

### 3. ✅ Navigation Parameters

**Location**: Multiple files using `router.push()` with params

**Checked**: All params are simple types (strings, numbers):

- `{ id: challengeId }` ✅
- `{ coins: coinsEarned }` ✅
- `{ uri: selectedImage.uri, type: "uri" }` ✅

**Status**: All navigation params are serializable.

## Recommended Fixes

### Fix 1: Secure Token Handling

Ensure tokens are never null when passed to native modules.

### Fix 2: Add Error Boundaries

Wrap native module calls in try-catch blocks.

### Fix 3: Deep Clean

Run the deep clean commands to reset native bindings.
