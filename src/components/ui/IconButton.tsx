import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';

export interface IconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  onPress: () => void;
  accessibilityLabel: string;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  bordered?: boolean;
  circular?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  name,
  size = 22,
  color = colors.textPrimary,
  backgroundColor = 'transparent',
  onPress,
  accessibilityLabel,
  style,
  disabled = false,
  bordered = false,
  circular = true,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.button,
        {
          backgroundColor,
          borderRadius: circular ? radius.full : radius.md,
          borderWidth: bordered ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={disabled ? colors.textDisabled : color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
