import React from 'react';
import {useCurrentFrame} from 'remotion';
import {V5_FONTS} from '../fonts';
import {rgba} from '../theme';
import {enter, drawOn} from '../motion';
import {V5FuriganaText, BnText} from './text';

// ============================================================================
// GRAMMAR TRACK components (SPEC-grammar). The rule scene keeps 接続
// (what attaches BEFORE the form) and 活用 (how the form itself changes)
// as SEPARATE charts — never merged into one generic table.
// GRAMMAR SAFEGUARD: charts render exactly the connection data the lesson
// carries (noun+の, verb plain form, い形 as-is, な形 stem, noun+である…).
// A category that does not apply is shown as a labelled non-applicable row
// or omitted by the data — the component never invents an attachment rule.
// ============================================================================

// One connection row: category label · input example (its ending/stem
// highlighted) · arrow · target form · combined result.
export const V5ConnectionChart = ({theme, rows, enterAt = 24}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 13}}>
      {rows.map((row, i) => {
        const at = enterAt + i * 6;
        if (row.applicable === false) {
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: 0.62, ...enter(frame, at, 10, 8)}}>
              <span style={{width: 128, flexShrink: 0, fontFamily: V5_FONTS.jp, fontWeight: 700, fontSize: 23, color: theme.mutedInk}}>{row.category}</span>
              <span style={{fontFamily: V5_FONTS.bn, fontWeight: 600, fontSize: 23, color: theme.mutedInk, border: `2px dashed ${theme.mutedInk}`, borderRadius: 10, padding: '7px 14px'}}>
                {row.naLabel || 'এই pattern-এ লাগে না'}
              </span>
            </div>
          );
        }
        const arrowP = drawOn(frame, at + 6, 8);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 13, ...enter(frame, at, 10, 10)}}>
            <span style={{width: 128, flexShrink: 0, fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 24, color: theme.ink}}>
              {row.category}
            </span>
            <span style={{background: theme.surfaceAlt, border: `2px solid ${theme.surfaceLine}`, borderRadius: 11, padding: '8px 13px', display: 'inline-flex'}}>
              <V5FuriganaText
                segments={row.inputSegs}
                states={row.inputSegs.map((s) => (s.hot ? 'current' : null))}
                theme={theme} size={27} furiganaSize={15}
                collapseEmptyRuby
              />
            </span>
            <svg width="46" height="20" style={{flexShrink: 0}}>
              <line x1="2" y1="10" x2={2 + 38 * arrowP} y2="10" stroke={theme.accent} strokeWidth="4" strokeLinecap="round" />
              {arrowP > 0.85 && <path d="M36 3 L45 10 L36 17 Z" fill={theme.accent} />}
            </svg>
            <span style={{background: theme.accent, color: theme.onAccent, borderRadius: 11, padding: '9px 14px', fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 25, whiteSpace: 'nowrap'}}>
              {row.target}
            </span>
            <span style={{fontFamily: V5_FONTS.jp, fontWeight: 700, fontSize: 24, color: theme.mutedInk, whiteSpace: 'nowrap'}}>
              = {row.result}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// 活用 chart: the form's OWN variants (base + the changed forms that
// actually apply to this pattern — nothing invented).
export const V5ConjugationChart = ({theme, title, forms, enterAt = 30}) => {
  const frame = useCurrentFrame();
  return (
    <div>
      <div style={{fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 25, color: theme.ink, ...enter(frame, enterAt, 10, 8)}}>
        {title}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 11, marginTop: 15}}>
        {forms.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 15,
              background: f.main ? rgba(theme.current, 0.16) : theme.surfaceAlt,
              border: `2px solid ${f.main ? theme.current : theme.surfaceLine}`,
              borderRadius: 13, padding: '11px 17px',
              ...enter(frame, enterAt + 6 + i * 6, 10, 10),
            }}
          >
            <span style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 21.5, color: theme.mutedInk, width: 118, flexShrink: 0}}>{f.labelBn}</span>
            <V5FuriganaText segments={f.segs} theme={theme} size={29} furiganaSize={16} weight={900} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Student character — the recurring classroom device (grammar spec §4):
// simple silhouette, ≤2 clothing colours + outline, 3 expressions
// (confused / confident / embarrassed). A visual device, not a narrator.
export const V5StudentCharacter = ({theme, height = 245, expression = 'confused', style}) => {
  const width = Math.round(height * (300 / 340));
  const brow = expression === 'confused'
    ? <><path d="M118,86 L140,92" stroke="#26323D" strokeWidth="5" strokeLinecap="round" /><path d="M182,92 L204,86" stroke="#26323D" strokeWidth="5" strokeLinecap="round" /></>
    : expression === 'confident'
      ? <><path d="M118,88 Q129,84 140,88" fill="none" stroke="#26323D" strokeWidth="5" strokeLinecap="round" /><path d="M182,88 Q193,84 204,88" fill="none" stroke="#26323D" strokeWidth="5" strokeLinecap="round" /></>
      : <><path d="M118,90 Q129,94 140,90" fill="none" stroke="#26323D" strokeWidth="5" strokeLinecap="round" /><path d="M182,90 Q193,94 204,90" fill="none" stroke="#26323D" strokeWidth="5" strokeLinecap="round" /></>;
  const mouth = expression === 'confused'
    ? <path d="M148,128 Q161,121 174,128" fill="none" stroke="#26323D" strokeWidth="4.5" strokeLinecap="round" />
    : expression === 'confident'
      ? <path d="M147,124 Q161,135 175,124" fill="none" stroke="#26323D" strokeWidth="4.5" strokeLinecap="round" />
      : <path d="M150,127 Q161,124 172,127" fill="none" stroke="#26323D" strokeWidth="4.5" strokeLinecap="round" />;
  return (
    <svg viewBox="0 0 300 340" width={width} height={height} style={style}>
      <ellipse cx="150" cy="322" rx="86" ry="10" fill="rgba(0,0,0,0.28)" />
      <path d="M96,196 L204,196 L216,318 L84,318 Z" fill={theme.current} stroke="#26323D" strokeWidth="4" />
      <path d="M128,196 L172,196 L164,232 L136,232 Z" fill={theme.surface} stroke="#26323D" strokeWidth="3.5" />
      <circle cx="150" cy="112" r="62" fill="#D9A066" stroke="#26323D" strokeWidth="4" />
      <path d="M88,110 C84,58 108,44 150,44 C192,44 216,58 212,110 C206,80 192,70 178,68 C164,74 136,74 122,68 C106,70 94,82 88,110 Z" fill="#26323D" />
      <circle cx="129" cy="110" r="6.5" fill="#26323D" /><circle cx="193" cy="110" r="6.5" fill="#26323D" />
      {brow}{mouth}
      {expression === 'confused' && (
        <text x="228" y="66" fontFamily={V5_FONTS.en} fontWeight="800" fontSize="40" fill={theme.accent}>?</text>
      )}
      {expression === 'embarrassed' && (
        <><ellipse cx="112" cy="122" rx="11" ry="6" fill="#E88" opacity="0.55" /><ellipse cx="210" cy="122" rx="11" ry="6" fill="#E88" opacity="0.55" /></>
      )}
    </svg>
  );
};

// Speech bubble — max ONE active at a time; Bangla 27–31px; entrance 8–12f;
// max on-screen duration 90f unless the spoken line runs longer (spec §4).
export const V5SpeechBubble = ({theme, children, enterAt = 0, exitAt = null, tailSide = 'left', style}) => {
  const frame = useCurrentFrame();
  if (frame < enterAt) return null;
  if (exitAt != null && frame >= exitAt) return null;
  return (
    <div
      style={{
        position: 'relative', background: theme.surface, borderRadius: 20, padding: '18px 22px',
        border: `2px solid ${theme.surfaceLine}`, boxShadow: theme.shadowSoft, maxWidth: 580,
        ...enter(frame, enterAt, 10, 12),
        ...style,
      }}
    >
      <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 28, color: theme.ink, lineHeight: 1.35}}>
        {children}
      </div>
      <div
        style={{
          position: 'absolute', bottom: -11, [tailSide]: 44, width: 22, height: 22,
          background: theme.surface, borderRight: `2px solid ${theme.surfaceLine}`,
          borderBottom: `2px solid ${theme.surfaceLine}`, transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
};

// Reaction stamp — ভুল! / আবার ভাবো! / এই যে সমস্যা! — shows 12–18f then
// fades (grammar spec §4). Jokes never replace the rule explanation.
export const V5ReactionStamp = ({theme, text, at, duration = 16, style}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + duration + 6) return null;
  const fade = frame > at + duration ? 1 - (frame - at - duration) / 6 : 1;
  return (
    <div
      style={{
        display: 'inline-block', transform: 'rotate(-7deg)', opacity: fade,
        border: `4px solid ${theme.error}`, color: theme.error, borderRadius: 10,
        padding: '6px 18px', fontFamily: V5_FONTS.bn, fontWeight: 900, fontSize: 33,
        background: rgba(theme.surface, 0.9),
        ...style,
      }}
    >
      {text}
    </div>
  );
};
