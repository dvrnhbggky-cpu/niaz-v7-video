import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {V5_FONTS} from '../fonts';

// ============================================================================
// V5CrossRef — CROSS-TRACK REMINDER CALLOUT (Niaz's standing rule
// 2026-11-13; identity per SPEC-part-core-teaching §8).
// When a lesson hits an important kanji / grammar point / word that belongs
// to another track, a designed reminder surfaces at that moment. It is a
// REAL teacher connection, not a footnote, and never decoration.
//
// IDENTITY IS CONSTANT across themes: dark navy panel, teal accent,
// radius 20. Reserved zone 760×176; position flexible ((90,150) or
// (1070,150) by default) — it must NEVER obscure the current target.
// Timeline: entrance 8f (slide 36px + fade + scale .96→1) · contents
// stagger 6f · hold 75–105f · exit 10f (fade + slide 18px).
// Naming rule: REAL track name + ACTUAL lesson identifier, verified
// against the approved lesson index — if a reference cannot be verified,
// show the track name only; NEVER fabricate a lesson/word/kanji number.
// Frequency caps per lesson: vocab ≤6 (rec. 3–5) · kanji ≤3 · grammar ≤3.
// Multiple connections on one item group into ONE callout (max 2 refs).
//
// DATA: rendered ONLY from a data crossRef field:
//   {track: 'kanji'|'grammar'|'vocab', label: string, lessonRef?: string}
// ============================================================================

export const CROSSREF_STYLE = {
  bg: '#14273D',
  border: '#1F4258',
  accent: '#1E8C82',
  ink: '#F2F7FA',
  sub: '#B9CCDA',
  w: 760,
  h: 176,
};

const TRACK_META = {
  kanji: {tile: '字', name: 'KANJI TRACK'},
  grammar: {tile: '文', name: 'GRAMMAR TRACK'},
  vocab: {tile: '語', name: 'VOCABULARY TRACK'},
};

export const V5CrossRef = ({crossRef, enterAt = 0, exitAt = null, style}) => {
  const frame = useCurrentFrame();
  if (!crossRef || frame < enterAt) return null;
  if (exitAt != null && frame >= exitAt) return null;
  const meta = TRACK_META[crossRef.track] || TRACK_META.vocab;
  const S = CROSSREF_STYLE;
  const exitP = exitAt != null ? interpolate(frame, [exitAt - 10, exitAt], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const inP = interpolate(frame, [enterAt, enterAt + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const contentP = interpolate(frame, [enterAt + 9, enterAt + 17], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        width: S.w, maxWidth: '100%', minHeight: 132, boxSizing: 'border-box',
        background: S.bg, border: `2px solid ${S.border}`, borderLeft: `8px solid ${S.accent}`,
        borderRadius: 20, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'flex-start',
        boxShadow: '0 12px 32px rgba(10,20,35,0.35)',
        opacity: inP * (1 - exitP),
        transform: `translateX(${36 * (1 - inP) - 18 * exitP}px) scale(${0.96 + 0.04 * inP})`,
        ...style,
      }}
    >
      <div
        style={{
          width: 64, height: 64, flexShrink: 0, borderRadius: 14, background: S.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 34, color: '#FFFFFF',
        }}
      >
        {meta.tile}
      </div>
      <div style={{opacity: contentP, transform: `translateY(${8 * (1 - contentP)}px)`}}>
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 17, letterSpacing: 2.2, color: S.accent}}>
          CROSS-TRACK CONNECTION · {meta.name}
        </div>
        {crossRef.lessonRef && (
          <div style={{fontFamily: V5_FONTS.en, fontWeight: 700, fontSize: 24, color: S.ink, marginTop: 5}}>
            {crossRef.lessonRef}
          </div>
        )}
        <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 24.5, color: S.ink, lineHeight: 1.4, marginTop: 6}}>
          {crossRef.label}
        </div>
      </div>
    </div>
  );
};

// Small marker dot for a grid/summary cell whose entry carries a crossRef —
// the full callout is scheduled by the scene; the dot keeps the connection
// visible on the cell itself (drawn in the callout's teal identity).
export const V5CrossRefDot = ({crossRef, style}) => {
  if (!crossRef) return null;
  return (
    <div
      style={{
        position: 'absolute', top: 12, right: 12, width: 16, height: 16, borderRadius: '50%',
        background: CROSSREF_STYLE.accent, border: '2.5px solid #FFFFFF',
        boxShadow: '0 2px 6px rgba(10,20,35,0.35)',
        ...style,
      }}
    />
  );
};
