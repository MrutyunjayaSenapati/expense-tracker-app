import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Account } from '../../../types/account';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { formatCurrency } from '../../../utils/currency';
import { Ionicons } from '@expo/vector-icons';

export interface AccountCardProps {
  account: Account;
  onPress?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onPress }) => {
  const { colors } = useTheme();
  const isPositive = account.balance >= 0;

  const getAccountIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'bank':
        return 'business-outline';
      case 'upi':
        return 'phone-portrait-outline';
      case 'credit_card':
        return 'card-outline';
      case 'cash':
        return 'cash-outline';
      default:
        return 'wallet-outline';
    }
  };

  return (
    <Card elevation="sm" onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.accountInfo}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name={getAccountIcon(account.type)} size={22} color={colors.primary} />
          </View>
          <View style={styles.nameContainer}>
            <Text variant="headingS" weight="bold">
              {account.name}
            </Text>
            <Text variant="caption" color="secondary">
              {account.institutionName || account.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <Badge label={account.type.toUpperCase()} variant="neutral" />
      </View>

      <View style={[styles.bottomRow, { borderTopColor: colors.border }]}>
        <Text variant="caption" color="secondary">
          Current Balance
        </Text>
        <Text
          variant="headingM"
          weight="bold"
          color={isPositive ? 'primary' : 'expense'}
        >
          {formatCurrency(account.balance)}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  nameContainer: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
});
