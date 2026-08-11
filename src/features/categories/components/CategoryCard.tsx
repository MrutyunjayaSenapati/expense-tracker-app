import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Category } from '../../../types/category';
import { useTheme } from '../../../hooks/useTheme';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { CategoryIcon } from '../../../components/ui/CategoryIcon';
import { Badge } from '../../../components/ui/Badge';

export interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.leftCol}>
        <CategoryIcon icon={category.icon} color={category.colorToken} size="md" />
        <View style={styles.textContainer}>
          <Text variant="bodyLarge" weight="semibold">
            {category.name}
          </Text>
          <Text variant="caption" color="secondary">
            {category.type.toUpperCase()}
          </Text>
        </View>
      </View>

      {category.isDefault && (
        <Badge label="Default" variant="neutral" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: spacing.md,
  },
});
