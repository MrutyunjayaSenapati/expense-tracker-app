import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Chip } from '../../components/ui/Chip';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
import { TransactionList } from '../../features/transactions/components/TransactionList';
import { TransactionFiltersSheet } from '../../features/transactions/components/TransactionFiltersSheet';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { filters, sort, setFilters, resetFilters } = useAppStore();

  // Combine store filters with search
  const effectiveFilters = {
    ...filters,
    search: searchQuery,
  };

  const {
    data: transactions = [],
    isLoading,
    isRefetching,
    refetch,
  } = useTransactions(effectiveFilters, sort);

  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const hasActiveFilters =
    (filters.type && filters.type !== 'all') ||
    !!filters.categoryId ||
    !!filters.accountId ||
    !!searchQuery.trim();

  const activeCategory = categories.find(c => c.id === filters.categoryId);
  const activeAccount = accounts.find(a => a.id === filters.accountId);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <AmbientMeshBackground>
        <View style={styles.container}>
          {/* Screen Header */}
          <View style={styles.header}>
            <Text variant="headingL" weight="bold">
              Transactions
            </Text>
            <Text variant="caption" color="secondary">
              {`${transactions.length} recorded`}
            </Text>
          </View>

        {/* Search Bar & Filter Button Row */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchInputContainer}>
            <Input
              placeholder="Search merchants, notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Ionicons name="search" size={17} color={colors.textTertiary} />}
              clearable
              onClear={() => setSearchQuery('')}
              containerStyle={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            onPress={() => setFilterSheetVisible(true)}
            activeOpacity={0.7}
            style={[
              styles.filterBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
              hasActiveFilters && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open filter sheet"
          >
            <Ionicons
              name="filter"
              size={18}
              color={hasActiveFilters ? '#FFFFFF' : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Quick Type Pills (All | Expense | Income) */}
        <View style={styles.quickTypeRow}>
          <TouchableOpacity
            onPress={() => setFilters({ ...filters, type: 'all' })}
            style={[
              styles.quickPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
              (!filters.type || filters.type === 'all') && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text
              variant="caption"
              weight="bold"
              style={{
                color: !filters.type || filters.type === 'all' ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilters({ ...filters, type: 'expense' })}
            style={[
              styles.quickPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
              filters.type === 'expense' && {
                backgroundColor: colors.expense,
                borderColor: colors.expense,
              },
            ]}
          >
            <Text
              variant="caption"
              weight="bold"
              style={{
                color: filters.type === 'expense' ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              Expenses
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilters({ ...filters, type: 'income' })}
            style={[
              styles.quickPill,
              { backgroundColor: colors.surface, borderColor: colors.border },
              filters.type === 'income' && {
                backgroundColor: colors.income,
                borderColor: colors.income,
              },
            ]}
          >
            <Text
              variant="caption"
              weight="bold"
              style={{
                color: filters.type === 'income' ? '#FFFFFF' : colors.textSecondary,
              }}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Filter Chips Bar */}
        {(activeCategory || activeAccount) && (
          <View style={styles.activeChipsRow}>
            {activeCategory && (
              <Chip
                label={activeCategory.name}
                selected
                onPress={() => setFilters({ ...filters, categoryId: undefined })}
              />
            )}
            {activeAccount && (
              <Chip
                label={activeAccount.name}
                selected
                onPress={() => setFilters({ ...filters, accountId: undefined })}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                resetFilters();
              }}
              style={styles.clearAllBtn}
            >
              <Text variant="caption" weight="bold" color="expense">
                Clear Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Grouped Transaction List */}
        <TransactionList
          transactions={transactions}
          categories={categories}
          accounts={accounts}
          isLoading={isLoading}
          isRefreshing={isRefetching}
          onRefresh={refetch}
          onSelectTransaction={id => router.push(`/transactions/${id}`)}
          onAddTransaction={() => router.push('/(tabs)/add')}
          onResetFilters={() => {
            setSearchQuery('');
            resetFilters();
          }}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Filter Bottom Sheet */}
        <TransactionFiltersSheet
          visible={filterSheetVisible}
          onClose={() => setFilterSheetVisible(false)}
          filters={filters}
          categories={categories}
          accounts={accounts}
          onApply={setFilters}
          onReset={resetFilters}
        />
        </View>
      </AmbientMeshBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.input,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTypeRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginVertical: spacing.xs,
  },
  quickPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  activeChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  clearAllBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
