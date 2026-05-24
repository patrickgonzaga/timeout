import { useEffect } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  withDelay,
  FadeInUp,
  FadeInDown
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import RarityBadge from './RarityBadge';
import type { Quote } from '../types/quote';

interface Props {
  quote: Quote;
  rarity: string;
  glowColor: string;
  open: boolean;
  theme?: 'nebula' | 'golden';
}

export default function FortuneCookieReveal({ quote, rarity, glowColor, open, theme = 'nebula' }: Props) {
  const crackProgress = useSharedValue(1);
  const paperRotation = useSharedValue(0);
  const paperScale = useSharedValue(1);

  useEffect(() => {
    if (open) {
      // Burst open: shell cracks apart, paper rises with bounce
      crackProgress.value = withTiming(1, { duration: 650 });
      paperScale.value = withDelay(300, withTiming(1, { duration: 500 }));
      paperRotation.value = withDelay(300, withTiming(2, { duration: 700 }));
    } else {
      // Smooth close: paper shrinks away, shell resets
      paperScale.value = withTiming(0.2, { duration: 220 });
      paperRotation.value = withTiming(0, { duration: 200 });
      crackProgress.value = withTiming(0, { duration: 280 });
    }
  }, [open, theme]);

  const isNebula = theme === 'nebula';

  // 1. NEBULA CAPSULE ANIMATIONS (Horizontal slide)
  const leftCapsuleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(crackProgress.value, [0, 1], [0, -140], Extrapolate.CLAMP) }],
    opacity: interpolate(crackProgress.value, [0, 0.8, 1], [1, 0.9, 0.15], Extrapolate.CLAMP)
  }));

  const rightCapsuleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(crackProgress.value, [0, 1], [0, 140], Extrapolate.CLAMP) }],
    opacity: interpolate(crackProgress.value, [0, 0.8, 1], [1, 0.9, 0.15], Extrapolate.CLAMP)
  }));

  // 2. GOLDEN SCROLL ANIMATIONS (Vertical roll)
  const topRollerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(crackProgress.value, [0, 1], [0, -120], Extrapolate.CLAMP) }],
    opacity: interpolate(crackProgress.value, [0, 0.9, 1], [1, 1, 0.1], Extrapolate.CLAMP)
  }));

  const bottomRollerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(crackProgress.value, [0, 1], [0, 120], Extrapolate.CLAMP) }],
    opacity: interpolate(crackProgress.value, [0, 0.9, 1], [1, 1, 0.1], Extrapolate.CLAMP)
  }));

  const cordStyle = useAnimatedStyle(() => ({
    opacity: interpolate(crackProgress.value, [0, 0.25], [1, 0], Extrapolate.CLAMP),
    transform: [{ scale: interpolate(crackProgress.value, [0, 0.25], [1, 1.25], Extrapolate.CLAMP) }]
  }));

  // 3. PAPER FORTUNE CARD RISE ANIMATION
  const paperStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: paperScale.value },
      { rotateZ: `${paperRotation.value}deg` }
    ],
    opacity: paperScale.value
  }));

  const webCardClass = `web-fortune-card ${isNebula ? 'fortune-card-nebula' : 'fortune-card-golden'}`;

  return (
    <View style={styles.container}>
      {/* Web-only Styles */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes card-rise {
            from {
              opacity: 0;
              transform: translateY(28px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          .web-fortune-card {
            width: 100%;
            padding: 24px 20px !important;
            box-sizing: border-box;
            animation: card-rise 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transition: all 0.4s ease;
            text-align: center;
          }

          .fortune-card-nebula {
            background: rgba(140, 80, 255, 0.05) !important;
            border: 1px solid rgba(140, 80, 255, 0.2) !important;
            border-radius: 18px !important;
            backdrop-filter: blur(14px);
            box-shadow: 0 10px 40px rgba(140, 80, 255, 0.08), inset 0 0 15px rgba(255, 255, 255, 0.05);
          }

          .fortune-card-golden {
            background: rgba(218, 165, 32, 0.04) !important;
            border: 1.5px solid rgba(218, 165, 32, 0.22) !important;
            border-radius: 12px !important;
            backdrop-filter: blur(8px);
            box-shadow: 0 10px 40px rgba(218, 165, 32, 0.04);
          }

          .fortune-card-golden::before {
            content: '✦ — ✦ — ✦';
            display: block;
            font-family: 'Cinzel', serif;
            font-size: 11px;
            color: #daa520;
            letter-spacing: 5px;
            margin-bottom: 16px;
            text-align: center;
            opacity: 0.9;
            text-shadow: 0 0 8px rgba(218,165,32,0.3);
          }

          .web-quote-text {
            font-family: 'Cormorant Garamond', serif !important;
            font-style: italic !important;
            font-weight: 300 !important;
            font-size: 21px !important;
            line-height: 1.55 !important;
            margin-bottom: 16px !important;
            text-align: center;
          }

          .nebula-quote {
            color: #d8b4fe !important;
            text-shadow: 0 0 10px rgba(216, 180, 254, 0.3);
          }

          .golden-quote {
            color: #ffd700 !important;
            text-shadow: 0 0 12px rgba(255, 215, 0, 0.25);
          }

          .web-author-text {
            font-family: 'Space Grotesk', sans-serif !important;
            font-weight: 400 !important;
            font-size: 13px !important;
            letter-spacing: 0.6px;
            margin-bottom: 18px !important;
            text-align: center;
            text-transform: uppercase;
          }

          .nebula-author {
            color: #7c6a99 !important;
          }

          .golden-author {
            color: #daa520 !important;
          }
        ` }} />
      )}

      {/* 1. NEBULA CAPSULE (Horizontal Slide Open) */}
      {isNebula && !open && (
        <View style={styles.shellWrapper}>
          {/* Glowing particle wave in the middle of capsule */}
          <LinearGradient
            colors={['transparent', glowColor, 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.capsuleCoreGlow}
          />
          
          <View style={styles.capsuleBody}>
            {/* Left Capsule half */}
            <Animated.View style={[styles.capsuleHalf, styles.capsuleLeft, leftCapsuleStyle]}>
              <LinearGradient
                colors={['rgba(140,80,255,0.18)', 'rgba(255,255,255,0.01)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientFill}
              />
              <View style={styles.innerCapsuleCore} />
            </Animated.View>

            {/* Right Capsule half */}
            <Animated.View style={[styles.capsuleHalf, styles.capsuleRight, rightCapsuleStyle]}>
              <LinearGradient
                colors={['rgba(255,255,255,0.01)', 'rgba(140,80,255,0.15)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientFill}
              />
              <View style={[styles.innerCapsuleCore, { right: 20, left: undefined }]} />
            </Animated.View>
          </View>
        </View>
      )}

      {/* 2. GOLDEN SCROLL (Vertical Unroll) */}
      {!isNebula && !open && (
        <View style={styles.shellWrapper}>
          {/* Scroll Tie String Cord */}
          <Animated.View style={[styles.scrollTieCord, cordStyle]} />

          <View style={styles.scrollBody}>
            {/* Top roller spindle */}
            <Animated.View style={[styles.scrollRoller, styles.scrollRollerTop, topRollerStyle]}>
              <View style={styles.scrollHandleLeft} />
              <View style={styles.scrollBar} />
              <View style={styles.scrollHandleRight} />
            </Animated.View>

            {/* Middle closed paper roll */}
            <Animated.View style={[styles.scrollPaperBodyClosed, cordStyle]} />

            {/* Bottom roller spindle */}
            <Animated.View style={[styles.scrollRoller, styles.scrollRollerBottom, bottomRollerStyle]}>
              <View style={styles.scrollHandleLeft} />
              <View style={styles.scrollBar} />
              <View style={styles.scrollHandleRight} />
            </Animated.View>
          </View>
        </View>
      )}

      {/* 3. FORTUNE PAPER CARD (Floats and scales up dynamically from gap) */}
      {open && (
        <Animated.View style={[styles.paperContainer, paperStyle]}>
          <View 
            // @ts-ignore
            className={Platform.OS === 'web' ? webCardClass : undefined}
            style={[
              styles.paperBg,
              isNebula ? styles.paperNebula : styles.paperGolden,
              Platform.OS === 'web' ? null : { borderColor: glowColor }
            ]}
          >
            {/* Native top divider for Golden Scroll */}
            {Platform.OS !== 'web' && !isNebula && (
              <Text style={styles.nativeGoldenDivider}>✦ — ✦ — ✦</Text>
            )}

            <Text 
              // @ts-ignore
              className={Platform.OS === 'web' ? `web-quote-text ${isNebula ? 'nebula-quote' : 'golden-quote'}` : undefined}
              style={[
                styles.fortuneText, 
                isNebula ? styles.fortuneTextNebula : styles.fortuneTextGolden
              ]}
              numberOfLines={6}
            >
              {quote.q}
            </Text>

            <Text 
              // @ts-ignore
              className={Platform.OS === 'web' ? `web-author-text ${isNebula ? 'nebula-author' : 'golden-author'}` : undefined}
              style={[
                styles.authorText, 
                isNebula ? styles.authorTextNebula : styles.authorTextGolden
              ]}
            >
              — {quote.a}
            </Text>

            <Animated.View entering={FadeInDown.duration(300).delay(600)}>
              <RarityBadge rarity={rarity} color={glowColor} theme={theme} />
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    marginTop: 10,
    width: '100%'
  },
  shellWrapper: {
    width: 260,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  gradientFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50
  },
  // Nebula Capsule Styles
  capsuleBody: {
    flexDirection: 'row',
    width: 260,
    height: 76,
    borderRadius: 38,
    position: 'relative',
    overflow: 'hidden'
  },
  capsuleCoreGlow: {
    position: 'absolute',
    width: 14,
    height: 76,
    zIndex: 10,
    opacity: 0.8
  },
  capsuleHalf: {
    position: 'absolute',
    width: 130,
    height: 76,
    borderWidth: 1,
    borderColor: 'rgba(140,80,255,0.22)',
    backgroundColor: 'rgba(28, 8, 54, 0.65)'
  },
  capsuleLeft: {
    left: 0,
    borderTopLeftRadius: 38,
    borderBottomLeftRadius: 38,
    borderRightWidth: 0
  },
  capsuleRight: {
    right: 0,
    borderTopRightRadius: 38,
    borderBottomRightRadius: 38,
    borderLeftWidth: 0
  },
  innerCapsuleCore: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8c50ff',
    top: 25,
    left: 20,
    opacity: 0,
    shadowColor: '#8c50ff',
    shadowOpacity: 0.8,
    shadowRadius: 10
  },
  // Golden Scroll Styles
  scrollBody: {
    width: 200,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  scrollTieCord: {
    position: 'absolute',
    width: 8,
    height: 70,
    borderRadius: 4,
    backgroundColor: '#9a1a1a',
    zIndex: 15,
    borderWidth: 1,
    borderColor: '#daa520',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  scrollRoller: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 220,
    height: 16,
    zIndex: 10
  },
  scrollRollerTop: {
    top: 5
  },
  scrollRollerBottom: {
    bottom: 5
  },
  scrollBar: {
    width: 190,
    height: 10,
    backgroundColor: '#ffd700',
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#8b6914'
  },
  scrollHandleLeft: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#daa520',
    borderWidth: 1.5,
    borderColor: '#ffd700'
  },
  scrollHandleRight: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#daa520',
    borderWidth: 1.5,
    borderColor: '#ffd700'
  },
  scrollPaperBodyClosed: {
    width: 180,
    height: 52,
    backgroundColor: '#f6ebd0',
    borderWidth: 1,
    borderColor: '#c09853',
    borderRadius: 4,
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6
  },
  // Fortune Paper Card Styles (Shared)
  paperContainer: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center'
  },
  paperBg: {
    width: '100%',
    padding: 22,
    borderWidth: 1,
    shadowOpacity: 0.12,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 }
  },
  paperNebula: {
    backgroundColor: 'rgba(140, 80, 255, 0.07)',
    borderColor: 'rgba(140, 80, 255, 0.22)',
    borderRadius: 18
  },
  paperGolden: {
    backgroundColor: 'rgba(218, 165, 32, 0.05)',
    borderColor: 'rgba(218, 165, 32, 0.22)',
    borderRadius: 12
  },
  nativeGoldenDivider: {
    color: '#daa520',
    fontFamily: Platform.OS === 'web' ? 'Cinzel' : 'System',
    fontSize: 11,
    letterSpacing: 5,
    textAlign: 'center',
    marginBottom: 14
  },
  fortuneText: {
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 12,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  fortuneTextNebula: {
    color: '#d8b4fe',
    fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'System'
  },
  fortuneTextGolden: {
    color: '#ffd700',
    fontFamily: Platform.OS === 'web' ? 'Cormorant Garamond' : 'System'
  },
  authorText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.5
  },
  authorTextNebula: {
    color: '#7c6a99',
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  },
  authorTextGolden: {
    color: '#daa520',
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  }
});
