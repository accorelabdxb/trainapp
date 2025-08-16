// lib/icons/CircleChevronRight.tsx
// (Or components/icons/CircleChevronRight.tsx depending on your preferred structure)

// Import the specific icon from lucide-react-native
import { CircleChevronRight } from 'lucide-react-native';
// Import your utility to enable className support
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the CircleChevronRight component to accept className props
iconWithClassName(CircleChevronRight);

// Re-export the component so you can import it easily in other files
export { CircleChevronRight };