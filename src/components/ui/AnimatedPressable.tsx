import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useHaptics } from '../../hooks/useHaptics';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  hapticFeedback?: boolean;
  children?: React.ReactNode;
}

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  style,
  scaleTo = 0.96,
  hapticFeedback = true,
  onPressIn,
  onPressOut,
  children,
  ...props
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const haptics = useHaptics();

  const handlePressIn = (e: GestureResponderEvent) => {
    'worklet';
    scale.value = withSpring(scaleTo, { damping: 14, stiffness: 220 });
    opacity.value = withSpring(0.92, { damping: 14, stiffness: 220 });
    if (hapticFeedback) {
      haptics.light();
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    'worklet';
    scale.value = withSpring(1, { damping: 14, stiffness: 220 });
    opacity.value = withSpring(1, { damping: 14, stiffness: 220 });
    onPressOut?.(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressableBase
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressableBase>
  );
};
