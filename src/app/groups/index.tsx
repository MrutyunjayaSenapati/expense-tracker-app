import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGroups } from '../../hooks/useGroups';
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

export default function GroupsListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const { groups, isLoading, isRefetching, refetch } = useGroups();

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AmbientMeshBackground />
        <ScrollView contentContainerStyle={styles.content}>
          <CardSkeleton style={{ height: 100, marginBottom: spacing.md }} />
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
                Shared Expense Groups
              </Text>
              <Text variant="caption" color="secondary">
                Roommates, Flatmates, Trips & Gangs
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.push('/groups/join' as any);
              }}
              style={[styles.actionIconBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel="Join group by code"
            >
              <Ionicons name="key-outline" size={18} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                haptics.selection();
                router.push('/groups/create' as any);
              }}
              style={[styles.actionIconBtn, { backgroundColor: colors.primary, marginLeft: 8 }]}
              accessibilityRole="button"
              accessibilityLabel="Create group"
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Quick Action Banner */}
          <Animated.View entering={FadeInDown.duration(400).delay(40)}>
            <Card elevation="subtle" style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.heroLeft}>
                <View style={[styles.heroIconCircle, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="people" size={24} color={colors.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: spacing.sm }}>
                  <Text variant="bodyLarge" weight="bold">
                    Split Room & Trip Bills
                  </Text>
                  <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                    Continuous shared ledger with simplified net balances
                  </Text>
                </View>
              </View>

              <View style={styles.heroButtons}>
                <TouchableOpacity
                  onPress={() => {
                    haptics.selection();
                    router.push('/groups/create' as any);
                  }}
                  style={[styles.heroBtn, { backgroundColor: colors.primary }]}
                >
                  <Ionicons name="add-circle-outline" size={15} color="#FFFFFF" />
                  <Text variant="caption" weight="bold" style={{ color: '#FFFFFF', marginLeft: 4 }}>
                    New Group
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    haptics.selection();
                    router.push('/groups/join' as any);
                  }}
                  style={[styles.heroBtnOutline, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}
                >
                  <Ionicons name="enter-outline" size={15} color={colors.textPrimary} />
                  <Text variant="caption" weight="bold" style={{ color: colors.textPrimary, marginLeft: 4 }}>
                    Join Code
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          {/* Groups List */}
          <Text variant="label" color="secondary" style={styles.sectionTitle}>
            YOUR ACTIVE GROUPS ({groups.length})
          </Text>

          {groups.length === 0 ? (
            <Card elevation="subtle" style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
              <Text variant="headingM" weight="bold" style={{ marginTop: spacing.sm }}>
                No Groups Yet
              </Text>
              <Text variant="caption" color="secondary" align="center" style={styles.emptySubtitle}>
                {`Create a "Room Expenses" or "Flatmates" group to track continuous shared expenses and simplify settlements.`}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/groups/create' as any)}
                style={[styles.emptyActionBtn, { backgroundColor: colors.primary }]}
              >
                <Text variant="bodyLarge" weight="bold" style={{ color: '#FFFFFF' }}>
                  + Create Room Expenses Group
                </Text>
              </TouchableOpacity>
            </Card>
          ) : (
            groups.map((group, index) => {
              const isPositive = group.yourNetBalance > 0.01;
              const isNegative = group.yourNetBalance < -0.01;

              return (
                <Animated.View
                  key={group.id}
                  entering={FadeInDown.duration(350).delay(index * 40)}
                  style={styles.groupItemWrapper}
                >
                  <TouchableOpacity
                    onPress={() => {
                      haptics.light();
                      router.push(`/groups/${group.id}` as any);
                    }}
                    activeOpacity={0.7}
                  >
                    <Card
                      elevation="subtle"
                      style={[styles.groupCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                    >
                      <View style={styles.groupTop}>
                        <View style={[styles.categoryIconCircle, { backgroundColor: colors.primaryLight }]}>
                          <Ionicons
                            name={
                              group.category === 'HOME'
                                ? 'home-outline'
                                : group.category === 'TRIP'
                                ? 'airplane-outline'
                                : 'people-outline'
                            }
                            size={20}
                            color={colors.primary}
                          />
                        </View>

                        <View style={{ flex: 1, marginLeft: spacing.sm }}>
                          <Text variant="bodyLarge" weight="bold" numberOfLines={1}>
                            {group.name}
                          </Text>
                          <Text variant="caption" color="secondary" style={{ fontSize: 11 }}>
                            {group.memberCount} members • Code: {group.inviteCode}
                          </Text>
                        </View>

                        {/* Balance Badge */}
                        <View
                          style={[
                            styles.balanceBadge,
                            {
                              backgroundColor: isPositive
                                ? colors.incomeSoft
                                : isNegative
                                ? colors.expenseSoft
                                : colors.surfaceMuted,
                            },
                          ]}
                        >
                          <Text
                            variant="caption"
                            weight="bold"
                            style={{
                              color: isPositive
                                ? colors.income
                                : isNegative
                                ? colors.expense
                                : colors.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            {isPositive
                              ? `+${formatCurrency(group.yourNetBalance, { currency: currencyCode })}`
                              : isNegative
                              ? `-${formatCurrency(Math.abs(group.yourNetBalance), { currency: currencyCode })}`
                              : 'Settled'}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  </TouchableOpacity>
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
  actionIconBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  heroIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: radius.button,
  },
  heroBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: radius.button,
    borderWidth: 1,
  },
  sectionTitle: {
    letterSpacing: 0.6,
    marginBottom: spacing.xs + 2,
  },
  emptyCard: {
    padding: spacing.xl,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
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
  groupItemWrapper: {
    marginBottom: spacing.sm,
  },
  groupCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  groupTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
});
