import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser, useUpdateCurrency } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { useAppStore, ThemeMode } from '../../store/useAppStore';
import { useTheme } from '../../hooks/useTheme';
import { useQueryClient } from '@tanstack/react-query';
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
  const queryClient = useQueryClient();
  const { colors, themeMode, setThemeMode } = useTheme();
  const showToast = useAppStore(state => state.showToast);

  const { data: user } = useUser();
  const { logout, isLoading: isAuthLoading } = useAuth();
  const updateCurrencyMutation = useUpdateCurrency();

  const [currencySheetVisible, setCurrencySheetVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const currentCurrency = user?.currency || 'INR';

  const handleSelectCurrency = async (code: CurrencyCode) => {
    setCurrencySheetVisible(false);
    await updateCurrencyMutation.mutateAsync(code);
  };

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await logout();
  };

  const handleResyncData = async () => {
    setIsResetting(true);
    try {
      await queryClient.invalidateQueries();
      setResetModalVisible(false);
      showToast('Data refreshed and re-synced from backend', 'success');
    } catch {
      showToast('Failed to re-sync data', 'error');
    } finally {
      setIsResetting(false);
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
          <Ionicons name="person" size={32} color={colors.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text variant="headingM" weight="bold">
            {user?.name || 'Mrutyunjaya Senapati'}
          </Text>
          <Text variant="bodySmall" color="secondary">
            {user?.email || 'mrutyunjaya.senapati@example.com'}
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
      </Card>

      {/* Backend & Sync Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        BACKEND & SYNC
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.incomeSoft }]}>
              <Ionicons name="server-outline" size={20} color={colors.income} />
            </View>
            <View>
              <Text variant="bodyLarge" weight="semibold">
                FastAPI Backend
              </Text>
              <Text variant="caption" color="secondary">
                Connected to http://localhost:8000/api/v1
              </Text>
            </View>
          </View>
          <Ionicons name="checkmark-circle" size={20} color={colors.income} />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => setResetModalVisible(true)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sync-outline" size={20} color={colors.primary} />
            </View>
            <Text variant="bodyLarge" weight="semibold" color="brand">
              Re-sync Backend Data
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </Card>

      {/* Account Actions Section */}
      <Text variant="label" color="secondary" style={styles.sectionHeader}>
        ACCOUNT
      </Text>
      <Card elevation="none" style={styles.menuCard}>
        <TouchableOpacity
          onPress={() => router.push('/auth/login')}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="swap-horizontal-outline" size={20} color={colors.primary} />
            </View>
            <Text variant="bodyLarge" weight="semibold">
              Switch / Sign In with Another Account
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <TouchableOpacity
          onPress={() => setLogoutModalVisible(true)}
          activeOpacity={0.7}
          style={styles.menuItem}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: colors.expenseSoft }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.expense} />
            </View>
            <Text variant="bodyLarge" weight="semibold" color="expense">
              Log Out
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      </Card>

      {/* App Version Info */}
      <View style={styles.appInfo}>
        <Text variant="caption" color="tertiary" align="center">
          Expense Tracker v1.0.0 (FastAPI + React Native Connected)
        </Text>
        <Text variant="caption" color="disabled" align="center">
          Full Stack Architecture · PostgreSQL / SQLite Backend
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

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        visible={resetModalVisible}
        title="Re-sync with Backend?"
        message="This will re-fetch all active accounts, categories, transactions, and budgets from the live backend server."
        confirmLabel="Re-sync Data"
        cancelLabel="Cancel"
        isDestructive={false}
        loading={isResetting}
        onConfirm={handleResyncData}
        onCancel={() => setResetModalVisible(false)}
      />

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
    paddingBottom: 115,
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
