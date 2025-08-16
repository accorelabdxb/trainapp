// lib/icons/Clock.tsx
// (Or components/icons/Clock.tsx depending on your preferred structure)

// Import the specific icon from lucide-react-native
import { Clock } from 'lucide-react-native';
// Import your utility to enable className support
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the Clock component to accept className props
iconWithClassName(Clock);

// Re-export the component so you can import it easily in other files
export { Clock };