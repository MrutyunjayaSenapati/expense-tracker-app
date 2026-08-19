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

  // Selective Glass Surfaces
  glassSurface: string;
  glassSurfaceSubtle: string;
  glassBorder: string;
  glassBorderDark: string;
  glassHighlight: string;
  glassBackdrop: string;

  // Hero Card Palette
  heroBackground: string;
  heroBorder: string;
  heroTextPrimary: string;
  heroTextSecondary: string;

  // Text Hierarchy
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

  // Borders & Dividers
  border: string;
  borderStrong: string;
  divider: string;

  // Habit & Badges
  streakOrange: string;
  streakSoft: string;
  trophyGold: string;
  trophySoft: string;

  // Overlays
  overlay: string;
  backdrop: string;

  // Category Icon Colors (Curated Harmonic Palette)
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
  primary: '#0075FF', // Revolut Electric Blue
  primaryDark: '#005BC5',
  primaryLight: 'rgba(0, 117, 255, 0.12)',
  primaryGlow: 'rgba(0, 117, 255, 0.25)',

  background: '#F7F9FC', // Clean Swiss off-white
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#EDF2F7',
  surfaceSubtle: '#F8FAFC',

  glassSurface: 'rgba(255, 255, 255, 0.92)',
  glassSurfaceSubtle: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(226, 232, 240, 0.8)',
  glassBorderDark: 'rgba(15, 23, 42, 0.08)',
  glassHighlight: 'rgba(255, 255, 255, 0.95)',
  glassBackdrop: 'rgba(7, 9, 14, 0.40)',

  heroBackground: '#0B1222', // Dark slate hero card for crisp contrast
  heroBorder: 'rgba(255, 255, 255, 0.12)',
  heroTextPrimary: '#FFFFFF',
  heroTextSecondary: 'rgba(255, 255, 255, 0.72)',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',

  expense: '#FF3B30', // Revolut Electric Coral
  expenseSoft: '#FFE5E5',
  expenseGlow: 'rgba(255, 59, 48, 0.14)',
  income: '#00D09C', // Revolut Mint Green
  incomeSoft: '#E0FAF2',
  incomeGlow: 'rgba(0, 208, 156, 0.14)',
  savings: '#0075FF',
  savingsSoft: '#E6F1FF',
  savingsGlow: 'rgba(0, 117, 255, 0.14)',
  warning: '#FF9500',
  warningSoft: '#FFF4E5',
  warningGlow: 'rgba(255, 149, 0, 0.14)',
  info: '#0075FF',
  infoSoft: '#E6F1FF',
  success: '#00D09C',
  successSoft: '#E0FAF2',
  error: '#FF3B30',
  errorSoft: '#FFE5E5',

  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  divider: '#F1F5F9',

  streakOrange: '#FF6B00',
  streakSoft: '#FFF0E6',
  trophyGold: '#FFB800',
  trophySoft: '#FFF8E6',

  overlay: 'rgba(7, 9, 14, 0.45)',
  backdrop: 'rgba(7, 9, 14, 0.70)',

  categoryColors: {
    food: '#FF6B00',
    groceries: '#00D09C',
    shopping: '#8A3FFC',
    travel: '#0075FF',
    bills: '#FF3B30',
    entertainment: '#FA4D56',
    health: '#00D09C',
    education: '#0075FF',
    rent: '#FF9500',
    subscriptions: '#8A3FFC',
    personal: '#0075FF',
    salary: '#00D09C',
    freelance: '#00B4D8',
    investment: '#0075FF',
    gift: '#FF3B30',
    other: '#64748B',
  },
};

export const darkPalette: ThemeColors = {
  primary: '#0075FF', // Revolut Electric Blue
  primaryDark: '#005BC5',
  primaryLight: 'rgba(0, 117, 255, 0.20)',
  primaryGlow: 'rgba(0, 117, 255, 0.35)',

  background: '#07090E', // Revolut Pure Obsidian Black
  surface: 'rgba(17, 22, 34, 0.85)', // Frosted glass surface
  surfaceElevated: 'rgba(24, 31, 48, 0.95)',
  surfaceMuted: 'rgba(255, 255, 255, 0.08)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.04)',

  glassSurface: 'rgba(17, 22, 34, 0.75)',
  glassSurfaceSubtle: 'rgba(255, 255, 255, 0.035)',
  glassBorder: 'rgba(255, 255, 255, 0.09)',
  glassBorderDark: 'rgba(0, 0, 0, 0.50)',
  glassHighlight: 'rgba(255, 255, 255, 0.16)',
  glassBackdrop: 'rgba(7, 9, 14, 0.75)',

  heroBackground: 'rgba(17, 22, 34, 0.90)',
  heroBorder: 'rgba(255, 255, 255, 0.10)',
  heroTextPrimary: '#FFFFFF',
  heroTextSecondary: 'rgba(255, 255, 255, 0.70)',

  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8', // Slate 400 (Revolut high contrast subtext)
  textTertiary: '#64748B',
  textDisabled: '#334155',
  textInverse: '#07090E',

  expense: '#FF453A', // Revolut Coral Red
  expenseSoft: 'rgba(255, 69, 58, 0.15)',
  expenseGlow: 'rgba(255, 69, 58, 0.30)',
  income: '#00D09C', // Revolut Mint Green
  incomeSoft: 'rgba(0, 208, 156, 0.15)',
  incomeGlow: 'rgba(0, 208, 156, 0.30)',
  savings: '#0075FF',
  savingsSoft: 'rgba(0, 117, 255, 0.15)',
  savingsGlow: 'rgba(0, 117, 255, 0.30)',
  warning: '#FF9F0A',
  warningSoft: 'rgba(255, 159, 10, 0.15)',
  warningGlow: 'rgba(255, 159, 10, 0.30)',
  info: '#0075FF',
  infoSoft: 'rgba(0, 117, 255, 0.15)',
  success: '#00D09C',
  successSoft: 'rgba(0, 208, 156, 0.15)',
  error: '#FF453A',
  errorSoft: 'rgba(255, 69, 58, 0.15)',

  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
  divider: 'rgba(255, 255, 255, 0.06)',

  streakOrange: '#FF6B00',
  streakSoft: 'rgba(255, 107, 0, 0.16)',
  trophyGold: '#FFB800',
  trophySoft: 'rgba(255, 184, 0, 0.16)',

  overlay: 'rgba(0, 0, 0, 0.65)',
  backdrop: 'rgba(0, 0, 0, 0.85)',

  categoryColors: {
    food: '#FB923C',
    groceries: '#34D399',
    shopping: '#A78BFA',
    travel: '#60A5FA',
    bills: '#FB7185',
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
