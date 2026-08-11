import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useBudgets } from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BudgetCard } from '../../features/budgets/components/BudgetCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency } from '../../utils/currency';
import { calculateBudgetPercentage } from '../../utils/calculations';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: budgets = [], isLoading, isRefetching, isError, refetch } = useBudgets();
  const { data: categories = [] } = useCategories();

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overallPercentage = calculateBudgetPercentage(totalSpent, totalBudget);
  const remaining = totalBudget - totalSpent;
  const isOver = remaining < 0;

  if (isLoading && budgets.length === 0) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <CardSkeleton />
        <CardSkeleton />
      </ScrollView>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState
          title="Could not load budgets"
          message="Failed to retrieve budget items."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Overall Summary Card */}
        <Card elevation="sm" style={styles.summaryCard}>
          <Text variant="label" color="secondary">
            TOTAL MONTHLY BUDGET
          </Text>
          <View style={styles.summaryAmountRow}>
            <Text variant="headingXL" weight="bold">
              {formatCurrency(totalSpent)}
            </Text>
            <Text variant="bodyLarge" color="secondary">
              {` / ${formatCurrency(totalBudget)}`}
            </Text>
          </View>

          <ProgressBar
            progress={totalBudget > 0 ? totalSpent / totalBudget : 0}
            height={10}
            style={styles.progressBar}
          />

          <View style={styles.summaryFooter}>
            <Text variant="bodySmall" weight="medium" color="secondary">
              {`${overallPercentage}% used`}
            </Text>
            <Text
              variant="bodySmall"
              weight="bold"
              color={isOver ? 'expense' : 'income'}
            >
              {isOver
                ? `${formatCurrency(Math.abs(remaining))} over budget`
                : `${formatCurrency(remaining)} remaining`}
            </Text>
          </View>
        </Card>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text variant="headingS" weight="bold">
            Category Budgets
          </Text>
          <Text variant="caption" color="secondary">
            {`${budgets.length} Active Budgets`}
          </Text>
        </View>

        {/* Budget Cards List */}
        {budgets.length === 0 ? (
          <EmptyState
            icon="pie-chart-outline"
            title="No budgets set"
            message="Create monthly limits for categories to manage your spending."
            actionLabel="Create Budget"
            onAction={() => router.push('/budgets/create')}
          />
        ) : (
          budgets.map(budget => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              category={categoryMap.get(budget.categoryId || '')}
              onPress={() => router.push(`/budgets/create?id=${budget.id}`)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Add Budget FAB */}
      <TouchableOpacity
        onPress={() => router.push('/budgets/create')}
        activeOpacity={0.85}
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel="Create new budget"
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: 120,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  summaryAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: spacing.xs,
  },
  progressBar: {
    marginVertical: spacing.sm,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
