import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAppStore } from '../../store/useAppStore';
import { biometricService } from '../../services/security/biometricService';
import { Text } from './Text';
import { Button } from './Button';
import { BrandLogo } from './BrandLogo';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../../theme/spacing';

export const BiometricLockOverlay: React.FC = () => {
  const { colors } = useTheme();
  const biometricsEnabled = useAppStore(state => state.biometricsEnabled);
  const isAppLocked = useAppStore(state => state.isAppLocked);
  const unlockApp = useAppStore(state => state.unlockApp);

  const handleUnlock = async () => {
    const success = await biometricService.authenticate('Unlock Expense Tracker');
    if (success) {
      unlockApp();
    }
  };

  useEffect(() => {
    if (biometricsEnabled && isAppLocked) {
      handleUnlock();
    }
  }, [biometricsEnabled, isAppLocked]);

  if (!biometricsEnabled || !isAppLocked) {
    return null;
  }

  return (
    <Modal visible={isAppLocked} transparent={false} animationType="fade">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.logo}>
            <BrandLogo size={64} />
          </View>
          
          <Text variant="headingL" weight="bold" style={styles.title}>
            Expense Tracker Locked
          </Text>
          <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
            Your financial data is protected. Use Face ID, Fingerprint, or Passcode to continue.
          </Text>

          <TouchableOpacity
            onPress={handleUnlock}
            activeOpacity={0.8}
            style={[styles.unlockButton, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}
          >
            <Ionicons name="finger-print-outline" size={48} color={colors.primary} />
            <Text variant="bodyLarge" weight="bold" color="brand" style={{ marginTop: spacing.xs }}>
              Tap to Unlock
            </Text>
          </TouchableOpacity>

          <Button
            variant="primary"
            size="lg"
            onPress={handleUnlock}
            style={styles.actionBtn}
          >
            Unlock with Biometrics
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  logo: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  unlockButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  actionBtn: {
    width: '100%',
  },
});
