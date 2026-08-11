import { colors } from './colors';
import { typography, fontWeights } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  fontWeights,
  spacing,
  radius,
  shadows,
};

export { colors, typography, fontWeights, spacing, radius, shadows };
export type Theme = typeof theme;
