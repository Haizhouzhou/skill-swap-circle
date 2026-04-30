export function mulberry32(seed: number): () => number {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const pick = <T>(rand: () => number, values: readonly T[]) => values[Math.floor(rand() * values.length)];
export const int = (rand: () => number, min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;
export function sample<T>(rand: () => number, values: readonly T[], count: number): T[] {
  return [...values].sort(() => rand() - 0.5).slice(0, Math.min(count, values.length));
}
export function dateDaysAgo(daysAgo: number, hour = 12): string {
  return new Date(Date.UTC(2026, 3, 30 - daysAgo, hour, 0, 0)).toISOString();
}
