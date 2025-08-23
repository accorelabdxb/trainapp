import React from 'react';
import { Search } from 'lucide-react-native';

interface SearchIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const SearchIcon: React.FC<SearchIconProps> = ({
  size = 24,
  color = '#000',
  strokeWidth = 2,
}) => {
  return (
    <Search
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default SearchIcon;
