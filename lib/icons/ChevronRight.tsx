// lib/icons/ChevronRight.tsx
// (Or components/icons/ChevronRight.tsx depending on your preferred structure)

import { ChevronRight } from 'lucide-react-native'; // Import ChevronRight
import { iconWithClassName } from './iconWithClassName'; // Adjust path if needed

// This line registers the ChevronRight component to accept className props
iconWithClassName(ChevronRight);

// Re-export the component so you can import it easily
export { ChevronRight };