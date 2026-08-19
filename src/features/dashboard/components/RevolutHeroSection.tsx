import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useHaptics } from '../../../hooks/useHaptics';
import { useUser } from '../../../hooks/useUser';
import { Account } from '../../../types/account';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { AnimatedNumber } from '../../../components/ui/AnimatedNumber';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { formatCurrency } from '../../../utils/currency';
import { CURRENCIES, CurrencyCode } from '../../../types/currency';

export interface RevolutHeroSectionProps {
  totalBalance: number;
  netSavings: number;
  accounts: Account[];
  onAddExpense?: () => void;
}

export const RevolutHeroSection: React.FC<RevolutHeroSectionProps> = ({
  totalBalance,
  netSavings,
  accounts,
  onAddExpense,
}) => {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;
  const currencyConfig = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);
  const activeBalance = selectedAccount ? Number(selectedAccount.balance) : totalBalance;
  const isPositiveSavings = netSavings >= 0;

  const toggleVisibility = () => {
    haptics.light();
    setIsBalanceHidden(prev => !prev);
  };

  return (
    <View style={styles.container}>
      {/* 1. Revolut Account Selector Pill */}
      <View style={styles.pillRow}>
        <TouchableOpacity
          onPress={() => {
            haptics.selection();
            setAccountSheetVisible(true);
          }}
          activeOpacity={0.7}
          style={[
            styles.accountPill,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Select active account"
        >
          <View style={[styles.flagDot, { backgroundColor: colors.primary }]}>
            <Ionicons name="wallet" size={11} color="#FFFFFF" />
          </View>
          <Text variant="caption" weight="bold" color="primary" numberOfLines={1} style={styles.pillText}>
            {selectedAccount ? selectedAccount.name : 'All Accounts'}
          </Text>
          <Ionicons name="chevron-down" size={14} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 2. Hero Big Balance with Eye Hide/Show */}
      <View style={styles.balanceRow}>
        {isBalanceHidden ? (
          <Text variant="display" weight="bold" style={[styles.hiddenBalance, { color: colors.textPrimary }]}>
            {currencyConfig.symbol} • • • • • •
          </Text>
        ) : (
          <View style={styles.amountWrapper}>
            <Text variant="display" weight="bold" style={[styles.currencySymbol, { color: colors.textPrimary }]}>
              {currencyConfig.symbol}
            </Text>
            <AnimatedNumber
              value={activeBalance}
              variant="display"
              weight="bold"
              style={[styles.balanceNumber, { color: colors.textPrimary }]}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={toggleVisibility}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.eyeBtn}
          accessibilityLabel="Toggle balance visibility"
        >
          <Ionicons
            name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>
      </View>

      {/* 3. Monthly Net Savings / Rate Badge */}
      <View style={styles.badgeRow}>
        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor: isPositiveSavings ? colors.incomeSoft : colors.expenseSoft,
            },
          ]}
        >
          <Ionicons
            name={isPositiveSavings ? 'arrow-up' : 'arrow-down'}
            size={12}
            color={isPositiveSavings ? colors.income : colors.expense}
          />
          <Text
            variant="caption"
            weight="bold"
            style={{
              color: isPositiveSavings ? colors.income : colors.expense,
              marginLeft: 4,
              fontSize: 12,
            }}
          >
            {isPositiveSavings ? '+' : '-'}
            {formatCurrency(Math.abs(netSavings), { currency: currencyCode })} this month
          </Text>
        </View>
      </View>

      {/* 4. Revolut 4 Circular Action Buttons */}
      <View style={styles.actionGrid}>
        {/* Button 1: Add Money / Log */}
        <View style={styles.actionCol}>
          <TouchableOpacity
            onPress={() => {
              haptics.medium();
              if (onAddExpense) {
                onAddExpense();
              } else {
                router.push('/(tabs)/add');
              }
            }}
            activeOpacity={0.8}
            style={[styles.circleBtnPrimary, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            accessibilityLabel="Add transaction"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text variant="caption" weight="semibold" color="secondary" style={styles.actionLabel}>
            Add Money
          </Text>
        </View>

        {/* Button 2: Transfer / Log */}
        <View style={styles.actionCol}>
          <TouchableOpacity
            onPress={() => {
              haptics.light();
              router.push('/(tabs)/add');
            }}
            activeOpacity={0.8}
            style={[
              styles.circleBtnGlass,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Transfer"
          >
            <Ionicons name="swap-horizontal" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="caption" weight="semibold" color="secondary" style={styles.actionLabel}>
            Transfer
          </Text>
        </View>

        {/* Button 3: Analytics */}
        <View style={styles.actionCol}>
          <TouchableOpacity
            onPress={() => {
              haptics.light();
              router.push('/(tabs)/reports');
            }}
            activeOpacity={0.8}
            style={[
              styles.circleBtnGlass,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Analytics and Reports"
          >
            <Ionicons name="pie-chart-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="caption" weight="semibold" color="secondary" style={styles.actionLabel}>
            Analytics
          </Text>
        </View>

        {/* Button 4: Accounts / More */}
        <View style={styles.actionCol}>
          <TouchableOpacity
            onPress={() => {
              haptics.light();
              router.push('/accounts');
            }}
            activeOpacity={0.8}
            style={[
              styles.circleBtnGlass,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Manage Accounts"
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text variant="caption" weight="semibold" color="secondary" style={styles.actionLabel}>
            Accounts
          </Text>
        </View>
      </View>

      {/* Account Picker Bottom Sheet */}
      <BottomSheet
        visible={accountSheetVisible}
        onClose={() => setAccountSheetVisible(false)}
        title="Select Account"
      >
        <ScrollView style={{ maxHeight: 360 }}>
          {/* Option 1: All Accounts */}
          <TouchableOpacity
            onPress={() => {
              setSelectedAccountId(null);
              setAccountSheetVisible(false);
              haptics.selection();
            }}
            style={[
              styles.sheetItem,
              selectedAccountId === null && { backgroundColor: colors.primaryLight },
            ]}
          >
            <View style={[styles.sheetIconBox, { backgroundColor: colors.primary }]}>
              <Ionicons name="globe-outline" size={18} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text variant="bodyLarge" weight="bold">
                All Accounts
              </Text>
              <Text variant="caption" color="secondary">
                Net Total: {formatCurrency(totalBalance, { currency: currencyCode })}
              </Text>
            </View>
            {selectedAccountId === null && (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            )}
          </TouchableOpacity>

          {/* User's Individual Accounts */}
          {accounts.map(acc => (
            <TouchableOpacity
              key={acc.id}
              onPress={() => {
                setSelectedAccountId(acc.id);
                setAccountSheetVisible(false);
                haptics.selection();
              }}
              style={[
                styles.sheetItem,
                selectedAccountId === acc.id && { backgroundColor: colors.primaryLight },
              ]}
            >
              <View style={[styles.sheetIconBox, { backgroundColor: colors.surfaceMuted }]}>
                <Ionicons name="wallet-outline" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text variant="bodyLarge" weight="bold">
                  {acc.name}
                </Text>
                <Text variant="caption" color="secondary">
                  {formatCurrency(Number(acc.balance), { currency: currencyCode })}
                </Text>
              </View>
              {selectedAccountId === acc.id && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    width: '100%',
  },
  pillRow: {
    marginBottom: spacing.sm,
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  flagDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    maxWidth: 160,
    fontSize: 13,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 6,
    position: 'relative',
    paddingHorizontal: 30,
  },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '800',
    marginRight: 4,
  },
  balanceNumber: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  hiddenBalance: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 2,
  },
  eyeBtn: {
    marginLeft: spacing.xs,
    padding: 6,
  },
  badgeRow: {
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  actionCol: {
    alignItems: 'center',
    gap: 6,
  },
  circleBtnPrimary: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#0075FF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  circleBtnGlass: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  actionLabel: {
    fontSize: 12,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginBottom: 4,
  },
  sheetIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
