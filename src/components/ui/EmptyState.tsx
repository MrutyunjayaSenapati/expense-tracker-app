import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';
import { Button } from './Button';
import { LottieAnimation } from './LottieAnimation';

export interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  lottieSource?: any;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  lottieSource,
  title,
  message,
  actionLabel,
  onAction,
  style,
}) => {
  const { colors } = useTheme();
  const defaultLottie = require('../../../assets/animations/empty.json');
  const animSource = lottieSource || (!icon ? defaultLottie : null);

  return (
    <View style={[styles.container, style]}>
      {animSource ? (
        <LottieAnimation
          source={animSource}
          width={130}
          height={130}
          style={styles.animation}
        />
      ) : (
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name={icon || 'receipt-outline'} size={36} color={colors.primary} />
        </View>
      )}
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
  animation: {
    marginBottom: spacing.md,
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
    maxWidth: 280,
  },
  actionButton: {
    minWidth: 160,
  },
});
