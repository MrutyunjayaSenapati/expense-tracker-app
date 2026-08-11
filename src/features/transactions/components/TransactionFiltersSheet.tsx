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

export const TransactionFiltersSheet: React.FC<TransactionFiltersSheetProps> = ({
  visible,
  onClose,
  filters,
  categories,
  accounts,
  onApply,
  onReset,
}) => {
  const [draftFilters, setDraftFilters] = useState<TransactionFilters>({ ...filters });

  const handleTypeChange = (type: 'expense' | 'income' | 'all') => {
    setDraftFilters(prev => ({
      ...prev,
      type,
      // If type changed and current category belongs to another type, reset category
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
    <BottomSheet visible={visible} onClose={onClose} title="Filter Transactions">
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
            contentContainerStyle={styles.chipRow}
          >
            {availableCategories.map(cat => (
              <Chip
                key={cat.id}
                label={cat.name}
                selected={draftFilters.categoryId === cat.id}
                onPress={() => toggleCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Accounts */}
        <View style={styles.section}>
          <Text variant="label" color="secondary" style={styles.sectionLabel}>
            ACCOUNT
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {accounts.map(acc => (
              <Chip
                key={acc.id}
                label={acc.name}
                selected={draftFilters.accountId === acc.id}
                onPress={() => toggleAccount(acc.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button variant="secondary" size="md" onPress={handleReset} style={styles.btn}>
            Reset
          </Button>
          <Button variant="primary" size="md" onPress={handleApply} style={styles.btn}>
            Apply Filters
          </Button>
        </View>
      </ScrollView>
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
    marginBottom: spacing.xs,
  },
  chipRow: {
    paddingVertical: spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  btn: {
    flex: 1,
  },
});
