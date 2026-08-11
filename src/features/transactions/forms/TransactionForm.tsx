import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  transactionFormSchema,
  TransactionFormValues,
} from '../../../schemas/transactionSchema';
import { Category } from '../../../types/category';
import { Account } from '../../../types/account';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { AnimatedPressable } from '../../../components/ui/AnimatedPressable';
import { useHaptics } from '../../../hooks/useHaptics';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { Ionicons } from '@expo/vector-icons';

export interface TransactionFormProps {
  initialValues?: Partial<TransactionFormValues>;
  categories: Category[];
  accounts: Account[];
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialValues,
  categories,
  accounts,
  onSubmit,
  onDelete,
  isSubmitting = false,
  mode = 'create',
}) => {
  const { colors } = useTheme();
  const [categorySheetVisible, setCategorySheetVisible] = useState(false);
  const [accountSheetVisible, setAccountSheetVisible] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const haptics = useHaptics();

  const defaultCategory = categories.find(c => c.type === (initialValues?.type || 'expense')) || categories[0];
  const defaultAccount = accounts[0];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: initialValues?.type || 'expense',
      amount: initialValues?.amount || ('' as unknown as number),
      categoryId: initialValues?.categoryId || defaultCategory?.id || '',
      accountId: initialValues?.accountId || defaultAccount?.id || '',
      date: initialValues?.date || new Date().toISOString(),
      merchant: initialValues?.merchant || '',
      note: initialValues?.note || '',
      receiptUri: initialValues?.receiptUri || '',
    },
  });

  const selectedType = watch('type');
  const selectedCategoryId = watch('categoryId');
  const selectedAccountId = watch('accountId');
  const selectedDate = watch('date');

  const availableCategories = useMemo(() => {
    return categories
      .filter(c => c.type === selectedType)
      .filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
  }, [categories, selectedType, categorySearch]);

  const currentCategory = categories.find(c => c.id === selectedCategoryId);
  const currentAccount = accounts.find(a => a.id === selectedAccountId);

  const handleTypeChange = (type: 'expense' | 'income') => {
    setValue('type', type);
    const firstCat = categories.find(c => c.type === type);
    if (firstCat) {
      setValue('categoryId', firstCat.id);
    }
  };

  const handleFormSubmit = async (values: TransactionFormValues) => {
    try {
      await onSubmit(values);
      haptics.success();
      setIsSavedSuccess(true);
    } catch {
      setIsSavedSuccess(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.keyboardContainer, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.responsiveWrapper}>
          {/* Type Selector (Expense vs Income) */}
          <SegmentedControl
            options={[
              {
                value: 'expense',
                label: 'Expense',
                icon: <Ionicons name="arrow-up" size={16} color={colors.expense} />,
              },
              {
                value: 'income',
                label: 'Income',
                icon: <Ionicons name="arrow-down" size={16} color={colors.income} />,
              },
            ]}
            value={selectedType}
            onChange={handleTypeChange}
            style={styles.segmentedControl}
          />

          {/* Hero Amount Input Card */}
          <View style={[styles.amountCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text variant="label" weight="semibold" color="secondary" align="center" style={styles.amountLabel}>
              {selectedType === 'expense' ? 'ENTER EXPENSE AMOUNT' : 'ENTER INCOME AMOUNT'}
            </Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, value } }) => {
                const displayValue =
                  typeof value === 'number' && !Number.isNaN(value) && value > 0
                    ? String(value)
                    : '';

                return (
                  <View style={styles.amountInputContainer}>
                    <Text
                      variant="display"
                      weight="bold"
                      color={errors.amount ? 'expense' : 'brand'}
                      style={styles.currencySign}
                    >
                      ₹
                    </Text>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor={colors.textDisabled}
                      keyboardType="decimal-pad"
                      value={displayValue}
                      onChangeText={text => {
                        const cleaned = text.replace(/[^0-9.]/g, '');
                        if (cleaned === '') {
                          onChange(0);
                        } else {
                          const parsed = parseFloat(cleaned);
                          onChange(Number.isNaN(parsed) ? 0 : parsed);
                        }
                      }}
                      style={[
                        styles.amountTextInput,
                        { color: colors.textPrimary },
                        Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {},
                      ]}
                    />
                  </View>
                );
              }}
            />
            {errors.amount && (
              <Text variant="caption" color="expense" align="center" style={styles.errorText}>
                {errors.amount.message}
              </Text>
            )}
          </View>

          {/* Grouped Form Fields Card */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Category Row */}
            <AnimatedPressable
              onPress={() => setCategorySheetVisible(true)}
              scaleTo={0.98}
              style={styles.formRow}
              accessibilityLabel="Select Category"
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="grid-outline" size={18} color={colors.primary} />
                </View>
                <Text variant="body" weight="medium" color="secondary">
                  Category
                </Text>
              </View>

              <View style={styles.rowRight}>
                {currentCategory ? (
                  <View style={styles.categoryBadge}>
                    <CategoryIcon
                      icon={currentCategory.icon}
                      color={currentCategory.colorToken}
                      size="sm"
                    />
                    <Text variant="body" weight="semibold" style={styles.badgeText}>
                      {currentCategory.name}
                    </Text>
                  </View>
                ) : (
                  <Text variant="body" color="disabled">
                    Select Category
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </AnimatedPressable>

            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />

            {/* Account / Payment Method Row */}
            <AnimatedPressable
              onPress={() => setAccountSheetVisible(true)}
              scaleTo={0.98}
              style={styles.formRow}
              accessibilityLabel="Select Account"
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.infoSoft }]}>
                  <Ionicons name="wallet-outline" size={18} color={colors.info} />
                </View>
                <Text variant="body" weight="medium" color="secondary">
                  Account
                </Text>
              </View>

              <View style={styles.rowRight}>
                {currentAccount ? (
                  <View style={styles.accountBadge}>
                    <Text variant="body" weight="semibold">
                      {currentAccount.name}
                    </Text>
                    <Text variant="caption" color="secondary">
                      ({formatCurrency(currentAccount.balance)})
                    </Text>
                  </View>
                ) : (
                  <Text variant="body" color="disabled">
                    Select Account
                  </Text>
                )}
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </AnimatedPressable>

            <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />

            {/* Date Row */}
            <View style={styles.formRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.warningSoft }]}>
                  <Ionicons name="calendar-outline" size={18} color={colors.warning} />
                </View>
                <Text variant="body" weight="medium" color="secondary">
                  Date
                </Text>
              </View>
              <View style={styles.rowRight}>
                <Text variant="body" weight="semibold">
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </View>
          </View>

          {/* Optional Metadata (Merchant & Notes) */}
          <View style={styles.optionalSection}>
            <Controller
              control={control}
              name="merchant"
              render={({ field: { onChange, value } }) => (
                <Input
                  label={selectedType === 'expense' ? 'MERCHANT / PAYEE (OPTIONAL)' : 'PAYER / SOURCE (OPTIONAL)'}
                  placeholder={selectedType === 'expense' ? 'e.g. Swiggy, Amazon, Uber' : 'e.g. Employer, Client'}
                  value={value}
                  onChangeText={onChange}
                  error={errors.merchant?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="note"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="NOTE (OPTIONAL)"
                  placeholder="Add description, tags, or reference"
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={2}
                  error={errors.note?.message}
                />
              )}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button
              variant="primary"
              size="lg"
              onPress={handleSubmit(handleFormSubmit)}
              loading={isSubmitting}
              success={isSavedSuccess}
              successLabel={mode === 'create' ? '✓ Added!' : '✓ Changes Saved!'}
              fullWidth
            >
              {mode === 'create'
                ? selectedType === 'expense'
                  ? '+ Add Expense'
                  : '+ Add Income'
                : 'Save Changes'}
            </Button>

            {mode === 'edit' && onDelete && (
              <Button
                variant="destructive"
                size="md"
                onPress={onDelete}
                disabled={isSubmitting || isSavedSuccess}
                fullWidth
                iconLeft={<Ionicons name="trash-outline" size={18} color="#FFFFFF" />}
              >
                Delete Transaction
              </Button>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Category Picker Sheet (Glass & Search) */}
      <BottomSheet
        visible={categorySheetVisible}
        onClose={() => {
          setCategorySheetVisible(false);
          setCategorySearch('');
        }}
        title="Select Category"
      >
        <View style={styles.sheetContainer}>
          {/* Search Category */}
          <View style={[styles.searchBox, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              placeholder="Search category..."
              placeholderTextColor={colors.textDisabled}
              value={categorySearch}
              onChangeText={setCategorySearch}
              style={[styles.searchInput, { color: colors.textPrimary }]}
            />
            {!!categorySearch && (
              <TouchableOpacity onPress={() => setCategorySearch('')}>
                <Ionicons name="close-circle" size={16} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>

          {/* Category List */}
          <ScrollView style={styles.categoryScrollView} showsVerticalScrollIndicator={false}>
            {availableCategories.map(cat => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <AnimatedPressable
                  key={cat.id}
                  onPress={() => {
                    setValue('categoryId', cat.id);
                    setCategorySheetVisible(false);
                    setCategorySearch('');
                  }}
                  scaleTo={0.98}
                  style={[
                    styles.categoryListItem,
                    { borderBottomColor: colors.border },
                    isSelected && { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <View style={styles.categoryItemLeft}>
                    <CategoryIcon icon={cat.icon} color={cat.colorToken} size="md" />
                    <Text
                      variant="bodyLarge"
                      weight={isSelected ? 'bold' : 'medium'}
                      style={styles.categoryItemText}
                    >
                      {cat.name}
                    </Text>
                  </View>

                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'chevron-forward'}
                    size={20}
                    color={isSelected ? colors.primary : colors.textTertiary}
                  />
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheet>

      {/* Account Picker Sheet */}
      <BottomSheet
        visible={accountSheetVisible}
        onClose={() => setAccountSheetVisible(false)}
        title="Select Payment Account"
      >
        <View style={styles.sheetContainer}>
          <ScrollView style={styles.accountScrollView} showsVerticalScrollIndicator={false}>
            {accounts.map(acc => {
              const isSelected = acc.id === selectedAccountId;
              return (
                <AnimatedPressable
                  key={acc.id}
                  onPress={() => {
                    setValue('accountId', acc.id);
                    setAccountSheetVisible(false);
                  }}
                  scaleTo={0.98}
                  style={[
                    styles.accountListItem,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    isSelected && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                  ]}
                >
                  <View style={styles.categoryItemLeft}>
                    <View style={[styles.accountCircle, { backgroundColor: colors.surfaceMuted }]}>
                      <Ionicons name="wallet-outline" size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text variant="bodyLarge" weight="semibold">
                        {acc.name}
                      </Text>
                      <Text variant="caption" color="secondary">
                        {acc.type.toUpperCase()} · Balance: {formatCurrency(acc.balance)}
                      </Text>
                    </View>
                  </View>

                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                  )}
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
    alignItems: 'center',
  },
  responsiveWrapper: {
    width: '100%',
    maxWidth: 520,
  },
  segmentedControl: {
    marginBottom: spacing.md,
  },
  amountCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: '100%',
  },
  amountLabel: {
    marginBottom: spacing.xs,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: spacing.xs,
  },
  currencySign: {
    fontSize: 34,
    marginRight: 4,
  },
  amountTextInput: {
    fontSize: 38,
    fontWeight: '800',
    minWidth: 80,
    maxWidth: 240,
    textAlign: 'center',
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  errorText: {
    marginTop: spacing.xs,
  },
  formCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    marginRight: 2,
  },
  accountBadge: {
    alignItems: 'flex-end',
  },
  rowDivider: {
    height: 1,
    marginLeft: 44,
  },
  optionalSection: {
    marginBottom: spacing.md,
  },
  actionsContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  sheetContainer: {
    paddingVertical: spacing.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.input,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 44,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  categoryScrollView: {
    maxHeight: 340,
  },
  categoryListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.xs,
  },
  categoryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryItemText: {
    fontSize: 15,
  },
  accountScrollView: {
    maxHeight: 340,
  },
  accountListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    marginBottom: spacing.sm,
  },
  accountCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
