import { useColorScheme as useRNColorScheme } from 'react-native';
import { useAppStore, ThemeMode } from '../store/useAppStore';
import { lightPalette, darkPalette, ThemeColors } from '../theme/colors';

export interface UseThemeReturn {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export function useTheme(): UseThemeReturn {
  const systemScheme = useRNColorScheme();
  const themeMode = useAppStore(state => state.themeMode);
  const setThemeMode = useAppStore(state => state.setThemeMode);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const activeColors = isDark ? darkPalette : lightPalette;

  return {
    colors: activeColors,
    isDark,
    themeMode,
    setThemeMode,
  };
}
