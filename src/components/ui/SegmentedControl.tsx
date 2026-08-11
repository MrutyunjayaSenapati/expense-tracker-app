import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Text } from './Text';
import { AnimatedPressable } from './AnimatedPressable';
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
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
  semanticColoring = true,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const handleSelect = (val: T) => {
    if (val !== value) {
      haptics.selection();
      onChange(val);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceMuted,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {options.map(option => {
        const isSelected = option.value === value;

        let activeBackground: string = colors.surface;
        let activeTextColor: 'primary' | 'expense' | 'income' | 'brand' = 'brand';

        if (semanticColoring) {
          if (option.value === 'expense') {
            activeBackground = isSelected ? colors.expenseSoft : colors.surface;
            activeTextColor = 'expense';
          } else if (option.value === 'income') {
            activeBackground = isSelected ? colors.incomeSoft : colors.surface;
            activeTextColor = 'income';
          }
        }

        return (
          <AnimatedPressable
            key={option.value}
            onPress={() => handleSelect(option.value)}
            scaleTo={0.97}
            hapticFeedback={false}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={[
              styles.segment,
              isSelected && [
                styles.selectedSegment,
                { backgroundColor: activeBackground },
              ],
            ]}
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
          </AnimatedPressable>
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
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  selectedSegment: {
    ...shadows.sm,
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
