# Time Out — Quick Start Guide

## 🎉 Your App is Ready!

The Time Out app has been fully scaffolded with all dependencies installed. Here's how to get started.

## 1️⃣ Start the Development Server

```bash
cd time-out
npm start
```

This opens the Expo CLI menu with options to run on different platforms.

## 2️⃣ Choose Your Platform

### iOS (Simulator)
```
Press 'i' in the terminal
```
- Opens iOS simulator automatically
- Requires Xcode installed on macOS

### Android (Emulator)
```
Press 'a' in the terminal
```
- Opens Android emulator
- Requires Android Studio and configured emulator

### Web (Browser)
```
Press 'w' in the terminal
```
- Opens http://localhost:8081 automatically
- Best for quick testing and development
- Tap the orb instead of shaking

### Physical Phone
```
Install Expo Go app, scan the QR code shown in terminal
```

## 3️⃣ Test the App

Once running, try:

✨ **Tap the glowing orb** — Receive a random fortune with magical animations
📱 **Shake your phone** (on iOS/Android) — Trigger fortune pull via accelerometer
🎨 **Watch the particles float** — Ambient background animation
🔊 **Hear sound effects** — Magical audio feedback for each pull
✨ **See the rarity glow** — Different colors for Common/Rare/Epic/Legendary

## 📚 Project Structure

```
src/
├── components/          # UI components (orb, quote card, particles, etc.)
├── screens/             # Full-screen layouts (HomeScreen)
├── services/            # API calls, rarity logic, shake detection, sounds
├── hooks/               # Custom React hooks
├── constants/           # Colors, rarities, fallback quotes
├── types/               # TypeScript types
└── utils/               # Helper functions
```

## ⚙️ Configuration

### Change Colors
Edit `src/constants/colors.ts` and adjust the `palette` object.

### Adjust Rarity Odds
Edit `src/constants/rarities.ts` and modify the `chance` values for each rarity.

### Add Your Own Quotes
Edit `src/constants/quotes.ts` to add fallback quotes when the API fails.

### Replace Sound Effects
Edit `src/services/soundService.ts` and update the `soundMap` URLs to use your own sounds.

## 🌐 Build for Production

### iOS
```bash
eas build --platform ios
```

### Android
```bash
eas build --platform android
```

### Web (Export)
```bash
npx expo export --platform web
```

## 🚀 Deploy Web to Vercel

1. Create a `.vercel` configuration (optional):
```bash
npx vercel
```

2. Deploy:
```bash
npm run build && npx vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Animations are choppy
- Ensure you're on the latest Expo Go version
- Close other apps on your device
- Restart the Expo CLI with `npm start`

### Sounds not playing
- Check internet connection (sounds are fetched from Mixkit)
- Test in web version first (better debugging)
- Check browser/phone volume settings

### Shake detection not working
- Make sure you're not on web (use tap instead)
- Check device has accelerometer (most phones do)
- Restart Expo Go app

## 📖 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## 🎨 Next Steps for Customization

1. **Add Custom Animations** — Import custom Lottie JSON files
2. **Implement Quote Categories** — Filter fortunes by theme
3. **Add User History** — Save favorite fortunes locally
4. **Create Custom Themes** — Build themed color palettes
5. **Enhance Haptics** — Add vibration patterns per rarity

---

Happy coding! 🌙✨
