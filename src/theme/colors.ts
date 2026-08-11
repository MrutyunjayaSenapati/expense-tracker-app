export interface ThemeColors {
  // Brand
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primaryGlow: string;

  // Backgrounds & Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  surfaceSubtle: string;

  // Selective Liquid Glass
  glassSurface: string;
  glassSurfaceSubtle: string;
  glassBorder: string;
  glassBorderDark: string;
  glassHighlight: string;
  glassBackdrop: string;

  // Hero Card Gradient
  heroGradientStart: string;
  heroGradientEnd: string;
  heroSparkline: string;
  heroSparklineGlow: string;
  heroDot: string;
  heroTextSecondary: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  textInverse: string;

  // Financial & Semantic States
  expense: string;
  expenseSoft: string;
  expenseGlow: string;
  income: string;
  incomeSoft: string;
  incomeGlow: string;
  savings: string;
  savingsSoft: string;
  savingsGlow: string;
  warning: string;
  warningSoft: string;
  warningGlow: string;
  info: string;
  infoSoft: string;
  success: string;
  successSoft: string;
  error: string;
  errorSoft: string;

  // Borders
  border: string;
  borderStrong: string;

  // Gamification & Habit Badges
  streakOrange: string;
  streakSoft: string;
  trophyGold: string;
  trophySoft: string;

  // Overlays
  overlay: string;
  backdrop: string;

  // Category Icon Colors
  categoryColors: {
    food: string;
    groceries: string;
    shopping: string;
    travel: string;
    bills: string;
    entertainment: string;
    health: string;
    education: string;
    rent: string;
    subscriptions: string;
    personal: string;
    salary: string;
    freelance: string;
    investment: string;
    gift: string;
    other: string;
  };
}

export const lightPalette: ThemeColors = {
  primary: '#5B5CE2',
  primaryDark: '#4647B8',
  primaryLight: '#EEF0FF',
  primaryGlow: 'rgba(91, 92, 226, 0.25)',

  background: '#F5F7FB',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F3F8',
  surfaceSubtle: '#FAFAFD',

  glassSurface: 'rgba(255, 255, 255, 0.85)',
  glassSurfaceSubtle: 'rgba(255, 255, 255, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.6)',
  glassBorderDark: 'rgba(23, 24, 28, 0.06)',
  glassHighlight: 'rgba(255, 255, 255, 0.95)',
  glassBackdrop: 'rgba(15, 18, 30, 0.35)',

  heroGradientStart: '#4F46E5',
  heroGradientEnd: '#7C3AED',
  heroSparkline: '#38BDF8',
  heroSparklineGlow: 'rgba(56, 189, 248, 0.4)',
  heroDot: '#22D3EE',
  heroTextSecondary: 'rgba(255, 255, 255, 0.78)',

  textPrimary: '#111827',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',

  expense: '#EF4444',
  expenseSoft: '#FEE2E2',
  expenseGlow: 'rgba(239, 68, 68, 0.2)',
  income: '#10B981',
  incomeSoft: '#D1FAE5',
  incomeGlow: 'rgba(16, 185, 129, 0.2)',
  savings: '#3B82F6',
  savingsSoft: '#DBEAFE',
  savingsGlow: 'rgba(59, 130, 246, 0.2)',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  warningGlow: 'rgba(245, 158, 11, 0.2)',
  info: '#6366F1',
  infoSoft: '#EEF2FF',
  success: '#10B981',
  successSoft: '#D1FAE5',
  error: '#EF4444',
  errorSoft: '#FEE2E2',

  border: '#E2E8F0',
  borderStrong: '#CBD5E1',

  streakOrange: '#FF7A00',
  streakSoft: '#FFF3E6',
  trophyGold: '#F59E0B',
  trophySoft: '#FEF3C7',

  overlay: 'rgba(15, 23, 42, 0.4)',
  backdrop: 'rgba(15, 23, 42, 0.6)',

  categoryColors: {
    food: '#FF7A00',
    groceries: '#10B981',
    shopping: '#8B5CF6',
    travel: '#3B82F6',
    bills: '#EF4444',
    entertainment: '#EC4899',
    health: '#14B8A6',
    education: '#6366F1',
    rent: '#F59E0B',
    subscriptions: '#06B6D4',
    personal: '#0EA5E9',
    salary: '#10B981',
    freelance: '#14B8A6',
    investment: '#3B82F6',
    gift: '#F43F5E',
    other: '#64748B',
  },
};

export const darkPalette: ThemeColors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#312E81',
  primaryGlow: 'rgba(99, 102, 241, 0.35)',

  background: '#0B0D17',
  surface: '#151928',
  surfaceElevated: '#1E2337',
  surfaceMuted: '#1A1E30',
  surfaceSubtle: '#121522',

  glassSurface: 'rgba(22, 25, 40, 0.85)',
  glassSurfaceSubtle: 'rgba(22, 25, 40, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderDark: 'rgba(0, 0, 0, 0.3)',
  glassHighlight: 'rgba(255, 255, 255, 0.15)',
  glassBackdrop: 'rgba(5, 7, 12, 0.65)',

  heroGradientStart: '#1E1B4B',
  heroGradientEnd: '#311042',
  heroSparkline: '#818CF8',
  heroSparklineGlow: 'rgba(129, 140, 248, 0.5)',
  heroDot: '#A5B4FC',
  heroTextSecondary: 'rgba(226, 232, 240, 0.75)',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textDisabled: '#475569',
  textInverse: '#0B0D17',

  expense: '#F87171',
  expenseSoft: 'rgba(239, 68, 68, 0.15)',
  expenseGlow: 'rgba(248, 113, 113, 0.3)',
  income: '#34D399',
  incomeSoft: 'rgba(16, 185, 129, 0.15)',
  incomeGlow: 'rgba(52, 211, 153, 0.3)',
  savings: '#60A5FA',
  savingsSoft: 'rgba(59, 130, 246, 0.15)',
  savingsGlow: 'rgba(96, 165, 250, 0.3)',
  warning: '#FBBF24',
  warningSoft: 'rgba(245, 158, 11, 0.15)',
  warningGlow: 'rgba(251, 191, 36, 0.3)',
  info: '#818CF8',
  infoSoft: 'rgba(99, 102, 241, 0.15)',
  success: '#34D399',
  successSoft: 'rgba(16, 185, 129, 0.15)',
  error: '#F87171',
  errorSoft: 'rgba(239, 68, 68, 0.15)',

  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',

  streakOrange: '#FB923C',
  streakSoft: 'rgba(251, 146, 60, 0.15)',
  trophyGold: '#FBBF24',
  trophySoft: 'rgba(251, 191, 36, 0.15)',

  overlay: 'rgba(0, 0, 0, 0.7)',
  backdrop: 'rgba(0, 0, 0, 0.8)',

  categoryColors: {
    food: '#FB923C',
    groceries: '#34D399',
    shopping: '#A78BFA',
    travel: '#60A5FA',
    bills: '#F87171',
    entertainment: '#F472B6',
    health: '#2DD4BF',
    education: '#818CF8',
    rent: '#FBBF24',
    subscriptions: '#22D3EE',
    personal: '#38BDF8',
    salary: '#34D399',
    freelance: '#2DD4BF',
    investment: '#60A5FA',
    gift: '#FB7185',
    other: '#94A3B8',
  },
};

// Default export backward compatibility
export const colors = lightPalette;
export type Colors = ThemeColors;
