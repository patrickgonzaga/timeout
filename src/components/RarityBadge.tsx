import { StyleSheet, Text, View, Platform } from 'react-native';

interface Props {
  rarity: string;
  color: string;
  theme?: 'nebula' | 'golden';
}

export default function RarityBadge({ rarity, color, theme = 'nebula' }: Props) {
  const isNebula = theme === 'nebula';
  const isLegendary = rarity === 'Legendary';
  
  // Dynamic Web classes for themed fonts and glowing shadows
  const webClass = `${isNebula ? 'badge-nebula' : 'badge-golden'} ${isLegendary ? 'badge-legendary' : ''}`;

  return (
    <View style={[
      styles.badge, 
      isNebula ? styles.badgeNebula : styles.badgeGolden,
      isLegendary && styles.legendaryBadge,
      Platform.OS === 'web' ? null : { borderColor: color, shadowColor: color }
    ]}>
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{ __html: `
          .badge-nebula {
            font-family: 'Rajdhani', sans-serif !important;
            font-size: 10px !important;
            letter-spacing: 2.5px !important;
            color: #c084fc !important;
            border-color: rgba(192, 132, 252, 0.35) !important;
            background-color: rgba(192, 132, 252, 0.1) !important;
            text-transform: uppercase;
          }
          .badge-golden {
            font-family: 'Cinzel', serif !important;
            font-size: 11px !important;
            letter-spacing: 2px !important;
            color: #daa520 !important;
            border-color: rgba(218, 165, 32, 0.35) !important;
            background-color: rgba(218, 165, 32, 0.08) !important;
            text-transform: uppercase;
          }
          .badge-nebula.badge-legendary {
            color: #ffd700 !important;
            border-color: rgba(255, 215, 0, 0.4) !important;
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.35) !important;
          }
          .badge-golden.badge-legendary {
            color: #ffd700 !important;
            border-color: rgba(255, 215, 0, 0.4) !important;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.45) !important;
          }
        ` }} />
      )}
      <Text 
        // @ts-ignore
        className={Platform.OS === 'web' ? webClass : undefined}
        style={[
          styles.text, 
          isNebula ? styles.textNebula : styles.textGolden,
          isLegendary && styles.legendaryText
        ]}
      >
        {rarity}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 14,
    alignSelf: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }
  },
  badgeNebula: {
    backgroundColor: 'rgba(192, 132, 252, 0.1)',
    borderColor: 'rgba(192, 132, 252, 0.35)'
  },
  badgeGolden: {
    backgroundColor: 'rgba(218, 165, 32, 0.08)',
    borderColor: 'rgba(218, 165, 32, 0.35)'
  },
  legendaryBadge: {
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    shadowColor: '#ffd700',
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  text: {
    fontWeight: '700',
    textAlign: 'center'
  },
  textNebula: {
    fontFamily: Platform.OS === 'web' ? 'Rajdhani' : 'System',
    fontSize: 10,
    letterSpacing: 2.5,
    color: '#c084fc'
  },
  textGolden: {
    fontFamily: Platform.OS === 'web' ? 'Cinzel' : 'System',
    fontSize: 11,
    letterSpacing: 2,
    color: '#daa520'
  },
  legendaryText: {
    color: '#ffd700'
  }
});
