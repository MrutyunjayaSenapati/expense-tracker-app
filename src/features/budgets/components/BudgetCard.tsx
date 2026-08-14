import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Budget } from '../../../types/budget';
import { Category } from '../../../types/category';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { Card } from '../../../components/ui/Card';
import { Text } from '../../../components/ui/Text';
import { Badge } from '../../../components/ui/Badge';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { formatCurrency } from '../../../utils/currency';
import {
  calculateBudgetPercentage,
  calculateBudgetStatus,
} from '../../../utils/calculations';

export interface BudgetCardProps {
  budget: Budget;
  category?: Category | null;
  onPress?: () => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  category,
  onPress,
}) => {
  const { colors } = useTheme();
  const percentage = calculateBudgetPercentage(budget.spent, budget.amount);
  const status = calculateBudgetStatus(budget.spent, budget.amount);
  const remaining = budget.amount - budget.spent;
  const isOver = remaining < 0;

  const getStatusLabel = () => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Near Limit';
      case 'exceeded':
        return 'Over Budget';
    }
  };

  return (
    <Card variant={status === 'exceeded' ? 'glow' : 'solid'} elevation="sm" onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.categoryInfo}>
          <CategoryIcon
            icon={category?.icon ?? 'cash'}
            color={category?.colorToken ?? colors.primary}
            size="md"
          />
          <View style={styles.nameCol}>
            <Text variant="headingS" weight="bold">
              {budget.name}
            </Text>
            <Text variant="caption" color="secondary">
              {budget.period.toUpperCase()}
            </Text>
          </View>
        </View>

        <Badge label={getStatusLabel()} variant={status} />
      </View>

      {/* Amount info */}
      <View style={styles.amountRow}>
        <AnimatedNumber
          value={budget.spent}
          variant="bodyLarge"
          weight="bold"
          color="primary"
        />
        <Text variant="bodySmall" color="secondary">
          {` / ${formatCurrency(budget.amount)}`}
        </Text>
      </View>

      {/* Progress */}
      <ProgressBar
        progress={budget.amount > 0 ? budget.spent / budget.amount : 0}
        height={8}
        style={styles.progressBar}
      />

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text variant="caption" color="secondary">
          {`${percentage}% spent`}
        </Text>
        <Text
          variant="caption"
          weight="semibold"
          color={isOver ? 'expense' : 'income'}
        >
          {isOver
            ? `${formatCurrency(Math.abs(remaining))} over budget`
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  nameCol: {
    marginLeft: spacing.md,
    flex: 1,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.xs,
  },
  progressBar: {
    marginVertical: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
});
