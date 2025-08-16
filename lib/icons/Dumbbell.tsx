// lib/icons/Dumbbell.tsx
// (Or components/icons/Dumbbell.tsx depending on your preferred structure)

// Import the specific icon from lucide-react-native
import { Dumbbell } from 'lucide-react-native';
// Import your utility to enable className support
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the Dumbbell component to accept className props
iconWithClassName(Dumbbell);

// Re-export the component so you can import it easily in other files
export { Dumbbell };