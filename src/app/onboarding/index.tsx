import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Hero Visual */}
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Ionicons name="wallet" size={48} color={colors.textInverse} />
          </View>
          <Text variant="display" weight="bold" align="center" style={styles.heroTitle}>
            Take Control of Your Expenses
          </Text>
          <Text variant="bodyLarge" color="secondary" align="center" style={styles.heroSubtitle}>
            Track your daily spending, manage category budgets, and understand your financial health effortlessly.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.incomeSoft }]}>
              <Ionicons name="flash-outline" size={20} color={colors.income} />
            </View>
            <View style={styles.featureText}>
              <Text variant="bodyLarge" weight="bold">
                Instant Expense Entry
              </Text>
              <Text variant="caption" color="secondary">
                Log expenses in seconds with UPI, Cash & Bank tags.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="pie-chart-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.featureText}>
              <Text variant="bodyLarge" weight="bold">
                Smart Category Budgets
              </Text>
              <Text variant="caption" color="secondary">
                Stay on track with real-time budget limit alerts.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="analytics-outline" size={20} color={colors.warning} />
            </View>
            <View style={styles.featureText}>
              <Text variant="bodyLarge" weight="bold">
                Visual Financial Insights
              </Text>
              <Text variant="caption" color="secondary">
                Understand where your money goes with clear breakdown charts.
              </Text>
            </View>
          </View>
        </View>

        {/* Get Started Action */}
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            onPress={() => router.replace('/(tabs)/home')}
            fullWidth
            iconRight={<Ionicons name="arrow-forward" size={20} color={colors.textInverse} />}
          >
            Get Started
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    lineHeight: 22,
  },
  features: {
    gap: spacing.lg,
    marginVertical: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  footer: {
    marginBottom: spacing.md,
  },
});
