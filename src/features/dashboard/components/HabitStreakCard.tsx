import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

export interface HabitStreakCardProps {
  streakDays?: number;
  netSavings?: number;
}

export const HabitStreakCard: React.FC<HabitStreakCardProps> = ({
  streakDays = 0,
  netSavings = 0,
}) => {
  const { colors } = useTheme();

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const hasStreak = streakDays > 0;
  const hasSavings = netSavings > 0;

  return (
    <View style={styles.container}>
      {/* 1. Real Streak Card */}
      <Card variant="solid" elevation="sm" style={styles.streakCard}>
        <View style={styles.headerRow}>
          <Text variant="body" weight="bold">
            {`${streakDays} Day Streak! 🔥`}
          </Text>
        </View>
        <Text variant="caption" color="secondary" style={styles.subtitle} numberOfLines={1}>
          {hasStreak ? 'Building a great habit' : 'Log a transaction today'}
        </Text>

        {/* Dynamic Days Bubbles (only active if streak > 0) */}
        <View style={styles.daysRow}>
          {days.map((day, i) => {
            const isActive = i < Math.min(streakDays, 7);
            return (
              <View
                key={i}
                style={[
                  styles.dayBubble,
                  { backgroundColor: isActive ? colors.income : colors.surfaceMuted },
                ]}
              >
                <Text
                  variant="caption"
                  weight="bold"
                  style={{
                    color: isActive ? colors.textInverse : colors.textTertiary,
                    fontSize: 9,
                  }}
                >
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      </Card>

      {/* 2. Real Savings Card */}
      <Card variant="solid" elevation="sm" style={styles.achievementCard}>
        <View style={styles.headerRow}>
          <Text variant="body" weight="bold">
            {hasSavings ? 'Monthly Savings 🏆' : 'Savings Goal 🎯'}
          </Text>
        </View>
        <Text variant="caption" color="secondary" style={styles.subtitle} numberOfLines={1}>
          {hasSavings ? 'Stayed under budget' : 'Track spending to save'}
        </Text>

        <View
          style={[
            styles.savedBadge,
            { backgroundColor: hasSavings ? colors.incomeSoft : colors.surfaceMuted },
          ]}
        >
          <Ionicons
            name={hasSavings ? 'sparkles' : 'wallet-outline'}
            size={12}
            color={hasSavings ? colors.income : colors.textSecondary}
          />
          <Text
            variant="caption"
            weight="bold"
            style={{
              color: hasSavings ? colors.income : colors.textSecondary,
              fontSize: 11,
            }}
          >
            {hasSavings
              ? `Saved ₹${netSavings.toLocaleString('en-IN')}`
              : '₹0 Saved this month'}
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  streakCard: {
    flex: 1,
    padding: spacing.sm + 2,
    justifyContent: 'space-between',
  },
  achievementCard: {
    flex: 1,
    padding: spacing.sm + 2,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: spacing.sm,
    fontSize: 10.5,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  dayBubble: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 3,
  },
});


