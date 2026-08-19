import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Transaction } from '../../../types/transaction';
import { Category } from '../../../types/category';
import { formatCurrency } from '../../../utils/currency';
import { useUser } from '../../../hooks/useUser';
import { CurrencyCode } from '../../../types/currency';

interface CategorySpendVelocityBarProps {
  transactions: Transaction[];
  categories: Category[];
}

const CATEGORY_COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#64748B'];

export const CategorySpendVelocityBar: React.FC<CategorySpendVelocityBarProps> = ({
  transactions,
  categories,
}) => {
  const { colors } = useTheme();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  // Filter expenses
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

  if (totalExpense <= 0) {
    return null; // Don't show empty bar if no expenses logged yet
  }

  // Create lookup map for categories
  const categoryLookup = new Map<string, Category>();
  for (const c of categories) {
    categoryLookup.set(c.id, c);
  }

  // Aggregate by category
  const categoryMap: Record<string, { name: string; amount: number }> = {};
  for (const t of expenseTransactions) {
    const cat = categoryLookup.get(t.categoryId);
    const catName = cat?.name || 'Other';
    if (!categoryMap[catName]) {
      categoryMap[catName] = {
        name: catName,
        amount: 0,
      };
    }
    categoryMap[catName].amount += t.amount || 0;
  }

  const sortedCategories = Object.values(categoryMap)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3); // Top 3

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ marginBottom: spacing.md }}>
      <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Text variant="captionBold" color="secondary" style={styles.headerLabel}>
            TOP SPENDING CATEGORIES
          </Text>
          <Text variant="captionBold" color="secondary">
            {formatCurrency(totalExpense, { currency: currencyCode })} Total
          </Text>
        </View>

        {/* Multi-segment Bar */}
        <View style={[styles.barContainer, { backgroundColor: colors.surfaceMuted }]}>
          {sortedCategories.map((cat, idx) => {
            const percentage = Math.max(5, Math.round((cat.amount / totalExpense) * 100));
            const barColor = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <View
                key={cat.name}
                style={[
                  styles.barSegment,
                  {
                    width: `${percentage}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Legend Row */}
        <View style={styles.legendRow}>
          {sortedCategories.map((cat, idx) => {
            const percentage = Math.round((cat.amount / totalExpense) * 100);
            const barColor = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            return (
              <View key={cat.name} style={styles.legendItem}>
                <View style={[styles.colorDot, { backgroundColor: barColor }]} />
                <Text variant="caption" color="primary" numberOfLines={1} style={{ maxWidth: 80 }}>
                  {cat.name}
                </Text>
                <Text variant="captionBold" color="secondary" style={{ marginLeft: 3 }}>
                  {percentage}%
                </Text>
              </View>
            );
          })}
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  headerLabel: {
    letterSpacing: 0.6,
    fontSize: 11,
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 4,
  },
  barSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: spacing.xs + 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
});
