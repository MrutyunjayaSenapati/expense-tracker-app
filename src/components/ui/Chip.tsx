import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
  count?: number;
  style?: ViewStyle | ViewStyle[];
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  count,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        variant="label"
        weight={selected ? 'semibold' : 'regular'}
        color={selected ? 'inverse' : 'secondary'}
      >
        {label}
      </Text>
      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            {
              backgroundColor: selected ? colors.surface : colors.surfaceMuted,
            },
          ]}
        >
          <Text
            variant="caption"
            weight="bold"
            style={{ color: selected ? colors.primary : colors.textSecondary }}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
  },
  countBadge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
});
