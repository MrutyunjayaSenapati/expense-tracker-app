import React, { useMemo } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHaptics } from '../../hooks/useHaptics';

export interface TrendDataPoint {
  label: string;
  value: number;
}

export interface InteractiveTrendGraphProps {
  data: TrendDataPoint[];
  width: number;
  height: number;
  strokeColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  onScrub?: (point: TrendDataPoint) => void;
  onScrubEnd?: () => void;
}

export const InteractiveTrendGraph: React.FC<InteractiveTrendGraphProps> = ({
  data,
  width,
  height,
  strokeColor = '#6366F1',
  gradientStart = 'rgba(99, 102, 241, 0.35)',
  gradientEnd = 'rgba(99, 102, 241, 0.0)',
  onScrub,
  onScrubEnd,
}) => {
  const haptics = useHaptics();
  const indicatorOpacity = useSharedValue(0);
  const indicatorX = useSharedValue(0);
  const indicatorY = useSharedValue(0);

  const points = useMemo(() => {
    if (data.length === 0) return [];
    const minVal = Math.min(...data.map(d => d.value));
    const maxVal = Math.max(...data.map(d => d.value));
    const range = maxVal - minVal || 1;
    const padding = 10;
    const availableHeight = height - padding * 2;
    const stepX = (width - padding * 2) / Math.max(data.length - 1, 1);

    return data.map((d, i) => ({
      x: padding + i * stepX,
      y: height - padding - ((d.value - minVal) / range) * availableHeight,
      data: d,
    }));
  }, [data, width, height]);

  // Generate smooth SVG curve path
  const { linePath, areaPath } = useMemo(() => {
    if (points.length < 2) return { linePath: '', areaPath: '' };

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      d += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const area = `${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
    return { linePath: d, areaPath: area };
  }, [points, height]);

  /* eslint-disable react-hooks/exhaustive-deps */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          const touchX = evt.nativeEvent.locationX;
          if (points.length === 0) return;
          let closest = points[0];
          let closestDist = Math.abs(points[0].x - touchX);
          for (let i = 1; i < points.length; i++) {
            const dist = Math.abs(points[i].x - touchX);
            if (dist < closestDist) {
              closestDist = dist;
              closest = points[i];
            }
          }
          indicatorX.value = withSpring(closest.x, { damping: 20, stiffness: 300 });
          indicatorY.value = withSpring(closest.y, { damping: 20, stiffness: 300 });
          indicatorOpacity.value = withTiming(1, { duration: 150 });
          haptics.selection();
          onScrub?.(closest.data);
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          const touchX = evt.nativeEvent.locationX;
          if (points.length === 0) return;
          let closest = points[0];
          let closestDist = Math.abs(points[0].x - touchX);
          for (let i = 1; i < points.length; i++) {
            const dist = Math.abs(points[i].x - touchX);
            if (dist < closestDist) {
              closestDist = dist;
              closest = points[i];
            }
          }
          indicatorX.value = withSpring(closest.x, { damping: 20, stiffness: 300 });
          indicatorY.value = withSpring(closest.y, { damping: 20, stiffness: 300 });
          haptics.selection();
          onScrub?.(closest.data);
        },
        onPanResponderRelease: () => {
          indicatorOpacity.value = withTiming(0, { duration: 250 });
          onScrubEnd?.();
        },
        onPanResponderTerminate: () => {
          indicatorOpacity.value = withTiming(0, { duration: 250 });
          onScrubEnd?.();
        },
      }),
    [points, onScrub, onScrubEnd]
  );
  /* eslint-enable react-hooks/exhaustive-deps */

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ translateX: indicatorX.value }, { translateY: indicatorY.value }],
  }));

  const verticalLineStyle = useAnimatedStyle(() => ({
    opacity: indicatorOpacity.value,
    transform: [{ translateX: indicatorX.value }],
  }));

  if (points.length < 2) return null;

  return (
    <View style={[styles.container, { width, height }]} {...panResponder.panHandlers}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="interactiveAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity={0.32} />
            <Stop offset="80%" stopColor={strokeColor} stopOpacity={0.05} />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </LinearGradient>
        </Defs>

        {/* Gradient Area Fill */}
        <Path d={areaPath} fill="url(#interactiveAreaGrad)" />

        {/* Smooth Stroke Line */}
        <Path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {/* Reanimated Vertical Scrub Cursor */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.verticalLine,
          { height },
          verticalLineStyle,
        ]}
      />

      {/* Reanimated Glowing Bead Cursor */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cursorBead,
          { borderColor: strokeColor },
          cursorStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  cursorBead: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
