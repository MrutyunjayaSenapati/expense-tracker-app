import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/currency';
import { CategorySpending } from '../../types/reports';

export interface DonutChartProps {
  categories: CategorySpending[];
  totalSpent: number;
  size?: number;
  strokeWidth?: number;
}

interface SlicedCategory extends CategorySpending {
  strokeDasharray: string;
  strokeDashoffset: number;
}

function computeSlices(categories: CategorySpending[], circumference: number): SlicedCategory[] {
  let currentAngle = 0;
  const result: SlicedCategory[] = [];
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((currentAngle / 360) * circumference);
    currentAngle += (cat.percentage / 100) * 360;
    result.push({
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    });
  }
  return result;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  categories,
  totalSpent,
  size = 140,
  strokeWidth = 24,
}) => {
  const { colors } = useTheme();

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate slice angles and offsets
  const slices = useMemo(
    () => computeSlices(categories, circumference),
    [categories, circumference]
  );

  return (
    <View style={styles.container}>
      {/* Donut graphic with center cutout */}
      <View style={[styles.chartWrapper, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G transform={`rotate(-90 ${center} ${center})`}>
            {/* Background ring */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={colors.surfaceMuted}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Category Arcs */}
            {slices.map(slice => (
              <Circle
                key={slice.categoryId}
                cx={center}
                cy={center}
                r={radius}
                stroke={slice.categoryColor}
                strokeWidth={strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                fill="none"
                strokeLinecap="butt"
              />
            ))}
          </G>
        </Svg>

        {/* Center Text */}
        <View style={styles.centerTextContainer}>
          <Text
            variant="headingS"
            weight="bold"
            align="center"
            style={styles.centerAmount}
          >
            {formatCurrency(totalSpent)}
          </Text>
          <Text
            variant="caption"
            weight="medium"
            color="secondary"
            align="center"
            style={styles.centerLabel}
          >
            Total Spent
          </Text>
        </View>
      </View>

      {/* Legend List */}
      <View style={styles.legendContainer}>
        {categories.slice(0, 5).map(cat => (
          <View key={cat.categoryId} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: cat.categoryColor },
                ]}
              />
              <Text
                variant="bodySmall"
                weight="medium"
                numberOfLines={1}
                style={styles.categoryName}
              >
                {cat.categoryName}
              </Text>
            </View>

            <View style={styles.legendRight}>
              <Text variant="caption" color="secondary" style={styles.percentageText}>
                {`${cat.percentage}%`}
              </Text>
              <Text variant="bodySmall" weight="bold">
                {formatCurrency(cat.amount)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  chartWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  centerAmount: {
    fontSize: 15,
    lineHeight: 18,
  },
  centerLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  legendContainer: {
    flex: 1,
    marginLeft: spacing.lg,
    gap: spacing.xs + 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs + 2,
  },
  categoryName: {
    flexShrink: 1,
    fontSize: 13,
  },
  legendRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  percentageText: {
    minWidth: 40,
    textAlign: 'right',
  },
});
