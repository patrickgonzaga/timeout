import { useCallback, useEffect, useMemo, useState } from 'react';
import { palette } from '../constants/colors';
import { Platform, StyleSheet, Text, View, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import GlowAnimation from '../../assets/animations/glow.json';
import * as Haptics from 'expo-haptics';
import AnimatedGradientBackground from '../components/AnimatedGradientBackground';
import ParticleBackground from '../components/ParticleBackground';
import OrbButton from '../components/OrbButton';
import FortuneCookieReveal from '../components/FortuneCookieReveal';
import PullAnimationOverlay from '../components/PullAnimationOverlay';
import { fetchQuote, QuoteSource } from '../services/quoteService';
import { pickRarity, getRarityDefinition } from '../services/rarityService';
import { playPullSequence } from '../services/soundService';
import { useShake } from '../services/shakeService';
import type { Quote } from '../types/quote';
import type { RarityType } from '../types/rarity';

const initialQuote: Quote = {
  q: 'Welcome to Time Out. Tap or shake to receive a calm, glowing message.',
  a: 'Your daily ritual'
};

export default function HomeScreen() {
  const [quote, setQuote] = useState<Quote>(initialQuote);
  const [rarity, setRarity] = useState<RarityType>('Common');
  const [quoteSource, setQuoteSource] = useState<QuoteSource>('mixed');
  const [theme, setTheme] = useState<'nebula' | 'golden'>('nebula');
  const [loading, setLoading] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(true); // show welcome card immediately
  const [error, setError] = useState<string | null>(null);

  const rarityDef = useMemo(() => getRarityDefinition(rarity), [rarity]);
  const isNebula = theme === 'nebula';

  // Sync theme class with body element on Web
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.body.className = theme;
    }
  }, [theme]);

  const handlePull = useCallback(async () => {
    if (pulling) return;

    // Step 1: Collapse the reveal card first (shell closes)
    setCookieOpen(false);
    setError(null);

    // Small delay so the card collapse is visible before the spin
    await new Promise((res) => setTimeout(res, 180));

    setPulling(true);
    setLoading(true);

    const selectedRarity = pickRarity();
    setRarity(selectedRarity);

    try {
      if (Platform.OS !== 'web') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      // Kick off sound + fetch in parallel with the 3D spin (which lasts ~900ms)
      const [nextQuote] = await Promise.all([
        fetchQuote(quoteSource),
        playPullSequence(selectedRarity).catch(() => null)
      ]);
      setQuote(nextQuote);
      // Wait for orb 3D spin to finish (900ms) then burst reveal the card
      setTimeout(() => {
        setLoading(false);
        setCookieOpen(true);
      }, 900);
    } catch (fetchError) {
      setLoading(false);
      setError('Unable to load your fortune right now.');
      setCookieOpen(true);
    } finally {
      setTimeout(() => setPulling(false), 950);
    }
  }, [pulling, quoteSource]);


  useShake(handlePull, Platform.OS !== 'web');

  const toggleTheme = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => null);
    }
    setTheme((prev) => (prev === 'nebula' ? 'golden' : 'nebula'));
  };

  const categories = [
    { id: 'mixed', label: 'Surprise Me', icon: '🌸' },
    { id: 'zen', label: 'Zen Quotes', icon: '🌌' },
    { id: 'advice', label: 'Wise Advice', icon: '💡' }
  ] as const;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isNebula ? '#050508' : '#040300' }]}>
      {/* Dynamic Visual CSS imports on Web */}
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{ __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cormorant+Garamond:ital,wght@1,300&family=Rajdhani:wght@700&family=Space+Grotesk:wght@300;400;600&display=swap');
          
          body {
            margin: 0;
            transition: background 0.6s ease;
            min-height: 100vh;
            overflow-x: hidden;
          }
          
          body.nebula {
            background: radial-gradient(ellipse at 30% 20%, #1a0533, #050508) !important;
          }
          
          body.golden {
            background: radial-gradient(ellipse at 50% 90%, #1a0c00, #060400) !important;
          }

          /* General Title Styles */
          .title-text-web {
            transition: all 0.4s ease;
            text-align: center;
          }
          .nebula .title-text-web {
            font-family: 'Rajdhani', sans-serif !important;
            font-weight: 700 !important;
            font-size: 38px !important;
            letter-spacing: 1.5px;
            color: #ffffff !important;
            text-shadow: 0 0 15px rgba(140, 80, 255, 0.45);
          }
          .golden .title-text-web {
            font-family: 'Cinzel', serif !important;
            font-weight: 700 !important;
            font-size: 34px !important;
            letter-spacing: 2.5px;
            color: #ffd700 !important;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
          }

          /* General Description Styles */
          .desc-text-web {
            font-family: 'Space Grotesk', sans-serif !important;
            font-weight: 300 !important;
            transition: all 0.4s ease;
            text-align: center;
            line-height: 1.5;
          }
          .nebula .desc-text-web {
            color: #7c6a99 !important;
          }
          .golden .desc-text-web {
            color: #7a6020 !important;
          }
        ` }} />
      )}

      {/* Floating Theme Toggle Switch */}
      <Pressable 
        onPress={toggleTheme} 
        style={[
          styles.themeToggle, 
          { borderColor: isNebula ? 'rgba(140,80,255,0.4)' : 'rgba(218,165,32,0.45)' }
        ]}
      >
        <Text style={[styles.themeToggleText, { color: isNebula ? '#c084fc' : '#ffd700' }]}>
          {isNebula ? '☽' : '☀'}
        </Text>
      </Pressable>

      <AnimatedGradientBackground theme={theme} />
      <ParticleBackground theme={theme} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Intro Branding Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.intro}>
          <Text 
            // @ts-ignore
            className="title-text-web" 
            style={[styles.subTitle, isNebula ? styles.subTitleNebula : styles.subTitleGolden]}
          >
            Time Out
          </Text>
          <Text 
            // @ts-ignore
            className="desc-text-web" 
            style={[styles.description, isNebula ? styles.descNebula : styles.descGolden]}
          >
            A tiny calming ritual with a magical fortune reveal.
          </Text>
        </Animated.View>

        {/* Categories Selector Tab Bar (Bulletproof React Native style hierarchy) */}
        <Animated.View 
          entering={FadeInDown.duration(600).delay(150)} 
          style={[
            styles.selectorContainer, 
            isNebula ? styles.selectorContainerNebula : styles.selectorContainerGolden
          ]}
        >
          {categories.map((cat) => {
            const active = quoteSource === cat.id;
            
            // Dynamic themed style assignments
            const tabStyle = isNebula ? styles.tabNebula : styles.tabGolden;
            const activeStyle = isNebula ? styles.tabActiveNebula : styles.tabActiveGolden;
            const labelStyle = isNebula ? styles.labelNebula : styles.labelGolden;
            const activeLabelStyle = isNebula ? styles.labelActiveNebula : styles.labelActiveGolden;

            return (
              <Pressable
                key={cat.id}
                onPress={() => {
                  if (pulling) return;
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => null);
                  }
                  setQuoteSource(cat.id);
                }}
                style={[
                  styles.selectorTab,
                  tabStyle,
                  active && activeStyle,
                  active && { shadowColor: rarityDef.glow }
                ]}
              >
                {/* Nebula gets icons, Golden gets clean text tabs */}
                {(isNebula || Platform.OS !== 'web') && (
                  <Text style={styles.selectorIcon}>{cat.icon}</Text>
                )}
                
                <Text style={[
                  styles.selectorLabel, 
                  labelStyle, 
                  active && activeLabelStyle
                ]}>
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </Animated.View>

        {/* Interactive centerpiece section */}
        <View style={styles.orbSection}>
          <OrbButton 
            onPress={handlePull} 
            isPulling={pulling} 
            glowColor={rarityDef.glow} 
            theme={theme}
          />
          
          <Text style={[styles.hint, isNebula ? styles.hintNebula : styles.hintGolden]}>
            {Platform.OS === 'web' 
              ? `Click the ${isNebula ? 'orb' : 'coin'} for your fortune` 
              : `Shake or tap the ${isNebula ? 'orb' : 'coin'} for your fortune`}
          </Text>
        </View>

        {/* Fortune reveal section */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.cardWrapper}>
          {loading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator size="small" color={isNebula ? '#8c50ff' : '#daa520'} />
              <Text style={[styles.loadingText, { color: isNebula ? '#7c6a99' : '#7a6020' }]}>
                {isNebula ? 'Unfolding your nebula capsule…' : 'Unrolling your solar scroll…'}
              </Text>
            </View>
          ) : null}
          <FortuneCookieReveal 
            quote={quote} 
            rarity={rarity} 
            glowColor={rarityDef.glow} 
            open={cookieOpen} 
            theme={theme}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </Animated.View>

        {/* App store downloads footer */}
        <View style={styles.footer}>
          <LottieView source={GlowAnimation} autoPlay loop style={styles.lottie} />
          <Text style={[styles.footerText, { color: isNebula ? '#7c6a99' : '#7a6020' }]}>
            Download the mobile app for the full experience.
          </Text>
          <View style={styles.storeButtons}>
            <Pressable style={[styles.storeButton, styles.storeFill, { backgroundColor: isNebula ? 'rgba(255,255,255,0.04)' : 'rgba(218,165,32,0.04)' }]}> 
              <Text style={styles.storeButtonText}>App Store</Text>
            </Pressable>
            <Pressable style={[styles.storeButton, styles.storeOutline, { borderColor: isNebula ? 'rgba(255,255,255,0.08)' : 'rgba(218,165,32,0.12)' }]}> 
              <Text style={styles.storeButtonText}>Google Play</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      
      <PullAnimationOverlay active={pulling} color={rarityDef.glow} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  themeToggle: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    zIndex: 999,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  },
  themeToggleText: {
    fontSize: 20,
    fontWeight: '700'
  },
  container: {
    minHeight: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24
  },
  intro: {
    alignItems: 'center',
    marginBottom: 24
  },
  subTitle: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  subTitleNebula: {
    color: '#fff',
    fontFamily: Platform.OS === 'web' ? 'Rajdhani' : 'System'
  },
  subTitleGolden: {
    color: '#ffd700',
    fontFamily: Platform.OS === 'web' ? 'Cinzel' : 'System'
  },
  description: {
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 320
  },
  descNebula: {
    color: '#7c6a99',
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  },
  descGolden: {
    color: '#7a6020',
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  },
  // Visual tab selectors direct styling (cross-platform safe)
  selectorContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 360,
    marginBottom: 20,
    paddingHorizontal: 4
  },
  selectorContainerNebula: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 30,
    padding: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'space-between'
  },
  selectorContainerGolden: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    gap: 28 // exact 28px gap for golden tabs
  },
  selectorTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  tabNebula: {
    flex: 1,
    borderRadius: 26,
    marginHorizontal: 2
  },
  tabGolden: {
    paddingHorizontal: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: 'transparent'
  },
  tabActiveNebula: {
    backgroundColor: 'rgba(140, 80, 255, 0.25)',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  tabActiveGolden: {
    borderBottomColor: '#ffd700'
  },
  selectorIcon: {
    fontSize: 13,
    marginRight: 6
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '700'
  },
  labelNebula: {
    color: '#7c6a99',
    fontFamily: Platform.OS === 'web' ? 'Rajdhani' : 'System',
    letterSpacing: 0.5
  },
  labelGolden: {
    color: '#7a6020',
    fontFamily: Platform.OS === 'web' ? 'Cinzel' : 'System',
    letterSpacing: 2
  },
  labelActiveNebula: {
    color: '#ffffff'
  },
  labelActiveGolden: {
    color: '#ffd700'
  },
  orbSection: {
    alignItems: 'center',
    marginVertical: 12
  },
  hint: {
    marginTop: 18,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  },
  hintNebula: {
    color: '#7c6a99'
  },
  hintGolden: {
    color: '#7a6020'
  },
  cardWrapper: {
    width: '100%',
    marginTop: 8
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  loadingText: {
    fontSize: 13,
    marginLeft: 12,
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  },
  errorText: {
    color: palette.error,
    marginTop: 10,
    textAlign: 'center'
  },
  footer: {
    marginTop: 32,
    alignItems: 'center'
  },
  lottie: {
    width: 150,
    height: 150
  },
  footerText: {
    textAlign: 'center',
    maxWidth: 320,
    marginTop: 4,
    fontSize: 13,
    fontFamily: Platform.OS === 'web' ? 'Space Grotesk' : 'System'
  },
  storeButtons: {
    marginTop: 18,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  storeButton: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  storeFill: {
    // handled dynamically
  },
  storeOutline: {
    borderWidth: 1
  },
  storeButtonText: {
    color: '#fff',
    fontWeight: '700'
  }
});
