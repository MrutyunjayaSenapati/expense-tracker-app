import { TextStyle } from 'react-native';

export const fontFamilies = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const typography = {
  display: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.0,
  } as TextStyle,
  displayNumeric: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -1.0,
    fontVariant: ['tabular-nums'],
  } as TextStyle,
  headingXL: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
  } as TextStyle,
  headingL: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  } as TextStyle,
  headingM: {
    fontFamily: fontFamilies.semibold,
    fontSize: 19,
    lineHeight: 25,
    letterSpacing: -0.2,
  } as TextStyle,
  headingS: {
    fontFamily: fontFamilies.semibold,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: -0.1,
  } as TextStyle,
  bodyLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
  } as TextStyle,
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
  } as TextStyle,
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: 13.5,
    lineHeight: 19,
  } as TextStyle,
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  } as TextStyle,
  captionBold: {
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.1,
  } as TextStyle,
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
} as const;

export type Typography = typeof typography;
export type FontWeight = keyof typeof fontWeights;
