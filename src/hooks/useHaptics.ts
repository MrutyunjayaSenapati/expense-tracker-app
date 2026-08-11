import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function useHaptics() {
  const light = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Ignore fallback
      }
    }
  };

  const medium = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch {
        // Ignore fallback
      }
    }
  };

  const success = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // Ignore fallback
      }
    }
  };

  const selection = () => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Ignore fallback
      }
    }
  };

  return { light, medium, success, selection };
}
