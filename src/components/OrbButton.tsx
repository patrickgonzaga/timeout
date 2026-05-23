import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
  interpolateColor,
  Easing,
  cancelAnimation
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  onPress: () => void;
  isPulling: boolean;
  glowColor: string;
  theme?: 'nebula' | 'golden';
}

export default function OrbButton({ onPress, isPulling, glowColor, theme = 'nebula' }: Props) {
  const isNebula = theme === 'nebula';

  // Animation shared values
  const pulse = useSharedValue(0);
  const spinX = useSharedValue(0);
  const spinY = useSharedValue(0);
  const ring1Rot = useSharedValue(0);
  const ring2Rot = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  useEffect(() => {
    if (isPulling) {
      // Pulling trigger animation sequence (Charging/Spinning at hyper speed)
      cancelAnimation(spinX);
      cancelAnimation(spinY);
      cancelAnimation(ring1Rot);
      cancelAnimation(ring2Rot);

      // 3D Barrel Roll flip
      spinX.value = withTiming(720, { duration: 900, easing: Easing.bezier(0.25, 1, 0.5, 1) });
      spinY.value = withTiming(-720, { duration: 900, easing: Easing.bezier(0.25, 1, 0.5, 1) }, (finished) => {
        if (finished) {
          spinX.value = 0;
          spinY.value = 0;
        }
      });

      // Rapid rings spin
      ring1Rot.value = withTiming(ring1Rot.value + 1080, { duration: 900, easing: Easing.out(Easing.quad) });
      ring2Rot.value = withTiming(ring2Rot.value - 1080, { duration: 900, easing: Easing.out(Easing.quad) });
    } else {
      // Smooth out spin values
      spinX.value = withSpring(0);
      spinY.value = withSpring(0);

      // Idle breathing pulse
      pulse.value = withRepeat(
        withTiming(1, { duration: isNebula ? 2000 : 2500, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );

      // Continuous slow rotation for Nebula rings
      ring1Rot.value = withRepeat(
        withTiming(360, { duration: 14000, easing: Easing.linear }),
        -1,
        false
      );
      ring2Rot.value = withRepeat(
        withTiming(-360, { duration: 9000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [isPulling, theme]);

  // Pointer move handler (Web mouse parallax tilt)
  const handlePointerMove = (e: any) => {
    if (isPulling || Platform.OS !== 'web') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 140; // relative to center X
    const y = e.clientY - rect.top - 140;  // relative to center Y
    
    // Tilt up to 20 degrees
    tiltX.value = withTiming((-y / 140) * 20, { duration: 150 });
    tiltY.value = withTiming((x / 140) * 20, { duration: 150 });
  };

  const handlePointerLeave = () => {
    if (Platform.OS !== 'web') return;
    tiltX.value = withSpring(0, { damping: 12 });
    tiltY.value = withSpring(0, { damping: 12 });
  };

  // Centerpiece layout styles (size switches between 160px for Orb and 150px for Coin)
  const size = isNebula ? 160 : 150;

  const containerStyle = useAnimatedStyle(() => {
    const scaleVal = isPulling ? 1.08 : 0.97 + pulse.value * 0.03;
    const yFloat = isNebula ? Math.sin(pulse.value * Math.PI) * 7 : Math.sin(pulse.value * Math.PI) * 5;
    const yRot = isNebula ? 0 : Math.sin(pulse.value * Math.PI) * 6; // coin tilts/turns dynamically in 3D

    return {
      transform: [
        { perspective: 600 },
        { translateY: yFloat },
        { rotateX: `${tiltX.value + spinX.value}deg` },
        { rotateY: `${tiltY.value + yRot + spinY.value}deg` },
        { scale: withSpring(scaleVal, { damping: 10, stiffness: 120 }) }
      ]
    };
  });

  const ring1Style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateX: '65deg' },
      { rotateY: '20deg' },
      { rotateZ: `${ring1Rot.value}deg` }
    ]
  }));

  const ring2Style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { rotateX: '20deg' },
      { rotateY: '65deg' },
      { rotateZ: `${ring2Rot.value}deg` }
    ]
  }));

  const coreStyle = useAnimatedStyle(() => {
    const defaultColor = isNebula ? '#1c0836' : '#221400';
    return {
      backgroundColor: interpolateColor(
        pulse.value,
        [0, 1],
        [defaultColor, isPulling ? glowColor : isNebula ? '#2b0f4d' : '#331d00']
      ),
      shadowColor: glowColor,
      shadowOpacity: withTiming(isPulling ? 0.95 : isNebula ? 0.7 : 0.55),
      shadowRadius: withTiming(isPulling ? 50 : isNebula ? 32 : 28)
    };
  });

  const glyph = isNebula ? '🔮' : '✦';

  return (
    <View
      style={styles.outerContainer}
      // @ts-ignore
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Pressable onPress={onPress} style={styles.wrapper}>
        {/* Concentric rings surrounding Nebula Orb */}
        {isNebula && (
          <>
            <Animated.View style={[styles.ring, styles.ringOuter, { borderColor: 'rgba(140,80,255,0.18)' }, ring1Style]} />
            <Animated.View style={[styles.ring, styles.ringInner, { borderColor: 'rgba(140,80,255,0.1)' }, ring2Style]} />
          </>
        )}

        {/* 3D Centered Sphere / Coin */}
        <Animated.View 
          style={[
            styles.sphere, 
            { width: size, height: size, borderRadius: size / 2 },
            coreStyle,
            containerStyle
          ]}
        >
          {/* Main background colors */}
          <LinearGradient
            colors={
              isNebula 
                ? ['#c084fc', '#7c3aed', '#2e1065', '#0a0010'] 
                : ['#fff8dc', '#ffd700', '#daa520', '#8b6914', '#3a2800']
            }
            start={{ x: 0.15, y: 0.15 }}
            end={{ x: 0.85, y: 0.85 }}
            style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
          />

          {/* SPECULAR LIGHT HIGHLIGHT */}
          <View 
            style={[
              styles.specularHighlight, 
              isNebula ? styles.orbGlint : styles.coinGlint
            ]} 
          />

          {/* INNER ENGRAVED RING (Golden only) */}
          {!isNebula && <View style={styles.engravedRing} />}

          {/* CENTER TYPOGRAPHY GLYPH */}
          <Text 
            style={[
              styles.glyph, 
              { 
                fontFamily: isNebula ? 'System' : 'Cinzel',
                fontSize: isNebula ? 42 : 46,
                textShadowColor: isNebula ? 'rgba(140,80,255,0.5)' : 'rgba(255,215,0,0.4)',
                textShadowRadius: 10
              }
            ]}
          >
            {glyph}
          </Text>

          {/* Border glass ring overlay */}
          <View style={[
            styles.glassRingOverlay, 
            { 
              borderColor: isNebula ? 'rgba(140,80,255,0.22)' : 'rgba(255,215,0,0.22)',
              borderRadius: size / 2 
            }
          ]} />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
    position: 'relative'
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'relative'
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 200,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8
  },
  ringOuter: {
    width: 280,
    height: 280
  },
  ringInner: {
    width: 220,
    height: 220
  },
  sphere: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowOffset: { width: 0, height: 10 },
    elevation: 8
  },
  specularHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 50
  },
  orbGlint: {
    top: 10,
    left: 20,
    width: 56, // 35% of 160
    height: 35, // 22% of 160
    opacity: 0.55,
    transform: [{ rotate: '-30deg' }]
  },
  coinGlint: {
    top: 12,
    left: 18,
    width: 48, // 32% of 150
    height: 24, // 16% of 150
    opacity: 0.65,
    backgroundColor: 'rgba(255,255,255,0.65)',
    transform: [{ rotate: '-35deg' }]
  },
  engravedRing: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.35)'
  },
  glyph: {
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 5
  },
  glassRingOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.4
  }
});
