import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SpendingTrendPoint } from '../../../types/reports';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';

export interface MonthlyTrendChartProps {
  data: SpendingTrendPoint[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  const { colors } = useTheme();

  if (data.length === 0) return null;

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.income, d.expense)),
    1000
  );

  const isCompact = data.length <= 7;

  return (
    <Card variant="solid" elevation="sm" style={styles.card}>
      <View style={styles.header}>
        <Text variant="headingS" weight="bold">
          Spending & Income Trend
        </Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
            <Text variant="caption" color="secondary">
              Income
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
            <Text variant="caption" color="secondary">
              Expense
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.chartBody,
          isCompact && styles.chartBodyCompact,
        ]}
      >
        {data.map((point, index) => {
          const incomeHeight = (point.income / maxVal) * 110;
          const expenseHeight = (point.expense / maxVal) * 110;

          return (
            <View key={index} style={styles.barGroup}>
              <View style={[styles.barsContainer, { backgroundColor: colors.surfaceMuted }]}>
                {/* Income bar */}
                {point.income > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(incomeHeight, 8),
                        backgroundColor: colors.income,
                      },
                    ]}
                  />
                )}
                {/* Expense bar */}
                {point.expense > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: Math.max(expenseHeight, 8),
                        backgroundColor: colors.expense,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                variant="caption"
                color="secondary"
                numberOfLines={1}
                style={styles.pointLabel}
              >
                {point.label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chartBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 145,
    gap: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: 2,
  },
  chartBodyCompact: {
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  barGroup: {
    alignItems: 'center',
    minWidth: 38,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 115,
    paddingHorizontal: 3,
    paddingBottom: 2,
    borderRadius: radius.sm,
    gap: 3,
  },
  bar: {
    width: 10,
    borderTopLeftRadius: radius.xs,
    borderTopRightRadius: radius.xs,
  },
  pointLabel: {
    marginTop: 6,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
});
