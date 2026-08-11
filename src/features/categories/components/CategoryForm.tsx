import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CategoryType, CreateCategoryInput } from '../../../types/category';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { SegmentedControl } from '../../../components/ui/SegmentedControl';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';

export interface CategoryFormProps {
  onSubmit: (input: CreateCategoryInput) => Promise<void> | void;
  isSubmitting?: boolean;
}

const AVAILABLE_ICONS = [
  'restaurant', 'cart', 'bag-handle', 'car', 'flash',
  'film', 'medkit', 'school', 'home', 'tv',
  'sparkles', 'fitness', 'airplane', 'gift', 'cafe',
  'book', 'football', 'musical-notes', 'cash', 'laptop'
];

const AVAILABLE_COLORS = [
  '#FF7A00', '#2E9B68', '#8B5CF6', '#3B82F6', '#EF4444',
  '#EC4899', '#10B981', '#6366F1', '#F59E0B', '#06B6D4',
  '#14B8A6', '#F43F5E', '#84CC16', '#A855F7', '#6B7280'
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [selectedIcon, setSelectedIcon] = useState('restaurant');
  const [selectedColor, setSelectedColor] = useState('#FF7A00');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    setError('');
    onSubmit({
      name: name.trim(),
      type,
      icon: selectedIcon,
      colorToken: selectedColor,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.responsiveWrapper}>
        {/* Category Preview */}
        <View style={styles.previewContainer}>
          <CategoryIcon icon={selectedIcon} color={selectedColor} size="xl" />
          <Text variant="headingM" weight="bold" style={styles.previewText}>
            {name.trim() || 'Category Name'}
          </Text>
        </View>

        {/* Type */}
        <SegmentedControl
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
          value={type}
          onChange={setType}
          style={styles.typeControl}
        />

        {/* Name */}
        <Input
          label="CATEGORY NAME"
          placeholder="e.g. Pet Care, Books, Investments"
          value={name}
          onChangeText={t => {
            setName(t);
            if (error) setError('');
          }}
          error={error}
        />

        {/* Icon Picker */}
        <View style={styles.pickerSection}>
          <Text variant="label" color="secondary" style={styles.sectionLabel}>
            SELECT ICON
          </Text>
          <View style={styles.iconGrid}>
            {AVAILABLE_ICONS.map(icon => (
              <TouchableOpacity
                key={icon}
                onPress={() => setSelectedIcon(icon)}
                activeOpacity={0.7}
                style={[
                  styles.iconBox,
                  { borderColor: colors.border },
                  selectedIcon === icon && { borderColor: colors.primary, backgroundColor: colors.primaryLight },
                ]}
              >
                <CategoryIcon icon={icon} color={selectedIcon === icon ? colors.primary : colors.textSecondary} size="sm" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Picker */}
        <View style={styles.pickerSection}>
          <Text variant="label" color="secondary" style={styles.sectionLabel}>
            SELECT COLOR
          </Text>
          <View style={styles.colorGrid}>
            {AVAILABLE_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                activeOpacity={0.7}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && [styles.selectedColorCircle, { borderColor: colors.textPrimary }],
                ]}
              />
            ))}
          </View>
        </View>

        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
          style={styles.submitBtn}
        >
          Create Category
        </Button>
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
  previewContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
  },
  previewText: {
    marginTop: spacing.sm,
  },
  typeControl: {
    marginBottom: spacing.lg,
  },
  pickerSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    marginBottom: spacing.xs,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  iconBox: {
    padding: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedColorCircle: {
    borderWidth: 3,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});
