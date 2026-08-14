import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LottieView from 'lottie-react-native';

export interface LottieAnimationProps {
  source: any;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  onAnimationFinish?: () => void;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  source,
  autoPlay = true,
  loop = true,
  speed = 1,
  width = 120,
  height = 120,
  style,
  onAnimationFinish,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay]);

  return (
    <View style={[styles.container, { width, height }, style]}>
      <LottieView
        ref={animationRef}
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={styles.lottie}
        onAnimationFinish={onAnimationFinish}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
