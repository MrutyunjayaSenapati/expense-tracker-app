import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAccount,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '../../hooks/useAccounts';
import { useTheme } from '../../hooks/useTheme';
import { AccountForm } from '../../features/accounts/components/AccountForm';
import { AccountFormValues } from '../../schemas/accountSchema';
import { CardSkeleton } from '../../components/ui/LoadingState';

export default function CreateAccountScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const { data: account, isLoading: isAccountLoading } = useAccount(id);
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const handleSubmit = async (values: AccountFormValues) => {
    try {
      if (id) {
        await updateAccountMutation.mutateAsync({
          id,
          input: values,
        });
      } else {
        await createAccountMutation.mutateAsync({
          name: values.name,
          type: values.type,
          institutionName: values.institutionName,
          balance: values.balance,
          icon: values.icon,
        });
      }
      router.back();
    } catch {
      // Handled in mutation onError
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteAccountMutation.mutateAsync(id);
      router.back();
    } catch {
      // Handled in mutation onError
    }
  };

  if (id && isAccountLoading) {
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
      <AccountForm
        initialValues={
          account
            ? {
                name: account.name,
                type: account.type,
                institutionName: account.institutionName,
                balance: account.balance,
                icon: account.icon,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onDelete={id ? handleDelete : undefined}
        isSubmitting={createAccountMutation.isPending || updateAccountMutation.isPending}
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
