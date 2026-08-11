import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useBudget,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from '../../hooks/useBudgets';
import { useCategories } from '../../hooks/useCategories';
import { useTheme } from '../../hooks/useTheme';
import { BudgetForm } from '../../features/budgets/components/BudgetForm';
import { BudgetFormValues } from '../../schemas/budgetSchema';
import { CardSkeleton } from '../../components/ui/LoadingState';

export default function CreateBudgetScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { data: budget, isLoading: isBudgetLoading } = useBudget(id);
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();

  const createBudgetMutation = useCreateBudget();
  const updateBudgetMutation = useUpdateBudget();
  const deleteBudgetMutation = useDeleteBudget();

  const handleSubmit = async (values: BudgetFormValues) => {
    try {
      if (id) {
        await updateBudgetMutation.mutateAsync({
          id,
          input: values,
        });
      } else {
        await createBudgetMutation.mutateAsync(values);
      }
      router.back();
    } catch {
      // Handled in mutation onError
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteBudgetMutation.mutateAsync(id);
      router.back();
    } catch {
      // Handled in mutation onError
    }
  };

  if ((id && isBudgetLoading) || isCategoriesLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <CardSkeleton />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BudgetForm
        initialValues={
          budget
            ? {
                name: budget.name,
                amount: budget.amount,
                categoryId: budget.categoryId,
                period: budget.period,
                startDate: budget.startDate,
                endDate: budget.endDate,
              }
            : undefined
        }
        categories={categories}
        onSubmit={handleSubmit}
        onDelete={id ? handleDelete : undefined}
        isSubmitting={createBudgetMutation.isPending || updateBudgetMutation.isPending}
        mode={id ? 'edit' : 'create'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    padding: 16,
  },
});
