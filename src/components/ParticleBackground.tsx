import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const PARTICLE_COUNT = 15;

interface Props {
  theme?: 'nebula' | 'golden';
}

function createParticle(index: number) {
  const size = 5 + (index % 4) * 3;
  const leftPercent = 5 + (index * 8) % 90;
  const topPercent = 5 + (index * 13) % 90;
  const duration = 4000 + (index % 5) * 800;

  return { size, leftPercent, topPercent, duration };
}

function ParticleItem({ 
  particle, 
  theme 
}: { 
  particle: ReturnType<typeof createParticle>; 
  theme: 'nebula' | 'golden';
}) {
  const offset = useSharedValue(0);

  useEffect(() => {
    offset.value = withRepeat(
      withTiming(15, {
        duration: particle.duration,
        easing: Easing.inOut(Easing.sin)
      }),
      -1,
      true
    );
  }, [offset, particle.duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
    opacity: 0.38
  }));

  const isNebula = theme === 'nebula';
  const particleColor = isNebula ? '#c084fc' : '#daa520';
  const glowColor = isNebula ? '#8c50ff' : '#ffd700';

  return (
    <Animated.View
      key={`${particle.leftPercent}-${particle.topPercent}-${particle.size}`}
      style={[
        styles.particle,
        {
          left: `${particle.leftPercent}%`,
          top: `${particle.topPercent}%`,
          width: particle.size,
          height: particle.size,
          backgroundColor: particleColor,
          shadowColor: glowColor
        },
        animatedStyle
      ]}
    />
  );
}

export default function ParticleBackground({ theme = 'nebula' }: Props) {
  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }, (_, index) => createParticle(index)), []);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleItem 
          key={`${particle.leftPercent}-${particle.topPercent}-${particle.size}`} 
          particle={particle} 
          theme={theme}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    borderRadius: 50,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 2
  }
});
