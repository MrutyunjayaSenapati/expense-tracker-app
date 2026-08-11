import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PaymentMethodSpending } from '../../../types/reports';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { formatCurrency } from '../../../utils/currency';
import { Ionicons } from '@expo/vector-icons';

export interface PaymentMethodCardProps {
  paymentMethods: PaymentMethodSpending[];
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({ paymentMethods }) => {
  const { colors } = useTheme();
  if (paymentMethods.length === 0) return null;

  return (
    <Card elevation="sm" style={styles.card}>
      <Text variant="headingS" weight="bold" style={styles.title}>
        Spending by Account & Payment Method
      </Text>

      <View style={styles.list}>
        {paymentMethods.map(pm => (
          <View key={pm.accountId} style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
              <Ionicons name="wallet-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.content}>
              <View style={styles.labelRow}>
                <Text variant="body" weight="semibold">
                  {pm.accountName}
                </Text>
                <Text variant="body" weight="bold">
                  {formatCurrency(pm.amount)}
                </Text>
              </View>
              <View style={styles.progressRow}>
                <ProgressBar
                  progress={pm.percentage / 100}
                  color={colors.primary}
                  height={6}
                  autoColor={false}
                  style={styles.progressBar}
                />
                <Text variant="caption" color="secondary" style={styles.pctText}>
                  {`${pm.percentage}%`}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
  },
  pctText: {
    marginLeft: spacing.sm,
    minWidth: 35,
    textAlign: 'right',
  },
});
