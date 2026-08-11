import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export interface IconProps {
  name: keyof typeof Ionicons.glyphMap | string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  color = colors.textPrimary,
  style,
}) => {
  // Map friendly names to Ionicons glyphs
  const glyphName = (name as keyof typeof Ionicons.glyphMap) || 'ellipse';

  return (
    <View style={[styles.container, style]}>
      <Ionicons name={glyphName} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
