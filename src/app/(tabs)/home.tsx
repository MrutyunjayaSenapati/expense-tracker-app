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
import { DashboardHeader } from '../../features/dashboard/components/DashboardHeader';
import { FinancialSummaryCard } from '../../features/dashboard/components/FinancialSummaryCard';
import { IncomeExpenseCard } from '../../features/dashboard/components/IncomeExpenseCard';
import { MonthlyBudgetCard } from '../../features/dashboard/components/MonthlyBudgetCard';
import { SpendingByCategoryCard } from '../../features/dashboard/components/SpendingByCategoryCard';
import { HabitStreakCard } from '../../features/dashboard/components/HabitStreakCard';
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

  if (isDashboardLoading && !dashboard) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <CardSkeleton />
          <CardSkeleton />
          <ListSkeleton count={4} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !dashboard) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ErrorState
          title="Could not load Dashboard"
          message="Unable to calculate financial summary. Please retry."
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <DashboardHeader
            user={user}
            streakDays={dashboard.streakDays}
            onProfilePress={() => router.push('/(tabs)/settings')}
          />
        </Animated.View>

        {/* Hero Net Balance & Sparkline */}
        <Animated.View entering={FadeInDown.duration(450).delay(100)}>
          <FinancialSummaryCard
            totalBalance={dashboard.totalBalance}
            netSavings={dashboard.netSavings}
            onAddExpense={() => router.push('/(tabs)/add')}
            onViewAccounts={() => router.push('/accounts')}
          />
        </Animated.View>

        {/* 3-Column Metric Summary (Income, Expenses, Savings) */}
        <Animated.View entering={FadeInDown.duration(450).delay(150)}>
          <IncomeExpenseCard
            totalIncome={dashboard.totalIncome}
            totalExpense={dashboard.totalExpense}
            netSavings={dashboard.netSavings}
            savingsRate={dashboard.savingsRate}
            incomeCount={dashboard.incomeCount}
            expenseCount={dashboard.expenseCount}
          />
        </Animated.View>

        {/* Monthly Budget card */}
        <Animated.View entering={FadeInDown.duration(450).delay(200)}>
          <MonthlyBudgetCard
            monthlyBudget={dashboard.monthlyBudget}
            monthlyBudgetSpent={dashboard.monthlyBudgetSpent}
            status={dashboard.budgetStatus}
            onPress={() => router.push('/budgets')}
          />
        </Animated.View>

        {/* Top Spending Categories Donut Chart */}
        <Animated.View entering={FadeInDown.duration(450).delay(250)}>
          <SpendingByCategoryCard
            categories={dashboard.categorySpending}
            onViewReports={() => router.push('/(tabs)/reports')}
          />
        </Animated.View>

        {/* Gamification & Habit Badges */}
        <Animated.View entering={FadeInDown.duration(450).delay(300)}>
          <HabitStreakCard
            streakDays={dashboard.streakDays}
            netSavings={dashboard.netSavings}
          />
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInDown.duration(450).delay(350)}>
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
    paddingBottom: 115,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
});
