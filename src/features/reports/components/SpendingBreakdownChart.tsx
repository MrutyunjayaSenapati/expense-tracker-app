import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CategorySpending } from '../../../types/reports';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { formatCurrency } from '../../../utils/currency';

export interface SpendingBreakdownChartProps {
  categories: CategorySpending[];
  title?: string;
}

export const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({
  categories,
  title = 'Spending by Category',
}) => {
  const { colors } = useTheme();

  if (categories.length === 0) {
    return (
      <Card variant="solid" elevation="sm" style={styles.card}>
        <Text variant="headingS" weight="bold" style={styles.headerTitle}>
          {title}
        </Text>
        <View style={styles.emptyContainer}>
          <Text variant="body" color="secondary" align="center" style={styles.emptyText}>
            No transactions found for this period.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="solid" elevation="sm" style={styles.card}>
      <Text variant="headingS" weight="bold" style={styles.headerTitle}>
        {title}
      </Text>

      {/* Multi-segment stacked bar preview */}
      <View style={[styles.stackedBarContainer, { backgroundColor: colors.surfaceMuted }]}>
        {categories.map(cat => (
          <View
            key={cat.categoryId}
            style={[
              styles.stackedBarSegment,
              {
                width: `${Math.max(cat.percentage, 1.5)}%`,
                backgroundColor: cat.categoryColor,
              },
            ]}
          />
        ))}
      </View>

      {/* List breakdown */}
      <View style={styles.list}>
        {categories.map(cat => (
          <View key={cat.categoryId} style={styles.itemRow}>
            <CategoryIcon
              icon={cat.categoryIcon}
              color={cat.categoryColor}
              size="sm"
            />

            <View style={styles.itemContent}>
              <View style={styles.topLine}>
                <Text
                  variant="body"
                  weight="semibold"
                  numberOfLines={1}
                  style={styles.catName}
                >
                  {cat.categoryName}
                </Text>
                <Text variant="body" weight="bold" numberOfLines={1}>
                  {formatCurrency(cat.amount)}
                </Text>
              </View>

              <View style={styles.progressRow}>
                <ProgressBar
                  progress={cat.percentage / 100}
                  color={cat.categoryColor}
                  height={6}
                  autoColor={false}
                  style={styles.progressBar}
                />
                <View
                  style={[
                    styles.pctBadge,
                    { backgroundColor: colors.surfaceMuted },
                  ]}
                >
                  <Text variant="caption" weight="semibold" color="secondary">
                    {`${cat.percentage}%`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
  },
  stackedBarContainer: {
    flexDirection: 'row',
    height: 10,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  stackedBarSegment: {
    height: '100%',
  },
  list: {
    gap: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: spacing.xs,
  },
  catName: {
    flex: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  progressBar: {
    flex: 1,
  },
  pctBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.xs,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
