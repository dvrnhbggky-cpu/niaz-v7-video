import React from 'react';
import {useCurrentFrame} from 'remotion';
import {V5_FONTS} from '../fonts';
import {V5_TYPE, rgba} from '../theme';

// ============================================================================
// V5FuriganaText — ruby-aware Japanese text (spec §F4–F5).
// Input is PHRASE SEGMENTS, never a raw string to be broken arbitrarily:
//   segments = [{t: '市役所', r: 'しやくしょ'}, {t: 'は'}, ...]
// Each segment renders as one unbreakable unit (inline-flex column: furigana
// centred above its own kanji, gap 2–4px, size 20–22px, weight 600). Wrapping
// can only happen BETWEEN segments — phrase boundaries chosen by the lesson
// data — so single-character hanging lines and split particles are
// structurally impossible.
// Optional per-segment karaoke state: 'unspoken' | 'current' | 'spoken'
// (furigana inherits its kanji's state, spec §A4).
// ============================================================================

export const rubySeg = (t, r) => ({t, r});
export const plainSeg = (t) => ({t});

export const V5FuriganaText = ({
  segments,
  theme,
  size = V5_TYPE.j1,
  furiganaSize = V5_TYPE.furigana,
  color,
  furiganaColor,
  weight = 700,
  states = null, // optional array parallel to segments
  align = 'left',
  lineGap = 10,
  style,
  // §V6.9 refinement (v2 polish): the ruby row is normally RESERVED even
  // for ruby-less segments so a phase change (gate reveal) never shifts
  // the layout. Lines that can never carry ruby (Latin connection-chart
  // inputs) pass collapseEmptyRuby so their glyphs sit optically centred
  // in their chips instead of sunk under a dead ruby row.
  collapseEmptyRuby = false,
}) => {
  const ink = color || theme.ink;
  const furiInk = furiganaColor || theme.mutedInk;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        columnGap: 2,
        rowGap: lineGap,
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        fontFamily: V5_FONTS.jp,
        ...style,
      }}
    >
      {segments.map((seg, i) => {
        const state = states ? states[i] : null;
        const segOpacity = state === 'unspoken' ? 0.4 : state === 'spoken' ? 0.78 : 1;
        const isCurrent = state === 'current';
        return (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: segOpacity,
              background: isCurrent ? rgba(theme.accent, 0.18) : 'transparent',
              boxShadow: isCurrent ? `inset 0 -4px 0 ${theme.accent}` : 'none',
              borderRadius: 6,
              padding: '0 2px',
              transition: 'none',
            }}
          >
            <span
              style={{
                fontSize: furiganaSize,
                lineHeight: 1.1,
                fontWeight: 600,
                color: isCurrent ? theme.accent : furiInk,
                height: seg.r ? furiganaSize * 1.15 : collapseEmptyRuby ? 0 : furiganaSize * 1.15,
                whiteSpace: 'nowrap',
              }}
            >
              {seg.r || ''}
            </span>
            <span
              style={{
                fontSize: size,
                lineHeight: 1.12,
                fontWeight: weight,
                color: isCurrent ? theme.accent : ink,
                whiteSpace: 'nowrap',
              }}
            >
              {seg.t}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// ============================================================================
// V5KaraokeText — karaoke highlighting driven by an AUDIO TIMESTAMP MAP
// (spec §A4, §H5). Each timed segment carries start/end in ABSOLUTE video
// frames, derived from the final narration's measured clip times — never
// estimated from text length. States:
//   unspoken 35–45% opacity · current 100% + accent bg 15–22% + 4px
//   underline · spoken 70–80%. Transitions 3–4f (frame-quantised here).
// Japanese speech highlights Japanese text; Bangla narration highlights
// Bangla text — the map decides, by linking each timed unit to its own
// screen segment (spec §H5).
// timed = [{segments: [...ruby segments...], startFrame, endFrame}]
// ============================================================================

export const karaokeStateAt = (frame, startFrame, endFrame) =>
  frame < startFrame ? 'unspoken' : frame <= endFrame ? 'current' : 'spoken';

export const V5KaraokeText = ({timed, theme, size, furiganaSize, weight, style}) => {
  const frame = useCurrentFrame();
  // Flatten: each timed unit contributes its ruby segments with one state.
  const segments = [];
  const states = [];
  timed.forEach((unit) => {
    const st = karaokeStateAt(frame, unit.startFrame, unit.endFrame);
    unit.segments.forEach((s) => {
      segments.push(s);
      states.push(st);
    });
  });
  return (
    <V5FuriganaText
      segments={segments}
      states={states}
      theme={theme}
      size={size}
      furiganaSize={furiganaSize}
      weight={weight}
      style={style}
    />
  );
};

// Plain trilingual text helpers --------------------------------------------

export const BnText = ({children, theme, size = V5_TYPE.b1, weight = 700, color, onBase = false, muted = false, style}) => (
  <div style={{fontFamily: V5_FONTS.bn, fontSize: size, fontWeight: weight, color: color || (onBase ? (muted ? theme.mutedOnBase : theme.onBase) : muted ? theme.mutedInk : theme.ink), lineHeight: 1.35, ...style}}>
    {children}
  </div>
);

export const EnText = ({children, theme, size = V5_TYPE.e1, weight = 600, color, onBase = false, muted = false, style}) => (
  <div style={{fontFamily: V5_FONTS.en, fontSize: size, fontWeight: weight, color: color || (onBase ? (muted ? theme.mutedOnBase : theme.onBase) : muted ? theme.mutedInk : theme.mutedInk), lineHeight: 1.3, ...style}}>
    {children}
  </div>
);
