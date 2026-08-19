import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useUser } from '../../../hooks/useUser';
import { useHaptics } from '../../../hooks/useHaptics';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyCode } from '../../../types/currency';

interface MonthlySpendHeroProps {
  monthlyExpense: number;
  monthlyIncome: number;
  totalBudget?: number | null;
  budgetSpent?: number;
  onSetBudget?: () => void;
}

export const MonthlySpendHero: React.FC<MonthlySpendHeroProps> = ({
  monthlyExpense,
  monthlyIncome,
  totalBudget,
  budgetSpent = 0,
  onSetBudget,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  // Month & Day calculations
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' }).toUpperCase();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - currentDay);

  // Budget calculations
  const hasBudget = totalBudget && totalBudget > 0;
  const actualBudgetSpent = budgetSpent > 0 ? budgetSpent : monthlyExpense;
  const remainingBudget = hasBudget ? Math.max(0, totalBudget - actualBudgetSpent) : 0;
  const budgetRatio = hasBudget ? Math.min(1, actualBudgetSpent / totalBudget) : 0;
  const safeDailySpend = hasBudget ? Math.floor(remainingBudget / remainingDays) : 0;

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(40)}>
      <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Header Tag */}
        <View style={styles.topRow}>
          <View style={[styles.tagBadge, { backgroundColor: colors.surfaceMuted }]}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary} />
            <Text variant="captionBold" color="brand" style={styles.tagText}>
              {currentMonthName} SPENDING
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              haptics.light();
              router.push('/(tabs)/reports');
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.analyticsBtn}
          >
            <Text variant="captionBold" color="secondary">
              Analytics
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Big Outflow Amount */}
        <View style={styles.amountBlock}>
          <Text variant="display" weight="bold" style={{ color: colors.textPrimary }}>
            {formatCurrency(monthlyExpense, { currency: currencyCode })}
          </Text>
        </View>

        {/* Income vs Outflow Mini Pills */}
        <View style={styles.cashflowRow}>
          <View style={[styles.flowPill, { backgroundColor: colors.incomeSoft }]}>
            <Ionicons name="arrow-down" size={12} color={colors.income} />
            <Text variant="captionBold" style={{ color: colors.income, marginLeft: 4 }}>
              Income: {formatCurrency(monthlyIncome, { currency: currencyCode })}
            </Text>
          </View>

          <View style={[styles.flowPill, { backgroundColor: colors.expenseSoft }]}>
            <Ionicons name="arrow-up" size={12} color={colors.expense} />
            <Text variant="captionBold" style={{ color: colors.expense, marginLeft: 4 }}>
              Outflow: {formatCurrency(monthlyExpense, { currency: currencyCode })}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Budget Health & Safe Daily Spend */}
        {hasBudget ? (
          <View style={styles.budgetSection}>
            <View style={styles.budgetHeader}>
              <Text variant="captionBold" color="secondary">
                BUDGET HEALTH
              </Text>
              <Text variant="captionBold" style={{ color: budgetRatio > 0.9 ? colors.expense : colors.textPrimary }}>
                {formatCurrency(remainingBudget, { currency: currencyCode })} left
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceMuted }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${budgetRatio * 100}%`,
                    backgroundColor:
                      budgetRatio > 0.9 ? colors.expense : budgetRatio > 0.75 ? colors.warning : colors.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.safeDailyRow}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
              <Text variant="caption" color="secondary" style={{ marginLeft: 6, flex: 1 }}>
                Safe to spend:{' '}
                <Text variant="captionBold" color="primary">
                  {formatCurrency(safeDailySpend, { currency: currencyCode })}/day
                </Text>{' '}
                for next {remainingDays} days
              </Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              if (onSetBudget) {
                onSetBudget();
              } else {
                router.push('/budgets');
              }
            }}
            activeOpacity={0.7}
            style={[styles.setBudgetPrompt, { backgroundColor: colors.surfaceMuted }]}
          >
            <Ionicons name="pie-chart-outline" size={16} color={colors.primary} />
            <Text variant="captionBold" color="brand" style={{ marginLeft: 6, flex: 1 }}>
              Set a monthly budget to calculate safe daily spending
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
          </TouchableOpacity>
        )}
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md + 2,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagText: {
    marginLeft: 4,
    fontSize: 10.5,
    letterSpacing: 0.6,
  },
  analyticsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountBlock: {
    marginVertical: spacing.xs + 2,
  },
  cashflowRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  flowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  divider: {
    height: 1,
    marginVertical: spacing.md,
  },
  budgetSection: {
    gap: 6,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  safeDailyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  setBudgetPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.md,
  },
});
