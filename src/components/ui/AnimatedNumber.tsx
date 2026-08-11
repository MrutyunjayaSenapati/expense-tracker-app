import React, { useEffect, useState, useRef } from 'react';
import { TextStyle } from 'react-native';
import { Text } from './Text';
import { formatCurrency } from '../../utils/currency';
import { typography } from '../../theme/typography';

export interface AnimatedNumberProps {
  value: number;
  variant?: keyof typeof typography;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'brand' | 'expense' | 'income' | 'warning' | 'inverse';
  sign?: boolean;
  type?: 'expense' | 'income';
  style?: TextStyle | TextStyle[];
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  variant = 'headingL',
  weight = 'bold',
  color = 'primary',
  sign = false,
  type,
  style,
  duration = 600,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;
    prevValueRef.current = value;

    if (startValue === endValue) return;

    let startTimestamp: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * easedProgress);

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [value, duration]);

  const formatted = formatCurrency(displayValue, { sign, type });

  return (
    <Text variant={variant} weight={weight} color={color} style={style}>
      {formatted}
    </Text>
  );
};
