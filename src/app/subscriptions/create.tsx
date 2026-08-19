import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecurring } from '../../hooks/useRecurring';
import { useCategories } from '../../hooks/useCategories';
import { useAccounts } from '../../hooks/useAccounts';
import { useUser } from '../../hooks/useUser';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { CategoryIcon } from '../../components/ui/CategoryIcon';
import { BottomSheet } from '../../components/ui/BottomSheet';
import { CURRENCIES, CurrencyCode } from '../../types/currency';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';

export default function CreateSubscriptionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;
  const currencyConfig = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const { createRecurring, isCreating } = useRecurring();
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const [name, setName] = useState('');
  const [amountText, setAmountText] = useState('');
  const [frequency, setFrequency] = useState<'MONTHLY' | 'DAILY'>('MONTHLY');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories.find(c => c.type === 'expense')?.id || categories[0]?.id || ''
  );
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [categorySheetVisible, setCategorySheetVisible] = useState(false);
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);
  const [error, setError] = useState('');

  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const currentAccount = accounts.find(a => a.id === selectedAccountId);

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) {
      setError('Please enter a subscription name (e.g. Netflix, Rent)');
      return;
    }
    const numAmount = parseFloat(amountText);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!selectedCategoryId) {
      setError('Please select a category');
      return;
    }
    if (!selectedAccountId) {
      setError('Please select a payment account');
      return;
    }

    try {
      haptics.success();
      await createRecurring({
        merchant: name.trim(),
        amount: numAmount,
        frequency,
        type,
        category_id: selectedCategoryId,
        account_id: selectedAccountId,
        start_date: new Date().toISOString().split('T')[0],
      });
      router.back();
    } catch (err: any) {
      setError(err?.message || 'Failed to create subscription');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <AmbientMeshBackground>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          {/* Modal Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.closeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text variant="headingM" weight="bold">
              New Subscription / Bill
            </Text>
            <View style={{ width: 38 }} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.expenseSoft }]}>
                <Ionicons name="alert-circle" size={16} color={colors.expense} />
                <Text variant="caption" color="expense" weight="medium" style={{ marginLeft: 6, flex: 1 }}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Amount Input */}
            <View style={[styles.amountHero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text variant="caption" color="secondary" weight="semibold">
                RECURRING AMOUNT
              </Text>
              <View style={styles.amountInputRow}>
                <Text variant="headingXL" weight="bold" color="brand">
                  {currencyConfig.symbol}
                </Text>
                <TextInput
                  value={amountText}
                  onChangeText={setAmountText}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  style={[styles.amountTextInput, { color: colors.textPrimary }]}
                  autoFocus
                />
              </View>
            </View>

            {/* Form Fields Card */}
            <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Plan / Service Name */}
              <View style={styles.fieldRow}>
                <Text variant="caption" color="secondary" weight="semibold" style={styles.fieldLabel}>
                  SUBSCRIPTION NAME
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Netflix, Spotify, House Rent, Gym"
                  placeholderTextColor={colors.textTertiary}
                  style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border }]}
                />
              </View>

              {/* Recurrence Frequency */}
              <View style={styles.fieldRow}>
                <Text variant="caption" color="secondary" weight="semibold" style={styles.fieldLabel}>
                  BILLING FREQUENCY
                </Text>
                <View style={styles.freqRow}>
                  <TouchableOpacity
                    onPress={() => setFrequency('MONTHLY')}
                    style={[
                      styles.freqBtn,
                      { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
                      frequency === 'MONTHLY' && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      variant="body"
                      weight="bold"
                      style={{ color: frequency === 'MONTHLY' ? '#FFFFFF' : colors.textSecondary }}
                    >
                      Monthly
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setFrequency('DAILY')}
                    style={[
                      styles.freqBtn,
                      { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
                      frequency === 'DAILY' && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                  >
                    <Text
                      variant="body"
                      weight="bold"
                      style={{ color: frequency === 'DAILY' ? '#FFFFFF' : colors.textSecondary }}
                    >
                      Daily
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Category Selector */}
              <View style={styles.fieldRow}>
                <Text variant="caption" color="secondary" weight="semibold" style={styles.fieldLabel}>
                  CATEGORY
                </Text>
                <TouchableOpacity
                  onPress={() => setCategorySheetVisible(true)}
                  style={[styles.pickerBtn, { borderColor: colors.border }]}
                >
                  <View style={styles.pickerLeft}>
                    {currentCategory ? (
                      <CategoryIcon
                        icon={currentCategory.icon}
                        color={currentCategory.colorToken}
                        size="sm"
                      />
                    ) : null}
                    <Text variant="body" weight="medium" style={{ marginLeft: spacing.xs }}>
                      {currentCategory?.name || 'Select Category'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>

              {/* Payment Account */}
              <View style={styles.fieldRow}>
                <Text variant="caption" color="secondary" weight="semibold" style={styles.fieldLabel}>
                  PAYMENT ACCOUNT
                </Text>
                <TouchableOpacity
                  onPress={() => setAccountSheetVisible(true)}
                  style={[styles.pickerBtn, { borderColor: colors.border }]}
                >
                  <View style={styles.pickerLeft}>
                    <Ionicons name="wallet-outline" size={18} color={colors.primary} />
                    <Text variant="body" weight="medium" style={{ marginLeft: spacing.xs }}>
                      {currentAccount?.name || 'Select Account'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit Button */}
            <Button
              variant="primary"
              size="lg"
              loading={isCreating}
              onPress={handleSubmit}
              style={styles.submitBtn}
            >
              Save Subscription
            </Button>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Category Selection Sheet */}
        <BottomSheet
          visible={categorySheetVisible}
          onClose={() => setCategorySheetVisible(false)}
          title="Select Category"
        >
          <ScrollView style={{ maxHeight: 350 }}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setSelectedCategoryId(cat.id);
                  setCategorySheetVisible(false);
                }}
                style={[
                  styles.sheetItem,
                  cat.id === selectedCategoryId && { backgroundColor: colors.primaryLight },
                ]}
              >
                <CategoryIcon icon={cat.icon} color={cat.colorToken} size="sm" />
                <Text variant="body" weight="medium" style={{ marginLeft: spacing.sm, flex: 1 }}>
                  {cat.name}
                </Text>
                {cat.id === selectedCategoryId && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheet>

        {/* Account Selection Sheet */}
        <BottomSheet
          visible={accountSheetVisible}
          onClose={() => setAccountSheetVisible(false)}
          title="Select Payment Account"
        >
          <ScrollView style={{ maxHeight: 350 }}>
            {accounts.map(acc => (
              <TouchableOpacity
                key={acc.id}
                onPress={() => {
                  setSelectedAccountId(acc.id);
                  setAccountSheetVisible(false);
                }}
                style={[
                  styles.sheetItem,
                  acc.id === selectedAccountId && { backgroundColor: colors.primaryLight },
                ]}
              >
                <Ionicons name="wallet" size={18} color={colors.primary} />
                <Text variant="body" weight="medium" style={{ marginLeft: spacing.sm, flex: 1 }}>
                  {acc.name}
                </Text>
                {acc.id === selectedAccountId && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheet>
      </AmbientMeshBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
    paddingBottom: 40,
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  amountHero: {
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  amountTextInput: {
    fontSize: 36,
    fontWeight: '800',
    marginLeft: 6,
    minWidth: 80,
    textAlign: 'center',
  },
  formCard: {
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  fieldRow: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
  },
  freqRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  freqBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },
  pickerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
});
