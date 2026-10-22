/**
 * Shortens text to at most `limit` characters without cutting a word in half,
 * adding an ellipsis. Text already within the limit is returned unchanged.
 */
export function truncateAtWord(text: string, limit: number): string {
  const clean = text.trim();
  if (clean.length <= limit) return clean;
  const slice = clean.slice(0, limit);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > limit * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[\s,.;:\-–—]+$/, '') + '…';
}
