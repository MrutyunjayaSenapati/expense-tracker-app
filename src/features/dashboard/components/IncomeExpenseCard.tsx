import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
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
  incomeCount = 0,
  expenseCount = 0,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* 1. Income Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.topRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.incomeSoft }]}>
            <Ionicons name="arrow-down" size={14} color={colors.income} />
          </View>
          <Text variant="caption" color="secondary" weight="semibold">
            Income
          </Text>
        </View>

        <AnimatedNumber
          value={totalIncome}
          variant="headingM"
          weight="bold"
          color="income"
          style={styles.amountText}
        />

        <View style={styles.subRow}>
          <Text variant="caption" color="tertiary">
            {incomeCount > 0 ? `${incomeCount} transaction${incomeCount > 1 ? 's' : ''}` : 'No income'}
          </Text>
        </View>
      </Card>

      {/* 2. Expenses Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.topRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.expenseSoft }]}>
            <Ionicons name="arrow-up" size={14} color={colors.expense} />
          </View>
          <Text variant="caption" color="secondary" weight="semibold">
            Expenses
          </Text>
        </View>

        <AnimatedNumber
          value={totalExpense}
          variant="headingM"
          weight="bold"
          color="expense"
          style={styles.amountText}
        />

        <View style={styles.subRow}>
          <Text variant="caption" color="tertiary">
            {expenseCount > 0 ? `${expenseCount} transaction${expenseCount > 1 ? 's' : ''}` : 'No expenses'}
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    borderRadius: radius.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.xs,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    marginVertical: 2,
    fontSize: 20,
    lineHeight: 26,
  },
  subRow: {
    marginTop: 2,
  },
});
