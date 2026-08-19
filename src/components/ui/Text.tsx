import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle, Platform } from 'react-native';
import { typography, fontWeights, fontFamilies, FontWeight } from '../../theme/typography';
import { useTheme } from '../../hooks/useTheme';

export type TextVariant = keyof typeof typography;
export type TextColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'inverse'
  | 'expense'
  | 'income'
  | 'savings'
  | 'warning'
  | 'brand';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: TextColor;
  weight?: FontWeight;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'primary',
  weight,
  align,
  style,
  children,
  ...rest
}) => {
  const { colors } = useTheme();

  const colorMap: Record<TextColor, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    tertiary: colors.textTertiary,
    disabled: colors.textDisabled,
    inverse: colors.textInverse,
    expense: colors.expense,
    income: colors.income,
    savings: colors.savings,
    warning: colors.warning,
    brand: colors.primary,
  };

  const baseTypography = typography[variant];
  const textColor = colorMap[color] || colors.textPrimary;

  let fontFamily = baseTypography.fontFamily;
  if (weight && fontFamilies[weight]) {
    fontFamily = fontFamilies[weight];
  }

  const combinedStyle: TextStyle = {
    ...baseTypography,
    fontFamily,
    color: textColor,
    ...(align ? { textAlign: align } : {}),
  };

  return (
    <RNText style={[combinedStyle, style]} {...rest}>
      {children}
    </RNText>
  );
};
