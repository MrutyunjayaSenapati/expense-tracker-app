import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CategorySpending } from '../../../types/reports';
import { colors } from '../../../theme/colors';
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
  if (categories.length === 0) {
    return (
      <Card variant="solid" elevation="sm" style={styles.card}>
        <Text variant="headingS" weight="bold" style={styles.headerTitle}>
          {title}
        </Text>
        <Text variant="body" color="secondary" align="center" style={styles.emptyText}>
          No expense transactions found for this period.
        </Text>
      </Card>
    );
  }

  return (
    <Card variant="solid" elevation="sm" style={styles.card}>
      <Text variant="headingS" weight="bold" style={styles.headerTitle}>
        {title}
      </Text>

      {/* Multi-segment stacked bar preview */}
      <View style={styles.stackedBarContainer}>
        {categories.map(cat => (
          <View
            key={cat.categoryId}
            style={[
              styles.stackedBarSegment,
              {
                width: `${cat.percentage}%`,
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
                <Text variant="body" weight="semibold" numberOfLines={1} style={styles.catName}>
                  {cat.categoryName}
                </Text>
                <Text variant="body" weight="bold">
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
                <View style={styles.pctBadge}>
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
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    marginBottom: spacing.md,
  },
  emptyText: {
    paddingVertical: spacing.xl,
  },
  stackedBarContainer: {
    flexDirection: 'row',
    height: 12,
    borderRadius: radius.xs,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
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
    marginBottom: spacing.xs,
  },
  catName: {
    flex: 1,
    marginRight: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
  },
  pctBadge: {
    marginLeft: spacing.sm,
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
