import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Couldn't load information",
  message = 'Please check your connection and try again.',
  onRetry,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: colors.errorSoft }]}>
        <Ionicons name="alert-circle-outline" size={36} color={colors.error} />
      </View>
      <Text variant="headingM" weight="bold" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color="secondary" align="center" style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          onPress={onRetry}
          iconLeft={<Ionicons name="refresh" size={18} color={colors.primary} />}
        >
          Try Again
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
});
