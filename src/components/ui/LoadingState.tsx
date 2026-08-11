import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = radius.sm,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.surfaceMuted,
        },
        style,
      ]}
    />
  );
};

export const CardSkeleton: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    >
      <Skeleton width="40%" height={16} style={{ marginBottom: spacing.md }} />
      <Skeleton width="60%" height={32} style={{ marginBottom: spacing.lg }} />
      <View style={styles.row}>
        <Skeleton width="45%" height={20} />
        <Skeleton width="45%" height={20} />
      </View>
    </View>
  );
};

export const TransactionRowSkeleton: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.rowContainer, { borderBottomColor: colors.border }]}>
      <Skeleton width={44} height={44} borderRadius={radius.full} />
      <View style={styles.rowMiddle}>
        <Skeleton width="60%" height={16} style={{ marginBottom: spacing.xs }} />
        <Skeleton width="40%" height={12} />
      </View>
      <Skeleton width={70} height={20} />
    </View>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <TransactionRowSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: radius.card,
    padding: spacing.lg,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  rowMiddle: {
    flex: 1,
    marginLeft: spacing.md,
  },
  listContainer: {
    width: '100%',
  },
});
