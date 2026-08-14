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
  primary: '#4F46E5', // Rich Indigo
  primaryDark: '#4338CA',
  primaryLight: '#EEF2FF',
  primaryGlow: 'rgba(79, 70, 229, 0.16)',

  background: '#F8F9FA', // Clean modern off-white
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F1F3F9',
  surfaceSubtle: '#F8FAFC',

  glassSurface: 'rgba(255, 255, 255, 0.90)',
  glassSurfaceSubtle: 'rgba(255, 255, 255, 0.70)',
  glassBorder: 'rgba(229, 231, 235, 0.8)',
  glassBorderDark: 'rgba(15, 23, 42, 0.06)',
  glassHighlight: 'rgba(255, 255, 255, 0.95)',
  glassBackdrop: 'rgba(15, 23, 42, 0.35)',

  heroBackground: '#1E1B4B', // Deep indigo/slate hero card
  heroBorder: 'rgba(255, 255, 255, 0.12)',
  heroTextPrimary: '#FFFFFF',
  heroTextSecondary: 'rgba(255, 255, 255, 0.72)',

  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#94A3B8', // Slate 400
  textDisabled: '#CBD5E1', // Slate 300
  textInverse: '#FFFFFF',

  expense: '#E11D48', // Rose 600
  expenseSoft: '#FFE4E6',
  expenseGlow: 'rgba(225, 29, 72, 0.12)',
  income: '#059669', // Emerald 600
  incomeSoft: '#D1FAE5',
  incomeGlow: 'rgba(5, 150, 105, 0.12)',
  savings: '#2563EB', // Blue 600
  savingsSoft: '#DBEAFE',
  savingsGlow: 'rgba(37, 99, 235, 0.12)',
  warning: '#D97706', // Amber 600
  warningSoft: '#FEF3C7',
  warningGlow: 'rgba(217, 119, 6, 0.12)',
  info: '#4F46E5',
  infoSoft: '#EEF2FF',
  success: '#059669',
  successSoft: '#D1FAE5',
  error: '#E11D48',
  errorSoft: '#FFE4E6',

  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  divider: '#F1F5F9',

  streakOrange: '#EA580C',
  streakSoft: '#FFEDD5',
  trophyGold: '#D97706',
  trophySoft: '#FEF3C7',

  overlay: 'rgba(15, 23, 42, 0.45)',
  backdrop: 'rgba(15, 23, 42, 0.65)',

  categoryColors: {
    food: '#EA580C',
    groceries: '#059669',
    shopping: '#7C3AED',
    travel: '#0284C7',
    bills: '#E11D48',
    entertainment: '#DB2777',
    health: '#0D9488',
    education: '#4F46E5',
    rent: '#D97706',
    subscriptions: '#0891B2',
    personal: '#2563EB',
    salary: '#059669',
    freelance: '#0D9488',
    investment: '#2563EB',
    gift: '#E11D48',
    other: '#64748B',
  },
};

export const darkPalette: ThemeColors = {
  primary: '#6366F1', // Indigo 500
  primaryDark: '#4F46E5',
  primaryLight: 'rgba(99, 102, 241, 0.18)',
  primaryGlow: 'rgba(99, 102, 241, 0.25)',

  background: '#090A0F', // Deep obsidian
  surface: 'rgba(19, 21, 31, 0.76)', // Frosted glass surface
  surfaceElevated: 'rgba(26, 30, 46, 0.86)',
  surfaceMuted: 'rgba(255, 255, 255, 0.08)',
  surfaceSubtle: 'rgba(255, 255, 255, 0.05)',

  glassSurface: 'rgba(19, 21, 31, 0.62)',
  glassSurfaceSubtle: 'rgba(255, 255, 255, 0.04)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderDark: 'rgba(0, 0, 0, 0.40)',
  glassHighlight: 'rgba(255, 255, 255, 0.20)',
  glassBackdrop: 'rgba(9, 10, 15, 0.60)',

  heroBackground: 'rgba(24, 27, 44, 0.82)',
  heroBorder: 'rgba(255, 255, 255, 0.15)',
  heroTextPrimary: '#FFFFFF',
  heroTextSecondary: 'rgba(255, 255, 255, 0.76)',

  textPrimary: '#F8FAFC', // Slate 50
  textSecondary: '#CBD5E1', // Slate 300 (Crisp contrast)
  textTertiary: '#94A3B8', // Slate 400
  textDisabled: '#475569', // Slate 600
  textInverse: '#0F172A',

  expense: '#FB7185', // Rose 400 (soft, readable)
  expenseSoft: 'rgba(251, 113, 133, 0.14)',
  expenseGlow: 'rgba(251, 113, 133, 0.2)',
  income: '#34D399', // Emerald 400
  incomeSoft: 'rgba(52, 211, 153, 0.14)',
  incomeGlow: 'rgba(52, 211, 153, 0.2)',
  savings: '#60A5FA', // Blue 400
  savingsSoft: 'rgba(96, 165, 250, 0.14)',
  savingsGlow: 'rgba(96, 165, 250, 0.2)',
  warning: '#FBBF24', // Amber 400
  warningSoft: 'rgba(251, 191, 36, 0.14)',
  warningGlow: 'rgba(251, 191, 36, 0.2)',
  info: '#818CF8',
  infoSoft: 'rgba(129, 140, 248, 0.14)',
  success: '#34D399',
  successSoft: 'rgba(52, 211, 153, 0.14)',
  error: '#FB7185',
  errorSoft: 'rgba(251, 113, 133, 0.14)',

  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  divider: 'rgba(255, 255, 255, 0.05)',

  streakOrange: '#FB923C',
  streakSoft: 'rgba(251, 146, 60, 0.14)',
  trophyGold: '#FBBF24',
  trophySoft: 'rgba(251, 191, 36, 0.14)',

  overlay: 'rgba(0, 0, 0, 0.75)',
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
