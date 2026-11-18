import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {V5FuriganaText, BnText} from '../../src/components/text';
import {V5_FONTS} from '../../src/fonts';
import {rgba} from '../../src/theme';
import {enter, popAt} from '../../src/motion';

export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
export const AMBER = '#F2A93B';
export const INDIGO = '#1D2450';

// ============================================================================
// V7 JOURNEY HUD (§V7.7) — constant identity across themes: deep navy strip,
// level nodes N5 ✓ · N4 ✓ · N3 (progress), current item label, and the slim
// progress hairline (Level-Up v3 HUD, §A7). Persistent chrome, all frames.
// ============================================================================
const HudNode = ({label, state, fill = 0}) => {
  const done = state === 'done';
  const current = state === 'current';
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderRadius: 999,
        border: `2px solid ${current ? AMBER : 'rgba(255,255,255,0.35)'}`,
        background: done ? 'rgba(62,207,111,0.16)' : current ? 'rgba(242,169,59,0.14)' : 'rgba(255,255,255,0.05)',
        color: '#F4F6FB', fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 19, letterSpacing: 1.5,
      }}
    >
      <span>{label}</span>
      {done && <span style={{color: '#3ECF6F', fontSize: 18}}>✓</span>}
      {current && (
        <span style={{display: 'flex', gap: 3}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} style={{width: 11, height: 11, borderRadius: 2, background: i / 5 < fill ? AMBER : 'rgba(255,255,255,0.25)'}} />
          ))}
        </span>
      )}
    </div>
  );
};

export const JourneyHUD = ({itemLabel, n3Fill = 0.45}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const prog = Math.min(1, frame / Math.max(1, durationInFrames - 1));
  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 66, background: 'rgba(12,18,36,0.95)', zIndex: 90, boxShadow: '0 3px 16px rgba(0,0,0,0.35)'}}>
      <div style={{position: 'absolute', left: 34, top: 0, height: 62, display: 'flex', alignItems: 'center', gap: 10}}>
        <HudNode label="N5" state="done" />
        <div style={{width: 30, height: 2, background: 'rgba(255,255,255,0.35)'}} />
        <HudNode label="N4" state="done" />
        <div style={{width: 30, height: 2, background: 'rgba(255,255,255,0.35)'}} />
        <HudNode label="N3" state="current" fill={n3Fill} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 62, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none'}}>
        <span style={{fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 21, letterSpacing: 3, color: '#F4F6FB'}}>{itemLabel}</span>
      </div>
      <div style={{position: 'absolute', right: 34, top: 0, height: 62, display: 'flex', alignItems: 'center'}}>
        <span style={{fontFamily: V5_FONTS.display, fontWeight: 700, fontSize: 15, letterSpacing: 2, color: 'rgba(244,246,251,0.62)'}}>NIHONGO BY NIAZ SENSEI · V7</span>
      </div>
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 4, width: '100%', background: 'rgba(255,255,255,0.13)'}}>
        <div style={{height: '100%', width: `${prog * 100}%`, background: AMBER}} />
      </div>
    </div>
  );
};

// ============================================================================
// V7 RECALL CARD (§V7.4) — constant v7 identity: deep indigo, amber provenance
// chip, MEMORY tab. Carries the OLD item + where it was learned (Bridge data).
// goneAt: the card files away toward the HUD (shrinks up + fades).
// ============================================================================
export const RecallCard = ({theme, at, goneAt = -1, x, y, width = 440, glyphSegs, glyphSize = 118, provenance, subSegs, subBn}) => {
  const frame = useCurrentFrame();
  let wrap = {...enter(frame, at, 14, 20), transform: `${enter(frame, at, 14, 20).transform} rotate(-1.6deg)`};
  if (goneAt >= 0 && frame > goneAt) {
    const p = interpolate(frame, [goneAt, goneAt + 16], [0, 1], CL);
    wrap = {opacity: 1 - p, transform: `translateY(${-p * 190}px) scale(${1 - p * 0.55}) rotate(-1.6deg)`};
  }
  return (
    <div style={{position: 'absolute', left: x, top: y, width, ...wrap, zIndex: 30}}>
      <div
        style={{
          background: 'linear-gradient(155deg, #273069 0%, #171D42 78%)',
          border: `2px solid ${rgba(AMBER, 0.65)}`, borderRadius: 26,
          boxShadow: '0 24px 48px rgba(8,10,30,0.45), inset 0 2px 0 rgba(255,255,255,0.18)',
          padding: '20px 26px 24px', position: 'relative',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{background: AMBER, color: '#23180A', fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 15, letterSpacing: 1.6, padding: '5px 12px', borderRadius: 7}}>
            MEMORY · স্মৃতি
          </div>
          <div style={{border: `1.5px solid ${rgba(AMBER, 0.8)}`, color: '#FFD98A', fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 15, letterSpacing: 1.2, padding: '4px 11px', borderRadius: 7}}>
            {provenance}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
          <V5FuriganaText segments={glyphSegs} theme={theme} size={glyphSize} furiganaSize={Math.round(glyphSize * 0.34)} weight={900} color="#FFFFFF" furiganaColor="#FFD98A" align="center" />
        </div>
        {(subSegs || subBn) && (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 14, marginTop: 10}}>
            {subSegs && <V5FuriganaText segments={subSegs} theme={theme} size={40} furiganaSize={19} weight={700} color="#E8EBFF" furiganaColor="#B9C2F2" />}
            {subBn && <BnText theme={theme} size={25} weight={700} color="#C9D2FF">{subBn}</BnText>}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// KANJI TILE — one kanji per card, provenance/status chip below the glyph.
// state: 'old' (success ring) · 'new' (accent ring) · 'empty' (dashed ghost)
// ============================================================================
export const KanjiTile = ({theme, x, y, size = 300, glyph, ruby, chip, chipKind = 'old', dashed = false, glow = 0, ringAt = -1, style}) => {
  const frame = useCurrentFrame();
  const ringP = ringAt >= 0 ? interpolate(frame, [ringAt, ringAt + 20], [0, 1], CL) : 0;
  const chipBg = chipKind === 'old' ? theme.success : chipKind === 'new' ? theme.accent : theme.current;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: size, height: size, ...style}}>
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: 30,
          background: dashed ? rgba(theme.surface, 0.25) : theme.surface,
          border: dashed ? `3px dashed ${rgba(theme.current, 0.75)}` : `3px solid ${chipKind === 'new' ? theme.accent : rgba(theme.success, 0.55)}`,
          boxShadow: glow > 0 ? `0 0 ${30 + glow * 55}px ${rgba(theme.current, 0.25 + glow * 0.5)}, ${theme.shadow}` : theme.shadow,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {ringAt >= 0 && ringP > 0 && ringP < 1 && (
          <div style={{position: 'absolute', inset: -10, borderRadius: 36, border: `4px solid ${rgba('#FFC53D', 1 - ringP)}`, transform: `scale(${1 + ringP * 0.13})`, pointerEvents: 'none'}} />
        )}
        {glyph ? (
          <>
            <div style={{fontFamily: V5_FONTS.jp, fontSize: 30, fontWeight: 600, color: theme.accent, height: 36, lineHeight: 1}}>{ruby}</div>
            <div style={{fontFamily: V5_FONTS.jp, fontSize: 168, fontWeight: 900, color: theme.ink, lineHeight: 1.05}}>{glyph}</div>
            <div style={{marginTop: 10, background: chipBg, color: chipKind === 'old' ? theme.onSuccess : chipKind === 'new' ? theme.onAccent : theme.onCurrent, fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 16.5, letterSpacing: 1.4, padding: '5px 13px', borderRadius: 7}}>
              {chip}
            </div>
          </>
        ) : (
          <div style={{fontFamily: V5_FONTS.jp, fontSize: 150, fontWeight: 900, color: rgba(theme.current, 0.5 + glow * 0.4), lineHeight: 1}}>?</div>
        )}
      </div>
    </div>
  );
};

// Karaoke sweep (§A12 item 7) — progress bar under the voiced card.
export const KaraokeSweep = ({theme, x, y, width, start, end}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, end], [0, 1], CL);
  if (frame < start - 6 || frame > end + 10) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y, width, height: 7, borderRadius: 4, background: rgba(theme.onBase, 0.16), zIndex: 25}}>
      <div style={{height: '100%', borderRadius: 4, background: theme.accent, transform: `scaleX(${p})`, transformOrigin: 'left center'}} />
      <div style={{position: 'absolute', top: -4, left: `calc(${p * 100}% - 7px)`, width: 15, height: 15, borderRadius: '50%', background: theme.accent, boxShadow: `0 0 14px ${rgba(theme.accent, 0.8)}`}} />
    </div>
  );
};

// Bottom-left Bangla caption pill — shows the currently spoken Bangla line.
export const Captions = ({theme, lines}) => {
  const frame = useCurrentFrame();
  const active = lines.find((l) => frame >= l.from && frame <= l.to);
  if (!active) return null;
  const fade = Math.min(
    interpolate(frame, [active.from, active.from + 6], [0, 1], CL),
    interpolate(frame, [active.to - 6, active.to], [1, 0], CL)
  );
  return (
    <div style={{position: 'absolute', left: 56, bottom: 40, maxWidth: 1130, zIndex: 60, opacity: fade}}>
      <div style={{background: 'rgba(12,16,28,0.82)', borderRadius: 14, padding: '13px 22px', boxShadow: '0 10px 26px rgba(0,0,0,0.30)'}}>
        <BnText theme={theme} size={30} weight={700} color="#F5F2EA">{active.text}</BnText>
      </div>
    </div>
  );
};

// Chain-map node chip (§V7.6) — pops in at `at`, provenance sub-line under.
export const ChainNode = ({theme, at, glyph, segs, label, sub, big = false, accentBorder = false}) => {
  const frame = useCurrentFrame();
  const s = popAt(frame, at, 1.06, 12);
  const o = interpolate(frame, [at, at + 7], [0, 1], CL);
  return (
    <div style={{opacity: o, transform: `scale(${s})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, flexShrink: 0}}>
      <div
        style={{
          background: theme.surface, borderRadius: 20, padding: big ? '16px 30px 12px' : '10px 22px 7px',
          border: `3px solid ${accentBorder ? theme.accent : rgba(theme.ink, 0.16)}`,
          boxShadow: theme.shadow,
          display: 'flex', justifyContent: 'center',
        }}
      >
        {segs ? (
          <V5FuriganaText segments={segs} theme={theme} size={big ? 74 : 46} furiganaSize={big ? 26 : 19} weight={900} align="center" />
        ) : (
          <span style={{fontFamily: V5_FONTS.jp, fontSize: big ? 74 : 46, fontWeight: 900, color: theme.ink, lineHeight: 1.1}}>{glyph || label}</span>
        )}
      </div>
      <div style={{fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 15.5, letterSpacing: 1.4, color: theme.onBase, background: rgba(theme.base, 0.0), textShadow: '0 1px 8px rgba(0,0,0,0.25)'}}>
        <span style={{background: 'rgba(12,18,36,0.78)', color: '#F4F6FB', padding: '4px 11px', borderRadius: 6}}>{sub}</span>
      </div>
    </div>
  );
};

export const ChainJoin = ({theme, at, symbol = '+', width = 58}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], CL);
  const s = popAt(frame, at, 1.3, 10);
  return (
    <div style={{width, height: 138, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
      <div style={{fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 42, color: theme.accent, opacity: o, transform: `scale(${s})`, lineHeight: 1}}>{symbol}</div>
    </div>
  );
};

// Chain-map grounding panel (§V7.6) — header chip + the node row on a card.
export const ChainPanel = ({theme, at, header, children}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: '50%', top: 318, transform: 'translateX(-50%)', zIndex: 28}}>
      <div
        style={{
          background: theme.surface, borderRadius: 30, padding: '24px 42px 30px',
          border: `2px solid ${rgba(theme.accent, 0.4)}`, boxShadow: theme.shadow,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          ...enter(frame, at, 13, 16),
        }}
      >
        <div style={{background: theme.accent, color: theme.onAccent, fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 16.5, letterSpacing: 2.2, padding: '6px 16px', borderRadius: 8}}>
          {header}
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start'}}>{children}</div>
      </div>
    </div>
  );
};
