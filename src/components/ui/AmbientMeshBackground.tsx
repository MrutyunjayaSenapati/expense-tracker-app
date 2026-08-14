import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';

export interface AmbientMeshBackgroundProps {
  children?: React.ReactNode;
}

export const AmbientMeshBackground: React.FC<AmbientMeshBackgroundProps> = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      {/* Ambient Diffuse Mesh Canvas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            {/* Top-Right Emerald/Indigo Aura */}
            <RadialGradient id="meshOrb1" cx="85%" cy="12%" r="60%">
              <Stop
                offset="0%"
                stopColor={isDark ? '#4F46E5' : '#818CF8'}
                stopOpacity={isDark ? '0.22' : '0.12'}
              />
              <Stop
                offset="100%"
                stopColor={isDark ? '#4F46E5' : '#818CF8'}
                stopOpacity="0"
              />
            </RadialGradient>

            {/* Mid-Left Emerald Glow */}
            <RadialGradient id="meshOrb2" cx="15%" cy="42%" r="55%">
              <Stop
                offset="0%"
                stopColor={isDark ? '#059669' : '#34D399'}
                stopOpacity={isDark ? '0.18' : '0.09'}
              />
              <Stop
                offset="100%"
                stopColor={isDark ? '#059669' : '#34D399'}
                stopOpacity="0"
              />
            </RadialGradient>

            {/* Bottom-Right Violet Glow */}
            <RadialGradient id="meshOrb3" cx="80%" cy="85%" r="50%">
              <Stop
                offset="0%"
                stopColor={isDark ? '#7C3AED' : '#A78BFA'}
                stopOpacity={isDark ? '0.15' : '0.08'}
              />
              <Stop
                offset="100%"
                stopColor={isDark ? '#7C3AED' : '#A78BFA'}
                stopOpacity="0"
              />
            </RadialGradient>
          </Defs>

          <Rect x="0" y="0" width="100%" height="100%" fill="url(#meshOrb1)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#meshOrb2)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#meshOrb3)" />
        </Svg>
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
