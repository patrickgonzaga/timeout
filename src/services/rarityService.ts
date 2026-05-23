import { rarityDefinitions } from '../constants/rarities';
import type { RarityDefinition, RarityType } from '../types/rarity';

export function pickRarity(): RarityType {
  const random = Math.random();
  let cumulative = 0;

  for (const rarity of rarityDefinitions) {
    cumulative += rarity.chance;
    if (random <= cumulative) {
      return rarity.label;
    }
  }

  return rarityDefinitions[0].label;
}

export function getRarityDefinition(label: RarityType): RarityDefinition {
  return rarityDefinitions.find((item) => item.label === label) ?? rarityDefinitions[0];
}
