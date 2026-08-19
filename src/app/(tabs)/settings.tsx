import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser, useUpdateCurrency } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore, type ThemeMode } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { notificationService } from '../../services/notifications/notificationService';
import { CurrencyCode, CURRENCIES } from '../../types/currency';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, themeMode, setThemeMode } = useTheme();
  const haptics = useHaptics();

  const { data: user } = useUser();
  const { logout, deleteAccount, isLoading: isAuthLoading, isDeletingAccount } = useAuth();
  const updateCurrencyMutation = useUpdateCurrency();

  const notificationsEnabled = useAppStore(state => state.notificationsEnabled);
  const setNotificationsEnabled = useAppStore(state => state.setNotificationsEnabled);
  const budgetAlertsEnabled = useAppStore(state => state.budgetAlertsEnabled);
  const setBudgetAlertsEnabled = useAppStore(state => state.setBudgetAlertsEnabled);
  const biometricsEnabled = useAppStore(state => state.biometricsEnabled);
  const setBiometricsEnabled = useAppStore(state => state.setBiometricsEnabled);
  const showToast = useAppStore(state => state.showToast);

  const [currencySheetVisible, setCurrencySheetVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const currentCurrency = user?.currency || 'INR';

  const handleToggleBiometrics = async (val: boolean) => {
    haptics.selection();
    const success = await setBiometricsEnabled(val);
    if (val && !success) {
      showToast('Biometrics not available or authentication cancelled', 'info');
    } else if (val) {
      showToast('Biometric App Lock enabled', 'success');
    } else {
      showToast('Biometric App Lock disabled', 'info');
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    haptics.selection();
    const success = await setNotificationsEnabled(val);
    if (val && !success) {
      showToast('Please enable notifications in your phone Settings', 'info');
    } else if (val) {
      showToast('Daily reminders enabled for 8:00 PM', 'success');
    } else {
      showToast('Daily reminders disabled', 'info');
    }
  };

  const handleToggleBudgetAlerts = (val: boolean) => {
    haptics.selection();
    setBudgetAlertsEnabled(val);
    showToast(val ? 'Budget limit alerts enabled' : 'Budget limit alerts disabled', 'info');
  };

  const handleSendTestNotification = async () => {
    haptics.medium();
    setIsSendingTest(true);
    const sent = await notificationService.sendTestNotification();
    setIsSendingTest(false);
    if (sent) {
      showToast('Sample notification sent. Check your notification tray.', 'success');
    } else {
      showToast('Could not send notification. Please check permissions.', 'error');
    }
  };

  const handleSelectCurrency = async (code: CurrencyCode) => {
    setCurrencySheetVisible(false);
    await updateCurrencyMutation.mutateAsync(code);
  };

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
  };

  const handleDeleteAccount = async () => {
    try {
      haptics.medium();
      await deleteAccount();
      setDeleteAccountModalVisible(false);
    } catch {
      // Handled in mutation onError
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Card */}
      <Card elevation="sm" style={styles.profileCard}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Ionicons name="person" size={32} color={colors.primary} />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text variant="headingM" weight="bold">
            {user?.name || 'User'}
          </Text>
          <Text variant="bodySmall" color="secondary">
            {user?.email || ''}
          </Text>
        </View>
      </Card>

      {/* Appearance Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        APPEARANCE
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        <View style={styles.appearanceContainer}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="moon-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text variant="bodyLarge" weight="semibold">
                Theme Mode
              </Text>
              <Text variant="caption" color="secondary">
                {themeMode === 'light' ? 'Light Theme' : themeMode === 'dark' ? 'Dark Theme' : 'System Default'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.themeSelectorWrapper}>
          <SegmentedControl
            options={[
              {
                value: 'light',
                label: 'Light',
                icon: <Ionicons name="sunny-outline" size={15} color={colors.streakOrange} />,
              },
              {
                value: 'dark',
                label: 'Dark',
                icon: <Ionicons name="moon-outline" size={15} color={colors.primary} />,
              },
              {
                value: 'system',
                label: 'System',
                icon: <Ionicons name="phone-portrait-outline" size={15} color={colors.textSecondary} />,
              },
            ]}
            value={themeMode}
            onChange={val => setThemeMode(val as ThemeMode)}
          />
        </View>
      </Card>

      {/* Preferences Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        PREFERENCES
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        <TouchableOpacity
          onPress={() => setCurrencySheetVisible(true)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="cash-outline" size={20} color={colors.primary} />
            </View>
            <Text variant="bodyLarge" weight="semibold">
              Default Currency
            </Text>
          </View>
          <View style={styles.menuRight}>
            <Text variant="body" color="brand" weight="bold">
              {currentCurrency} ({CURRENCIES[currentCurrency].symbol})
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </View>
        </TouchableOpacity>
      </Card>

      {/* Notifications Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        NOTIFICATIONS
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        {/* Daily Reminders */}
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.streakSoft || 'rgba(255, 107, 0, 0.15)' }]}>
              <Ionicons name="alarm-outline" size={20} color={colors.streakOrange || '#FF6B00'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Daily Expense Reminder
              </Text>
              <Text variant="caption" color="secondary">
                {notificationsEnabled ? 'Scheduled daily at 8:00 PM' : 'Reminders are disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Budget Limit Warnings */}
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Budget Limit Alerts
              </Text>
              <Text variant="caption" color="secondary">
                Instant warnings at 80% & 100% of limits
              </Text>
            </View>
          </View>
          <Switch
            value={budgetAlertsEnabled}
            onValueChange={handleToggleBudgetAlerts}
            trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Send Test Notification */}
        <TouchableOpacity
          onPress={handleSendTestNotification}
          activeOpacity={0.7}
          disabled={isSendingTest}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Send Test Notification
              </Text>
              <Text variant="caption" color="secondary">
                Tap to check notification delivery on your phone
              </Text>
            </View>
          </View>
          <Ionicons name="paper-plane-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      </Card>

      {/* Security & Privacy Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        SECURITY & PRIVACY
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        {/* Biometric App Lock */}
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="finger-print-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Biometric App Lock
              </Text>
              <Text variant="caption" color="secondary">
                Require Face ID / Fingerprint to open app
              </Text>
            </View>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={handleToggleBiometrics}
            trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      {/* Financial Management Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        FINANCIAL MANAGEMENT
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        <TouchableOpacity
          onPress={() => router.push('/accounts')}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.infoSoft }]}>
              <Ionicons name="wallet-outline" size={20} color={colors.info} />
            </View>
            <Text variant="bodyLarge" weight="semibold">
              Manage Accounts & Wallets
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => router.push('/budgets')}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.incomeSoft }]}>
              <Ionicons name="pie-chart-outline" size={20} color={colors.income} />
            </View>
            <Text variant="bodyLarge" weight="semibold">
              Monthly Budgets
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => router.push('/subscriptions' as any)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.streakSoft || 'rgba(255, 107, 0, 0.15)' }]}>
              <Ionicons name="repeat-outline" size={20} color={colors.streakOrange || '#FF6B00'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Subscriptions & Bills
              </Text>
              <Text variant="caption" color="secondary">
                Manage recurring monthly commitments
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => router.push('/categories')}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.warningSoft }]}>
              <Ionicons name="grid-outline" size={20} color={colors.warning} />
            </View>
            <Text variant="bodyLarge" weight="semibold">
              Expense & Income Categories
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => router.push('/splits' as any)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="receipt-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Split Individual Bills
              </Text>
              <Text variant="caption" color="secondary">
                1-tap UPI requests and split receipts
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => router.push('/groups' as any)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="people-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Room & Flatmate Groups
              </Text>
              <Text variant="caption" color="secondary">
                Continuous shared ledger with simplified settlements
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </Card>

      {/* Account Actions Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        ACCOUNT & DANGER ZONE
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        {/* Log Out */}
        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.surfaceMuted }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold">
                Log Out
              </Text>
              <Text variant="caption" color="secondary">
                Sign out of this device
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Delete Account */}
        <TouchableOpacity
          onPress={() => setDeleteAccountModalVisible(true)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.expenseSoft }]}>
              <Ionicons name="trash-outline" size={20} color={colors.expense} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="semibold" color="expense">
                Delete Account & Data
              </Text>
              <Text variant="caption" color="secondary">
                Permanently erase all your records
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.expense} />
        </TouchableOpacity>
      </Card>

      {/* App Version Info */}
      <View style={styles.appInfo}>
        <Text variant="caption" color="tertiary" align="center">
          Expense Tracker v1.0.0
        </Text>
      </View>

      {/* Currency Selection Bottom Sheet */}
      <BottomSheet
        visible={currencySheetVisible}
        onClose={() => setCurrencySheetVisible(false)}
        title="Select Default Currency"
      >
        <View style={styles.currencyList}>
          {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => {
            const config = CURRENCIES[code];
            const isSelected = code === currentCurrency;
            return (
              <TouchableOpacity
                key={code}
                onPress={() => handleSelectCurrency(code)}
                activeOpacity={0.7}
                style={[
                  styles.currencyItem,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isSelected && { borderColor: colors.primary },
                ]}
              >
                <View style={styles.currencyLeft}>
                  <Text variant="headingM" weight="bold" color={isSelected ? 'brand' : 'primary'}>
                    {config.symbol}
                  </Text>
                  <View style={styles.currencyDetails}>
                    <Text variant="bodyLarge" weight="semibold">
                      {config.name}
                    </Text>
                    <Text variant="caption" color="secondary">
                      {config.code}
                    </Text>
                  </View>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={logoutModalVisible}
        title="Log Out of Expense Tracker?"
        message="Are you sure you want to log out? You will need to sign in again to view and manage your transactions."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        isDestructive={true}
        loading={isAuthLoading}
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={deleteAccountModalVisible}
        title="Permanently Delete Account?"
        message="This action CANNOT be undone. All your transactions, budgets, accounts, recurring payments, and streak achievements will be permanently erased."
        confirmLabel="Delete Everything"
        cancelLabel="Keep My Account"
        isDestructive={true}
        loading={isDeletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteAccountModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: 140,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  menuCard: {
    borderRadius: radius.card,
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  appearanceContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  themeSelectorWrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  syncInfoCol: {
    flex: 1,
    paddingRight: spacing.xs,
  },
  syncSubtitle: {
    fontSize: 11,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    color: '#059669',
    fontSize: 11,
  },
  appInfo: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    gap: spacing.xs - 2,
  },
  currencyList: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  currencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyDetails: {
    marginLeft: spacing.lg,
  },
});
