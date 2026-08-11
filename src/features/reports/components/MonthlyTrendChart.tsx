import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SpendingTrendPoint } from '../../../types/reports';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';

export interface MonthlyTrendChartProps {
  data: SpendingTrendPoint[];
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data }) => {
  if (data.length === 0) return null;

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.income, d.expense)),
    1000
  );

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

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll}>
        <View style={styles.chartBody}>
          {data.map((point, index) => {
            const incomeHeight = (point.income / maxVal) * 110;
            const expenseHeight = (point.expense / maxVal) * 110;

            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.barsContainer}>
                  {/* Income bar */}
                  {point.income > 0 && (
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(incomeHeight, 6),
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
                          height: Math.max(expenseHeight, 6),
                          backgroundColor: colors.expense,
                        },
                      ]}
                    />
                  )}
                </View>
                <Text variant="caption" color="tertiary" style={styles.pointLabel}>
                  {point.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
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
  chartScroll: {
    paddingVertical: spacing.xs,
  },
  chartBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 140,
    gap: spacing.lg,
    paddingHorizontal: spacing.xs,
  },
  barGroup: {
    alignItems: 'center',
    width: 44,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    gap: 4,
  },
  bar: {
    width: 12,
    borderTopLeftRadius: radius.xs,
    borderTopRightRadius: radius.xs,
  },
  pointLabel: {
    marginTop: spacing.xs,
    fontSize: 10,
    textAlign: 'center',
  },
});
