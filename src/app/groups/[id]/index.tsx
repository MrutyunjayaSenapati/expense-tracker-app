import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGroupDetail } from '../../../hooks/useGroups';
import { useUser } from '../../../hooks/useUser';
import { useTheme } from '../../../hooks/useTheme';
import { useHaptics } from '../../../hooks/useHaptics';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { AmbientMeshBackground } from '../../../components/ui/AmbientMeshBackground';
import { CardSkeleton } from '../../../components/ui/LoadingState';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyCode } from '../../../types/currency';
import { generateUpiUrl } from '../../../utils/splitUtils';
import { SimplifiedDebt } from '../../../types/group';

export default function GroupDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = typeof params.id === 'string' ? params.id : '';

  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const {
    group,
    isLoading,
    isRefetching,
    refetch,
    recordSettlement,
  } = useGroupDetail(groupId);

  const handleShareInvite = async () => {
    if (!group) return;
    haptics.selection();
    try {
      await Share.share({
        message: `Join our shared expense group "${group.name}" on Expense Tracker! Use invite code: ${group.inviteCode}`,
      });
    } catch {
      // Ignored
    }
  };

  const handlePayViaUpi = async (debt: SimplifiedDebt) => {
    haptics.medium();
    if (debt.toUserPhoneOrUpi) {
      const upiUrl = generateUpiUrl({
        upiId: debt.toUserPhoneOrUpi,
        payeeName: debt.toMemberName,
        amount: debt.amount,
        note: `Group Split: ${group?.name || 'Room Expenses'}`,
      });
      const canOpen = await Linking.canOpenURL(upiUrl).catch(() => false);
      if (canOpen) {
        await Linking.openURL(upiUrl);
        return;
      }
    }

    // Fallback: Share settlement request via WhatsApp
    const message = `Hi ${debt.toMemberName}, I'm settling my share of ${formatCurrency(debt.amount, { currency: currencyCode })} for group "${group?.name}".`;
    await Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`).catch(() => {
      Share.share({ message });
    });
  };

  const handleDirectSettle = async (debt: SimplifiedDebt) => {
    if (!debt.fromUserId || !debt.toUserId) return;
    haptics.success();
    await recordSettlement({
      from_user_id: debt.fromUserId,
      to_user_id: debt.toUserId,
      amount: debt.amount,
    });
  };

  if (isLoading || !group) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AmbientMeshBackground />
        <ScrollView contentContainerStyle={styles.content}>
          <CardSkeleton style={{ height: 140, marginBottom: spacing.md }} />
          <CardSkeleton style={{ height: 100, marginBottom: spacing.sm }} />
          <CardSkeleton style={{ height: 120, marginBottom: spacing.sm }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const isNetPositive = group.yourNetBalance > 0.01;
  const isNetNegative = group.yourNetBalance < -0.01;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <AmbientMeshBackground>
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
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text variant="headingM" weight="bold" numberOfLines={1}>
                {group.name}
              </Text>
              <Text variant="caption" color="secondary">
                {group.members.length} roommates • Code: {group.inviteCode}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.push(`/groups/${group.id}/add-expense` as any);
              }}
              style={[styles.addExpenseBtn, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Add group expense"
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text variant="caption" weight="bold" style={{ color: '#FFFFFF', marginLeft: 4 }}>
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* Net Balance Hero Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(40)}>
            <Card
              elevation="subtle"
              style={[
                styles.netBalanceCard,
                {
                  backgroundColor: isNetPositive
                    ? colors.incomeSoft
                    : isNetNegative
                    ? colors.expenseSoft
                    : colors.surface,
                  borderColor: isNetPositive
                    ? colors.income
                    : isNetNegative
                    ? colors.expense
                    : colors.border,
                },
              ]}
            >
              <Text variant="caption" weight="bold" color="secondary" style={styles.netLabel}>
                YOUR NET GROUP BALANCE
              </Text>
              <Text
                variant="display"
                weight="bold"
                style={{
                  color: isNetPositive
                    ? colors.income
                    : isNetNegative
                    ? colors.expense
                    : colors.textPrimary,
                  marginTop: 4,
                }}
              >
                {isNetPositive ? '+' : isNetNegative ? '-' : ''}
                {formatCurrency(Math.abs(group.yourNetBalance), { currency: currencyCode })}
              </Text>
              <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                {isNetPositive
                  ? 'Overall in this group, you are owed money'
                  : isNetNegative
                  ? 'Overall in this group, you owe money'
                  : 'You are completely settled in this group! 🎉'}
              </Text>
            </Card>
          </Animated.View>

          {/* Invite Code Share Row */}
          <Animated.View entering={FadeInDown.duration(400).delay(60)} style={{ marginTop: spacing.sm }}>
            <TouchableOpacity onPress={handleShareInvite} activeOpacity={0.8}>
              <Card elevation="subtle" style={[styles.inviteCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.inviteLeft}>
                  <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                  <Text variant="caption" weight="bold" style={{ marginLeft: 6 }}>
                    Invite Code: <Text variant="caption" weight="bold" color="brand">{group.inviteCode}</Text>
                  </Text>
                </View>
                <Text variant="caption" weight="bold" color="brand">
                  Share with Roommates →
                </Text>
              </Card>
            </TouchableOpacity>
          </Animated.View>

          {/* Who Owes Whom (Simplified Debts) */}
          <Text variant="label" color="secondary" style={[styles.sectionHeader, { marginTop: spacing.md }]}>
            WHO OWES WHOM (SIMPLIFIED)
          </Text>

          {group.simplifiedDebts.length === 0 ? (
            <Card elevation="subtle" style={[styles.settledCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="checkmark-circle-outline" size={32} color={colors.income} />
              <Text variant="bodyLarge" weight="bold" style={{ marginTop: spacing.xs, color: colors.income }}>
                All Debts Settled!
              </Text>
              <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                Nobody owes anything in this group right now.
              </Text>
            </Card>
          ) : (
            group.simplifiedDebts.map((debt, index) => {
              const isYouDebtor = debt.fromUserId === user?.id;
              const isYouCreditor = debt.toUserId === user?.id;

              return (
                <Animated.View
                  key={`${debt.fromMemberId}-${debt.toMemberId}-${index}`}
                  entering={FadeInDown.duration(350).delay(80 + index * 40)}
                  style={{ marginBottom: 8 }}
                >
                  <Card elevation="subtle" style={[styles.debtCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.debtTop}>
                      <View style={styles.debtLeft}>
                        <View
                          style={[
                            styles.debtIconCircle,
                            { backgroundColor: isYouDebtor ? colors.expenseSoft : colors.incomeSoft },
                          ]}
                        >
                          <Ionicons
                            name={isYouDebtor ? 'arrow-up' : 'arrow-down'}
                            size={16}
                            color={isYouDebtor ? colors.expense : colors.income}
                          />
                        </View>

                        <View style={{ marginLeft: spacing.sm }}>
                          <Text variant="bodyLarge" weight="bold">
                            {isYouDebtor ? 'You' : debt.fromMemberName} owes{' '}
                            <Text variant="bodyLarge" weight="bold" color="brand">
                              {isYouCreditor ? 'You' : debt.toMemberName}
                            </Text>
                          </Text>
                          <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                            Net simplified balance
                          </Text>
                        </View>
                      </View>

                      <Text
                        variant="headingM"
                        weight="bold"
                        style={{ color: isYouDebtor ? colors.expense : colors.textPrimary }}
                      >
                        {formatCurrency(debt.amount, { currency: currencyCode })}
                      </Text>
                    </View>

                    {/* Settlement Actions */}
                    <View style={styles.debtActions}>
                      {isYouDebtor ? (
                        <TouchableOpacity
                          onPress={() => handlePayViaUpi(debt)}
                          style={[styles.payUpiBtn, { backgroundColor: colors.primary }]}
                        >
                          <Ionicons name="flash-outline" size={13} color="#FFFFFF" />
                          <Text variant="caption" weight="bold" style={{ color: '#FFFFFF', marginLeft: 4, fontSize: 11 }}>
                            Pay via UPI
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => handlePayViaUpi(debt)}
                          style={[styles.remindBtn, { backgroundColor: colors.surfaceMuted }]}
                        >
                          <Ionicons name="paper-plane-outline" size={13} color={colors.primary} />
                          <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 4, fontSize: 11 }}>
                            Remind / UPI
                          </Text>
                        </TouchableOpacity>
                      )}

                      {debt.fromUserId && debt.toUserId && (
                        <TouchableOpacity
                          onPress={() => handleDirectSettle(debt)}
                          style={[styles.settleBtn, { backgroundColor: colors.incomeSoft }]}
                        >
                          <Text variant="caption" weight="bold" style={{ color: colors.income, fontSize: 11 }}>
                            Mark Settled
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                </Animated.View>
              );
            })
          )}

          {/* Group Expenses Activity Stream */}
          <Text variant="label" color="secondary" style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
            GROUP EXPENSES ({group.expenses.length})
          </Text>

          {group.expenses.length === 0 ? (
            <Card elevation="subtle" style={[styles.settledCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="receipt-outline" size={32} color={colors.textTertiary} />
              <Text variant="body" color="secondary" style={{ marginTop: spacing.xs }}>
                No expenses logged yet in this group
              </Text>
            </Card>
          ) : (
            group.expenses.map((exp, index) => (
              <Animated.View
                key={exp.id}
                entering={FadeInDown.duration(300).delay(index * 30)}
                style={{ marginBottom: 8 }}
              >
                <Card elevation="subtle" style={[styles.expenseCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <View style={styles.expenseLeft}>
                    <View style={[styles.expenseIconCircle, { backgroundColor: colors.surfaceMuted }]}>
                      <Ionicons name="cart-outline" size={18} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: spacing.sm }}>
                      <Text variant="bodyLarge" weight="bold" numberOfLines={1}>
                        {exp.title}
                      </Text>
                      <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                        Paid by {exp.payerName} • Split {exp.splits.length} ways
                      </Text>
                    </View>
                  </View>

                  <Text variant="bodyLarge" weight="bold">
                    {formatCurrency(exp.amount, { currency: currencyCode })}
                  </Text>
                </Card>
              </Animated.View>
            ))
          )}
        </ScrollView>
      </AmbientMeshBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
    paddingBottom: 120,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addExpenseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.button,
  },
  netBalanceCard: {
    padding: spacing.md + 4,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  netLabel: {
    letterSpacing: 0.6,
    fontSize: 11,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  inviteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionHeader: {
    letterSpacing: 0.6,
    marginBottom: spacing.xs + 2,
  },
  settledCard: {
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  debtTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debtLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  debtIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debtActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: spacing.sm,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  payUpiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.button,
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.button,
  },
  settleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.button,
  },
  expenseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
