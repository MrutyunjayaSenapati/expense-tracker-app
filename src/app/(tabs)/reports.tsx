import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useReportData } from '../../hooks/useReportData';
import { ReportPeriod } from '../../types/reports';
import { useTheme } from '../../hooks/useTheme';
import { spacing } from '../../theme/spacing';
import { Text } from '../../components/ui/Text';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
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

  if (isLoading || (!reports && !isError)) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text variant="headingL" weight="bold">
            Financial Reports
          </Text>
          <Text variant="bodySmall" color="secondary">
            Insights and spending patterns
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
          {/* Screen Header */}
          <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
            <Text variant="headingL" weight="bold">
              Financial Reports
            </Text>
            <Text variant="bodySmall" color="secondary">
              Insights and spending patterns
            </Text>
          </Animated.View>

          {/* Period Selector */}
          <Animated.View entering={FadeInDown.delay(50).duration(300)}>
            <ReportPeriodSelector
              period={period}
              onChange={setPeriod}
              style={styles.periodSelector}
            />
          </Animated.View>

          {/* Summary Hero Cards */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <ReportSummaryCards summary={reports.summary} />
          </Animated.View>

          {/* Expense Category Breakdown */}
          <Animated.View entering={FadeInDown.delay(150).duration(300)}>
            <SpendingBreakdownChart
              categories={reports.categoryBreakdown}
              title="Expense Breakdown"
            />
          </Animated.View>

          {/* Income Category Breakdown */}
          {reports.incomeCategories.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).duration(300)}>
              <SpendingBreakdownChart
                categories={reports.incomeCategories}
                title="Income Sources"
              />
            </Animated.View>
          )}

          {/* Timeline Spending Trend */}
          <Animated.View entering={FadeInDown.delay(250).duration(300)}>
            <MonthlyTrendChart data={reports.spendingTrend} />
          </Animated.View>

          {/* Payment Method Breakdown */}
          <Animated.View entering={FadeInDown.delay(300).duration(300)}>
            <PaymentMethodCard paymentMethods={reports.paymentMethodBreakdown} />
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
    paddingBottom: 140,
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
