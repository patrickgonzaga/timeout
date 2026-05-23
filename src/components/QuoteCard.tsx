import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import type { Quote } from '../types/quote';
import { palette } from '../constants/colors';

interface Props {
  quote: Quote;
  rarity: string;
  loading: boolean;
}

export default function QuoteCard({ quote, rarity, loading }: Props) {
  return (
    <Animated.View
      entering={FadeInUp.duration(500)}
      exiting={FadeOutDown.duration(250)}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Fortune</Text>
        <Text style={styles.rarity}>{rarity}</Text>
      </View>
      <Text style={styles.body}>
        {loading ? 'A soft message will arrive soon...' : `“${quote.q}”`}
      </Text>
      <Text style={styles.author}>{loading ? 'Time Out' : `— ${quote.a}`}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(17, 10, 48, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#4f7bff',
    shadowOpacity: 0.22,
    shadowRadius: 26,
    marginTop: 26
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700'
  },
  rarity: {
    color: palette.neonBlue,
    fontSize: 13,
    fontWeight: '700'
  },
  body: {
    color: palette.textSoft,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 18
  },
  author: {
    color: '#dfe3ff',
    fontSize: 14,
    opacity: 0.86,
    textAlign: 'right'
  }
});
