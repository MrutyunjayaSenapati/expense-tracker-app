import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { formatCurrency } from '../../utils/currency';
import { CategorySpending } from '../../types/reports';
import { useHaptics } from '../../hooks/useHaptics';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

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
  size = 110,
  strokeWidth = 12,
}) => {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const radiusVal = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radiusVal;

  const slices = useMemo(
    () => computeSlices(categories, circumference),
    [categories, circumference]
  );

  const selectedCategory = categories.find(c => c.categoryId === selectedCategoryId);

  const handleSelectCategory = (catId: string) => {
    haptics.selection();
    setSelectedCategoryId(prev => (prev === catId ? null : catId));
  };

  const centerAmount = selectedCategory ? selectedCategory.amount : totalSpent;
  const centerLabel = selectedCategory ? selectedCategory.categoryName : 'Total Spent';

  return (
    <View style={styles.container}>
      {/* Animated Donut Graphic */}
      <Animated.View
        entering={ZoomIn.duration(500).springify()}
        style={[styles.chartWrapper, { width: size, height: size }]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G transform={`rotate(-90 ${center} ${center})`}>
            {/* Background Ring */}
            <Circle
              cx={center}
              cy={center}
              r={radiusVal}
              stroke={colors.surfaceMuted}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Category Arcs */}
            {slices.map(slice => {
              const isSelected = selectedCategoryId === slice.categoryId;
              const hasSelection = selectedCategoryId !== null;
              const arcOpacity = hasSelection ? (isSelected ? 1 : 0.25) : 1;
              const currentStroke = isSelected ? strokeWidth + 3 : strokeWidth;

              return (
                <Circle
                  key={slice.categoryId}
                  cx={center}
                  cy={center}
                  r={radiusVal}
                  stroke={slice.categoryColor}
                  strokeWidth={currentStroke}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  fill="none"
                  strokeLinecap="round"
                  opacity={arcOpacity}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Amount & Label */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCategoryId(null)}
          style={styles.centerTextContainer}
        >
          <Text
            variant="bodyLarge"
            weight="bold"
            align="center"
            style={styles.centerAmount}
          >
            {formatCurrency(centerAmount)}
          </Text>
          <Text
            variant="caption"
            weight="medium"
            color="secondary"
            align="center"
            numberOfLines={1}
            style={styles.centerLabel}
          >
            {centerLabel}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Interactive Stacked Legend List */}
      <Animated.View
        entering={FadeIn.delay(150).duration(400)}
        style={styles.legendContainer}
      >
        {categories.slice(0, 4).map(cat => {
          const isSelected = cat.categoryId === selectedCategoryId;
          return (
            <TouchableOpacity
              key={cat.categoryId}
              onPress={() => handleSelectCategory(cat.categoryId)}
              activeOpacity={0.7}
              style={[
                styles.legendRow,
                isSelected && { backgroundColor: colors.surfaceMuted, borderRadius: radius.xs, paddingHorizontal: 6 },
              ]}
            >
              <View style={[styles.legendDot, { backgroundColor: cat.categoryColor }]} />
              <View style={styles.legendTextCol}>
                <Text
                  variant="bodySmall"
                  weight={isSelected ? 'bold' : 'semibold'}
                  color={isSelected ? 'primary' : 'primary'}
                  numberOfLines={1}
                >
                  {cat.categoryName}
                </Text>
                <Text variant="caption" color="secondary" style={styles.subText}>
                  {`${formatCurrency(cat.amount)} · ${cat.percentage}%`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
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
    width: 85,
  },
  centerAmount: {
    fontSize: 14.5,
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  centerLabel: {
    fontSize: 10,
    marginTop: 1,
    maxWidth: 75,
  },
  legendContainer: {
    flex: 1,
    marginLeft: spacing.lg,
    gap: spacing.xs + 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.sm,
  },
  legendTextCol: {
    flex: 1,
  },
  subText: {
    fontSize: 11.5,
    marginTop: 1,
  },
});
