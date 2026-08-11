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
  savedAmount?: number;
}

export const HabitStreakCard: React.FC<HabitStreakCardProps> = ({
  streakDays = 7,
  savedAmount = 2400,
}) => {
  const { colors } = useTheme();

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <View style={styles.container}>
      {/* 7 Day Streak Card */}
      <Card variant="solid" elevation="sm" style={styles.streakCard}>
        <View style={styles.headerRow}>
          <Text variant="headingS" weight="bold">
            {`${streakDays} Day Streak! 🔥`}
          </Text>
        </View>
        <Text variant="caption" color="secondary" style={styles.subtitle}>
          {"You're building a great habit"}
        </Text>

        {/* Days Bubbles */}
        <View style={styles.daysRow}>
          {days.map((day, i) => (
            <View
              key={i}
              style={[
                styles.dayBubble,
                { backgroundColor: i < streakDays ? colors.income : colors.surfaceMuted },
              ]}
            >
              <Text
                variant="caption"
                weight="bold"
                style={{
                  color: i < streakDays ? colors.textInverse : colors.textTertiary,
                  fontSize: 10,
                }}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Budget Achieved Card */}
      <Card variant="solid" elevation="sm" style={styles.achievementCard}>
        <View style={styles.headerRow}>
          <Text variant="headingS" weight="bold">
            Budget Achieved! 🏆
          </Text>
        </View>
        <Text variant="caption" color="secondary" style={styles.subtitle}>
          You stayed under budget
        </Text>

        <View style={[styles.savedBadge, { backgroundColor: colors.incomeSoft }]}>
          <Ionicons name="sparkles" size={14} color={colors.income} />
          <Text variant="caption" weight="bold" color="income">
            {`Saved ₹${savedAmount.toLocaleString('en-IN')}`}
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  streakCard: {
    flex: 1,
    padding: spacing.md,
  },
  achievementCard: {
    flex: 1,
    padding: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: spacing.md,
    fontSize: 11,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    gap: 4,
  },
});
