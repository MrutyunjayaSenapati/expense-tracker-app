import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountFormSchema, AccountFormValues } from '../../../schemas/accountSchema';
import { spacing } from '../../../theme/spacing';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';

export interface AccountFormProps {
  initialValues?: Partial<AccountFormValues>;
  onSubmit: (values: AccountFormValues) => Promise<void> | void;
  onDelete?: () => void;
  isSubmitting?: boolean;
  mode?: 'create' | 'edit';
}

export const AccountForm: React.FC<AccountFormProps> = ({
  initialValues,
  onSubmit,
  onDelete,
  isSubmitting = false,
  mode = 'create',
}) => {
  const [balanceText, setBalanceText] = useState(
    initialValues?.balance !== undefined ? String(initialValues.balance) : ''
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      type: initialValues?.type || 'bank',
      institutionName: initialValues?.institutionName || '',
      balance: initialValues?.balance ?? 0,
      icon: initialValues?.icon || 'wallet',
    },
  });

  const selectedType = watch('type');

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
              label="ACCOUNT NAME"
              placeholder="e.g. HDFC Salary, Wallet Cash, Paytm UPI"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <View style={styles.fieldWrapper}>
          <Text variant="label" color="secondary" style={styles.fieldLabel}>
            ACCOUNT TYPE
          </Text>
          <SegmentedControl
            options={[
              { value: 'bank', label: 'Bank' },
              { value: 'upi', label: 'UPI' },
              { value: 'cash', label: 'Cash' },
              { value: 'credit_card', label: 'Card' },
            ]}
            value={selectedType}
            onChange={val => setValue('type', val as any)}
            semanticColoring={false}
          />
        </View>

        <Controller
          control={control}
          name="institutionName"
          render={({ field: { onChange, value } }) => (
            <Input
              label="INSTITUTION / BANK NAME (OPTIONAL)"
              placeholder="e.g. HDFC Bank, SBI, ICICI"
              value={value}
              onChangeText={onChange}
              error={errors.institutionName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="balance"
          render={({ field: { onChange } }) => (
            <Input
              label="CURRENT BALANCE"
              prefix="₹"
              placeholder="0"
              keyboardType="decimal-pad"
              value={balanceText}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9.-]/g, '');
                setBalanceText(cleaned);
                if (cleaned === '' || cleaned === '-' || cleaned === '.') {
                  onChange(0);
                } else {
                  const parsed = parseFloat(cleaned);
                  onChange(Number.isNaN(parsed) ? 0 : parsed);
                }
              }}
              error={errors.balance?.message}
            />
          )}
        />

        <View style={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            fullWidth
          >
            {mode === 'create' ? 'Add Account' : 'Save Changes'}
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
              Delete Account
            </Button>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
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
    marginBottom: spacing.xs + 2,
    letterSpacing: 0.6,
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  deleteBtn: {
    marginTop: spacing.xs,
  },
});
