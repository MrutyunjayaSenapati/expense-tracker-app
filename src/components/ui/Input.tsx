import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  variant?: 'default' | 'amount';
  containerStyle?: ViewStyle | ViewStyle[];
  inputStyle?: TextStyle;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  prefix,
  variant = 'default',
  containerStyle,
  inputStyle,
  clearable = false,
  onClear,
  value,
  onFocus,
  onBlur,
  ...rest
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const isAmount = variant === 'amount';

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text variant="label" weight="medium" color="secondary" style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          isAmount && {
            backgroundColor: colors.surfaceMuted,
            borderColor: isFocused ? colors.primary : 'transparent',
            minHeight: 64,
          },
          isFocused && {
            borderColor: colors.primary,
            backgroundColor: colors.surface,
          },
          !!error && {
            borderColor: colors.error,
          },
        ]}
      >
        {prefix && (
          <Text
            variant={isAmount ? 'headingXL' : 'bodyLarge'}
            weight="bold"
            color={error ? 'expense' : isFocused ? 'brand' : 'primary'}
            style={styles.prefixText}
          >
            {prefix}
          </Text>
        )}

        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          value={value}
          placeholderTextColor={colors.textDisabled}
          style={[
            styles.input,
            { color: colors.textPrimary },
            isAmount ? styles.amountInput : styles.defaultInput,
            inputStyle,
          ]}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />

        {clearable && !!value && (
          <TouchableOpacity
            onPress={onClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error ? (
        <Text variant="caption" color="expense" style={styles.helperText}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" color="tertiary" style={styles.helperText}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    minHeight: 50,
  },
  defaultInput: {
    ...typography.bodyLarge,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  amountInput: {
    ...typography.headingXL,
    fontWeight: '700',
    flex: 1,
    paddingVertical: spacing.sm,
  },
  input: {
    padding: 0,
  },
  prefixText: {
    marginRight: spacing.xs,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  clearButton: {
    padding: spacing.xs,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
