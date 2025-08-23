import React from 'react';
import { Plus } from 'lucide-react-native';

interface PlusProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const PlusIcon: React.FC<PlusProps> = ({
  size = 24,
  color = '#000',
  strokeWidth = 2,
}) => {
  return (
    <Plus 
      size={size} 
      color={color} 
      strokeWidth={strokeWidth} 
    />
  );
};

export default PlusIcon;
