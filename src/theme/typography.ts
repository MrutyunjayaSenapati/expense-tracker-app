import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.8,
  } as TextStyle,
  displayNumeric: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.8,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  headingXL: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
  } as TextStyle,
  headingL: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  } as TextStyle,
  headingM: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.2,
  } as TextStyle,
  headingS: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.1,
  } as TextStyle,
  bodyLarge: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13.5,
    lineHeight: 19,
  } as TextStyle,
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  captionBold: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
