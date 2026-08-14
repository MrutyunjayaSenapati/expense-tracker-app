import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTransaction, useDeleteTransaction } from '../../hooks/useTransactions';
import { useCategory } from '../../hooks/useCategories';
import { useAccount } from '../../hooks/useAccounts';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { Badge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';
import { formatCurrency } from '../../utils/currency';
import { formatDate, formatTime } from '../../utils/date';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const { data: transaction, isLoading, isError, refetch } = useTransaction(id);
  const { data: category } = useCategory(transaction?.categoryId);
  const { data: account } = useAccount(transaction?.accountId);
  const deleteTransactionMutation = useDeleteTransaction();

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTransactionMutation.mutateAsync(id);
      setDeleteModalVisible(false);
      router.back();
    } catch {
      // Handled in mutation onError
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CardSkeleton />
        <CardSkeleton />
      </View>
    );
  }

  if (isError || !transaction) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState
          title="Transaction Not Found"
          message="Could not locate details for this transaction."
          onRetry={refetch}
        />
      </View>
    );
  }

  const isExpense = transaction.type === 'expense';
  const merchantOrTitle = transaction.merchant || transaction.note || category?.name || 'Transaction';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Hero Amount & Category Card */}
      <Card elevation="sm" style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <CategoryIcon
            icon={category?.icon ?? 'receipt'}
            color={category?.colorToken ?? colors.primary}
            size="lg"
          />
          <Badge
            label={isExpense ? 'Expense' : 'Income'}
            variant={isExpense ? 'exceeded' : 'healthy'}
          />
        </View>

        <Text
          variant="display"
          weight="bold"
          color={isExpense ? 'primary' : 'income'}
          style={styles.heroAmount}
        >
          {formatCurrency(transaction.amount, { sign: true, type: transaction.type })}
        </Text>

        <Text variant="headingM" weight="semibold" align="center">
          {merchantOrTitle}
        </Text>
      </Card>

      {/* Details List Card */}
      <Card elevation="sm" style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text variant="body" color="secondary">
            Category
          </Text>
          <View style={styles.detailValueRow}>
            <CategoryIcon
              icon={category?.icon ?? 'receipt'}
              color={category?.colorToken ?? colors.primary}
              size="sm"
            />
            <Text variant="body" weight="semibold" style={styles.valText}>
              {category?.name ?? 'General'}
            </Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detailRow}>
          <Text variant="body" color="secondary">
            Account / Wallet
          </Text>
          <Text variant="body" weight="semibold">
            {account?.name ?? 'Default Account'}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.detailRow}>
          <Text variant="body" color="secondary">
            Date & Time
          </Text>
          <Text variant="body" weight="semibold">
            {`${formatDate(transaction.date)} · ${formatTime(transaction.date)}`}
          </Text>
        </View>

        {transaction.merchant && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.detailRow}>
              <Text variant="body" color="secondary">
                Merchant / Source
              </Text>
              <Text variant="body" weight="semibold">
                {transaction.merchant}
              </Text>
            </View>
          </>
        )}

        {transaction.note && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.noteSection}>
              <Text variant="body" color="secondary" style={styles.noteLabel}>
                Note
              </Text>
              <Text variant="body" style={styles.noteText}>
                {transaction.note}
              </Text>
            </View>
          </>
        )}
      </Card>

      {/* Receipt Attachment (if any) */}
      {transaction.receiptId && (
        <Card elevation="sm" style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text variant="headingS" weight="bold">
              Attached Receipt
            </Text>
            <Ionicons name="document-attach-outline" size={20} color={colors.primary} />
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1554415707-9e49016a3e5c?w=600' }}
            style={styles.receiptImage}
            resizeMode="cover"
          />
        </Card>
      )}

      {/* Edit & Delete Action Buttons */}
      <View style={styles.actions}>
        <Button
          variant="primary"
          size="lg"
          onPress={() => router.push(`/transactions/edit?id=${transaction.id}`)}
          iconLeft={<Ionicons name="create-outline" size={20} color="#FFFFFF" />}
          testID="edit-transaction"
        >
          Edit Transaction
        </Button>

        <Button
          variant="destructive"
          size="md"
          onPress={() => setDeleteModalVisible(true)}
          iconLeft={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
          testID="delete-transaction"
        >
          Delete Transaction
        </Button>
      </View>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete this transaction?"
        message="This action cannot be undone. Your account balance and budget will be updated."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        loading={deleteTransactionMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.screenHorizontal,
    paddingBottom: 115,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
  },
  heroAmount: {
    marginBottom: spacing.xs,
  },
  detailsCard: {
    marginBottom: spacing.lg,
    paddingVertical: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valText: {
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.md,
  },
  noteSection: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  noteLabel: {
    marginBottom: spacing.xs,
  },
  noteText: {
    lineHeight: 22,
  },
  receiptCard: {
    marginBottom: spacing.lg,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  receiptImage: {
    width: '100%',
    height: 180,
    borderRadius: radius.md,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});
