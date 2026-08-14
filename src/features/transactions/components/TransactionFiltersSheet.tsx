import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TransactionFilters } from '../../../types/transaction';
import { Category } from '../../../types/category';
import { Account } from '../../../types/account';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { Button } from '../../../components/ui/Button';
import { Chip } from '../../../components/ui/Chip';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';

export interface TransactionFiltersSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: TransactionFilters;
  categories: Category[];
  accounts: Account[];
  onApply: (filters: TransactionFilters) => void;
  onReset: () => void;
}

const FilterSheetBody: React.FC<{
  filters: TransactionFilters;
  categories: Category[];
  accounts: Account[];
  onApply: (filters: TransactionFilters) => void;
  onReset: () => void;
  onClose: () => void;
}> = ({ filters, categories, accounts, onApply, onReset, onClose }) => {
  const [draftFilters, setDraftFilters] = useState<TransactionFilters>({ ...filters });

  const handleTypeChange = (type: 'expense' | 'income' | 'all') => {
    setDraftFilters(prev => ({
      ...prev,
      type,
      categoryId: undefined,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setDraftFilters(prev => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? undefined : categoryId,
    }));
  };

  const toggleAccount = (accountId: string) => {
    setDraftFilters(prev => ({
      ...prev,
      accountId: prev.accountId === accountId ? undefined : accountId,
    }));
  };

  const handleApply = () => {
    onApply(draftFilters);
    onClose();
  };

  const handleReset = () => {
    setDraftFilters({ type: 'all' });
    onReset();
    onClose();
  };

  const availableCategories =
    draftFilters.type && draftFilters.type !== 'all'
      ? categories.filter(c => c.type === draftFilters.type)
      : categories;

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Transaction Type */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          TYPE
        </Text>
        <SegmentedControl
          options={[
            { value: 'all', label: 'All' },
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
          value={draftFilters.type || 'all'}
          onChange={handleTypeChange}
          semanticColoring={false}
        />
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          CATEGORY
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {availableCategories.map(cat => {
            const isSelected = draftFilters.categoryId === cat.id;
            return (
              <Chip
                key={cat.id}
                label={cat.name}
                selected={isSelected}
                onPress={() => toggleCategory(cat.id)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Accounts */}
      <View style={styles.section}>
        <Text variant="label" color="secondary" style={styles.sectionLabel}>
          ACCOUNT / WALLET
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {accounts.map(acc => {
            const isSelected = draftFilters.accountId === acc.id;
            return (
              <Chip
                key={acc.id}
                label={acc.name}
                selected={isSelected}
                onPress={() => toggleAccount(acc.id)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button variant="primary" size="lg" onPress={handleApply} fullWidth>
          Apply Filters
        </Button>
        <Button
          variant="ghost"
          size="md"
          onPress={handleReset}
          fullWidth
          style={styles.resetBtn}
        >
          Reset All Filters
        </Button>
      </View>
    </ScrollView>
  );
};

export const TransactionFiltersSheet: React.FC<TransactionFiltersSheetProps> = ({
  visible,
  onClose,
  filters,
  categories,
  accounts,
  onApply,
  onReset,
}) => {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Filter Transactions">
      {visible && (
        <FilterSheetBody
          key={visible ? 'open' : 'closed'}
          filters={filters}
          categories={categories}
          accounts={accounts}
          onApply={onApply}
          onReset={onReset}
          onClose={onClose}
        />
      )}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    marginBottom: spacing.xs + 2,
    letterSpacing: 0.6,
  },
  chipsContainer: {
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  resetBtn: {
    marginTop: 2,
  },
});
