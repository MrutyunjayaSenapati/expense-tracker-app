import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';

export type BadgeVariant = 'healthy' | 'warning' | 'exceeded' | 'info' | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'neutral',
  icon,
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'healthy':
        return { bg: colors.incomeSoft, text: colors.income };
      case 'warning':
        return { bg: colors.warningSoft, text: colors.warning };
      case 'exceeded':
        return { bg: colors.expenseSoft, text: colors.expense };
      case 'info':
        return { bg: colors.infoSoft, text: colors.info };
      case 'neutral':
      default:
        return { bg: colors.surfaceMuted, text: colors.textSecondary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text variant="caption" weight="semibold" style={{ color: text }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: spacing.xs - 1,
  },
});
