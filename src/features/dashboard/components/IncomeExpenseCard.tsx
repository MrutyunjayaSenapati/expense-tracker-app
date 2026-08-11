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
}

export const IncomeExpenseCard: React.FC<IncomeExpenseCardProps> = ({
  totalIncome,
  totalExpense,
  netSavings,
}) => {
  const { colors } = useTheme();
  const savings = netSavings !== undefined ? netSavings : totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      {/* 1. Income Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.iconRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.incomeSoft }]}>
            <Ionicons name="trending-up" size={14} color={colors.income} />
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
            8.2% vs last month
          </Text>
        </View>
      </Card>

      {/* 2. Expenses Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.iconRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.expenseSoft }]}>
            <Ionicons name="trending-down" size={14} color={colors.expense} />
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
          <Ionicons name="arrow-up" size={10} color={colors.expense} />
          <Text variant="caption" style={[styles.trendText, { color: colors.expense }]}>
            15.4% vs last month
          </Text>
        </View>
      </Card>

      {/* 3. Savings Card */}
      <Card variant="solid" elevation="sm" style={styles.metricCard}>
        <View style={styles.iconRow}>
          <View style={[styles.iconCircle, { backgroundColor: colors.savingsSoft }]}>
            <Ionicons name="wallet-outline" size={14} color={colors.savings} />
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
          <Ionicons name="arrow-up" size={10} color={colors.savings} />
          <Text variant="caption" style={[styles.trendText, { color: colors.savings }]}>
            12.5% vs last month
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
  },
  iconRow: {
    marginBottom: spacing.xs,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
    marginTop: spacing.xs,
    gap: 2,
  },
  trendText: {
    fontSize: 9,
    fontWeight: '600',
  },
});
