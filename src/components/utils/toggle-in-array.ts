/**
 * Toggle the existence of a value in a set.
 * Doesn't modify the input set.
 */
export function toggleInArray<T>(arr: T[], key: T): T[] {
  const set = new Set(arr);

  if (!set.delete(key)) {
    // Set.delete returns false if key not present
    set.add(key);
  }

  return Array.from(set);
}
