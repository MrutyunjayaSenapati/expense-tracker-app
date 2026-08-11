import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

export interface ProgressBarProps {
  progress: number; // 0 to 1 or > 1 for exceeded
  height?: number;
  color?: string;
  backgroundColor?: string;
  autoColor?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  autoColor = true,
  style,
}) => {
  const { colors } = useTheme();
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    animatedWidth.value = withSpring(clampedProgress, {
      damping: 15,
      stiffness: 120,
    });
  }, [clampedProgress, animatedWidth]);

  const getProgressColor = (): string => {
    if (color) return color;
    if (!autoColor) return colors.primary;

    if (progress >= 1) return colors.expense;
    if (progress >= 0.8) return colors.warning;
    return colors.income;
  };

  const barColor = getProgressColor();

  const fillStyle = useAnimatedStyle(() => ({
    width: `${animatedWidth.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: backgroundColor || colors.surfaceMuted,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: barColor,
            borderRadius: height / 2,
          },
          fillStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
