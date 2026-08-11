export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,

  // Semantic mappings
  input: 12,
  button: 12,
  card: 16,
  bottomSheet: 24,
  chip: 999,
  avatar: 999,
} as const;

export type Radius = typeof radius;
