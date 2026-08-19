import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSplitBills } from '../../../hooks/useSplitBills';
import { useTheme } from '../../../hooks/useTheme';
import { useUser } from '../../../hooks/useUser';
import { useHaptics } from '../../../hooks/useHaptics';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyCode } from '../../../types/currency';

export const SharedDebtsBanner: React.FC = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const { summary } = useSplitBills();

  const hasOwedToYou = summary.totalOwedToYou > 0;
  const hasYouOwe = summary.totalYouOwe > 0;

  if (!hasOwedToYou && !hasYouOwe) {
    return null; // Don't show clutter if there are no shared bills
  }

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(80)} style={{ marginBottom: spacing.md }}>
      <TouchableOpacity
        onPress={() => {
          haptics.selection();
          router.push('/splits');
        }}
        activeOpacity={0.8}
      >
        <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Ionicons name="people" size={16} color={colors.primary} />
              <Text variant="captionBold" color="secondary" style={styles.headerLabel}>
                SHARED BILLS & SOCIAL DEBTS
              </Text>
            </View>
            <Text variant="captionBold" color="brand">
              Manage →
            </Text>
          </View>

          <View style={styles.debtGrid}>
            {/* Owed to you */}
            <View style={[styles.debtBox, { backgroundColor: colors.incomeSoft }]}>
              <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                YOU ARE OWED
              </Text>
              <Text variant="bodyLarge" weight="bold" style={{ color: colors.income, marginTop: 2 }}>
                +{formatCurrency(summary.totalOwedToYou, { currency: currencyCode })}
              </Text>
            </View>

            {/* You owe */}
            <View
              style={[
                styles.debtBox,
                { backgroundColor: hasYouOwe ? colors.expenseSoft : colors.surfaceMuted },
              ]}
            >
              <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                YOU OWE
              </Text>
              <Text
                variant="bodyLarge"
                weight="bold"
                style={{ color: hasYouOwe ? colors.expense : colors.textSecondary, marginTop: 2 }}
              >
                {hasYouOwe
                  ? `-${formatCurrency(summary.totalYouOwe, { currency: currencyCode })}`
                  : '₹0'}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs + 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLabel: {
    letterSpacing: 0.6,
    fontSize: 11,
  },
  debtGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  debtBox: {
    flex: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 4,
    borderRadius: radius.md,
  },
});
