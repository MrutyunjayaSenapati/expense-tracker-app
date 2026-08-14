import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { CategorySpending } from '../../../types/reports';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { DonutChart } from '../../../components/ui/DonutChart';
import { Ionicons } from '@expo/vector-icons';

export interface SpendingByCategoryCardProps {
  categories: CategorySpending[];
  onViewReports: () => void;
}

export const SpendingByCategoryCard: React.FC<SpendingByCategoryCardProps> = ({
  categories,
  onViewReports,
}) => {
  const { colors } = useTheme();

  const totalSpent = categories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <Card variant="solid" elevation="sm" style={styles.card}>
      <View style={styles.header}>
        <Text variant="headingS" weight="bold">
          Top Categories
        </Text>
        <TouchableOpacity
          onPress={onViewReports}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.seeAllBtn}
          accessibilityLabel="View detailed reports"
        >
          <Text variant="caption" weight="semibold" color="brand">
            Reports
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Donut Chart Visualization */}
      <DonutChart
        categories={categories}
        totalSpent={totalSpent}
        size={110}
        strokeWidth={12}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
