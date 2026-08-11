import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCreateTransaction } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { useTheme } from '../../hooks/useTheme';
import { TransactionForm } from '../../features/transactions/forms/TransactionForm';
import { TransactionFormValues } from '../../schemas/transactionSchema';
import { CardSkeleton } from '../../components/ui/LoadingState';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const createTransactionMutation = useCreateTransaction();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: accounts = [], isLoading: isAccountsLoading } = useAccounts();

  const handleSave = async (values: TransactionFormValues) => {
    await createTransactionMutation.mutateAsync({
      type: values.type,
      amount: values.amount,
      categoryId: values.categoryId,
      accountId: values.accountId,
      date: values.date,
      merchant: values.merchant || undefined,
      note: values.note || undefined,
      receiptId: values.receiptUri || undefined,
    });

    // Short tactile pause to allow success checkmark feedback
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/home');
      }
    }, 450);
  };

  if (isCategoriesLoading || isAccountsLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <CardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <TransactionForm
        categories={categories}
        accounts={accounts}
        onSubmit={handleSave}
        isSubmitting={createTransactionMutation.isPending}
        mode="create"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    padding: 16,
  },
});
