import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useUser } from '../../hooks/useUser';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader';
import { RevolutHeroSection } from '../../features/dashboard/components/RevolutHeroSection';
import { RevolutVaultsCarousel } from '../../features/dashboard/components/RevolutVaultsCarousel';
import { RevolutSpendVelocityBar } from '../../features/dashboard/components/RevolutSpendVelocityBar';
import { HabitStreakCard } from '../../features/dashboard/components/HabitStreakCard';
import { IncomeExpenseCard } from '../../features/dashboard/components/IncomeExpenseCard';
import { MonthlyBudgetCard } from '../../features/dashboard/components/MonthlyBudgetCard';
import { RecentTransactionsSection } from '../../features/dashboard/components/RecentTransactionsSection';
import { CardSkeleton, ListSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError,
    refetch,
    isRefetching,
  } = useDashboardData();

  const { data: user } = useUser();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  if (isDashboardLoading || (!dashboard && !isError)) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AmbientMeshBackground />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <CardSkeleton style={{ height: 60 }} />
          <CardSkeleton style={{ height: 140 }} />
          <CardSkeleton style={{ height: 100 }} />
          <CardSkeleton style={{ height: 120 }} />
          <ListSkeleton count={4} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !dashboard) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <AmbientMeshBackground />
        <ErrorState
          title="Could not load dashboard"
          message="Please check your connection and try again"
          onRetry={refetch}
        />
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
          {/* 1. Revolut Top Header */}
          <Animated.View entering={FadeInDown.duration(350).delay(30)}>
            <DashboardHeader
              user={user}
              streakDays={dashboard.streakDays}
              onProfilePress={() => router.push('/(tabs)/settings')}
              onNotificationPress={() => router.push('/(tabs)/settings')}
            />
          </Animated.View>

          {/* 2. Revolut Borderless Hero Balance & 4 Action Circles */}
          <Animated.View entering={FadeInDown.duration(400).delay(60)}>
            <RevolutHeroSection
              totalBalance={dashboard.totalBalance}
              netSavings={dashboard.netSavings}
              accounts={accounts}
              onAddExpense={() => router.push('/(tabs)/add')}
            />
          </Animated.View>

          {/* 3. Revolut Vaults & Pockets Carousel (Savings Goals) */}
          <Animated.View entering={FadeInDown.duration(400).delay(90)}>
            <RevolutVaultsCarousel />
          </Animated.View>

          {/* 4. Revolut Smart Spend Velocity Bar */}
          <Animated.View entering={FadeInDown.duration(400).delay(120)}>
            <RevolutSpendVelocityBar
              totalSpentThisMonth={dashboard.totalExpense}
              totalMonthlyBudget={dashboard.monthlyBudget || 50000}
            />
          </Animated.View>

          {/* 5. Habit Streak Highlight */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)}>
            <HabitStreakCard
              streakDays={dashboard.streakDays}
              netSavings={dashboard.netSavings}
            />
          </Animated.View>

          {/* 6. Dual Cashflow Card */}
          <Animated.View entering={FadeInDown.duration(400).delay(180)}>
            <IncomeExpenseCard
              totalIncome={dashboard.totalIncome}
              totalExpense={dashboard.totalExpense}
              netSavings={dashboard.netSavings}
              savingsRate={dashboard.savingsRate}
              incomeCount={dashboard.incomeCount}
              expenseCount={dashboard.expenseCount}
            />
          </Animated.View>

          {/* 7. Grouped Recent Transactions Feed */}
          <Animated.View entering={FadeInDown.duration(400).delay(210)}>
            <RecentTransactionsSection
              transactions={dashboard.recentTransactions}
              categories={categories}
              accounts={accounts}
              onSeeAll={() => router.push('/(tabs)/transactions')}
              onSelectTransaction={id => router.push(`/transactions/${id}`)}
              onAddTransaction={() => router.push('/(tabs)/add')}
            />
          </Animated.View>
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
    paddingBottom: 150,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
});
