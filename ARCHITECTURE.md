# Time Out — Architecture Overview

## High-Level Design

The Time Out app follows a clean, scalable architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────┐
│           React Native App                   │
├─────────────────────────────────────────────┤
│  HomeScreen (Main UI Layout)                │
├──────────────┬──────────────┬────────────────┤
│ Components   │ Hooks        │ Services       │
├──────────────┼──────────────┼────────────────┤
│ • OrbButton  │ • useDebo    │ • quoteService │
│ • QuoteCard  │ • useShake   │ • rarityServ   │
│ • Particles  │              │ • soundService │
│ • Gradients  │              │ • shakeServ    │
└──────────────┴──────────────┴────────────────┘
```

## 📁 Directory Structure

### `src/components/`
Reusable, presentational React components:

- **OrbButton.tsx** — The main glowing orb button
  - Animated pulse effect
  - Tap interaction with ripple feedback
  - Dynamic glow color based on rarity
  
- **QuoteCard.tsx** — Fortune reveal card
  - FadeInUp animation on entry
  - Glassmorphic styling
  - Displays quote text and author
  
- **ParticleBackground.tsx** — Floating particles
  - 14 floating particles with sine wave motion
  - Independent animation per particle
  - Ambient visual effect
  
- **AnimatedGradientBackground.tsx** — Breathing gradient
  - Dark purple to blue gradient
  - Opacity pulsing for breathing effect
  - Full-screen backdrop
  
- **RarityBadge.tsx** — Rarity label
  - Glowing border matching rarity color
  - Small, elegant badge style
  
- **PullAnimationOverlay.tsx** — Pull feedback
  - Expanding ring animation
  - "Magic unfolding..." text
  - Shows during loading

### `src/screens/`
Full-screen layouts:

- **HomeScreen.tsx** — Main app screen
  - Orchestrates all components
  - Manages state (quote, rarity, loading, error)
  - Handles pull logic and user interactions
  - Listens for shake events

### `src/services/`
Business logic & external API calls:

- **quoteService.ts**
  - `fetchQuote()` — Calls ZenQuotes API
  - Fallback to local quotes on error
  - Returns `{ q: string, a: string }`

- **rarityService.ts**
  - `pickRarity()` — Probabilistic rarity selection
  - 70% Common, 20% Rare, 8% Epic, 2% Legendary
  - `getRarityDefinition()` — Returns rarity metadata

- **soundService.ts**
  - `playSound(key)` — Play single sound effect
  - `playPullSequence(rarity)` — Play sequence for pull
  - Uses free Mixkit sound URLs
  - Handles cleanup to prevent memory leaks

- **shakeService.ts**
  - `useShake(callback, active)` — React hook for shake detection
  - Uses Expo Sensors Accelerometer API
  - 1.6 threshold with 800ms debounce
  - Disabled on web platform

### `src/hooks/`
Custom React hooks:

- **useDebouncedCallback.ts**
  - Debounce wrapper for callbacks
  - Used to prevent multiple rapid pulls
  - Generic with TypeScript support

### `src/constants/`
App configuration & static data:

- **colors.ts**
  - `palette` object with all app colors
  - Deep purples, neons, glows, text colors
  - Centralized color management

- **rarities.ts**
  - `rarityDefinitions` array
  - Each rarity: label, chance, glow color, accent, description

- **quotes.ts**
  - `fallbackQuotes` array
  - 5 default quotes when API fails
  - Calming, positive messages

### `src/types/`
TypeScript type definitions:

- **quote.ts**
  - `Quote { q: string, a: string }`

- **rarity.ts**
  - `RarityType` union type
  - `RarityDefinition` interface

- **custom.d.ts**
  - Module declarations for JSON imports

### `src/utils/`
Helper functions:

- **random.ts**
  - `weightedRandom<T>()` — Weighted random selection
  - Used internally by rarity system

### `assets/`
Static assets:

- **animations/glow.json**
  - Lottie animation JSON
  - Pulsing glow effect for footer

## 🔄 Data Flow

```
User Action
    ↓
[HomeScreen] listens for:
  - Button tap
  - Shake event
    ↓
Call handlePull()
    ├→ Pick rarity with rarityService.pickRarity()
    ├→ Trigger haptics (if not web)
    ├→ Play sounds with soundService.playPullSequence()
    ├→ Fetch quote with quoteService.fetchQuote()
    └→ Update state (quote, rarity, loading)
    ↓
Component re-renders
    ├→ OrbButton glows (new color)
    ├→ QuoteCard animates in
    └→ RarityBadge shows rarity
```

## 🎨 Animation Strategy

- **React Native Reanimated** — High-performance 60fps animations
- **Animated.View** — All major animations use Animated components
- **Shared Values** — Animation state management
- **withTiming** — Controlled animations with duration
- **withSpring** — Natural physics-based animations
- **withRepeat** — Looping animations for idle breathing effects
- **Entering/Exiting** — Layout animations for card transitions

## 🔊 Sound Architecture

Sounds are **hosted externally** on Mixkit (free, no API key required):

```javascript
soundMap = {
  sparkle: "https://assets.mixkit.co/sfx/preview/mixkit-magic-spell-3401.mp3",
  reveal: "https://assets.mixkit.co/sfx/preview/mixkit-fairy-bells-613.mp3",
  chime: "https://assets.mixkit.co/sfx/preview/mixkit-futuristic-ufo-alert-605.mp3",
  Common: "https://assets.mixkit.co/sfx/preview/...",
  Rare: "https://assets.mixkit.co/sfx/preview/...",
  Epic: "https://assets.mixkit.co/sfx/preview/...",
  Legendary: "https://assets.mixkit.co/sfx/preview/..."
}
```

**Benefits:**
- No file size bloat in app
- Can update sounds without re-deploying
- Better compatibility across platforms

## 📡 API Integration

### ZenQuotes API
- **Endpoint:** `https://zenquotes.io/api/random`
- **Method:** GET
- **Response:** `[{ q: string, a: string }]`
- **Benefits:** Free, no auth, CORS-enabled, no rate limiting

### Fallback Strategy
```javascript
try {
  const data = await fetch("https://zenquotes.io/api/random")
  return data
} catch {
  return localFallbackQuote
}
```

## 🛡️ State Management

Simple, props-based state using React hooks:

```typescript
const [quote, setQuote] = useState<Quote>(initialQuote)
const [rarity, setRarity] = useState<RarityType>('Common')
const [loading, setLoading] = useState(false)
const [pulling, setPulling] = useState(false)
const [error, setError] = useState<string | null>(null)
```

**Why not Redux/Zustand?**
- App has minimal state
- All state lives in one screen
- No complex state updates
- Easier to understand for new developers

## 🎯 Performance Optimizations

1. **useMemo** — Rarity definition memoized to prevent re-renders
2. **useCallback** — Pull handler memoized to prevent dependency issues
3. **Debouncing** — Shake detection debounced to prevent rapid fires
4. **Sound cleanup** — Unload sounds after playback to free memory
5. **Animation optimization** — Use Reanimated for 60fps, not JS animations

## 🌐 Platform-Specific Code

```typescript
// Only on mobile (shake detection)
if (Platform.OS !== 'web') {
  useShake(handlePull)
}

// Only on mobile (haptics)
if (Platform.OS !== 'web') {
  await Haptics.notificationAsync()
}

// Web shows button instead of shake hint
Platform.OS === 'web' ? 'Tap the orb...' : 'Shake or tap...'
```

## 🚀 Scalability Considerations

If you want to expand Time Out:

1. **User Persistence** — Add AsyncStorage for favorite quotes
2. **Theme System** — Create multiple color themes
3. **Categories** — Filter quotes by mood/topic
4. **Animations** — Add more Lottie animations per rarity
5. **Streaks** — Track daily pull streaks
6. **Sharing** — Share fortunes to social media
7. **Notifications** — Daily reminder pull notifications
8. **Multiplayer** — Share fortunes with friends

---

This architecture is clean, maintainable, and ready to grow! 🌙✨
