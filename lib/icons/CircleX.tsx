// lib/icons/CircleX.tsx
// (Or components/icons/CircleX.tsx depending on your preferred structure)

// Import the specific icon from lucide-react-native
import { CircleX } from 'lucide-react-native';
// Import your utility to enable className support
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the CircleX component to accept className props
iconWithClassName(CircleX);

// Re-export the component so you can import it easily in other files
export { CircleX };