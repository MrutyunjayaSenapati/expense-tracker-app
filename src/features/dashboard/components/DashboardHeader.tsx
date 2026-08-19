import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { LottieAnimation } from '../../../components/ui/LottieAnimation';
import { getGreeting, formatMonthYear } from '../../../utils/date';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../../../types/user';

export interface DashboardHeaderProps {
  user?: User | null;
  streakDays?: number;
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  streakDays = 0,
  onProfilePress,
  onNotificationPress,
}) => {
  const { colors } = useTheme();
  const greeting = getGreeting();
  const userName = user?.name?.trim() ? user.name.trim() : 'Friend';
  const currentMonth = formatMonthYear();

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <Text variant="caption" color="secondary" style={styles.greetingText}>
          {greeting}
        </Text>
        <Text variant="headingL" weight="bold" numberOfLines={1} style={styles.nameText}>
          {userName}
        </Text>
        <Text variant="caption" color="secondary" style={styles.dateText}>
          {currentMonth}
        </Text>
      </View>

      <View style={styles.rightGroup}>
        {/* Animated Streak Pill */}
        <View style={[styles.streakPill, { backgroundColor: colors.streakSoft }]}>
          <LottieAnimation
            source={require('../../../../assets/animations/flame.json')}
            width={18}
            height={18}
            style={styles.flameAnim}
          />
          <Text variant="caption" weight="bold" style={{ color: colors.streakOrange, fontSize: 11 }}>
            {`${streakDays}d streak`}
          </Text>
        </View>

        {/* Notification Bell */}
        <TouchableOpacity
          onPress={onNotificationPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.iconButton, { backgroundColor: colors.surfaceMuted }]}
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={17} color={colors.textPrimary} />
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
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={16} color={colors.primary} />
          )}
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
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  leftCol: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  greetingText: {
    fontSize: 12,
    marginBottom: 1,
  },
  nameText: {
    fontSize: 22,
    lineHeight: 26,
  },
  dateText: {
    marginTop: 2,
    fontSize: 11,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 2,
  },
  flameAnim: {
    marginRight: -1,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 6,
    right: 7,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 17,
  },
});
