import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const SHAKE_THRESHOLD = 1.6;
const DEBOUNCE_MS = 800;

export function useShake(onShake: () => void, active = true) {
  const lastShake = useRef(Date.now());

  useEffect(() => {
    if (!active || Platform.OS === 'web') {
      return;
    }

    let subscription = Accelerometer.addListener(({ x, y, z }) => {
      const total = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (total > SHAKE_THRESHOLD && now - lastShake.current > DEBOUNCE_MS) {
        lastShake.current = now;
        onShake();
      }
    });

    Accelerometer.setUpdateInterval(120);

    return () => {
      subscription?.remove();
    };
  }, [active, onShake]);
}
