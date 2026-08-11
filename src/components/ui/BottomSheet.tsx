import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Text } from './Text';
import { IconButton } from './IconButton';
import { useHaptics } from '../../hooks/useHaptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: number | string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  maxHeight = '82%',
}) => {
  const { colors } = useTheme();
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const haptics = useHaptics();

  useEffect(() => {
    if (visible) {
      haptics.light();
      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 180,
      });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
    }
  }, [visible, haptics, translateY, backdropOpacity]);

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { backgroundColor: colors.backdrop }, backdropAnimatedStyle]} />
        </TouchableWithoutFeedback>

        {/* Sheet Content Container */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.glassBorder,
              maxHeight: maxHeight as any,
            },
            sheetAnimatedStyle,
          ]}
        >
          {/* Drag Handle Indicator */}
          <View style={styles.handleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: colors.borderStrong }]} />
          </View>

          {/* Header */}
          {title && (
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text variant="headingS" weight="bold">
                {title}
              </Text>
              <IconButton
                name="close"
                size={20}
                onPress={onClose}
                accessibilityLabel="Close sheet"
              />
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.xl,
    borderWidth: 1,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    ...shadows.bottomSheet,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
});
