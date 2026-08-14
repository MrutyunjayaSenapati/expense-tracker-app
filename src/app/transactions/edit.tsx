import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { TransactionForm } from '../../features/transactions/forms/TransactionForm';
import { TransactionFormValues } from '../../schemas/transactionSchema';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useTheme } from '../../hooks/useTheme';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { data: transaction, isLoading: isTxnLoading, isError, refetch } = useTransaction(id);
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: accounts = [], isLoading: isAccountsLoading } = useAccounts();

  const updateTransactionMutation = useUpdateTransaction();
  const deleteTransactionMutation = useDeleteTransaction();

  const handleUpdate = async (values: TransactionFormValues) => {
    if (!id) return;
    try {
      await updateTransactionMutation.mutateAsync({
        id,
        input: {
          type: values.type,
          amount: values.amount,
          categoryId: values.categoryId,
          accountId: values.accountId,
          date: values.date,
          merchant: values.merchant || undefined,
          note: values.note || undefined,
          receiptId: values.receiptUri || undefined,
        },
      });
      router.back();
    } catch {
      // Handled in mutation onError
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTransactionMutation.mutateAsync(id);
      setDeleteModalVisible(false);
      // Go back to transactions list
      router.replace('/(tabs)/transactions');
    } catch {
      // Handled in mutation onError
    }
  };

  if (isTxnLoading || isCategoriesLoading || isAccountsLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <CardSkeleton />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !transaction) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ErrorState
          title="Transaction Not Found"
          message="Could not find transaction to edit."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom', 'left', 'right']}>
      <TransactionForm
        initialValues={{
          type: transaction.type,
          amount: transaction.amount,
          categoryId: transaction.categoryId,
          accountId: transaction.accountId,
          date: transaction.date,
          merchant: transaction.merchant || '',
          note: transaction.note || '',
          receiptUri: transaction.receiptId || '',
        }}
        categories={categories}
        accounts={accounts}
        onSubmit={handleUpdate}
        onDelete={() => setDeleteModalVisible(true)}
        isSubmitting={updateTransactionMutation.isPending}
        mode="edit"
      />

      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete this transaction?"
        message="This transaction will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        loading={deleteTransactionMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
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
