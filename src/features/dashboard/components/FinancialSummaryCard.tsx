import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { SparklineGraph } from '../../../components/ui/SparklineGraph';
import { formatCurrency } from '../../../utils/currency';
import { Ionicons } from '@expo/vector-icons';

export interface FinancialSummaryCardProps {
  totalBalance: number;
  netSavings: number;
  onAddExpense?: () => void;
  onViewAccounts?: () => void;
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
  totalBalance,
  netSavings,
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const savingsRate =
    totalBalance > 0
      ? Math.min(100, Math.max(0, Math.round((netSavings / totalBalance) * 100)))
      : 0;

  return (
    <View style={styles.cardContainer}>
      {/* Top row: Label & Eye Toggle */}
      <View style={styles.topRow}>
        <Text variant="caption" weight="medium" style={styles.label}>
          TOTAL NET BALANCE
        </Text>
        <TouchableOpacity
          onPress={() => setIsBalanceHidden(!isBalanceHidden)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Toggle balance visibility"
        >
          <Ionicons
            name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="rgba(255, 255, 255, 0.85)"
          />
        </TouchableOpacity>
      </View>

      {/* Center Row: Large Balance & Sparkline Graph */}
      <View style={styles.centerRow}>
        <View style={styles.balanceCol}>
          {isBalanceHidden ? (
            <Text variant="display" weight="bold" style={styles.hiddenBalanceText}>
              ₹••••••
            </Text>
          ) : (
            <AnimatedNumber
              value={totalBalance}
              variant="display"
              weight="bold"
              style={styles.balanceText}
            />
          )}
        </View>

        {/* Responsive Sparkline Wave */}
        <View style={styles.sparklineContainer}>
          <SparklineGraph
            width={110}
            height={48}
            strokeColor="#38BDF8"
            gradientStartColor="rgba(56, 189, 248, 0.45)"
            gradientEndColor="rgba(56, 189, 248, 0.0)"
            dotColor="#22D3EE"
          />
        </View>
      </View>

      {/* Bottom Row: Net Savings & Status Badge */}
      <View style={styles.bottomRow}>
        <View style={styles.savingsBadge}>
          <Ionicons name="arrow-up" size={13} color="#34D399" />
          <Text variant="caption" weight="semibold" style={styles.savingsText}>
            {`Net Savings: ${formatCurrency(netSavings, { sign: true })} (${savingsRate}%)`}
          </Text>
        </View>

        <View style={styles.trendBadge}>
          <Ionicons name="shield-checkmark-outline" size={12} color="#34D399" />
          <Text variant="caption" weight="bold" style={styles.trendText}>
            Realtime
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#4F46E5',
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.6,
    fontSize: 11,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  balanceCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 36,
  },
  hiddenBalanceText: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 34,
  },
  sparklineContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    paddingRight: spacing.xs,
  },
  savingsText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  trendText: {
    color: '#34D399',
    fontSize: 11,
  },
});

