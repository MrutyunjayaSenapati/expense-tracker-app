import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRecurring, RecurringItem } from '../../hooks/useRecurring';
import { useUser } from '../../hooks/useUser';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { formatCurrency } from '../../utils/currency';

function getDaysUntil(dateStr: string): { text: string; isUrgent: boolean } {
  try {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: 'Due today! ⚡', isUrgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', isUrgent: true };
    if (diffDays > 1 && diffDays <= 5) return { text: `Due in ${diffDays} days`, isUrgent: true };
    if (diffDays > 5) return { text: `Renews on ${target.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, isUrgent: false };
    return { text: 'Scheduled', isUrgent: false };
  } catch {
    return { text: 'Scheduled', isUrgent: false };
  }
}

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currency = user?.currency || 'INR';

  const {
    recurringList,
    monthlyTotal,
    isLoading,
    isRefetching,
    refetch,
    updateRecurring,
    deleteRecurring,
  } = useRecurring();

  const [deleteModalItem, setDeleteModalItem] = useState<RecurringItem | null>(null);

  const handleToggleActive = async (item: RecurringItem, val: boolean) => {
    haptics.selection();
    await updateRecurring({
      id: item.id,
      payload: { is_active: val },
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalItem) return;
    haptics.medium();
    await deleteRecurring(deleteModalItem.id);
    setDeleteModalItem(null);
  };

  if (isLoading && !isRefetching) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AmbientMeshBackground />
        <ScrollView contentContainerStyle={styles.content}>
          <CardSkeleton style={{ height: 120, marginBottom: spacing.md }} />
          <CardSkeleton style={{ height: 80, marginBottom: spacing.sm }} />
          <CardSkeleton style={{ height: 80, marginBottom: spacing.sm }} />
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
                Subscriptions & Bills
              </Text>
              <Text variant="caption" color="secondary">
                Fixed monthly commitments
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/subscriptions/create')}
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel="Add subscription"
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Hero Committed Monthly Total */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
            <Card elevation="subtle" style={styles.heroCard}>
              <View style={styles.heroLeft}>
                <Text variant="caption" weight="semibold" color="secondary" style={styles.heroLabel}>
                  TOTAL COMMITTED PER MONTH
                </Text>
                <Text variant="headingXL" weight="bold" color="primary">
                  {formatCurrency(monthlyTotal, { currency })}
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  {recurringList.filter(i => i.isActive).length} active subscriptions
                </Text>
              </View>
              <View style={[styles.heroIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="repeat" size={28} color={colors.primary} />
              </View>
            </Card>
          </Animated.View>

          {/* Subscriptions List */}
          <Text variant="label" color="secondary" style={styles.sectionHeader}>
            ACTIVE RECURRING PLANS
          </Text>

          {recurringList.length === 0 ? (
            <Card elevation="none" style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={40} color={colors.textTertiary} />
              <Text variant="headingM" weight="semibold" style={{ marginTop: spacing.sm }}>
                No Recurring Subscriptions
              </Text>
              <Text variant="bodySmall" color="secondary" align="center" style={styles.emptyText}>
                Keep track of Netflix, Spotify, Rent, Gym, and bills with automatic reminders and auto-logging.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/subscriptions/create')}
                style={[styles.emptyActionBtn, { backgroundColor: colors.primary }]}
              >
                <Text variant="bodyLarge" weight="bold" style={{ color: '#FFFFFF' }}>
                  + Add First Subscription
                </Text>
              </TouchableOpacity>
            </Card>
          ) : (
            recurringList.map((item, index) => {
              const dueInfo = getDaysUntil(item.nextOccurrence);
              return (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.duration(350).delay(index * 60)}
                  style={styles.cardWrapper}
                >
                  <Card
                    elevation="none"
                    style={[
                      styles.subscriptionCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      !item.isActive && { opacity: 0.6 },
                    ]}
                  >
                    <View style={styles.cardHeader}>
                      <View style={styles.cardLeft}>
                        <CategoryIcon
                          icon={item.category?.icon || 'pricetag'}
                          color={item.category?.color || '#6366F1'}
                          size="md"
                        />
                        <View style={styles.cardInfo}>
                          <Text variant="bodyLarge" weight="bold" numberOfLines={1}>
                            {item.merchant || item.category?.name || 'Subscription'}
                          </Text>
                          <View style={styles.subDetailRow}>
                            <View
                              style={[
                                styles.freqBadge,
                                { backgroundColor: colors.surfaceMuted },
                              ]}
                            >
                              <Text variant="caption" weight="bold" color="secondary" style={{ fontSize: 10 }}>
                                {item.frequency}
                              </Text>
                            </View>
                            <Text
                              variant="caption"
                              weight="medium"
                              style={{
                                color: dueInfo.isUrgent ? (colors.streakOrange || '#FF6B00') : colors.textTertiary,
                                fontSize: 11,
                              }}
                            >
                              {item.isActive ? dueInfo.text : 'Paused'}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.cardRight}>
                        <Text
                          variant="headingM"
                          weight="bold"
                          color={item.type === 'INCOME' ? 'income' : 'expense'}
                        >
                          {item.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(Number(item.amount), { currency })}
                        </Text>
                        <View style={styles.switchWrapper}>
                          <Switch
                            value={item.isActive}
                            onValueChange={val => handleToggleActive(item, val)}
                            trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
                            thumbColor="#FFFFFF"
                          />
                        </View>
                      </View>
                    </View>

                    <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                      <Text variant="caption" color="tertiary">
                        Paid from: <Text variant="caption" weight="semibold" color="secondary">{item.account?.name || 'Default'}</Text>
                      </Text>
                      <TouchableOpacity
                        onPress={() => setDeleteModalItem(item)}
                        style={styles.deleteBtn}
                      >
                        <Ionicons name="trash-outline" size={16} color={colors.expense} />
                      </TouchableOpacity>
                    </View>
                  </Card>
                </Animated.View>
              );
            })
          )}
        </ScrollView>
      </AmbientMeshBackground>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={!!deleteModalItem}
        title="Remove Subscription?"
        message={`Are you sure you want to stop tracking "${deleteModalItem?.merchant || 'this subscription'}"?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalItem(null)}
      />
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
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroLeft: {
    flex: 1,
  },
  heroLabel: {
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  cardWrapper: {
    marginBottom: spacing.sm,
  },
  subscriptionCard: {
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  cardInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  subDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  freqBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  switchWrapper: {
    marginTop: 4,
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  emptyText: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  emptyActionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.button,
  },
});
