# Context API Implementation Guide

## 🎯 Why Context API Over Redux?

### ✅ **Context API Advantages:**

- **Zero Dependencies**: Built into React
- **Simpler Setup**: Less boilerplate code
- **Better Performance**: No additional library overhead
- **Type Safety**: Full TypeScript support out of the box
- **Learning Curve**: Easier for team adoption
- **Bundle Size**: Smaller final bundle

### ❌ **Redux Disadvantages for Your App:**

- **Overkill**: Your app has simple state management needs
- **Boilerplate**: Requires actions, reducers, store setup
- **Dependencies**: Additional packages (redux, react-redux, toolkit)
- **Complexity**: More concepts to learn and maintain

## 🏗 Architecture Overview

```
/context
  ├── AppContext.tsx           # Main context provider
  └── /hooks
      ├── useUser.ts          # User-specific operations
      ├── useTheme.ts         # Theme management
      └── useAppState.ts      # General app state
```

## 📋 State Structure

```typescript
interface AppState {
  user: User | null; // Current user data
  isLoading: boolean; // Global loading state
  error: string | null; // Global error state
  theme: "light" | "dark"; // Theme preference
  notifications: boolean; // Notification settings
}
```

## 🔧 Usage Examples

### 1. **Using User Data**

```tsx
import { useUser } from "../context/hooks/useUser";

const MyComponent = () => {
  const { user, updatePoints, redeemPoints } = useUser();

  const handleRedeem = () => {
    const success = redeemPoints(100);
    if (success) {
      console.log("Redemption successful!");
    }
  };

  return <Text>Points: {user?.points}</Text>;
};
```

### 2. **Managing Loading States**

```tsx
import { useAppState } from "../context/hooks/useAppState";

const MyComponent = () => {
  const { isLoading, setLoading, setError } = useAppState();

  const fetchData = async () => {
    setLoading(true);
    try {
      // API call
      const data = await api.getData();
    } catch (error) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
};
```

### 3. **Theme Management**

```tsx
import { useTheme } from "../context/hooks/useTheme";

const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity onPress={toggleTheme}>
      <Text>Current theme: {theme}</Text>
    </TouchableOpacity>
  );
};
```

## 🚀 Performance Optimizations

### 1. **Memoized Selectors**

```tsx
const useUserPoints = () => {
  const { user } = useUser();
  return useMemo(() => user?.points || 0, [user?.points]);
};
```

### 2. **Split Contexts for Better Performance**

```tsx
// If your app grows, split contexts by domain
const UserContext = createContext(/* user state */);
const ThemeContext = createContext(/* theme state */);
const NotificationContext = createContext(/* notification state */);
```

### 3. **Selective Re-renders**

```tsx
// Only re-render when specific values change
const MyComponent = memo(() => {
  const points = useUserPoints(); // Only re-renders when points change
  return <Text>{points}</Text>;
});
```

## 📁 File Organization

### **Constants Structure:**

```
/constants
  ├── index.ts              # Re-exports all constants
  ├── animations.ts         # Animation-related constants
  ├── ui.ts                # UI dimensions, spacing, fonts
  ├── app.ts               # App-specific constants
  └── theme.ts             # Colors, themes, chart config
```

### **Benefits of Split Constants:**

- **Better Organization**: Easy to find specific constants
- **Reduced Bundle Size**: Import only what you need
- **Type Safety**: Proper TypeScript support
- **Maintainability**: Easier to update and modify

## 🎨 Theme System

### **Using Theme Constants:**

```tsx
import { COLORS, THEMES } from "../constants/theme";
import { useTheme } from "../context/hooks/useTheme";

const MyComponent = () => {
  const { theme } = useTheme();
  const currentTheme = THEMES[theme];

  return (
    <View style={{ backgroundColor: currentTheme.background }}>
      <Text style={{ color: currentTheme.text }}>Hello</Text>
    </View>
  );
};
```

## 🔄 Migration Guide

### **From Current Code to Context:**

1. **Replace hardcoded values:**

```tsx
// Before
<Text>Points: 500</Text>;

// After
const { user } = useUser();
<Text>Points: {user?.points}</Text>;
```

2. **Use theme constants:**

```tsx
// Before
backgroundColor: "#F0B32D";

// After
import { COLORS } from "../constants/theme";
backgroundColor: COLORS.primary;
```

3. **Centralize state management:**

```tsx
// Before (local state in each component)
const [points, setPoints] = useState(500);

// After (global state)
const { user, updatePoints } = useUser();
```

## 🧪 Testing Strategy

### **Testing Context Providers:**

```tsx
const renderWithContext = (component: ReactElement) => {
  return render(<AppProvider>{component}</AppProvider>);
};

test("should display user points", () => {
  renderWithContext(<PointsCard />);
  expect(screen.getByText("500")).toBeInTheDocument();
});
```

## 🚀 Next Steps

### **Immediate Implementation:**

1. ✅ Context structure created
2. ✅ Constants organized by domain
3. ✅ Custom hooks for state management
4. ✅ Type safety implemented

### **Future Enhancements:**

1. **Persistence**: Add AsyncStorage for state persistence
2. **Middleware**: Add logging and debugging middleware
3. **Optimistic Updates**: Implement optimistic UI updates
4. **Offline Support**: Add offline state management
5. **Real-time Updates**: WebSocket integration for live data

## 💡 Best Practices

1. **Keep Context Focused**: Don't put everything in one context
2. **Use Custom Hooks**: Abstract context logic into reusable hooks
3. **Memoize Expensive Operations**: Use useMemo and useCallback
4. **Type Everything**: Leverage TypeScript for better DX
5. **Test Context Logic**: Write tests for your context providers
6. **Document State Changes**: Keep track of state mutations

This Context implementation provides a solid foundation that's scalable, maintainable, and performant for your React Native app!
