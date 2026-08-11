import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Card } from '../../../components/ui/Card';
import { Text } from '../../../components/ui/Text';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { formatCurrency } from '../../../utils/currency';
import { calculateBudgetPercentage } from '../../../utils/calculations';
import { BudgetStatus } from '../../../types/budget';

export interface MonthlyBudgetCardProps {
  monthlyBudget: number;
  monthlyBudgetSpent: number;
  status: BudgetStatus;
  onPress: () => void;
}

export const MonthlyBudgetCard: React.FC<MonthlyBudgetCardProps> = ({
  monthlyBudget,
  monthlyBudgetSpent,
  status,
  onPress,
}) => {
  const { colors } = useTheme();
  const percentage = calculateBudgetPercentage(monthlyBudgetSpent, monthlyBudget);
  const remaining = monthlyBudget - monthlyBudgetSpent;
  const isOver = remaining < 0;

  const getStatusBadge = () => {
    switch (status) {
      case 'healthy':
        return { label: '● Healthy', color: colors.income, bg: colors.incomeSoft };
      case 'warning':
        return { label: '● Near Limit', color: colors.warning, bg: colors.warningSoft };
      case 'exceeded':
        return { label: '● Over Budget', color: colors.expense, bg: colors.expenseSoft };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <Card variant="solid" elevation="sm" onPress={onPress} style={styles.card}>
      {/* Top Header Row */}
      <View style={styles.header}>
        <Text variant="headingS" weight="bold">
          Monthly Budget
        </Text>
        <View style={[styles.statusPill, { backgroundColor: statusBadge.bg }]}>
          <Text variant="caption" weight="bold" style={{ color: statusBadge.color, fontSize: 11 }}>
            {statusBadge.label}
          </Text>
        </View>
      </View>

      {/* Amount line: ₹33,600 of ₹45,000 */}
      <View style={styles.amountRow}>
        <Text variant="bodyLarge" weight="bold">
          {formatCurrency(monthlyBudgetSpent)}
        </Text>
        <Text variant="bodySmall" color="secondary">
          {` of ${formatCurrency(monthlyBudget)}`}
        </Text>
      </View>

      {/* Progress Bar */}
      <ProgressBar
        progress={monthlyBudget > 0 ? monthlyBudgetSpent / monthlyBudget : 0}
        height={8}
        style={styles.progressBar}
      />

      {/* Footer: 75% used ... ₹11,400 remaining */}
      <View style={styles.footer}>
        <Text variant="caption" color="secondary">
          {`${percentage}% used`}
        </Text>
        <Text
          variant="caption"
          weight="semibold"
          color={isOver ? 'expense' : 'secondary'}
        >
          {isOver
            ? `${formatCurrency(Math.abs(remaining))} over`
            : `${formatCurrency(remaining)} remaining`}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusPill: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  progressBar: {
    marginVertical: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
