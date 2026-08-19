import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSplitBills } from '../../hooks/useSplitBills';
import { useUser } from '../../hooks/useUser';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { formatCurrency } from '../../utils/currency';
import { CurrencyCode } from '../../types/currency';
import { sharePaymentRequest, generateUpiUrl } from '../../utils/splitUtils';
import { SplitBill } from '../../types/split';

export default function SplitExpenseHubScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL' | 'SETTLED'>('PENDING');

  const {
    bills,
    isLoading,
    isRefetching,
    refetch,
    summary,
    settleParticipant,
    deleteSplitBill,
  } = useSplitBills(activeTab === 'ALL' ? undefined : activeTab);

  const handleShare = async (bill: SplitBill, participantName: string, amountOwed: number, phoneOrUpi?: string | null) => {
    haptics.selection();
    await sharePaymentRequest({
      billTitle: bill.title,
      yourName: user?.name || 'Friend',
      participantName,
      phoneOrUpi: phoneOrUpi || undefined,
      amountOwed,
    });
  };

  const handleDirectUpiPay = async (bill: SplitBill, amount: number, payeeUpi?: string | null) => {
    haptics.medium();
    if (payeeUpi) {
      const upiUrl = generateUpiUrl({
        upiId: payeeUpi,
        payeeName: bill.paidBy?.name || 'Payer',
        amount,
        note: `Split: ${bill.title}`,
      });
      const canOpen = await Linking.canOpenURL(upiUrl).catch(() => false);
      if (canOpen) {
        await Linking.openURL(upiUrl);
        return;
      }
    }
    // Fallback: share receipt or confirm settlement
    await sharePaymentRequest({
      billTitle: bill.title,
      yourName: user?.name || 'Friend',
      participantName: bill.paidBy?.name || 'Payer',
      amountOwed: amount,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AmbientMeshBackground />
        <ScrollView contentContainerStyle={styles.content}>
          <CardSkeleton style={{ height: 120, marginBottom: spacing.md }} />
          <CardSkeleton style={{ height: 90, marginBottom: spacing.sm }} />
          <CardSkeleton style={{ height: 90, marginBottom: spacing.sm }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
              <Text variant="headingM" weight="bold">
                Split Expenses
              </Text>
              <Text variant="caption" color="secondary">
                Group bills and shared payments
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.push('/splits/create');
              }}
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Create split bill"
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Dual Balance Summary Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(40)}>
            <View style={styles.dualHeroRow}>
              {/* Owed to you */}
              <Card elevation="subtle" style={[styles.summaryCard, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.summaryTop}>
                  <View style={[styles.heroIconBox, { backgroundColor: colors.incomeSoft }]}>
                    <Ionicons name="arrow-down-outline" size={18} color={colors.income} />
                  </View>
                  <Text variant="caption" weight="bold" color="secondary" style={styles.summaryLabel}>
                    YOU ARE OWED
                  </Text>
                </View>
                <Text variant="headingL" weight="bold" style={{ color: colors.income, marginTop: 6 }}>
                  +{formatCurrency(summary.totalOwedToYou, { currency: currencyCode })}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2, fontSize: 11 }}>
                  {summary.pendingBillsCount} bills pending
                </Text>
              </Card>

              {/* You owe */}
              <Card elevation="subtle" style={[styles.summaryCard, { flex: 1, backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.summaryTop}>
                  <View style={[styles.heroIconBox, { backgroundColor: summary.totalYouOwe > 0 ? colors.expenseSoft : colors.surfaceMuted }]}>
                    <Ionicons
                      name="arrow-up-outline"
                      size={18}
                      color={summary.totalYouOwe > 0 ? colors.expense : colors.textSecondary}
                    />
                  </View>
                  <Text variant="caption" weight="bold" color="secondary" style={styles.summaryLabel}>
                    YOU OWE
                  </Text>
                </View>
                <Text
                  variant="headingL"
                  weight="bold"
                  style={{
                    color: summary.totalYouOwe > 0 ? colors.expense : colors.textPrimary,
                    marginTop: 6,
                  }}
                >
                  {formatCurrency(summary.totalYouOwe, { currency: currencyCode })}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2, fontSize: 11 }}>
                  {summary.totalYouOwe === 0 ? 'All settled' : 'Pending payment'}
                </Text>
              </Card>
            </View>
          </Animated.View>

          {/* Groups / Flatmates Quick Entry Banner */}
          <Animated.View entering={FadeInDown.duration(400).delay(60)} style={{ marginBottom: spacing.md }}>
            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.push('/groups' as any);
              }}
              activeOpacity={0.8}
            >
              <Card
                elevation="subtle"
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: spacing.md,
                  borderRadius: radius.card,
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primaryLight,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="people" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text variant="bodyLarge" weight="bold">
                    Room & Flatmate Groups
                  </Text>
                  <Text variant="caption" color="secondary">
                    Continuous ledger with auto debt simplification
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </Card>
            </TouchableOpacity>
          </Animated.View>

          {/* Filter Tabs */}
          <View style={styles.tabRow}>
            {(['PENDING', 'ALL', 'SETTLED'] as const).map(tab => (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  haptics.selection();
                  setActiveTab(tab);
                }}
                style={[
                  styles.tabChip,
                  activeTab === tab && { backgroundColor: colors.primary, borderColor: colors.primary },
                  activeTab !== tab && { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Text
                  variant="caption"
                  weight="bold"
                  style={{ color: activeTab === tab ? '#FFFFFF' : colors.textSecondary }}
                >
                  {tab === 'PENDING' ? 'Pending' : tab === 'ALL' ? 'All Splits' : 'Settled'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bills List */}
          {bills.length === 0 ? (
            <Card elevation="subtle" style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyIconCircle, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="people-outline" size={32} color={colors.primary} />
              </View>
              <Text variant="headingM" weight="bold" style={{ marginTop: spacing.sm }}>
                No {activeTab === 'PENDING' ? 'Pending' : ''} Split Bills
              </Text>
              <Text variant="caption" color="secondary" align="center" style={styles.emptySubtitle}>
                Split group dinners, road trips, groceries, and rent with friends via WhatsApp and UPI.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/splits/create')}
                style={[styles.emptyActionBtn, { backgroundColor: colors.primary }]}
              >
                <Text variant="bodyLarge" weight="bold" style={{ color: '#FFFFFF' }}>
                  + Split an Expense
                </Text>
              </TouchableOpacity>
            </Card>
          ) : (
            bills.map((bill, index) => {
              const isPayer = bill.paidByUserId === user?.id;
              const paidParticipantsCount = bill.participants.filter(p => p.isPaid).length;
              const totalParticipants = bill.participants.length;

              return (
                <Animated.View
                  key={bill.id}
                  entering={FadeInDown.duration(350).delay(index * 50)}
                  style={styles.billWrapper}
                >
                  <Card
                    elevation="subtle"
                    style={[
                      styles.billCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                  >
                    {/* Top Row: Title & Total Amount */}
                    <View style={styles.billHeader}>
                      <View style={styles.billLeft}>
                        <View style={[styles.billIconBox, { backgroundColor: colors.surfaceMuted }]}>
                          <Ionicons name="receipt-outline" size={18} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1, marginLeft: spacing.xs + 2 }}>
                          <Text variant="bodyLarge" weight="bold" numberOfLines={1}>
                            {bill.title}
                          </Text>
                          <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                            Total: {formatCurrency(bill.totalAmount, { currency: currencyCode })} •{' '}
                            {isPayer ? 'Paid by You' : `Paid by ${bill.paidBy?.name || 'Friend'}`}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: bill.isSettled ? colors.incomeSoft : colors.primaryLight,
                          },
                        ]}
                      >
                        <Text
                          variant="caption"
                          weight="bold"
                          style={{
                            color: bill.isSettled ? colors.income : colors.primary,
                            fontSize: 11,
                          }}
                        >
                          {bill.isSettled ? 'Settled' : `${paidParticipantsCount}/${totalParticipants} Paid`}
                        </Text>
                      </View>
                    </View>

                    {/* Participants Settlement Rows */}
                    <View style={styles.participantsContainer}>
                      {bill.participants.map(p => {
                        const isCurrentParticipant = p.userId === user?.id;

                        return (
                          <View
                            key={p.id}
                            style={[
                              styles.participantRow,
                              { borderTopColor: colors.border },
                            ]}
                          >
                            {/* Left: Name and Amount */}
                            <View style={styles.pInfo}>
                              <TouchableOpacity
                                onPress={() => settleParticipant(bill.id, p.id, !p.isPaid)}
                                style={[
                                  styles.checkCircle,
                                  {
                                    borderColor: p.isPaid ? colors.income : colors.border,
                                    backgroundColor: p.isPaid ? colors.income : 'transparent',
                                  },
                                ]}
                              >
                                {p.isPaid && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                              </TouchableOpacity>

                              <View style={{ marginLeft: spacing.xs + 2 }}>
                                <Text
                                  variant="body"
                                  weight="medium"
                                  style={p.isPaid ? { textDecorationLine: 'line-through', color: colors.textTertiary } : undefined}
                                >
                                  {p.name} {isCurrentParticipant ? '(You)' : ''}
                                </Text>
                                <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                                  {p.isPaid
                                    ? 'Settled'
                                    : `Owes ${formatCurrency(p.amountOwed, { currency: currencyCode })}`}
                                </Text>
                              </View>
                            </View>

                            {/* Right: Actions */}
                            <View style={styles.pActions}>
                              {!p.isPaid && (
                                <>
                                  {isCurrentParticipant && !isPayer ? (
                                    /* Friend's phone: 1-Tap Pay via UPI */
                                    <TouchableOpacity
                                      onPress={() => handleDirectUpiPay(bill, p.amountOwed, p.phoneOrUpi)}
                                      style={[styles.payUpiBtn, { backgroundColor: colors.primary }]}
                                    >
                                      <Ionicons name="flash-outline" size={13} color="#FFFFFF" />
                                      <Text variant="caption" weight="bold" style={{ color: '#FFFFFF', marginLeft: 4, fontSize: 11 }}>
                                        Pay via UPI
                                      </Text>
                                    </TouchableOpacity>
                                  ) : (
                                    /* Payer's phone: Remind via WhatsApp/UPI */
                                    <TouchableOpacity
                                      onPress={() => handleShare(bill, p.name, p.amountOwed, p.phoneOrUpi)}
                                      style={[styles.remindBtn, { backgroundColor: colors.surfaceMuted }]}
                                    >
                                      <Ionicons name="paper-plane-outline" size={13} color={colors.primary} />
                                      <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 4, fontSize: 11 }}>
                                        Remind / UPI
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </>
                              )}

                              <TouchableOpacity
                                onPress={() => settleParticipant(bill.id, p.id, !p.isPaid)}
                                style={[
                                  styles.settleBtn,
                                  {
                                    backgroundColor: p.isPaid ? colors.surfaceMuted : colors.incomeSoft,
                                  },
                                ]}
                              >
                                <Text
                                  variant="caption"
                                  weight="bold"
                                  style={{
                                    color: p.isPaid ? colors.textSecondary : colors.income,
                                    fontSize: 11,
                                  }}
                                >
                                  {p.isPaid ? 'Undo' : 'Mark Paid'}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </Card>
                </Animated.View>
              );
            })
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
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dualHeroRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  summaryCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  summaryTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    letterSpacing: 0.5,
    fontSize: 11,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm + 2,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  emptyActionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.button,
  },
  billWrapper: {
    marginBottom: spacing.sm,
  },
  billCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  billLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.xs,
  },
  billIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.squircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  participantsContainer: {
    marginTop: 2,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 4,
    borderTopWidth: 1,
  },
  pInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  payUpiBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.button,
  },
  remindBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.button,
  },
  settleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.button,
  },
});
