import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { Card } from '../../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

export interface IncomeExpenseCardProps {
  totalIncome: number;
  totalExpense: number;
  netSavings?: number;
  savingsRate?: number;
  incomeCount?: number;
  expenseCount?: number;
}

export const IncomeExpenseCard: React.FC<IncomeExpenseCardProps> = ({
  totalIncome,
  totalExpense,
  netSavings,
  savingsRate = 0,
  incomeCount = 0,
  expenseCount = 0,
}) => {
  const { colors } = useTheme();
  const savings = netSavings !== undefined ? netSavings : totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      {/* 1. Income Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.iconRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.incomeSoft }]}>
            <Ionicons name="trending-up" size={13} color={colors.income} />
          </View>
        </View>
        <Text variant="caption" color="secondary" style={styles.label}>
          Income
        </Text>
        <AnimatedNumber
          value={totalIncome}
          variant="bodyLarge"
          weight="bold"
          color="primary"
          style={styles.amountText}
        />
        <View style={styles.trendRow}>
          <Ionicons name="arrow-up" size={10} color={colors.income} />
          <Text variant="caption" style={[styles.trendText, { color: colors.income }]}>
            {incomeCount > 0 ? `${incomeCount} txn${incomeCount > 1 ? 's' : ''}` : 'This month'}
          </Text>
        </View>
      </Card>

      {/* 2. Expenses Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.iconRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.expenseSoft }]}>
            <Ionicons name="trending-down" size={13} color={colors.expense} />
          </View>
        </View>
        <Text variant="caption" color="secondary" style={styles.label}>
          Expenses
        </Text>
        <AnimatedNumber
          value={totalExpense}
          variant="bodyLarge"
          weight="bold"
          color="primary"
          style={styles.amountText}
        />
        <View style={styles.trendRow}>
          <Ionicons name="arrow-down" size={10} color={colors.expense} />
          <Text variant="caption" style={[styles.trendText, { color: colors.expense }]}>
            {expenseCount > 0 ? `${expenseCount} txn${expenseCount > 1 ? 's' : ''}` : 'This month'}
          </Text>
        </View>
      </Card>

      {/* 3. Savings Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.iconRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.savingsSoft }]}>
            <Ionicons name="wallet-outline" size={13} color={colors.savings} />
          </View>
        </View>
        <Text variant="caption" color="secondary" style={styles.label}>
          Savings
        </Text>
        <AnimatedNumber
          value={savings}
          variant="bodyLarge"
          weight="bold"
          color="primary"
          style={styles.amountText}
        />
        <View style={styles.trendRow}>
          <Ionicons name="sparkles" size={9} color={colors.savings} />
          <Text variant="caption" style={[styles.trendText, { color: colors.savings }]}>
            {`${savingsRate}% saved`}
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  iconRow: {
    marginBottom: 2,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    marginBottom: 2,
  },
  amountText: {
    fontSize: 15,
    lineHeight: 20,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 2,
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
  },
});


