import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows, Shadows } from '../../theme/shadows';
import { AnimatedPressable } from './AnimatedPressable';

export type CardVariant = 'solid' | 'flat' | 'glass' | 'subtle' | 'elevated';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  elevation?: keyof Shadows;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing | number;
  borderRadius?: number;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'solid',
  elevation = 'sm',
  onPress,
  style,
  padding = 'lg',
  borderRadius = radius.card,
  accessibilityLabel,
}) => {
  const { colors } = useTheme();
  const paddingValue = typeof padding === 'number' ? padding : spacing[padding];

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          ...shadows[elevation],
        };
      case 'elevated':
        return {
          backgroundColor: colors.surfaceElevated,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          ...shadows.md,
        };
      case 'flat':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'subtle':
        return {
          backgroundColor: colors.surfaceMuted,
          borderWidth: 0,
        };
      case 'glass':
        return {
          backgroundColor: colors.glassSurface,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          ...shadows.glass,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius,
    padding: paddingValue,
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[cardStyle, style]}
      >
        {children}
      </AnimatedPressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
