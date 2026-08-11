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
      <View style={styles.container}>
        {/* Screen Header */}
        <View style={styles.header}>
          <Text variant="headingL" weight="bold">
            Transactions
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/add')}
            activeOpacity={0.8}
            style={[styles.addIconBtn, { backgroundColor: colors.primary }]}
            accessibilityLabel="Add transaction"
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar & Filter Button Row */}
        <View style={styles.searchFilterRow}>
          <View style={styles.searchInputContainer}>
            <Input
              placeholder="Search merchants, notes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Ionicons name="search" size={18} color={colors.textTertiary} />}
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
              size={20}
              color={hasActiveFilters ? '#FFFFFF' : colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <View style={styles.activeChipsRow}>
            {filters.type && filters.type !== 'all' && (
              <Chip
                label={filters.type.toUpperCase()}
                selected
                onPress={() => setFilters({ ...filters, type: 'all' })}
              />
            )}
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
                Clear All
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  addIconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
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
    width: 50,
    height: 50,
    borderRadius: radius.input,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  clearAllBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
