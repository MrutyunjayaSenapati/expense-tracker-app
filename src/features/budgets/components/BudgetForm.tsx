import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetFormSchema, BudgetFormValues } from '../../../schemas/budgetSchema';
import { Category } from '../../../types/category';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { BottomSheet } from '../../../components/ui/BottomSheet';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { Ionicons } from '@expo/vector-icons';

export interface BudgetFormProps {
  initialValues?: Partial<BudgetFormValues>;
  categories: Category[];
  onSubmit: (values: BudgetFormValues) => Promise<void> | void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

function getCurrentMonthBounds() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  return {
    startDate: fmt(start),
    endDate: fmt(end),
  };
}

export const BudgetForm: React.FC<BudgetFormProps> = ({
  initialValues,
  categories,
  onSubmit,
  onDelete,
  isSubmitting = false,
  mode = 'create',
}) => {
  const { colors } = useTheme();
  const [categorySheetVisible, setCategorySheetVisible] = useState(false);
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const monthBounds = getCurrentMonthBounds();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      amount: initialValues?.amount || ('' as unknown as number),
      categoryId: initialValues?.categoryId || '',
      period: initialValues?.period || 'monthly',
      startDate: initialValues?.startDate || monthBounds.startDate,
      endDate: initialValues?.endDate || monthBounds.endDate,
    },
  });

  const selectedCategoryId = watch('categoryId');
  const currentCategory = expenseCategories.find(c => c.id === selectedCategoryId);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.responsiveWrapper}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="BUDGET NAME"
              placeholder="e.g. Dining Out, Monthly Groceries"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <Input
              label="BUDGET AMOUNT LIMIT"
              prefix="₹"
              placeholder="0"
              keyboardType="decimal-pad"
              value={value ? String(value) : ''}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                onChange(cleaned === '' ? '' : parseFloat(cleaned));
              }}
              error={errors.amount?.message}
            />
          )}
        />

        {/* Category Selection */}
        <View style={styles.fieldWrapper}>
          <Text variant="label" color="secondary" style={styles.fieldLabel}>
            CATEGORY (OPTIONAL)
          </Text>
          <TouchableOpacity
            onPress={() => setCategorySheetVisible(true)}
            activeOpacity={0.7}
            style={[
              styles.pickerField,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {currentCategory ? (
              <View style={styles.selectedRow}>
                <CategoryIcon
                  icon={currentCategory.icon}
                  color={currentCategory.colorToken}
                  size="sm"
                />
                <Text variant="bodyLarge" weight="semibold" style={styles.selectedText}>
                  {currentCategory.name}
                </Text>
              </View>
            ) : (
              <Text variant="bodyLarge" color="secondary">
                Overall / General Budget
              </Text>
            )}
            <Ionicons name="chevron-down" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
          >
            {mode === 'create' ? 'Create Budget' : 'Save Changes'}
          </Button>

          {mode === 'edit' && onDelete && (
            <Button
              variant="destructive"
              size="md"
              onPress={onDelete}
              disabled={isSubmitting}
              fullWidth
              style={styles.deleteBtn}
            >
              Delete Budget
            </Button>
          )}
        </View>
      </View>

      {/* Category Picker Sheet */}
      <BottomSheet
        visible={categorySheetVisible}
        onClose={() => setCategorySheetVisible(false)}
        title="Select Budget Category"
      >
        <View style={styles.gridContainer}>
          <TouchableOpacity
            onPress={() => {
              setValue('categoryId', undefined);
              setCategorySheetVisible(false);
            }}
            activeOpacity={0.7}
            style={[
              styles.categoryGridItem,
              !selectedCategoryId && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
          >
            <CategoryIcon icon="wallet" color={colors.primary} size="lg" />
            <Text variant="caption" weight="semibold" align="center" style={styles.gridItemText}>
              Overall Budget
            </Text>
          </TouchableOpacity>

          {expenseCategories.map(cat => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setValue('categoryId', cat.id);
                  if (!getValues('name')) {
                    setValue('name', cat.name);
                  }
                  setCategorySheetVisible(false);
                }}
                activeOpacity={0.7}
                style={[
                  styles.categoryGridItem,
                  isSelected && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                ]}
              >
                <CategoryIcon icon={cat.icon} color={cat.colorToken} size="lg" />
                <Text
                  variant="caption"
                  weight={isSelected ? 'bold' : 'medium'}
                  align="center"
                  numberOfLines={2}
                  style={styles.gridItemText}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BottomSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: 120,
    alignItems: 'center',
  },
  responsiveWrapper: {
    width: '100%',
    maxWidth: 520,
  },
  fieldWrapper: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    marginBottom: spacing.xs,
  },
  pickerField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    minHeight: 50,
  },
  selectedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    marginLeft: spacing.md,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  deleteBtn: {
    marginTop: spacing.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  categoryGridItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  gridItemText: {
    marginTop: spacing.xs,
  },
});
