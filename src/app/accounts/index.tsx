import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAccounts } from '../../hooks/useAccounts';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { AccountCard } from '../../features/accounts/components/AccountCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency } from '../../utils/currency';
import { calculateTotalBalance } from '../../utils/calculations';
import { Ionicons } from '@expo/vector-icons';

export default function AccountsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: accounts = [], isLoading, isRefetching, isError, refetch } = useAccounts();

  const totalBalance = calculateTotalBalance(accounts);

  if (isLoading && accounts.length === 0) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <CardSkeleton />
        <CardSkeleton />
      </ScrollView>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState
          title="Could not load accounts"
          message="Failed to retrieve accounts."
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Net Worth Hero Card */}
        <Card elevation="sm" style={styles.heroCard}>
          <Text variant="label" color="secondary">
            TOTAL NET LIQUIDITY
          </Text>
          <Text variant="display" weight="bold" style={styles.balanceText}>
            {formatCurrency(totalBalance)}
          </Text>
          <Text variant="caption" color="secondary">
            Across {accounts.length} active financial accounts
          </Text>
        </Card>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text variant="headingS" weight="bold">
            Accounts & Payment Methods
          </Text>
        </View>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <EmptyState
            icon="wallet-outline"
            title="No accounts found"
            message="Add your bank accounts, cash wallet, or cards."
            actionLabel="Add Account"
            onAction={() => router.push('/accounts/create')}
          />
        ) : (
          accounts.map(acc => (
            <AccountCard
              key={acc.id}
              account={acc}
              onPress={() => router.push(`/accounts/create?id=${acc.id}`)}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Add Account FAB */}
      <TouchableOpacity
        onPress={() => router.push('/accounts/create')}
        activeOpacity={0.85}
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel="Add new account"
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: 120,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  heroCard: {
    marginBottom: spacing.lg,
  },
  balanceText: {
    marginVertical: spacing.xs,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
