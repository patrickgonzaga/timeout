# Time Out 🌙

A beautiful, magical mobile-first React Native app for receiving calming fortunes and quotes. Feel like a digital fortune cookie with gacha pull mechanics.

## ✨ Features

- **Magical Fortune Pulls** — Shake your phone or tap the glowing orb to receive a personalized quote
- **Rarity System** — Common, Rare, Epic, and Legendary fortune tiers with unique glow effects
- **Cross-Platform** — Works on iOS, Android, and Web via React Native Web
- **Shake Detection** — Native accelerometer support for immersive phone shake interaction
- **Sound Effects** — Magical audio feedback with free public sound assets
- **Smooth Animations** — React Native Reanimated for buttery-smooth 60fps animations
- **Offline First** — Fallback local quotes when API is unavailable
- **Zero Backend** — Entirely frontend-only with free ZenQuotes API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
cd time-out
npm install
```

### Development

**Start the dev server:**
```bash
npm start
```

Then choose your platform:
- **iOS**: Press `i` → Opens Expo Go on iOS simulator
- **Android**: Press `a` → Opens Expo Go on Android emulator  
- **Web**: Press `w` → Opens in browser at http://localhost:8081

### Testing on Physical Devices

1. Install **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npm start`
3. Scan the QR code with your phone camera

## 📦 Tech Stack

- **Expo 51** — Managed React Native framework
- **React Native 0.74** — Cross-platform UI framework
- **TypeScript** — Type-safe development
- **React Native Reanimated 3** — High-performance animations
- **React Native Gesture Handler** — Touch and gesture detection
- **Lottie** — Vector animation support
- **Expo Sensors** — Shake detection via accelerometer
- **Expo AV** — Sound playback
- **Linear Gradient** — Beautiful gradient backgrounds

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── OrbButton.tsx           # Main glowing fortune button
│   ├── QuoteCard.tsx           # Fortune reveal card
│   ├── ParticleBackground.tsx  # Floating particle effect
│   ├── RarityBadge.tsx         # Rarity label display
│   ├── AnimatedGradientBackground.tsx  # Breathing gradient
│   └── PullAnimationOverlay.tsx        # Pull feedback animation
├── screens/             # Full-screen layouts
│   └── HomeScreen.tsx          # Main app screen
├── services/            # Business logic & API calls
│   ├── quoteService.ts         # Fetch from ZenQuotes API
│   ├── rarityService.ts        # Rarity probability system
│   ├── soundService.ts         # Audio playback
│   └── shakeService.ts         # Accelerometer events
├── hooks/               # Custom React hooks
│   └── useDebouncedCallback.ts # Throttle callbacks
├── constants/           # App configuration
│   ├── colors.ts        # Color palette
│   ├── rarities.ts      # Rarity definitions
│   └── quotes.ts        # Fallback quotes
├── types/               # TypeScript definitions
│   ├── quote.ts
│   └── rarity.ts
└── utils/               # Helper functions
    └── random.ts        # Weighted random selection
```

## 🎨 Visual Design

- **Color Palette**: Deep purple, neon blue, soft pink, cyan glow
- **Aesthetic**: Lo-fi anime UI with glassmorphism and floating particles
- **Typography**: Clean, modern sans-serif with glowing text effects
- **Dark Mode**: Optimized dark theme throughout

## 🎯 How It Works

1. **User taps orb or shakes phone** → Haptic vibration feedback
2. **Rarity is randomly selected** (70% Common, 20% Rare, 8% Epic, 2% Legendary)
3. **Sound effects play** in sequence (sparkle → rarity chime → reveal)
4. **Fortune is fetched** from [ZenQuotes.io](https://zenquotes.io/) API
5. **Quote animates in** with glassmorphic card design
6. **Rarity badge glows** with unique color for that tier

### Rarity System

| Tier | Probability | Glow Color | Feel |
|------|-----------|-----------|------|
| Common | 70% | Purple | Gentle & calm |
| Rare | 20% | Cyan | Uplifting |
| Epic | 8% | Pink | Powerful |
| Legendary | 2% | Gold | Magical & rare ✨ |

## 🔧 Configuration

### Change Colors
Edit [src/constants/colors.ts](src/constants/colors.ts)

### Modify Rarity Chances
Edit [src/constants/rarities.ts](src/constants/rarities.ts)

### Add Fallback Quotes
Edit [src/constants/quotes.ts](src/constants/quotes.ts)

### Customize Sounds
Replace sound URLs in [src/services/soundService.ts](src/services/soundService.ts)

## 🌐 Web Deployment

### Deploy to Vercel

1. Build the web version:
```bash
npm run web
```

2. Deploy the `.web-build/` directory to Vercel:
```bash
npx vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Custom Lottie animations
- More sound variations per rarity
- Haptic feedback patterns
- Quote categories/filtering
- User quote history
- Custom themes

## 📝 License

Free to use, modify, and distribute.

## 🙏 Credits

- **ZenQuotes API** — Free quote service
- **Mixkit** — Free sound effects
- **Expo Team** — React Native framework
- **React Reanimated** — Animation library

---

Made with 🌙 and ✨
