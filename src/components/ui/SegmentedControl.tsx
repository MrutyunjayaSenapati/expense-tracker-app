import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Text } from './Text';
import { useHaptics } from '../../hooks/useHaptics';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  semanticColoring?: boolean;
  testID?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
  semanticColoring = true,
  testID,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const [containerWidth, setContainerWidth] = useState(0);
  const selectedIndex = options.findIndex(o => o.value === value);

  const thumbPosition = useSharedValue(0);

  useEffect(() => {
    if (containerWidth > 0 && selectedIndex >= 0) {
      const segmentWidth = (containerWidth - spacing.xs * 2) / options.length;
      thumbPosition.value = withSpring(selectedIndex * segmentWidth, {
        damping: 18,
        stiffness: 220,
      });
    }
  }, [selectedIndex, containerWidth, options.length, thumbPosition]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
  };

  const handleSelect = (val: T) => {
    if (val !== value) {
      haptics.selection();
      onChange(val);
    }
  };

  const segmentWidth = containerWidth > 0 ? (containerWidth - spacing.xs * 2) / options.length : 0;

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: thumbPosition.value }],
      width: segmentWidth,
    };
  });

  let activeBackground = colors.surface;
  if (semanticColoring) {
    if (value === 'expense') activeBackground = colors.expenseSoft;
    else if (value === 'income') activeBackground = colors.incomeSoft;
  }

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {/* Animated Sliding Thumb Pill */}
      {containerWidth > 0 && (
        <Animated.View
          style={[
            styles.activeThumb,
            animatedThumbStyle,
            {
              backgroundColor: activeBackground,
              borderColor: colors.border,
            },
          ]}
        />
      )}

      {/* Segment Option Buttons */}
      {options.map((option, idx) => {
        const isSelected = option.value === value;

        let activeTextColor: 'primary' | 'expense' | 'income' | 'brand' = 'brand';
        if (semanticColoring) {
          if (option.value === 'expense') activeTextColor = 'expense';
          else if (option.value === 'income') activeTextColor = 'income';
        }

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => handleSelect(option.value)}
            activeOpacity={0.8}
            testID={testID ? `${testID}-${option.value}` : undefined}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={styles.segment}
          >
            <View style={styles.segmentContent}>
              {option.icon && <View style={styles.icon}>{option.icon}</View>}
              <Text
                variant="bodySmall"
                weight={isSelected ? 'bold' : 'medium'}
                color={isSelected ? activeTextColor : 'secondary'}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  activeThumb: {
    position: 'absolute',
    top: spacing.xs,
    bottom: spacing.xs,
    left: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    ...shadows.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
});
