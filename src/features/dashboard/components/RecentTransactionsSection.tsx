import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { Transaction } from '../../../types/transaction';
import { Category } from '../../../types/category';
import { Account } from '../../../types/account';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { TransactionRow } from '../../transactions/components/TransactionRow';
import { Ionicons } from '@expo/vector-icons';

export interface RecentTransactionsSectionProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onSeeAll: () => void;
  onSelectTransaction: (id: string) => void;
  onAddTransaction: () => void;
}

export const RecentTransactionsSection: React.FC<RecentTransactionsSectionProps> = ({
  transactions,
  categories,
  accounts,
  onSeeAll,
  onSelectTransaction,
}) => {
  const { colors } = useTheme();

  const categoryMap = new Map(categories.map(c => [c.id, c]));
  const accountMap = new Map(accounts.map(a => [a.id, a]));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headingS" weight="bold">
          Recent Transactions
        </Text>
        <TouchableOpacity
          onPress={onSeeAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.seeAllBtn}
          accessibilityLabel="See all transactions"
        >
          <Text variant="caption" weight="semibold" color="brand">
            See All
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Transaction Items */}
      <Card variant="solid" elevation="sm" padding={0} style={styles.listCard}>
        {transactions.slice(0, 4).map((txn, index) => (
          <View key={txn.id}>
            <TransactionRow
              transaction={txn}
              category={categoryMap.get(txn.categoryId)}
              account={accountMap.get(txn.accountId)}
              onPress={() => onSelectTransaction(txn.id)}
              style={styles.rowStyle}
            />
            {index < Math.min(transactions.length, 4) - 1 && (
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
            )}
          </View>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
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
  listCard: {
    overflow: 'hidden',
  },
  rowStyle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
    borderRadius: 0,
  },
  separator: {
    height: 1,
    marginLeft: 60,
  },
});
