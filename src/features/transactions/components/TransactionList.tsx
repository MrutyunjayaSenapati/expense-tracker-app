import React, { useMemo } from 'react';
import {
  View,
  SectionList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Transaction } from '../../../types/transaction';
import { Category } from '../../../types/category';
import { Account } from '../../../types/account';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { TransactionRow } from './TransactionRow';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ListSkeleton } from '../../../components/ui/LoadingState';
import { formatRelativeDate, getGroupedDateKey } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';

export interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onSelectTransaction: (id: string) => void;
  onAddTransaction: () => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

interface TransactionSection {
  title: string;
  totalExpense: number;
  totalIncome: number;
  data: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  accounts,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onSelectTransaction,
  onAddTransaction,
  onResetFilters,
  hasActiveFilters = false,
}) => {
  const { colors } = useTheme();
  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);
  const accountMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);

  // Group transactions by date
  const sections = useMemo(() => {
    const groups = new Map<string, Transaction[]>();

    for (const txn of transactions) {
      const dateKey = getGroupedDateKey(txn.date);
      const list = groups.get(dateKey) || [];
      list.push(txn);
      groups.set(dateKey, list);
    }

    const result: TransactionSection[] = [];

    for (const [, items] of groups.entries()) {
      const title = formatRelativeDate(items[0].date);
      let totalExpense = 0;
      let totalIncome = 0;

      for (const item of items) {
        if (item.type === 'expense') totalExpense += item.amount;
        else totalIncome += item.amount;
      }

      result.push({
        title,
        totalExpense,
        totalIncome,
        data: items,
      });
    }

    return result;
  }, [transactions]);

  if (isLoading) {
    return <ListSkeleton count={6} />;
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? 'No matching transactions' : 'No transactions yet'}
        message={
          hasActiveFilters
            ? 'Try adjusting or resetting your active search and filters.'
            : 'Start adding your daily expenses to see them organized here.'
        }
        actionLabel={hasActiveFilters ? 'Reset Filters' : 'Add Expense'}
        onAction={hasActiveFilters ? onResetFilters : onAddTransaction}
      />
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={item => item.id}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        ) : undefined
      }
      renderSectionHeader={({ section: { title, totalExpense, totalIncome } }) => (
        <View style={styles.sectionHeader}>
          <Text variant="captionBold" color="secondary" style={styles.sectionTitle}>
            {title.toUpperCase()}
          </Text>
          {totalExpense > 0 && (
            <View style={[styles.spentPill, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
              <Text variant="caption" weight="bold" color="secondary" style={styles.spentText}>
                {`Spent: ${formatCurrency(totalExpense)}`}
              </Text>
            </View>
          )}
        </View>
      )}
      renderItem={({ item, index, section }) => {
        const isLastItem = index === section.data.length - 1;
        const isFirstItem = index === 0;

        return (
          <Animated.View
            entering={FadeInDown.duration(300).delay(Math.min(index * 25, 150))}
            style={[
              styles.itemContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
              isFirstItem && styles.firstItem,
              isLastItem && styles.lastItem,
            ]}
          >
            <TransactionRow
              transaction={item}
              category={categoryMap.get(item.categoryId)}
              account={accountMap.get(item.accountId)}
              onPress={() => onSelectTransaction(item.id)}
            />
            {!isLastItem && (
              <View style={[styles.separator, { backgroundColor: colors.divider || colors.border }]} />
            )}
          </Animated.View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 140,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    letterSpacing: 0.6,
    fontSize: 11.5,
  },
  spentPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2.5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  spentText: {
    fontSize: 11,
  },
  itemContainer: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  firstItem: {
    borderTopWidth: 1,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
  },
  lastItem: {
    borderBottomWidth: 1,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    marginBottom: spacing.xs,
  },
  separator: {
    height: 1,
    marginLeft: 56,
  },
});
