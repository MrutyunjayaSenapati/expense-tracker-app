import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../../theme/radius';

export type CategoryIconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface CategoryIconProps {
  icon: string;
  color?: string;
  size?: CategoryIconSize;
  style?: ViewStyle | ViewStyle[];
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  color = '#5B5CE2',
  size = 'md',
  style,
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { container: 34, iconSize: 18 };
      case 'lg':
        return { container: 52, iconSize: 26 };
      case 'xl':
        return { container: 64, iconSize: 32 };
      case 'md':
      default:
        return { container: 44, iconSize: 22 };
    }
  };

  const { container, iconSize } = getDimensions();

  // Safely map icon names or fallback to 'grid'
  const validIcon = (icon in Ionicons.glyphMap ? icon : 'grid') as keyof typeof Ionicons.glyphMap;

  return (
    <View
      style={[
        styles.container,
        {
          width: container,
          height: container,
          borderRadius: radius.full,
          backgroundColor: `${color}18`, // 10% opacity tint
        },
        style,
      ]}
    >
      <Ionicons name={validIcon} size={iconSize} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
