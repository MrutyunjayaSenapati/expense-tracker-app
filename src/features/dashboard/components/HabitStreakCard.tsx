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

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
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
            {hasStreak ? `Active • ${fullDayNames[todayIndex]}` : 'Log today to start streak'}
          </Text>

          {/* Dynamic Days of Current Week */}
          <View style={styles.daysRow}>
            {dayNames.map((day, i) => {
              const isToday = i === todayIndex;
              const isPastOrToday = i <= todayIndex;
              const isActive = isPastOrToday && (todayIndex - i) < streakDays;

              return (
                <View
                  key={i}
                  style={[
                    styles.dayBubble,
                    {
                      backgroundColor: isActive
                        ? (colors.streakOrange || '#FF6B00')
                        : isToday
                        ? colors.surfaceMuted
                        : 'transparent',
                      borderColor: isToday
                        ? (colors.streakOrange || '#FF6B00')
                        : isActive
                        ? '#FFA14A'
                        : colors.border,
                      borderWidth: isToday ? 2 : isActive ? 1 : 0.8,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    weight={isToday || isActive ? 'bold' : 'regular'}
                    style={{
                      color: isActive
                        ? '#FFFFFF'
                        : isToday
                        ? (colors.streakOrange || '#FF6B00')
                        : colors.textTertiary,
                      fontSize: 10,
                    }}
                  >
                    {day}
                  </Text>
                  {isToday && (
                    <View
                      style={[
                        styles.todayIndicator,
                        { backgroundColor: isActive ? '#FFFFFF' : (colors.streakOrange || '#FF6B00') },
                      ]}
                    />
                  )}
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
                ? `Saved $${netSavings.toLocaleString('en-US')}`
                : '$0 Saved this month'}
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
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayIndicator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 1,
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
