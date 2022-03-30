
export function omit<T, Key extends (keyof T)>(obj: T, key: Key): Omit<T, Key> {
  const copy = { ...obj }
  delete copy[key]
  return copy
}
