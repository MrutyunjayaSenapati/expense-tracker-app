import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  } as TextStyle,
  headingXL: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  } as TextStyle,
  headingL: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  } as TextStyle,
  headingM: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
  } as TextStyle,
  headingS: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  } as TextStyle,
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  } as TextStyle,
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  } as TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  } as TextStyle,
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  } as TextStyle,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type Typography = typeof typography;
export type FontWeight = keyof typeof fontWeights;
