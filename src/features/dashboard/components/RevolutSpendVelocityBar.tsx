import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useHaptics } from '../../../hooks/useHaptics';
import { useUser } from '../../../hooks/useUser';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyCode } from '../../../types/currency';

export interface RevolutSpendVelocityBarProps {
  totalSpentThisMonth: number;
  totalMonthlyBudget?: number;
}

export const RevolutSpendVelocityBar: React.FC<RevolutSpendVelocityBarProps> = ({
  totalSpentThisMonth,
  totalMonthlyBudget = 0,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  // If user has not set a monthly budget yet, show a clean prompt instead of mock data
  if (!totalMonthlyBudget || totalMonthlyBudget <= 0) {
    return (
      <TouchableOpacity
        onPress={() => {
          haptics.selection();
          router.push('/budgets/create');
        }}
        activeOpacity={0.8}
        style={styles.container}
      >
        <Card
          elevation="subtle"
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.topRow}>
            <View style={styles.leftInfo}>
              <View style={[styles.iconDot, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="flash-outline" size={14} color={colors.primary} />
              </View>
              <View>
                <Text variant="caption" weight="bold" color="primary">
                  Set a Monthly Budget
                </Text>
                <Text variant="caption" color="secondary" style={{ fontSize: 11, marginTop: 1 }}>
                  Calculate your safe daily spending limit automatically
                </Text>
              </View>
            </View>

            <View style={styles.rightBadge}>
              <Text variant="caption" weight="bold" color="brand">
                + Set
              </Text>
              <Ionicons name="chevron-forward" size={14} color={colors.primary} />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  // Calculate days remaining in the current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay);

  const remainingBudget = Math.max(0, totalMonthlyBudget - totalSpentThisMonth);
  const dailyLimit = Math.round(remainingBudget / daysRemaining);
  const percentUsed = Math.min(100, Math.round((totalSpentThisMonth / totalMonthlyBudget) * 100));

  const isWarning = percentUsed > 80;
  const isOver = totalSpentThisMonth > totalMonthlyBudget;

  return (
    <TouchableOpacity
      onPress={() => {
        haptics.selection();
        router.push('/budgets');
      }}
      activeOpacity={0.8}
      style={styles.container}
    >
      <Card
        elevation="subtle"
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: isOver ? colors.expenseGlow : colors.border,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.leftInfo}>
            <View
              style={[
                styles.iconDot,
                {
                  backgroundColor: isOver
                    ? colors.expenseSoft
                    : isWarning
                    ? colors.warningSoft
                    : colors.incomeSoft,
                },
              ]}
            >
              <Ionicons
                name={isOver ? 'alert-circle' : 'flash'}
                size={14}
                color={isOver ? colors.expense : isWarning ? colors.warning : colors.income}
              />
            </View>
            <View>
              <Text variant="caption" weight="bold" color="primary">
                {isOver
                  ? 'Monthly Budget Exceeded'
                  : `Safe Daily Limit: ${formatCurrency(dailyLimit, { currency: currencyCode })}/day`}
              </Text>
              <Text variant="caption" color="secondary" style={{ fontSize: 11, marginTop: 1 }}>
                {daysRemaining} days left • {formatCurrency(remainingBudget, { currency: currencyCode })} remaining
              </Text>
            </View>
          </View>

          <View style={styles.rightBadge}>
            <Text
              variant="caption"
              weight="bold"
              style={{
                color: isOver ? colors.expense : isWarning ? colors.warning : colors.income,
                fontSize: 12,
              }}
            >
              {percentUsed}% spent
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textTertiary} />
          </View>
        </View>

        {/* Progress Line */}
        <View style={[styles.progressTrack, { backgroundColor: colors.surfaceMuted }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentUsed}%`,
                backgroundColor: isOver ? colors.expense : isWarning ? colors.warning : colors.income,
              },
            ]}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.screenHorizontal,
    width: '100%',
  },
  card: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  iconDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  progressTrack: {
    height: 4,
    borderRadius: radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: radius.full,
  },
});
