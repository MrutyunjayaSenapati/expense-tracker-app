import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

class BiometricService {
  /**
   * Check if device has hardware support for biometrics (Touch ID / Face ID / Biometrics)
   */
  async isHardwareAvailable(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      return await LocalAuthentication.hasHardwareAsync();
    } catch {
      return false;
    }
  }

  /**
   * Check if user has enrolled fingerprints / face recognition
   */
  async isEnrolled(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch {
      return false;
    }
  }

  /**
   * Get supported biometric types (Face ID, Fingerprint, Iris)
   */
  async getSupportedTypes(): Promise<string[]> {
    if (Platform.OS === 'web') return [];
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types.map(t => {
        if (t === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) return 'Face ID';
        if (t === LocalAuthentication.AuthenticationType.FINGERPRINT) return 'Fingerprint';
        if (t === LocalAuthentication.AuthenticationType.IRIS) return 'Iris';
        return 'Biometrics';
      });
    } catch {
      return [];
    }
  }

  /**
   * Prompt user to authenticate with biometrics / device passcode
   */
  async authenticate(promptMessage: string = 'Unlock Expense Tracker'): Promise<boolean> {
    if (Platform.OS === 'web') return true;
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Device Passcode',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  }
}

export const biometricService = new BiometricService();
