/**
 * Returns the index of the last element in the array where predicate is true, and -1
 * otherwise.
 * @param array The source array to search in
 * @param predicate find calls predicate once for each element of the array, in descending
 * order, until it finds one where predicate returns true. If such an element is found,
 * findLastIndex immediately returns that element index. Otherwise, findLastIndex returns -1.
 */
export const findLastIndex = <T>(
  array: readonly T[],
  predicate: (value: T, index: number, obj: readonly T[]) => boolean
): number => {
  let l = array.length;
  while (l--) {
    if (predicate(array[l] as T, l, array)) return l;
  }
  return -1;
};

export const brighten = (hexColor: string, lightness: number) => {
  let hex = String(hexColor).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex.replace(/(.)/g, '$1$1');
  }
  const lum = lightness || 0;

  let rgb = '#';
  for (let i = 0; i < 3; i++) {
    const channel = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    const brightened = Math.round(
      Math.min(Math.max(0, channel + channel * lum), 255)
    ).toString(16);
    rgb += `00${brightened}`.slice(brightened.length);
  }
  return rgb;
};
