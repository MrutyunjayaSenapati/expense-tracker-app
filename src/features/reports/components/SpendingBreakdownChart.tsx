import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CategorySpending } from '../../../types/reports';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { formatCurrency } from '../../../utils/currency';
import { Ionicons } from '@expo/vector-icons';

export interface SpendingBreakdownChartProps {
  categories: CategorySpending[];
  title?: string;
  onSelectCategory?: (categoryId: string) => void;
}

export const SpendingBreakdownChart: React.FC<SpendingBreakdownChartProps> = ({
  categories,
  title = 'Spending by Category',
  onSelectCategory,
}) => {
  const { colors } = useTheme();

  const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0);

  if (categories.length === 0 || totalSpent === 0) {
    return (
      <Card variant="solid" elevation="sm" style={styles.card}>
        <Text variant="headingS" weight="bold" style={styles.headerTitle}>
          {title}
        </Text>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceMuted }]}>
            <Ionicons name="pie-chart-outline" size={24} color={colors.textTertiary} />
          </View>
          <Text variant="body" weight="semibold" style={styles.emptyTitle}>
            No spending recorded
          </Text>
          <Text variant="caption" color="secondary" align="center" style={styles.emptySubtitle}>
            Transactions for this time period will appear here.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card variant="solid" elevation="sm" style={styles.card}>
      <View style={styles.headerRow}>
        <Text variant="headingS" weight="bold" style={styles.headerTitle}>
          {title}
        </Text>
        <Text variant="caption" color="secondary" weight="semibold">
          {`${categories.length} categories`}
        </Text>
      </View>

      {/* Proportional Multi-segment stacked bar preview */}
      <View style={[styles.stackedBarContainer, { backgroundColor: colors.surfaceMuted }]}>
        {categories.map((cat, idx) => (
          <View
            key={cat.categoryId}
            style={[
              styles.stackedBarSegment,
              {
                flex: Math.max(cat.amount, 0.01),
                backgroundColor: cat.categoryColor,
                marginRight: idx < categories.length - 1 ? 1.5 : 0,
              },
            ]}
          />
        ))}
      </View>

      {/* List breakdown */}
      <View style={styles.list}>
        {categories.map(cat => {
          const content = (
            <View style={styles.itemRow}>
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
                      {`${Math.round(cat.percentage || 0)}%`}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );

          if (onSelectCategory) {
            return (
              <TouchableOpacity
                key={cat.categoryId}
                activeOpacity={0.7}
                onPress={() => onSelectCategory(cat.categoryId)}
                accessibilityRole="button"
                accessibilityLabel={`${cat.categoryName}, ${formatCurrency(cat.amount)}`}
              >
                {content}
              </TouchableOpacity>
            );
          }

          return <View key={cat.categoryId}>{content}</View>;
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerTitle: {
    flex: 1,
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    marginBottom: 2,
  },
  emptySubtitle: {
    maxWidth: 240,
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
