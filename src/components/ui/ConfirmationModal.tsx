import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';
import { Button } from './Button';
import { Ionicons } from '@expo/vector-icons';

export interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TouchableWithoutFeedback>
            <View style={[styles.dialog, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {isDestructive && (
                <View style={[styles.iconCircle, { backgroundColor: colors.expenseSoft }]}>
                  <Ionicons name="trash-outline" size={28} color={colors.expense} />
                </View>
              )}
              <Text variant="headingM" weight="bold" align="center" style={styles.title}>
                {title}
              </Text>
              <Text variant="body" color="secondary" align="center" style={styles.message}>
                {message}
              </Text>
              <View style={styles.buttonRow}>
                <Button
                  variant="secondary"
                  size="md"
                  onPress={onCancel}
                  disabled={loading}
                  style={styles.actionBtn}
                >
                  {cancelLabel}
                </Button>
                <Button
                  variant={isDestructive ? 'destructive' : 'primary'}
                  size="md"
                  onPress={onConfirm}
                  loading={loading}
                  style={styles.actionBtn}
                >
                  {confirmLabel}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
});
