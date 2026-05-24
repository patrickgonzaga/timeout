import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import Animated, { FadeIn, FadeOut, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

interface Props {
  active: boolean;
  color: string;
}

export default function PullAnimationOverlay({ active, color }: Props) {
  const glow = useSharedValue(0);

  useEffect(() => {
    if (active) {
      glow.value = withSequence(
        withTiming(1, { duration: 180 }),
        withTiming(0.3, { duration: 280 })
      );
    }
  }, [active, glow]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.96 + glow.value * 0.18 }],
    opacity: 0.18 + glow.value * 0.3
  }));

  return active ? (
    <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)} style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.ring, ringStyle, { borderColor: color }]} />
      <View style={styles.textBox}>
        <Text style={styles.text}>Magic unfolding...</Text>
      </View>
    </Animated.View>
  ) : null;
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ring: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 0,
    position: 'absolute'
  },
  textBox: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(8, 7, 28, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    letterSpacing: 0.3
  }
});
