// lib/icons/ArrowRight.tsx
// (Or components/icons/ArrowRight.tsx if you prefer that structure)

import { ArrowRight } from 'lucide-react-native';
import { iconWithClassName } from './iconWithClassName'; // Adjust path based on your setup

// This line registers the ArrowRight component to accept className props
iconWithClassName(ArrowRight);

// Re-export the component so you can import it easily in other files
export { ArrowRight };