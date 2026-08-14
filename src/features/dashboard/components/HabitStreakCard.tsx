import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';

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
      {/* 1. Streak Card */}
      <Animated.View entering={FadeInLeft.duration(500).springify()} style={{ flex: 1 }}>
        <Card variant={hasStreak ? 'glow' : 'solid'} elevation="sm" style={styles.streakCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleWithAnim}>
              {hasStreak ? (
                <View style={styles.flameCircle}>
                  <Ionicons name="flame" size={15} color="#FF6B00" />
                </View>
              ) : (
                <View style={styles.flameCircleMuted}>
                  <Ionicons name="flame-outline" size={14} color={colors.textTertiary} />
                </View>
              )}
              <Text variant="body" weight="bold" numberOfLines={1} style={styles.cardTitle}>
                {`${streakDays} Day Streak`}
              </Text>
            </View>
          </View>
          <Text variant="caption" color="secondary" style={styles.subtitle} numberOfLines={1}>
            {hasStreak ? 'Building a great habit' : 'Log a transaction today'}
          </Text>

          {/* Dynamic Days Bubbles */}
          <View style={styles.daysRow}>
            {days.map((day, i) => {
              const isActive = i < Math.min(streakDays, 7);
              return (
                <View
                  key={i}
                  style={[
                    styles.dayBubble,
                    {
                      backgroundColor: isActive ? (colors.streakOrange || '#FF6B00') : colors.surfaceMuted,
                      borderColor: isActive ? '#FFA14A' : 'transparent',
                      borderWidth: isActive ? 1 : 0,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    weight="bold"
                    style={{
                      color: isActive ? '#FFFFFF' : colors.textTertiary,
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
      </Animated.View>

      {/* 2. Monthly Savings Card */}
      <Animated.View entering={FadeInRight.duration(500).springify()} style={{ flex: 1 }}>
        <Card variant="solid" elevation="sm" style={styles.achievementCard}>
          <View style={styles.headerRow}>
            <View style={styles.titleWithAnim}>
              <View style={styles.trophyCircle}>
                <Ionicons name={hasSavings ? 'trophy' : 'flag'} size={14} color="#F59E0B" />
              </View>
              <Text variant="body" weight="bold" numberOfLines={1} style={styles.cardTitle}>
                {hasSavings ? 'Monthly Savings' : 'Savings Goal'}
              </Text>
            </View>
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
              numberOfLines={1}
              style={{
                color: hasSavings ? colors.income : colors.textSecondary,
                fontSize: 11,
                flexShrink: 1,
              }}
            >
              {hasSavings
                ? `Saved ₹${netSavings.toLocaleString('en-IN')}`
                : '₹0 Saved this month'}
            </Text>
          </View>
        </Card>
      </Animated.View>
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
    padding: spacing.sm + 2,
    justifyContent: 'space-between',
    minHeight: 104,
  },
  achievementCard: {
    padding: spacing.sm + 2,
    justifyContent: 'space-between',
    minHeight: 104,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  titleWithAnim: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  cardTitle: {
    flexShrink: 1,
    fontSize: 13.5,
  },
  flameCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 107, 0, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameCircleMuted: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 4,
    maxWidth: '100%',
  },
});
