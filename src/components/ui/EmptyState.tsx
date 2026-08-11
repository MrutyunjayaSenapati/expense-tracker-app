import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'receipt-outline',
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text variant="headingM" weight="bold" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color="secondary" align="center" style={styles.message}>
        {message}
      </Text>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="md"
          onPress={onAction}
          style={styles.actionButton}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    marginBottom: spacing.xl,
  },
  actionButton: {
    minWidth: 160,
  },
});
