import React from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

export const Toast: React.FC = () => {
  const { visible, message, type } = useAppStore(state => state.toast);
  const hideToast = useAppStore(state => state.hideToast);
  const { colors } = useTheme();

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Ionicons name="checkmark-circle" size={20} color={colors.success} />;
      case 'error':
        return <Ionicons name="alert-circle" size={20} color={colors.error} />;
      case 'info':
        return <Ionicons name="information-circle" size={20} color={colors.info} />;
    }
  };

  return (
    <SafeAreaView style={styles.wrapper} pointerEvents="box-none">
      <View
        style={[
          styles.container,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.iconContainer}>{getIcon()}</View>
        <Text variant="bodySmall" weight="semibold" style={styles.text}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={hideToast}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.close}
        >
          <Ionicons name="close" size={16} color={colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 50,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  text: {
    flex: 1,
  },
  close: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
});
