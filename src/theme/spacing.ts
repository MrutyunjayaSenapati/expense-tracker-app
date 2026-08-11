export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
  gigantic: 64,

  // Semantic layout spacing
  screenHorizontal: 16,
  cardPadding: 16,
  sectionGap: 24,
  rowVertical: 12,
  iconGap: 8,
  majorSectionGap: 32,
} as const;

export type Spacing = typeof spacing;
