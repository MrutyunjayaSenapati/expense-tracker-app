import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface BrandLogoProps {
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 72 }) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <Image
        source={require('../../../assets/images/app-logo.png')}
        style={[styles.image, { width: size, height: size, borderRadius: size * 0.28 }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

