import type { RarityDefinition } from '../types/rarity';

export const rarityDefinitions: RarityDefinition[] = [
  {
    label: 'Common',
    chance: 0.7,
    glow: '#5f4cff',
    accent: '#8e86ff',
    description: 'A gentle message for your moment of calm.'
  },
  {
    label: 'Rare',
    chance: 0.2,
    glow: '#50e6ff',
    accent: '#84f3ff',
    description: 'A brighter reminder for your soul.'
  },
  {
    label: 'Epic',
    chance: 0.08,
    glow: '#ff87d9',
    accent: '#ffb5f3',
    description: 'A powerful message from the universe.'
  },
  {
    label: 'Legendary',
    chance: 0.02,
    glow: '#ffd45b',
    accent: '#ffedf2',
    description: 'A rare burst of warmth and magic.'
  }
];
