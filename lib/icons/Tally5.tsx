// lib/icons/Tally5.tsx
// (Or components/icons/Tally5.tsx depending on your preferred structure)

// Import the specific icon from lucide-react-native
import { Tally5 } from 'lucide-react-native';
// Import your utility to enable className support
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the Tally5 component to accept className props
iconWithClassName(Tally5);

// Re-export the component so you can import it easily in other files
export { Tally5 };