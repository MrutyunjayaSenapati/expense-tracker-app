import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Transaction } from '../../../types/transaction';
import { Category } from '../../../types/category';
import { Account } from '../../../types/account';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { formatCurrency } from '../../../utils/currency';
import { formatRelativeDate } from '../../../utils/date';
import { Ionicons } from '@expo/vector-icons';

export interface TransactionRowProps {
  transaction: Transaction;
  category?: Category | null;
  account?: Account | null;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  category,
  account,
  onPress,
  style,
}) => {
  const { colors } = useTheme();
  const isExpense = transaction.type === 'expense';
  const categoryName = category?.name || 'General';
  const title = transaction.merchant || transaction.note || categoryName;

  const content = (
    <View style={[styles.container, { backgroundColor: colors.surface }, style]}>
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
            variant="bodyLarge"
            weight="semibold"
            numberOfLines={1}
            style={styles.titleText}
          >
            {title}
          </Text>
          {transaction.receiptId && (
            <Ionicons
              name="attach"
              size={14}
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

      {/* Right Column: Amount and Relative Date */}
      <View style={styles.rightCol}>
        <Text
          variant="bodyLarge"
          weight="bold"
          color={isExpense ? 'primary' : 'income'}
        >
          {formatCurrency(transaction.amount, { sign: true, type: transaction.type })}
        </Text>
        <Text variant="caption" color="tertiary">
          {formatRelativeDate(transaction.date)}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        scaleTo={0.98}
        accessibilityRole="button"
        accessibilityLabel={`${title}, ${formatCurrency(transaction.amount)}`}
      >
        {content}
      </AnimatedPressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
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
    marginLeft: spacing.xs,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
});
