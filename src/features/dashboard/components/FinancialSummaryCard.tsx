import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { SparklineGraph } from '../../../components/ui/SparklineGraph';
import { formatCurrency } from '../../../utils/currency';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

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
  const { colors } = useTheme();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const savingsRate = Math.round((netSavings / 87450) * 100) || 80;

  return (
    <View style={styles.cardContainer}>
      {/* Background Gradient */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.heroGradientStart} stopOpacity="1" />
            <Stop offset="100%" stopColor={colors.heroGradientEnd} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" rx={radius.card} fill="url(#heroGrad)" />
      </Svg>

      {/* Top row: Label & Eye Toggle */}
      <View style={styles.topRow}>
        <Text variant="label" style={{ color: colors.heroTextSecondary }}>
          Total Net Balance
        </Text>
        <TouchableOpacity
          onPress={() => setIsBalanceHidden(!isBalanceHidden)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Toggle balance visibility"
        >
          <Ionicons
            name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="rgba(255, 255, 255, 0.85)"
          />
        </TouchableOpacity>
      </View>

      {/* Center Row: Large Balance & Glowing Sparkline Graph */}
      <View style={styles.centerRow}>
        <View style={styles.balanceCol}>
          {isBalanceHidden ? (
            <Text
              variant="display"
              weight="bold"
              style={styles.hiddenBalanceText}
            >
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

        {/* Glowing Sparkline Graph */}
        <SparklineGraph
          width={130}
          height={55}
          strokeColor={colors.heroSparkline}
          gradientStartColor={colors.heroSparklineGlow}
          dotColor={colors.heroDot}
          style={styles.sparkline}
        />
      </View>

      {/* Bottom Row: Net Savings + Trend Badge Pill */}
      <View style={styles.bottomRow}>
        <View style={styles.savingsRow}>
          <Ionicons name="arrow-up" size={14} color="#34D399" />
          <Text variant="caption" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            {`Net Savings ${formatCurrency(netSavings, { sign: true })} (${savingsRate}%)`}
          </Text>
        </View>

        <View style={styles.trendPill}>
          <Text variant="caption" weight="bold" style={styles.trendText}>
            +12.5%
          </Text>
          <Text variant="caption" style={styles.trendSubText}>
            vs last month
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.xs,
  },
  balanceCol: {
    flex: 1,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 38,
  },
  hiddenBalanceText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
  },
  sparkline: {
    marginLeft: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  trendPill: {
    alignItems: 'flex-end',
  },
  trendText: {
    color: '#34D399',
    fontSize: 11,
  },
  trendSubText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
  },
});
