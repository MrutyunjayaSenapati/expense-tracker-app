import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { useReportData } from '../../hooks/useReportData';
import { ReportPeriod } from '../../types/reports';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { useAppStore } from '../../store/useAppStore';
import { apiClient } from '../../services/api/apiClient';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
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
  const [isExporting, setIsExporting] = useState(false);
  const { colors } = useTheme();
  const haptics = useHaptics();
  const showToast = useAppStore(state => state.showToast);

  const {
    data: reports,
    isLoading,
    isRefetching,
    isError,
    refetch,
  } = useReportData(period);

  const handleExportCsv = async () => {
    try {
      haptics.medium();
      setIsExporting(true);
      const csvData = await apiClient.exportTransactionsCsv();
      const filename = `expense_tracker_${new Date().toISOString().split('T')[0]}.csv`;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('CSV report downloaded! 📊', 'success');
      } else {
        const file = new File(Paths.document, filename);
        if (!file.exists) {
          file.create();
        }
        file.write(csvData);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri, {
            mimeType: 'text/csv',
            dialogTitle: 'Export Expense Report',
            UTI: 'public.comma-separated-values-text',
          });
          showToast('CSV report ready to share! 📊', 'success');
        } else {
          showToast(`File saved: ${filename}`, 'success');
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to export CSV report', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading || (!reports && !isError)) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View>
            <Text variant="headingL" weight="bold">
              Financial Reports
            </Text>
            <Text variant="bodySmall" color="secondary">
              Insights and spending patterns
            </Text>
          </View>
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
          {/* Screen Header with CSV Export */}
          <Animated.View entering={FadeInDown.duration(300)} style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text variant="headingL" weight="bold">
                Financial Reports
              </Text>
              <Text variant="bodySmall" color="secondary">
                Insights and spending patterns
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleExportCsv}
              disabled={isExporting}
              activeOpacity={0.8}
              style={[
                styles.exportBtn,
                { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
            >
              {isExporting ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <>
                  <Ionicons name="download-outline" size={16} color={colors.primary} />
                  <Text variant="caption" weight="bold" color="brand">
                    Export CSV
                  </Text>
                </>
              )}
            </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  periodSelector: {
    marginBottom: spacing.lg,
  },
});
