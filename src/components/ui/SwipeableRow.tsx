import React, { useRef } from 'react';
import { StyleSheet, View, Animated as RNAnimated } from 'react-native';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';

export interface SwipeableAction {
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  onPress: () => void;
  accessibilityLabel: string;
}

export interface SwipeableRowProps {
  children: React.ReactNode;
  leftAction?: SwipeableAction;
  rightAction?: SwipeableAction;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enabled?: boolean;
}

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  children,
  leftAction,
  rightAction,
  enabled = true,
}) => {
  const haptics = useHaptics();
  const swipeableRef = useRef<Swipeable>(null);

  if (!enabled || (!leftAction && !rightAction)) {
    return <View>{children}</View>;
  }

  const renderLeftActions = (
    progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>
  ) => {
    if (!leftAction) return null;

    const trans = dragX.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [-20, 0, 0],
      extrapolate: 'clamp',
    });

    const scale = dragX.interpolate({
      inputRange: [0, 60, 100],
      outputRange: [0.6, 1, 1.1],
      extrapolate: 'clamp',
    });

    return (
      <RectButton
        style={[
          styles.actionButton,
          styles.leftAction,
          { backgroundColor: leftAction.backgroundColor },
        ]}
        onPress={() => {
          haptics.medium();
          swipeableRef.current?.close();
          leftAction.onPress();
        }}
        accessibilityLabel={leftAction.accessibilityLabel}
      >
        <RNAnimated.View style={{ transform: [{ translateX: trans }, { scale }] }}>
          <Ionicons name={leftAction.icon} size={22} color="#FFFFFF" />
        </RNAnimated.View>
      </RectButton>
    );
  };

  const renderRightActions = (
    progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>
  ) => {
    if (!rightAction) return null;

    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 0, 20],
      extrapolate: 'clamp',
    });

    const scale = dragX.interpolate({
      inputRange: [-100, -60, 0],
      outputRange: [1.1, 1, 0.6],
      extrapolate: 'clamp',
    });

    return (
      <RectButton
        style={[
          styles.actionButton,
          styles.rightAction,
          { backgroundColor: rightAction.backgroundColor },
        ]}
        onPress={() => {
          haptics.medium();
          swipeableRef.current?.close();
          rightAction.onPress();
        }}
        accessibilityLabel={rightAction.accessibilityLabel}
      >
        <RNAnimated.View style={{ transform: [{ translateX: trans }, { scale }] }}>
          <Ionicons name={rightAction.icon} size={22} color="#FFFFFF" />
        </RNAnimated.View>
      </RectButton>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={leftAction ? renderLeftActions : undefined}
      renderRightActions={rightAction ? renderRightActions : undefined}
      onSwipeableWillOpen={() => haptics.light()}
      containerStyle={styles.swipeContainer}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    marginBottom: spacing.xs,
  },
  actionButton: {
    width: 76,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  leftAction: {
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
  },
  rightAction: {
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
});
