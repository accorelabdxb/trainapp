// lib/icons/Bell.tsx
// (Or components/icons/Bell.tsx depending on your preferred structure)

import { Bell } from 'lucide-react-native'; // Import the Bell icon
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the Bell component to accept className props
iconWithClassName(Bell);

// Re-export the component so you can import it easily
export { Bell };