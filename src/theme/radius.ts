export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,

  // Semantic mappings
  input: 14,
  button: 24,
  card: 20,
  cardLarge: 24,
  squircle: 16,
  bottomSheet: 28,
  chip: 999,
  avatar: 999,
} as const;

export type Radius = typeof radius;
