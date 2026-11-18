import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {V5_FONTS} from '../fonts';
import {V5_TYPE, V5_SAFE, rgba} from '../theme';
import {enter, fadeIn, V5_MOTION} from '../motion';

// ============================================================================
// V5 CHROME — background, brand, headers, HUD furniture (spec §B4, §E).
// HUD labels NEVER clip or wrap uncontrollably (spec §E6): chips size to
// their content with the overflow protocol widen → padding → font floor.
// ============================================================================

// V5Background — themed base with restrained depth: layered gradient, fine
// paper grain (SVG noise at low opacity), low-opacity Japanese line motif
// and a soft radial light. Texture stays at 3–7% and never hurts contrast.
export const V5Background = ({theme, motif = 'ア', children}) => {
  const frame = useCurrentFrame();
  const o = fadeIn(frame, 0, 8);
  return (
    <div style={{position: 'absolute', inset: 0, background: theme.base, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute', inset: 0, opacity: o,
          background: `radial-gradient(1100px 620px at 78% 18%, ${rgba(theme.onBase, 0.10)}, transparent 65%), linear-gradient(160deg, ${rgba(theme.onBase, 0.05)}, transparent 55%)`,
        }}
      />
      <svg style={{position: 'absolute', inset: 0, opacity: 0.05}} width="1920" height="1080">
        <filter id="v5grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /></filter>
        <rect width="1920" height="1080" filter="url(#v5grain)" opacity="0.55" />
      </svg>
      <div
        style={{
          position: 'absolute', right: -30, bottom: -120, fontFamily: V5_FONTS.jp, fontWeight: 900,
          fontSize: 560, color: theme.textureInk, lineHeight: 1, userSelect: 'none',
        }}
      >
        {motif}
      </div>
      <div
        style={{
          position: 'absolute', left: 0, right: 0, top: 150,
          borderTop: `2px solid ${theme.textureInk}`, borderBottom: `2px solid ${theme.textureInk}`,
          height: 5, opacity: 0.6,
        }}
      />
      {children}
    </div>
  );
};

// V5BrandLockup — the programme identity (spec §F3): bold condensed display
// face, weight 800, tight spacing. "BY" carries the accent.
export const V5BrandLockup = ({theme, size = 44, sub, style}) => (
  <div style={{...style}}>
    <div
      style={{
        fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: size,
        letterSpacing: 0.5, color: theme.onBase, lineHeight: 1.02, whiteSpace: 'nowrap',
      }}
    >
      NIHONGO <span style={{color: theme.accent}}>BY</span> NIAZ SENSEI
    </div>
    {sub && (
      <div style={{fontFamily: V5_FONTS.en, fontWeight: 600, fontSize: Math.round(size * 0.36), letterSpacing: 3.2, color: theme.mutedOnBase, marginTop: 5, whiteSpace: 'nowrap'}}>
        {sub}
      </div>
    )}
  </div>
);

// Section chip — sizes to content; NEVER wraps (spec §E6 overflow protocol).
export const V5Chip = ({theme, children, tone = 'accent', style}) => {
  const bg = tone === 'accent' ? theme.accent : tone === 'success' ? theme.success : tone === 'current' ? theme.current : theme.surfaceAlt;
  const fg = tone === 'current' ? theme.onCurrent : tone === 'accent' ? theme.onAccent : tone === 'success' ? theme.onSuccess : theme.ink;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
        maxWidth: 260, minHeight: 38, padding: '9px 16px', borderRadius: theme.radius.chip,
        background: bg, color: fg, fontFamily: V5_FONTS.jp, fontWeight: 700, fontSize: 20,
        boxShadow: theme.shadowSoft, ...style,
      }}
    >
      {children}
    </span>
  );
};

// V5SectionHeader — section chip + bilingual section title row.
export const V5SectionHeader = ({theme, chip, titleBn, titleJp, startAt = 3}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, ...enter(frame, startAt, 10, 10)}}>
      <V5Chip theme={theme}>{chip}</V5Chip>
      <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 30, color: theme.onBase, whiteSpace: 'nowrap'}}>{titleBn}</div>
      {titleJp && (
        <div style={{fontFamily: V5_FONTS.jp, fontWeight: 700, fontSize: 24, color: theme.mutedOnBase, whiteSpace: 'nowrap'}}>{titleJp}</div>
      )}
    </div>
  );
};

// V5ProgressHUD — top furniture (spec §E2–E3): brand (subordinate, left),
// lesson id + section chip (centre/right), segmented section progress.
// Progress reflects COMPLETED SECTIONS, not elapsed time.
export const V5ProgressHUD = ({theme, lessonId, sections, activeSection, sectionChip}) => {
  const done = sections.filter((s) => s.state === 'done').length;
  return (
    <div
      style={{
        position: 'absolute', left: V5_SAFE.left, right: V5_SAFE.right, top: 30,
        display: 'flex', alignItems: 'center', gap: 22, height: 68,
      }}
    >
      <V5BrandLockup theme={theme} size={27} />
      <div style={{fontFamily: V5_FONTS.en, fontWeight: 600, fontSize: 18, letterSpacing: 1.6, color: theme.mutedOnBase, whiteSpace: 'nowrap'}}>
        {lessonId}
      </div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
        {sections.map((s, i) => (
          <div
            key={i}
            title={s.label}
            style={{
              width: 44, height: 10, borderRadius: 5,
              background: s.state === 'done' ? theme.success : s.state === 'active' ? theme.current : rgba(theme.onBase, 0.22),
            }}
          />
        ))}
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 19, color: theme.onBase, marginLeft: 8, whiteSpace: 'nowrap'}}>
          {String(done + (activeSection != null ? 1 : 0)).padStart(2, '0')}/{String(sections.length).padStart(2, '0')}
        </div>
      </div>
      {sectionChip && <V5Chip theme={theme} tone="accent">{sectionChip}</V5Chip>}
    </div>
  );
};

// V5QuestionTracker — "QUESTION 03/10" + state circles (spec §E4):
// completed = success ✓, active = current, upcoming = muted. Real counts
// only — never invented scores.
export const V5QuestionTracker = ({theme, total, current, completedCount}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 21, letterSpacing: 1.2, color: theme.onBase, whiteSpace: 'nowrap'}}>
      QUESTION {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
    </div>
    <div style={{display: 'flex', gap: 7}}>
      {Array.from({length: total}).map((_, i) => {
        const n = i + 1;
        const state = n <= completedCount ? 'done' : n === current ? 'active' : 'todo';
        return (
          <div
            key={n}
            style={{
              width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 14,
              background: state === 'done' ? theme.success : state === 'active' ? theme.current : 'transparent',
              color: state === 'todo' ? theme.mutedOnBase : state === 'active' ? theme.ink : theme.onSuccess,
              border: `2px solid ${state === 'todo' ? rgba(theme.onBase, 0.35) : 'transparent'}`,
            }}
          >
            {state === 'done' ? '✓' : n}
          </div>
        );
      })}
    </div>
  </div>
);

// V5KanjiStrip — kanji-lesson index strip. Two variants:
//  · 'core' (V5.0 §E5): compact 50px cells.
//  · 'track' (SPEC-kanji §3, governs for kanji lessons): (64,38) 1792×90
//    strip, cells 210×90, index 17px, glyph 42px, status dot 12px.
// States: current (filled accent + bright glyph + animated underline) ·
// completed (success tint + check) · upcoming (transparent + outline) ·
// hidden (index visible, glyph concealed — not yet revealed).
export const V5KanjiStrip = ({theme, items, style, variant = 'core'}) => {
  const frame = useCurrentFrame();
  if (variant === 'track') {
    return (
      <div style={{display: 'flex', gap: 12, alignItems: 'stretch', ...style}}>
        {items.map((it, i) => (
          <div
            key={i}
            style={{
              width: 210, height: 90, borderRadius: 14, position: 'relative', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: it.state === 'current' ? theme.accent : it.state === 'done' ? rgba(theme.success, 0.18) : 'transparent',
              border: `2px solid ${it.state === 'current' ? theme.accent : it.state === 'done' ? theme.success : rgba(theme.onBase, 0.3)}`,
            }}
          >
            <span style={{position: 'absolute', left: 12, top: 8, fontFamily: V5_FONTS.en, fontWeight: 700, fontSize: 17, color: it.state === 'current' ? theme.onAccent : theme.mutedOnBase}}>
              {String(it.index || i + 1).padStart(2, '0')}
            </span>
            <span style={{fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 42, color: it.state === 'current' ? theme.onAccent : it.state === 'hidden' ? 'transparent' : theme.onBase, opacity: it.state === 'upcoming' ? 0.55 : 1}}>
              {it.glyph}
            </span>
            <span
              style={{
                position: 'absolute', right: 12, top: 10, width: 12, height: 12, borderRadius: '50%',
                background: it.state === 'done' ? theme.success : it.state === 'current' ? theme.onAccent : rgba(theme.onBase, 0.3),
              }}
            />
            {it.state === 'done' && (
              <span style={{position: 'absolute', right: 8, bottom: 6, color: theme.success, fontWeight: 800, fontSize: 17}}>✓</span>
            )}
            {it.state === 'current' && (
              <span style={{position: 'absolute', left: 14, right: 14, bottom: 7, height: 4, borderRadius: 2, background: theme.onAccent, transform: `scaleX(${interpolate(frame % 90, [0, 45, 90], [0.25, 1, 0.25])})`, transformOrigin: 'left'}} />
            )}
          </div>
        ))}
      </div>
    );
  }
  return (
  <div style={{display: 'flex', gap: 8, alignItems: 'center', ...style}}>
    {items.map((it, i) => (
      <div
        key={i}
        style={{
          width: 50, height: 62, borderRadius: 12, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: V5_FONTS.jp, fontWeight: 700, fontSize: 28,
          background: it.state === 'current' ? rgba(theme.accent, 0.16) : rgba(theme.onBase, 0.05),
          color: it.state === 'upcoming' ? theme.mutedOnBase : theme.onBase,
          border: it.state === 'current' ? `3px solid ${theme.accent}` : `2px solid ${rgba(theme.onBase, 0.14)}`,
        }}
      >
        {it.glyph}
        {it.state === 'done' && (
          <div style={{position: 'absolute', top: -7, right: -7, width: 19, height: 19, borderRadius: '50%', background: theme.success, color: theme.onSuccess, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800}}>
            ✓
          </div>
        )}
      </div>
    ))}
  </div>
  );
};

// V5HudTag — section-aware HUD counter (SPEC-vocab §08): single line,
// never wraps, max width 440, height 48, font 22. The text is an APPROVED
// SHORT LABEL only ("WORD 02/29", "PRACTICE · QUESTION 01/08") — never a
// full Japanese word (that caused the v4 PLATFORM wrap bug). The tag reads
// the scene's declared section state; one counter never serves two meanings.
export const V5HudTag = ({theme, text, style}) => (
  <div
    style={{
      display: 'inline-flex', alignItems: 'center', height: 48, maxWidth: 440,
      padding: '0 18px', borderRadius: 14, whiteSpace: 'nowrap',
      background: rgba(theme.onBase, 0.08), border: `2px solid ${rgba(theme.onBase, 0.18)}`,
      color: theme.onBase, fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 21, letterSpacing: 1.1,
      ...style,
    }}
  >
    {text}
  </div>
);

export {V5_MOTION};
