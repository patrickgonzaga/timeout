import { useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

interface Props {
  theme?: 'nebula' | 'golden';
}

export default function AnimatedGradientBackground({ theme = 'nebula' }: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [pulse]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: theme === 'nebula' ? 0.45 + pulse.value * 0.15 : 0.25 + pulse.value * 0.15
  }));

  const isNebula = theme === 'nebula';
  const nebulaColors = ['#0f0322', '#1a0533', '#050508'] as const;
  const goldenColors = ['#0c0600', '#1c0f00', '#030200'] as const;

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Dynamic Gradients */}
      <LinearGradient
        colors={isNebula ? nebulaColors : goldenColors}
        style={StyleSheet.absoluteFill}
        start={isNebula ? { x: 0.1, y: 0.1 } : { x: 0.5, y: 0.9 }}
        end={isNebula ? { x: 0.9, y: 0.9 } : { x: 0.5, y: 0.1 }}
      />
      
      {/* Web-only Grid Overlay or Diamond Pattern */}
      {Platform.OS === 'web' && (
        <View 
          style={[
            StyleSheet.absoluteFill, 
            isNebula ? styles.nebulaGrid : styles.goldenPattern
          ]} 
        />
      )}

      {/* Breathing atmospheric overlay */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          styles.overlay, 
          { backgroundColor: isNebula ? '#0a0316' : '#080401' },
          overlayStyle
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  overlay: {
    mixBlendMode: 'plus-lighter'
  } as any,
  nebulaGrid: {
    // Tiled line grid overlay
    backgroundImage: `linear-gradient(rgba(140,80,255,0.045) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(140,80,255,0.045) 1px, transparent 1px)`,
    backgroundSize: '30px 30px'
  } as any,
  goldenPattern: {
    // Tiled SVG diamond pattern
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 0 L40 20 L20 40 L0 20 Z' fill='none' stroke='rgba(184,134,11,0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
    backgroundSize: '40px 40px'
  } as any
});
