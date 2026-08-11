import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReportSummary } from '../../../types/reports';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currency';
import { Ionicons } from '@expo/vector-icons';

export interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ summary }) => {
  const { colors } = useTheme();
  const isSavingsPositive = summary.netSavings >= 0;

  return (
    <View style={styles.container}>
      {/* Primary Savings Hero Card */}
      <Card elevation="sm" style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text variant="label" color="secondary">
            NET SAVINGS
          </Text>
          <View
            style={[
              styles.rateBadge,
              { backgroundColor: isSavingsPositive ? colors.incomeSoft : colors.expenseSoft },
            ]}
          >
            <Text
              variant="caption"
              weight="bold"
              color={isSavingsPositive ? 'income' : 'expense'}
            >
              {`${summary.savingsRate}% Savings Rate`}
            </Text>
          </View>
        </View>

        <Text
          variant="display"
          weight="bold"
          color={isSavingsPositive ? 'income' : 'expense'}
          style={styles.heroAmount}
        >
          {formatCurrency(summary.netSavings, { sign: true })}
        </Text>

        {summary.expenseChangePercentage !== undefined && summary.expenseChangePercentage !== 0 && (
          <View style={styles.trendRow}>
            <Ionicons
              name={summary.expenseChangePercentage > 0 ? 'trending-up' : 'trending-down'}
              size={16}
              color={summary.expenseChangePercentage > 0 ? colors.expense : colors.income}
            />
            <Text variant="caption" color="secondary" style={styles.trendText}>
              {`${Math.abs(summary.expenseChangePercentage)}% ${summary.expenseChangePercentage > 0 ? 'increase' : 'decrease'} vs previous ${summary.period}`}
            </Text>
          </View>
        )}
      </Card>

      {/* Income & Expense Breakdown Row */}
      <View style={styles.row}>
        <View
          style={[
            styles.subCard,
            styles.incomeSubCard,
            { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: colors.income },
          ]}
        >
          <Text variant="caption" weight="medium" color="secondary">
            Total Income
          </Text>
          <Text variant="headingM" weight="bold" color="income">
            {formatCurrency(summary.totalIncome)}
          </Text>
        </View>

        <View
          style={[
            styles.subCard,
            styles.expenseSubCard,
            { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: colors.expense },
          ]}
        >
          <Text variant="caption" weight="medium" color="secondary">
            Total Expenses
          </Text>
          <Text variant="headingM" weight="bold" color="expense">
            {formatCurrency(summary.totalExpense)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  heroCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  rateBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs - 2,
    borderRadius: radius.full,
  },
  heroAmount: {
    marginVertical: spacing.xs,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  trendText: {
    marginLeft: spacing.xs - 2,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  subCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  incomeSubCard: {
    borderLeftWidth: 3.5,
  },
  expenseSubCard: {
    borderLeftWidth: 3.5,
  },
});
