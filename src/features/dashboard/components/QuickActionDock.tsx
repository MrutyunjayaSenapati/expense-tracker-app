import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useHaptics } from '../../../hooks/useHaptics';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';

interface QuickActionDockProps {
  onAddExpense?: () => void;
}

export const QuickActionDock: React.FC<QuickActionDockProps> = ({ onAddExpense }) => {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(60)} style={styles.container}>
      {/* 1. Add Expense */}
      <TouchableOpacity
        onPress={() => {
          haptics.medium();
          if (onAddExpense) {
            onAddExpense();
          } else {
            router.push('/(tabs)/add');
          }
        }}
        activeOpacity={0.8}
        style={[styles.actionBtn, { backgroundColor: colors.primary }]}
      >
        <Ionicons name="add" size={18} color="#FFFFFF" />
        <Text variant="captionBold" style={{ color: '#FFFFFF', marginLeft: 4 }}>
          Add Expense
        </Text>
      </TouchableOpacity>

      {/* 2. Split Bill */}
      <TouchableOpacity
        onPress={() => {
          haptics.light();
          router.push('/splits/create' as any);
        }}
        activeOpacity={0.8}
        style={[styles.actionBtnSecondary, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Ionicons name="swap-horizontal" size={16} color={colors.textPrimary} />
        <Text variant="captionBold" color="primary" style={{ marginLeft: 4 }}>
          Split Bill
        </Text>
      </TouchableOpacity>

      {/* 3. Room & Flatmate Groups */}
      <TouchableOpacity
        onPress={() => {
          haptics.light();
          router.push('/groups' as any);
        }}
        activeOpacity={0.8}
        style={[styles.actionBtnSecondary, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Ionicons name="people" size={16} color={colors.primary} />
        <Text variant="captionBold" color="primary" style={{ marginLeft: 4 }}>
          Room Groups
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  actionBtn: {
    flex: 1.1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.button,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: radius.button,
    borderWidth: 1,
  },
});
