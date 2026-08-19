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
import { MonthlySpendHero } from '../../features/dashboard/components/MonthlySpendHero';
import { QuickActionDock } from '../../features/dashboard/components/QuickActionDock';
import { SharedDebtsBanner } from '../../features/dashboard/components/SharedDebtsBanner';
import { CategorySpendVelocityBar } from '../../features/dashboard/components/CategorySpendVelocityBar';
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
          <CardSkeleton style={{ height: 160 }} />
          <CardSkeleton style={{ height: 50 }} />
          <CardSkeleton style={{ height: 100 }} />
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
          {/* 1. Header (User profile, Greeting, Notifications) */}
          <Animated.View entering={FadeInDown.duration(350).delay(20)}>
            <DashboardHeader
              user={user}
              streakDays={dashboard.streakDays}
              onProfilePress={() => router.push('/(tabs)/settings')}
              onNotificationPress={() => router.push('/(tabs)/settings')}
            />
          </Animated.View>

          {/* 2. Monthly Spend Hero (Outflow, Income vs Outflow, Budget, Safe Daily Spend) */}
          <MonthlySpendHero
            monthlyExpense={dashboard.totalExpense}
            monthlyIncome={dashboard.totalIncome}
            totalBudget={dashboard.monthlyBudget}
            budgetSpent={dashboard.totalExpense}
            onSetBudget={() => router.push('/budgets')}
          />

          {/* 3. Quick Action Dock (Add Expense, Split Bill, Room Groups) */}
          <QuickActionDock
            onAddExpense={() => router.push('/(tabs)/add')}
          />

          {/* 4. Social Ledger & Shared Debts (You are owed vs You owe) */}
          <SharedDebtsBanner />

          {/* 5. Top Spending Categories Velocity Bar */}
          <CategorySpendVelocityBar
            transactions={dashboard.recentTransactions}
            categories={categories}
          />

          {/* 6. Categorized Recent Transactions Activity */}
          <Animated.View entering={FadeInDown.duration(400).delay(120)}>
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
