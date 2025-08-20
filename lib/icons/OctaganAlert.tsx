import React from 'react';
import { OctagonAlert } from 'lucide-react-native';

// Define props interface
interface OctagonAlertProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Create the component
const OctagonAlertIcon: React.FC<OctagonAlertProps> = ({ 
  size = 24, 
  color = '#000', 
  strokeWidth = 2 
}) => {
  return (
    <OctagonAlert 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth}
    />
  );
};

export default OctagonAlertIcon;