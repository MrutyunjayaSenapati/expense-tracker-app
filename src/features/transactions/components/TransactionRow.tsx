import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Transaction } from '../../../types/transaction';
import { Category } from '../../../types/category';
import { Account } from '../../../types/account';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { SwipeableRow, SwipeableAction } from '../../../components/ui/SwipeableRow';
import { formatCurrency } from '../../../utils/currency';
import { formatTime } from '../../../utils/date';
import { Ionicons } from '@expo/vector-icons';

export interface TransactionRowProps {
  transaction: Transaction;
  category?: Category | null;
  account?: Account | null;
  onPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  style?: StyleProp<ViewStyle>;
  enableSwipe?: boolean;
  showTimeOnly?: boolean;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  category,
  account,
  onPress,
  onDelete,
  onEdit,
  style,
  enableSwipe = false,
  showTimeOnly = false,
}) => {
  const { colors } = useTheme();
  const isExpense = transaction.type === 'expense';
  const categoryName = category?.name || 'General';
  const title = transaction.merchant || transaction.note || categoryName;

  const leftAction: SwipeableAction | undefined = onEdit
    ? {
        icon: 'pencil',
        backgroundColor: colors.primary,
        onPress: onEdit,
        accessibilityLabel: 'Edit transaction',
      }
    : undefined;

  const rightAction: SwipeableAction | undefined = onDelete
    ? {
        icon: 'trash',
        backgroundColor: colors.error || '#EF4444',
        onPress: onDelete,
        accessibilityLabel: 'Delete transaction',
      }
    : undefined;

  const content = (
    <View style={[styles.container, style]}>
      {/* Category Icon */}
      <CategoryIcon
        icon={category?.icon ?? 'cash'}
        color={category?.colorToken ?? colors.primary}
        size="md"
      />

      {/* Center Details */}
      <View style={styles.centerCol}>
        <View style={styles.titleRow}>
          <Text
            variant="body"
            weight="semibold"
            numberOfLines={1}
            style={styles.titleText}
          >
            {title}
          </Text>
          {transaction.receiptId && (
            <Ionicons
              name="attach"
              size={13}
              color={colors.textTertiary}
              style={styles.receiptIcon}
            />
          )}
        </View>

        <Text variant="caption" color="secondary" numberOfLines={1}>
          {categoryName}
          {account?.name ? ` · ${account.name}` : ''}
        </Text>
      </View>

      {/* Right Column: Amount and Time */}
      <View style={styles.rightCol}>
        <Text
          variant="body"
          weight="bold"
          color={isExpense ? 'primary' : 'income'}
          style={styles.amountText}
        >
          {formatCurrency(transaction.amount, { sign: true, type: transaction.type })}
        </Text>
        <Text variant="caption" color="tertiary" style={styles.timeText}>
          {formatTime(transaction.date)}
        </Text>
      </View>
    </View>
  );

  const wrappedRow = onPress ? (
    <AnimatedPressable
      onPress={onPress}
      scaleTo={0.98}
      testID="transaction-row"
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${formatCurrency(transaction.amount)}`}
    >
      {content}
    </AnimatedPressable>
  ) : (
    content
  );

  if (enableSwipe && (leftAction || rightAction)) {
    return (
      <SwipeableRow leftAction={leftAction} rightAction={rightAction}>
        {wrappedRow}
      </SwipeableRow>
    );
  }

  return wrappedRow;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
  },
  centerCol: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleText: {
    flexShrink: 1,
  },
  receiptIcon: {
    marginLeft: 4,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    letterSpacing: -0.2,
  },
  timeText: {
    fontSize: 11.5,
    marginTop: 1,
  },
});
