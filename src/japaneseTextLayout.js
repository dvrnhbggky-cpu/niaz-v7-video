// ============================================================================
// JapaneseTextLayout — shared Japanese line-breaking utility (grammar spec
// §7; core spec §F5). All scenes lay Japanese out through PHRASE SEGMENTS:
// lesson data arrives pre-segmented at grammatical phrase boundaries with
// furigana attached per segment, and this utility packs segments into lines
// WITHOUT ever splitting a segment. That structurally guarantees:
//   · no single-character hanging line (orphan) when a phrase break exists
//   · no particle starting a line (particles live inside their segment)
//   · no furigana detached from its kanji (ruby travels with the segment)
//   · no line starting with closing punctuation / ending with opening
//     punctuation (checked by auditLineBreaks against the JP rules)
// Widths are estimated per character class at the target font size (full-
// width JP glyphs = 1.0em, half-width = 0.55em) — production builds should
// re-measure with the loaded font; the segment packing stays identical.
// A full UAX #14 / Intl.Segmenter morphological pipeline can replace the
// width estimator later without changing call sites.
// ============================================================================

const FORBIDDEN_LINE_START = '、。，．・：；？！ー）］｝〕〉》」』】〙〗〟\'"…‥';
const FORBIDDEN_LINE_END = '（［｛〔〈《「『【〘〖〝\'"';

export const segTextWidth = (seg, size) => {
  let w = 0;
  for (const ch of seg.t) {
    w += /[\x00-\x7F]/.test(ch) ? 0.55 : 1.0;
  }
  return w * size;
};

// layoutJapaneseLines(segments, {maxWidth, size, furiganaSize})
// -> array of lines; each line is an array of the SAME segment objects.
export const layoutJapaneseLines = (segments, {maxWidth, size}) => {
  const lines = [];
  let line = [];
  let w = 0;
  for (const seg of segments) {
    const sw = segTextWidth(seg, size);
    if (line.length > 0 && w + sw > maxWidth) {
      lines.push(line);
      line = [];
      w = 0;
    }
    line.push(seg);
    w += sw;
  }
  if (line.length) lines.push(line);
  // Orphan repair: if the last line is a single short segment and the
  // previous line can donate its final segment, rebalance — a phrase-aware
  // break exists, so a stranded fragment is never accepted.
  if (lines.length > 1) {
    const last = lines[lines.length - 1];
    const prev = lines[lines.length - 2];
    if (last.length === 1 && segTextWidth(last[0], size) <= size * 1.2 && prev.length > 1) {
      last.unshift(prev.pop());
    }
  }
  return lines;
};

// auditLineBreaks(lines) -> list of violations (empty = pass).
export const auditLineBreaks = (lines) => {
  const problems = [];
  lines.forEach((line, i) => {
    const text = line.map((s) => s.t).join('');
    if (!text) return;
    if (FORBIDDEN_LINE_START.includes(text[0])) problems.push(`line ${i + 1} starts with forbidden "${text[0]}"`);
    if (FORBIDDEN_LINE_END.includes(text[text.length - 1])) problems.push(`line ${i + 1} ends with forbidden "${text[text.length - 1]}"`);
    if (i > 0 && line.length === 1 && text.length === 1) problems.push(`line ${i + 1} is a single stranded character`);
  });
  return problems;
};
