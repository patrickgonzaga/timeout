export function weightedRandom<T>(items: Array<{ weight: number; value: T }>): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const random = Math.random() * total;
  let running = 0;

  for (const item of items) {
    running += item.weight;
    if (random <= running) {
      return item.value;
    }
  }

  return items[items.length - 1].value;
}
