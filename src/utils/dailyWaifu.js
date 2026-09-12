/**
 * Deterministically picks one entry from `list` for the current UTC calendar
 * day, so every user sees the same "Waifu del Día" regardless of local
 * timezone or how many times the page reloads on the same day.
 *
 * The pick advances by exactly 1 index at every UTC midnight boundary
 * (00:00:00.000Z) and cycles back to the start once every entry has been
 * featured, via `epochDay % list.length`.
 *
 * @param {Array<object>} list - Source list to pick from (e.g. `red_waifus.json`).
 * @param {number} [now=Date.now()] - UTC milliseconds since epoch. Injectable
 *   for deterministic testing without mocking the system clock.
 * @returns {object|null} The featured entry, or `null` when `list` is empty
 *   or not an array.
 */
export function getWaifuOfTheDay(list, now = Date.now()) {
  if (!Array.isArray(list) || list.length === 0) return null;

  const epochDay = Math.floor(now / 86_400_000);
  const index = epochDay % list.length;

  return list[index];
}
