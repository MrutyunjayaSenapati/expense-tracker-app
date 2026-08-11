import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useCategories, useCreateCategory } from '../../hooks/useCategories';
import { CategoryType, CreateCategoryInput } from '../../types/category';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { CategoryCard } from '../../features/categories/components/CategoryCard';
import { CategoryForm } from '../../features/categories/components/CategoryForm';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriesScreen() {
  const [selectedType, setSelectedType] = useState<CategoryType>('expense');
  const [addSheetVisible, setAddSheetVisible] = useState(false);
  const { colors } = useTheme();

  const {
    data: categories = [],
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useCategories(selectedType);

  const createCategoryMutation = useCreateCategory();

  const handleCreateCategory = async (input: CreateCategoryInput) => {
    try {
      await createCategoryMutation.mutateAsync(input);
      setAddSheetVisible(false);
    } catch {
      // Handled in mutation onError
    }
  };

  if (isLoading && categories.length === 0) {
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
          title="Could not load categories"
          message="Failed to retrieve category items."
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
        {/* Type Toggle */}
        <SegmentedControl
          options={[
            { value: 'expense', label: 'Expense Categories' },
            { value: 'income', label: 'Income Categories' },
          ]}
          value={selectedType}
          onChange={setSelectedType}
          style={styles.typeControl}
        />

        {/* Categories List */}
        {categories.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </ScrollView>

      {/* Floating Add Category FAB */}
      <TouchableOpacity
        onPress={() => setAddSheetVisible(true)}
        activeOpacity={0.85}
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        accessibilityRole="button"
        accessibilityLabel="Add new category"
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Category Sheet */}
      <BottomSheet
        visible={addSheetVisible}
        onClose={() => setAddSheetVisible(false)}
        title="Add New Category"
      >
        <CategoryForm
          onSubmit={handleCreateCategory}
          isSubmitting={createCategoryMutation.isPending}
        />
      </BottomSheet>
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
  typeControl: {
    marginBottom: spacing.lg,
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
