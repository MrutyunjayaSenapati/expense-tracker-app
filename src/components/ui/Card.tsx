import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows, Shadows } from '../../theme/shadows';
import { AnimatedPressable } from './AnimatedPressable';

export type CardVariant = 'solid' | 'flat' | 'glass' | 'subtle' | 'elevated' | 'glow';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  elevation?: keyof Shadows;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padding?: keyof typeof spacing | number;
  borderRadius?: number;
  accessibilityLabel?: string;
  testID?: string;
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
  testID,
}) => {
  const { colors, isDark } = useTheme();
  const paddingValue = typeof padding === 'number' ? padding : spacing[padding];

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.16)' : colors.border,
          ...shadows[elevation],
        };
      case 'elevated':
        return {
          backgroundColor: colors.surfaceElevated,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.22)' : colors.borderStrong,
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
          backgroundColor: isDark ? 'rgba(19, 21, 31, 0.65)' : 'rgba(255, 255, 255, 0.78)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(255, 255, 255, 0.6)',
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.9)',
          borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)',
          ...shadows.glass,
        };
      case 'glow':
        return {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.primary,
          borderTopColor: colors.primaryLight,
          ...shadows.sm,
        };
    }
  };

  const cardStyle: ViewStyle = {
    borderRadius,
    padding: paddingValue,
    overflow: 'hidden',
    position: 'relative',
    ...getVariantStyle(),
  };

  const content = (
    <>
      {variant === 'glass' && Platform.OS !== 'web' && (
        <BlurView
          intensity={isDark ? 40 : 65}
          tint={isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        scaleTo={0.98}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[cardStyle, style]}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return (
    <View style={[cardStyle, style]} testID={testID}>
      {content}
    </View>
  );
};
