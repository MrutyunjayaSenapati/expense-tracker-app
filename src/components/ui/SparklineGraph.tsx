import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
} from 'react-native-svg';

export interface SparklineGraphProps {
  width?: number;
  height?: number;
  strokeColor?: string;
  gradientStartColor?: string;
  gradientEndColor?: string;
  dotColor?: string;
  style?: ViewStyle;
}

export const SparklineGraph: React.FC<SparklineGraphProps> = ({
  width = 160,
  height = 65,
  strokeColor = '#38BDF8',
  gradientStartColor = 'rgba(56, 189, 248, 0.35)',
  gradientEndColor = 'rgba(56, 189, 248, 0.0)',
  dotColor = '#22D3EE',
  style,
}) => {
  // Smooth wave bezier path coordinates scaled to width/height
  // Points: (0, 45) -> (30, 50) -> (65, 20) -> (100, 38) -> (130, 10) -> (160, 25)
  const linePath = `M 0 45 C 20 48, 40 45, 60 22 C 80 5, 95 38, 115 32 C 135 25, 145 10, 160 18`;
  const areaPath = `${linePath} L 160 ${height} L 0 ${height} Z`;

  return (
    <View style={[styles.container, { width, height }, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 160 65" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradientStartColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={gradientEndColor} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Gradient fill under curve */}
        <Path d={areaPath} fill="url(#sparklineGrad)" />

        {/* Stroke Curve */}
        <Path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Highlight Peak Dot */}
        <Circle cx="60" cy="22" r="3.5" fill={dotColor} />
        <Circle cx="60" cy="22" r="6" fill={dotColor} opacity="0.4" />

        {/* Highlight Endpoint Dot */}
        <Circle cx="160" cy="18" r="4" fill={dotColor} />
        <Circle cx="160" cy="18" r="7" fill={dotColor} opacity="0.4" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
