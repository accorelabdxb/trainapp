// lib/icons/X.tsx
// (Or components/icons/X.tsx depending on your preferred structure)

// Import the specific icon from lucide-react-native
import { X } from 'lucide-react-native';
// Import your utility to enable className support
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the X component to accept className props
iconWithClassName(X);

// Re-export the component so you can import it easily in other files
export { X };