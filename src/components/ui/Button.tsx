import React from 'react';
import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Text } from './Text';
import { AnimatedPressable } from './AnimatedPressable';
import { Ionicons } from '@expo/vector-icons';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'glass';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  successLabel?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  accessibilityLabel?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  success = false,
  successLabel = 'Saved!',
  iconLeft,
  iconRight,
  fullWidth = false,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const isDisabled = disabled || loading || success;

  const getContainerStyle = (): ViewStyle => {
    // Base size
    let height = 48;
    let paddingHorizontal: number = spacing.lg;
    let borderRadius: number = radius.button;

    if (size === 'sm') {
      height = 36;
      paddingHorizontal = spacing.md;
      borderRadius = radius.sm;
    } else if (size === 'lg') {
      height = 56;
      paddingHorizontal = spacing.xxl;
      borderRadius = radius.lg;
    }

    if (success) {
      return {
        height,
        paddingHorizontal,
        borderRadius,
        backgroundColor: colors.income,
        justifyContent: 'center',
        alignItems: 'center',
        width: fullWidth ? '100%' : undefined,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          height,
          paddingHorizontal,
          borderRadius,
          backgroundColor: isDisabled ? colors.surfaceMuted : colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
          ...(!isDisabled ? shadows.sm : {}),
        };
      case 'secondary':
        return {
          height,
          paddingHorizontal,
          borderRadius,
          backgroundColor: colors.surfaceMuted,
          justifyContent: 'center',
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
        };
      case 'glass':
        return {
          height,
          paddingHorizontal,
          borderRadius,
          backgroundColor: colors.glassSurface,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          justifyContent: 'center',
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
          ...shadows.glass,
        };
      case 'destructive':
        return {
          height,
          paddingHorizontal,
          borderRadius,
          backgroundColor: isDisabled ? colors.surfaceMuted : colors.error,
          justifyContent: 'center',
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
        };
      case 'outline':
        return {
          height,
          paddingHorizontal,
          borderRadius,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: isDisabled ? colors.border : colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
        };
      case 'ghost':
        return {
          height,
          paddingHorizontal,
          borderRadius,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
          width: fullWidth ? '100%' : undefined,
        };
    }
  };

  const getTextColor = (): TextStyle => {
    if (success) {
      return { color: colors.textInverse };
    }

    switch (variant) {
      case 'primary':
      case 'destructive':
        return { color: isDisabled ? colors.textDisabled : colors.textInverse };
      case 'secondary':
        return { color: isDisabled ? colors.textDisabled : colors.textPrimary };
      case 'glass':
        return { color: colors.primary };
      case 'outline':
      case 'ghost':
        return { color: isDisabled ? colors.textDisabled : colors.primary };
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'destructive' ? colors.textInverse : colors.primary}
        />
      ) : success ? (
        <View style={styles.contentRow}>
          <Ionicons name="checkmark-circle" size={20} color={colors.textInverse} style={styles.successIcon} />
          <Text variant={size === 'sm' ? 'bodySmall' : 'bodyLarge'} weight="bold" color="inverse">
            {successLabel}
          </Text>
        </View>
      ) : (
        <View style={styles.contentRow}>
          {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
          <Text
            variant={size === 'sm' ? 'bodySmall' : 'bodyLarge'}
            weight="semibold"
            style={[getTextColor(), ...(Array.isArray(textStyle) ? textStyle : textStyle ? [textStyle] : [])]}
          >
            {children}
          </Text>
          {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  successIcon: {
    marginRight: spacing.xs,
  },
});
