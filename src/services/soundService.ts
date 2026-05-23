import { Audio } from 'expo-av';
import type { RarityType } from '../types/rarity';

const soundMap: Record<'sparkle' | 'reveal' | 'chime' | RarityType, string> = {
  sparkle: 'https://assets.mixkit.co/sfx/preview/mixkit-magic-spell-3401.mp3',
  reveal: 'https://assets.mixkit.co/sfx/preview/mixkit-fairy-bells-613.mp3',
  chime: 'https://assets.mixkit.co/sfx/preview/mixkit-futuristic-ufo-alert-605.mp3',
  Common: 'https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3',
  Rare: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-block-hit-2107.mp3',
  Epic: 'https://assets.mixkit.co/sfx/preview/mixkit-fantasy-game-spell-525.mp3',
  Legendary: 'https://assets.mixkit.co/sfx/preview/mixkit-epic-retro-game-notification-211.mp3'
};

export async function playSound(key: 'sparkle' | 'reveal' | 'chime' | RarityType) {
  try {
    const { sound } = await Audio.Sound.createAsync(
      { uri: soundMap[key] },
      { shouldPlay: true, volume: 0.85 }
    );
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status && 'didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync().catch(() => null);
      }
    });
  } catch (error) {
    console.warn('Sound failed to play', error);
  }
}

export async function playPullSequence(rarity: RarityType) {
  await playSound('sparkle');
  await playSound(rarity);
  await playSound('reveal');
}
