import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { InteractiveTrendGraph, TrendDataPoint } from '../../../components/ui/InteractiveTrendGraph';
import { formatCurrency } from '../../../utils/currency';
import { useHaptics } from '../../../hooks/useHaptics';
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
  onAddExpense,
  onViewAccounts,
}) => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [scrubbedPoint, setScrubbedPoint] = useState<TrendDataPoint | null>(null);
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { width } = useWindowDimensions();

  const isPositiveSavings = netSavings >= 0;

  // Responsive graph width
  const graphWidth = Math.min(width - spacing.screenHorizontal * 2 - spacing.lg * 2, 460);

  // Generate smooth 7-day trend trajectory culminating in totalBalance
  const trendData: TrendDataPoint[] = useMemo(() => {
    const base = totalBalance - netSavings;
    return [
      { label: '8 Aug', value: Math.max(0, base) },
      { label: '9 Aug', value: Math.max(0, base + netSavings * 0.2) },
      { label: '10 Aug', value: Math.max(0, base + netSavings * 0.45) },
      { label: '11 Aug', value: Math.max(0, base + netSavings * 0.35) },
      { label: '12 Aug', value: Math.max(0, base + netSavings * 0.7) },
      { label: '13 Aug', value: Math.max(0, base + netSavings * 0.85) },
      { label: 'Today', value: totalBalance },
    ];
  }, [totalBalance, netSavings]);

  const toggleVisibility = () => {
    haptics.light();
    setIsBalanceHidden(prev => !prev);
  };

  const displayedAmount = scrubbedPoint ? scrubbedPoint.value : totalBalance;

  return (
    <View style={[styles.cardContainer, { backgroundColor: colors.heroBackground, borderColor: colors.heroBorder }]}>
      {/* Top row: Label & Eye Toggle */}
      <View style={styles.topRow}>
        <View style={styles.labelContainer}>
          <Text variant="captionBold" style={styles.label}>
            {scrubbedPoint ? `BALANCE ON ${scrubbedPoint.label.toUpperCase()}` : 'TOTAL NET BALANCE'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={toggleVisibility}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Toggle balance visibility"
          style={styles.eyeButton}
        >
          <Ionicons
            name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="rgba(255, 255, 255, 0.75)"
          />
        </TouchableOpacity>
      </View>

      {/* Center Balance Display */}
      <View style={styles.balanceContainer}>
        {isBalanceHidden ? (
          <Text variant="display" weight="bold" style={styles.hiddenBalanceText}>
            ₹••••••••
          </Text>
        ) : (
          <AnimatedNumber
            value={displayedAmount}
            variant="display"
            weight="bold"
            style={styles.balanceText}
            testID="total-balance"
          />
        )}
      </View>

      {/* Interactive Trend Wave Graph */}
      <View style={styles.graphContainer}>
        <InteractiveTrendGraph
          data={trendData}
          width={graphWidth}
          height={65}
          strokeColor="#818CF8"
          onScrub={setScrubbedPoint}
          onScrubEnd={() => setScrubbedPoint(null)}
        />
      </View>

      {/* Status Row */}
      <View style={styles.statusRow}>
        <View
          style={[
            styles.savingsPill,
            {
              backgroundColor: isPositiveSavings
                ? 'rgba(52, 211, 153, 0.16)'
                : 'rgba(251, 113, 133, 0.16)',
            },
          ]}
        >
          <Ionicons
            name={isPositiveSavings ? 'trending-up' : 'trending-down'}
            size={13}
            color={isPositiveSavings ? '#34D399' : '#FB7185'}
          />
          <Text
            variant="caption"
            weight="semibold"
            style={{
              color: isPositiveSavings ? '#34D399' : '#FB7185',
              fontSize: 12,
            }}
          >
            {`${formatCurrency(netSavings, { sign: true })} net savings this month`}
          </Text>
        </View>

        <Text variant="caption" style={styles.scrubHint}>
          Touch graph to scrub
        </Text>
      </View>

      {/* Quick Action Buttons Row */}
      <View style={styles.actionsRow}>
        {onAddExpense && (
          <TouchableOpacity
            onPress={onAddExpense}
            activeOpacity={0.8}
            style={[styles.primaryActionBtn, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Add Expense"
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text variant="bodySmall" weight="bold" style={styles.primaryActionText}>
              Add Expense
            </Text>
          </TouchableOpacity>
        )}

        {onViewAccounts && (
          <TouchableOpacity
            onPress={onViewAccounts}
            activeOpacity={0.7}
            style={styles.secondaryActionBtn}
            accessibilityRole="button"
            accessibilityLabel="View Accounts"
          >
            <Ionicons name="wallet-outline" size={16} color="rgba(255, 255, 255, 0.85)" />
            <Text variant="bodySmall" weight="semibold" style={styles.secondaryActionText}>
              Accounts
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.72)',
    letterSpacing: 0.6,
    fontSize: 11.5,
  },
  eyeButton: {
    padding: 4,
  },
  balanceContainer: {
    marginVertical: spacing.xs - 4,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
    fontWeight: '700',
  },
  hiddenBalanceText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 38,
    letterSpacing: 2,
  },
  graphContainer: {
    marginVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  scrubHint: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: radius.button,
    gap: 5,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13.5,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.button,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    gap: 6,
  },
  secondaryActionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13.5,
  },
});
