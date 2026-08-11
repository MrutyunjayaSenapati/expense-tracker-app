import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useReportData } from '../../hooks/useReportData';
import { ReportPeriod } from '../../types/reports';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from '../../components/ui/Text';
import { ReportPeriodSelector } from '../../features/reports/components/ReportPeriodSelector';
import { ReportSummaryCards } from '../../features/reports/components/ReportSummaryCards';
import { SpendingBreakdownChart } from '../../features/reports/components/SpendingBreakdownChart';
import { MonthlyTrendChart } from '../../features/reports/components/MonthlyTrendChart';
import { PaymentMethodCard } from '../../features/reports/components/PaymentMethodCard';
import { CardSkeleton } from '../../components/ui/LoadingState';
import { ErrorState } from '../../components/ui/ErrorState';

export default function ReportsScreen() {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const { colors } = useTheme();

  const {
    data: reports,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useReportData(period);

  if (isLoading && !reports) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text variant="headingL" weight="bold">
            Financial Reports
          </Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <CardSkeleton />
          <CardSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (isError || !reports) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ErrorState
          title="Could not load reports"
          message="Failed to compute analytics. Please try again."
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
        {/* Screen Header */}
        <View style={styles.header}>
          <Text variant="headingL" weight="bold">
            Financial Reports
          </Text>
          <Text variant="bodySmall" color="secondary">
            Insights and spending patterns
          </Text>
        </View>

        {/* Period Selector (Week | Month | Year) */}
        <ReportPeriodSelector
          period={period}
          onChange={setPeriod}
          style={styles.periodSelector}
        />

        {/* Summary Hero Cards */}
        <ReportSummaryCards summary={reports.summary} />

        {/* Expense Category Breakdown */}
        <SpendingBreakdownChart
          categories={reports.categoryBreakdown}
          title="Expense Breakdown"
        />

        {/* Income Category Breakdown */}
        {reports.incomeCategories.length > 0 && (
          <SpendingBreakdownChart
            categories={reports.incomeCategories}
            title="Income Sources"
          />
        )}

        {/* Timeline Spending Trend */}
        <MonthlyTrendChart data={reports.spendingTrend} />

        {/* Payment Method Breakdown */}
        <PaymentMethodCard paymentMethods={reports.paymentMethodBreakdown} />
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
  header: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  periodSelector: {
    marginBottom: spacing.lg,
  },
});
