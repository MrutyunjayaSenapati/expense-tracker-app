import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { getGreeting, formatMonthYear } from '../../../utils/date';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../../types/user';

export interface DashboardHeaderProps {
  user?: User | null;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onProfilePress,
  onNotificationPress,
}) => {
  const { colors } = useTheme();
  const greeting = getGreeting();
  const userName = user?.name ? user.name.split(' ')[0] : 'Mrutyunjaya';
  const currentMonth = formatMonthYear();

  return (
    <View style={styles.container}>
      <View>
        <Text variant="headingL" weight="bold">
          {`${greeting},`}
        </Text>
        <View style={styles.nameRow}>
          <Text variant="headingL" weight="bold">
            {userName}
          </Text>
          <Text variant="headingL"> 👋</Text>
        </View>
        <Text variant="bodySmall" color="secondary" style={styles.dateText}>
          {currentMonth}
        </Text>
      </View>

      <View style={styles.rightGroup}>
        {/* Habit Tracking Streak Pill */}
        <View style={[styles.streakPill, { backgroundColor: colors.streakSoft }]}>
          <Ionicons name="flame" size={15} color={colors.streakOrange} />
          <Text variant="caption" weight="bold" style={{ color: colors.streakOrange, fontSize: 11 }}>
            7 day streak
          </Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          onPress={onNotificationPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.iconButton, { backgroundColor: colors.surfaceMuted }]}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={18} color={colors.textPrimary} />
          <View style={[styles.badgeDot, { backgroundColor: colors.expense }]} />
        </TouchableOpacity>

        {/* Profile Avatar */}
        <AnimatedPressable
          onPress={onProfilePress}
          scaleTo={0.92}
          accessibilityRole="button"
          accessibilityLabel="Go to Profile and Settings"
          style={[styles.avatar, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
        >
          <Ionicons name="person" size={18} color={colors.primary} />
        </AnimatedPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginTop: 2,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm - 2,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    gap: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 7,
    right: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
});
