export type RarityType = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface RarityDefinition {
  label: RarityType;
  chance: number;
  glow: string;
  accent: string;
  description: string;
}
