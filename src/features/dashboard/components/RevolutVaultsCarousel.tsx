import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { useHaptics } from '../../../hooks/useHaptics';
import { useUser } from '../../../hooks/useUser';
import { useAppStore, SavingsVault } from '../../../store/useAppStore';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { ConfirmationModal } from '../../../components/ui/ConfirmationModal';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyCode } from '../../../types/currency';

export const RevolutVaultsCarousel: React.FC = () => {
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const vaults = useAppStore(state => state.vaults);
  const addVault = useAppStore(state => state.addVault);
  const depositToVault = useAppStore(state => state.depositToVault);
  const deleteVault = useAppStore(state => state.deleteVault);

  const [selectedVault, setSelectedVault] = useState<SavingsVault | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteConfirmVault, setDeleteConfirmVault] = useState<SavingsVault | null>(null);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');
  const [selectedColor, setSelectedColor] = useState('#0075FF');

  const VAULT_COLORS = ['#0075FF', '#00D09C', '#FF6B00', '#8A3FFC', '#FFB800', '#FF3B30'];

  const handleDeposit = () => {
    if (!selectedVault) return;
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    haptics.success();
    depositToVault(selectedVault.id, amt);
    setSelectedVault(null);
    setDepositAmount('');
  };

  const handleCreateVault = () => {
    const target = parseFloat(newVaultTarget);
    if (!newVaultName.trim() || isNaN(target) || target <= 0) return;

    haptics.success();
    addVault({
      name: newVaultName.trim(),
      icon: 'sparkles',
      color: selectedColor,
      targetAmount: target,
    });
    setCreateModalVisible(false);
    setNewVaultName('');
    setNewVaultTarget('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmVault) return;
    haptics.medium();
    deleteVault(deleteConfirmVault.id);
    setDeleteConfirmVault(null);
    setSelectedVault(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWithBadge}>
          <Text variant="label" weight="bold" color="secondary" style={styles.sectionLabel}>
            VAULTS & POCKETS
          </Text>
          {vaults.length > 0 && (
            <View style={[styles.countBadge, { backgroundColor: colors.primaryLight }]}>
              <Text variant="caption" weight="bold" color="brand" style={{ fontSize: 10 }}>
                {vaults.length}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={() => {
            haptics.light();
            setCreateModalVisible(true);
          }}
          style={styles.seeAllBtn}
        >
          <Text variant="caption" weight="bold" color="brand">
            + New Vault
          </Text>
        </TouchableOpacity>
      </View>

      {/* When Empty: Clean starter card */}
      {vaults.length === 0 ? (
        <View style={{ paddingHorizontal: spacing.screenHorizontal }}>
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              setCreateModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <Card
              elevation="subtle"
              style={[
                styles.emptyVaultCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={[styles.emptyIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="sparkles" size={24} color={colors.primary} />
              </View>
              <View style={styles.emptyInfo}>
                <Text variant="bodyLarge" weight="bold" color="primary">
                  Create a Savings Vault
                </Text>
                <Text variant="caption" color="secondary" style={{ marginTop: 2 }}>
                  Set a goal for vacation, a new gadget, or emergency savings.
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </Card>
          </TouchableOpacity>
        </View>
      ) : (
        /* Horizontal Carousel */
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {vaults.map(vault => {
            const progress = Math.min(1, vault.currentAmount / vault.targetAmount);
            const percent = Math.round(progress * 100);
            const isComplete = percent >= 100;

            return (
              <TouchableOpacity
                key={vault.id}
                activeOpacity={0.8}
                onPress={() => {
                  haptics.selection();
                  setSelectedVault(vault);
                }}
                style={styles.vaultWrapper}
              >
                <Card
                  elevation="subtle"
                  style={[
                    styles.vaultCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  {/* Top Row: Icon & Percent */}
                  <View style={styles.cardTop}>
                    <View style={[styles.iconCircle, { backgroundColor: `${vault.color}18` }]}>
                      <Ionicons name={vault.icon as any} size={18} color={vault.color} />
                    </View>
                    <View
                      style={[
                        styles.percentBadge,
                        {
                          backgroundColor: isComplete ? colors.incomeSoft : colors.primaryLight,
                        },
                      ]}
                    >
                      <Text
                        variant="caption"
                        weight="bold"
                        style={{
                          color: isComplete ? colors.income : colors.primary,
                          fontSize: 11,
                        }}
                      >
                        {percent}%
                      </Text>
                    </View>
                  </View>

                  {/* Vault Name */}
                  <Text variant="bodyLarge" weight="bold" numberOfLines={1} style={styles.vaultName}>
                    {vault.name}
                  </Text>

                  {/* Progress Bar */}
                  <View style={[styles.progressTrack, { backgroundColor: colors.surfaceMuted }]}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${percent}%`,
                          backgroundColor: isComplete ? colors.income : vault.color,
                        },
                      ]}
                    />
                  </View>

                  {/* Saved vs Target */}
                  <View style={styles.amountRow}>
                    <Text variant="caption" weight="bold" color="primary">
                      {formatCurrency(vault.currentAmount, { currency: currencyCode })}
                    </Text>
                    <Text variant="caption" color="secondary">
                      / {formatCurrency(vault.targetAmount, { currency: currencyCode })}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          {/* Add New Vault Quick Card */}
          <TouchableOpacity
            onPress={() => {
              haptics.selection();
              setCreateModalVisible(true);
            }}
            activeOpacity={0.7}
            style={styles.vaultWrapper}
          >
            <View
              style={[
                styles.addVaultCard,
                {
                  backgroundColor: colors.surfaceMuted,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={[styles.addIconCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="add" size={22} color="#FFFFFF" />
              </View>
              <Text variant="body" weight="bold" color="primary" style={{ marginTop: 8 }}>
                New Vault
              </Text>
              <Text variant="caption" color="secondary" align="center">
                Set savings goal
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Quick Deposit / Manage Modal */}
      <Modal
        visible={!!selectedVault}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedVault(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.backdrop }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeaderRow}>
              <Text variant="headingM" weight="bold">
                {selectedVault?.name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (selectedVault) setDeleteConfirmVault(selectedVault);
                }}
                style={styles.trashBtn}
              >
                <Ionicons name="trash-outline" size={18} color={colors.expense} />
              </TouchableOpacity>
            </View>

            <Text variant="caption" color="secondary" style={{ marginTop: 2, marginBottom: spacing.md }}>
              Saved: {formatCurrency(selectedVault?.currentAmount || 0, { currency: currencyCode })} /{' '}
              {formatCurrency(selectedVault?.targetAmount || 0, { currency: currencyCode })}
            </Text>

            <TextInput
              value={depositAmount}
              onChangeText={setDepositAmount}
              placeholder="Amount to deposit (e.g. 1000)"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              autoFocus
              style={[
                styles.modalInput,
                { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceMuted },
              ]}
            />

            <View style={styles.modalBtnRow}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setSelectedVault(null)}
                style={{ flex: 1 }}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleDeposit}
                style={{ flex: 1 }}
              >
                + Deposit
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Vault Modal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.backdrop }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text variant="headingM" weight="bold">
              Create Savings Vault
            </Text>
            <Text variant="caption" color="secondary" style={{ marginTop: 4, marginBottom: spacing.md }}>
              Set a target to track and save towards
            </Text>

            <TextInput
              value={newVaultName}
              onChangeText={setNewVaultName}
              placeholder="Vault name (e.g. Vacation, Bike, Emergency)"
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.modalInput,
                { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceMuted },
              ]}
            />

            <TextInput
              value={newVaultTarget}
              onChangeText={setNewVaultTarget}
              placeholder="Target amount (e.g. 50000)"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
              style={[
                styles.modalInput,
                { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surfaceMuted, marginTop: 10 },
              ]}
            />

            {/* Color Accent Picker */}
            <Text variant="caption" color="secondary" weight="semibold" style={{ marginTop: spacing.md, marginBottom: 8 }}>
              THEME COLOR
            </Text>
            <View style={styles.colorRow}>
              {VAULT_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setSelectedColor(c)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    selectedColor === c && styles.selectedColorDot,
                  ]}
                >
                  {selectedColor === c && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalBtnRow}>
              <Button
                variant="outline"
                size="md"
                onPress={() => setCreateModalVisible(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onPress={handleCreateVault}
                style={{ flex: 1 }}
              >
                Create Vault
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Vault Confirmation */}
      <ConfirmationModal
        visible={!!deleteConfirmVault}
        title="Delete Vault?"
        message={`Are you sure you want to delete "${deleteConfirmVault?.name}"?`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmVault(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.xs + 2,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionLabel: {
    letterSpacing: 0.8,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  seeAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  emptyVaultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  emptyIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  emptyInfo: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm,
    paddingVertical: 4,
  },
  vaultWrapper: {
    width: 175,
  },
  vaultCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    height: 145,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  vaultName: {
    marginTop: 6,
    marginBottom: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.full,
    overflow: 'hidden',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: radius.full,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 4,
  },
  addVaultCard: {
    width: 175,
    height: 145,
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  addIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trashBtn: {
    padding: 6,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.xs,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColorDot: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
