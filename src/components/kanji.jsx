import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {V5_FONTS} from '../fonts';
import {rgba} from '../theme';
import {enter, fadeIn, V5_MOTION} from '../motion';
import {V5FuriganaText, BnText, EnText} from './text';
import {V5Illustration} from './icons';

// ============================================================================
// V5KanjiCard — TRACK-SPEC layout (SPEC-kanji §1; governs over V5.1 §3A —
// see SYSTEM.md conflict register). Frame geometry (1920×1080):
//   index strip (64,38) 1792×90 · main card (64,150) 1792×850 ·
//   Zone A glyph stage local (36,55) 520×500 · Zone B readings+memory
//   local (596,55) 620 wide · Zone C Sensei local (1256,35) 470×650.
// The component renders the full card; the scene passes `senseiNode` for
// Zone C and positions the card at (64,150).
//
// Stroke animation (SPEC-kanji §2): total draw time
//   Ds = clamp(38, 90, 78 − 2.1×(n−6)) frames for n strokes,
// distributed across strokes by path length (final stroke ×1.20). Current
// stroke = accent with glow; completed = ink; upcoming = 12% guide ghost.
// Radical strokes take the theme's "current" (amber/gold) identity with an
// 18% wash that fades in during the post-draw radical phase.
// Numbered start dots are visible from the card's first frame (KW2D4
// package brief / Kanji Card 4.1); the ACTIVE stroke's dot enlarges to the
// spec's 28px label during its draw (see conflict register in SYSTEM.md).
// KANJI_LAYOUT remains the single drop-in point for pixel adjustments.
// ============================================================================

export const KANJI_LAYOUT = {
  card: {w: 1792, h: 850, radius: 28},
  zoneA: {x: 36, y: 55, w: 520, h: 500},
  glyphScale: 0.86, // visible glyph ≈360px inside the 500px stage
  strokeWidth: 3.3, // KanjiVG units ≈15px at stage scale (spec range 12–19)
  strokeGlowWidth: 5.8,
  dotR: 2.7, dotFont: 3.4, activeDotR: 3.7, activeDotFont: 6.1,
  badge: {size: 104, numeral: 42, label: 17},
  zoneB: {x: 596, y: 55, w: 620},
  readingBox: {w: 275, h: 120, heading: 21, reading: 48, bangla: 23},
  hook: {h: 220, illustration: 150},
  practice: {x: 36, y: 585, cols: 5, rows: 3, cellW: 78, cellH: 48, gap: 10},
  zoneC: {x: 1256, y: 35, w: 470, h: 650},
};

export const strokeDurations = (strokes) => {
  const n = strokes.length;
  const total = Math.max(38, Math.min(90, Math.round(78 - 2.1 * (n - 6))));
  const weights = strokes.map((d, i) => d.length * (i === n - 1 ? 1.2 : 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.max(3, Math.round((w / sum) * total)));
};

export const V5KanjiCard = ({theme, data, enterAt = 6, drawStartAt = 34, karaoke = null, senseiNode = null}) => {
  const frame = useCurrentFrame();
  const L = KANJI_LAYOUT;
  const radical = new Set(data.radicalStrokes || []);
  const durations = strokeDurations(data.strokes);
  const starts = [];
  durations.reduce((acc, d, i) => ((starts[i] = acc), acc + d), drawStartAt);
  const drawEnd = drawStartAt + durations.reduce((a, b) => a + b, 0);
  const radicalPhase = interpolate(frame, [drawEnd + 19, drawEnd + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const glyphSettle = interpolate(frame, [drawEnd + 9, drawEnd + 18], [1, 1.04], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rb = L.readingBox;

  const strokeState = (i) => {
    if (frame < starts[i]) return 'upcoming';
    if (frame <= starts[i] + durations[i]) return 'current';
    return 'done';
  };

  return (
    <div
      style={{
        width: L.card.w, height: L.card.h, background: theme.surface, borderRadius: L.card.radius,
        border: `2px solid ${theme.surfaceLine}`, boxShadow: theme.shadow, color: theme.ink,
        position: 'relative', overflow: 'hidden',
        ...enter(frame, enterAt, V5_MOTION.cardEntrance),
      }}
    >
      {/* ZONE A — glyph stage */}
      <div style={{position: 'absolute', left: L.zoneA.x, top: L.zoneA.y, width: L.zoneA.w, height: L.zoneA.h, background: theme.surfaceAlt, borderRadius: 22, border: `2px solid ${theme.surfaceLine}`, overflow: 'hidden'}}>
        <svg viewBox="0 0 109 109" width={L.zoneA.w} height={L.zoneA.h}>
          <line x1="54.5" y1="6" x2="54.5" y2="103" stroke={theme.surfaceLine} strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="6" y1="54.5" x2="103" y2="54.5" stroke={theme.surfaceLine} strokeWidth="0.8" strokeDasharray="3 3" />
          {data.radicalBounds && (
            <rect x={data.radicalBounds[0]} y={data.radicalBounds[1]} width={data.radicalBounds[2]} height={data.radicalBounds[3]} rx="6"
              fill={theme.current} opacity={0.18 * radicalPhase} transform={`translate(54.5 54.5) scale(${L.glyphScale * glyphSettle}) translate(-54.5 -54.5)`} />
          )}
          <g transform={`translate(54.5 54.5) scale(${L.glyphScale * glyphSettle}) translate(-54.5 -54.5)`}>
            {data.strokes.map((d, i) => (
              <path key={`g${i}`} d={d} fill="none" stroke={theme.ink} strokeWidth={L.strokeWidth} strokeLinecap="round" strokeLinejoin="round" opacity={0.12} />
            ))}
            {data.strokes.map((d, i) => {
              const st = strokeState(i);
              if (st === 'upcoming') return null;
              const p = st === 'done' ? 1 : Math.min(1, Math.max(0, (frame - starts[i]) / durations[i]));
              const isRad = radical.has(i);
              const col = st === 'current' ? theme.accent : isRad ? theme.current : theme.ink;
              return (
                <React.Fragment key={i}>
                  {st === 'current' && (
                    <path d={d} fill="none" pathLength={1000} stroke={theme.accent} strokeWidth={L.strokeGlowWidth} strokeLinecap="round" strokeLinejoin="round" opacity={0.3} strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} />
                  )}
                  <path d={d} fill="none" pathLength={1000} stroke={col} strokeWidth={L.strokeWidth} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} />
                </React.Fragment>
              );
            })}
          </g>
          {/* numbered start dots — visible from the card's first frame */}
          {data.starts.map((pt, i) => {
            const st = strokeState(i);
            const active = st === 'current';
            const sx = 54.5 + (pt[0] - 54.5) * L.glyphScale * glyphSettle;
            const sy = 54.5 + (pt[1] - 54.5) * L.glyphScale * glyphSettle;
            return (
              <g key={`d${i}`} opacity={fadeIn(frame, enterAt + 3, 6)}>
                <circle cx={sx} cy={sy} r={active ? L.activeDotR : L.dotR}
                  fill={active ? theme.accent : theme.surface}
                  stroke={active ? theme.accent : st === 'done' ? theme.mutedInk : theme.accent} strokeWidth="0.9" />
                <text x={sx} y={sy + (active ? L.activeDotFont : L.dotFont) * 0.36} textAnchor="middle"
                  fontSize={active ? L.activeDotFont : L.dotFont} fontWeight="700"
                  fill={active ? theme.onAccent : theme.ink} fontFamily={V5_FONTS.en}>
                  {i + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {/* stroke-count badge — circular, verified count */}
      <div
        style={{
          position: 'absolute', left: L.zoneA.x + L.zoneA.w - 58, top: L.zoneA.y - 34,
          width: L.badge.size, height: L.badge.size, borderRadius: '50%', background: theme.accent, color: theme.onAccent,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: theme.shadowSoft, border: `3px solid ${theme.surface}`,
          transform: `scale(${interpolate(frame, [enterAt + 8, enterAt + 16], [0.85, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})})`,
        }}
      >
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: L.badge.numeral, lineHeight: 1}}>{data.strokeCount}</div>
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 700, fontSize: L.badge.label}}>strokes</div>
      </div>

      {/* practice mini-grid (Zone A bottom) */}
      <div style={{position: 'absolute', left: L.practice.x, top: L.practice.y, ...enter(frame, enterAt + 30, 12, 10)}}>
        <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 19, color: theme.mutedInk, marginBottom: 8}}>
          লেখার অভ্যাস · <span style={{fontFamily: V5_FONTS.jp}}>練習</span>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${L.practice.cols}, ${L.practice.cellW}px)`, gap: L.practice.gap}}>
          {Array.from({length: L.practice.cols * L.practice.rows}).map((_, i) => (
            <div key={i} style={{
              width: L.practice.cellW, height: L.practice.cellH, borderRadius: 6, position: 'relative',
              border: i === 1 ? `2px solid ${theme.accent}` : `1.5px solid ${theme.surfaceLine}`,
              background: i === 0 ? rgba(theme.accent, 0.2) : theme.surface,
            }}>
              {i === 0 && (
                <svg viewBox="0 0 109 109" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                  {data.strokes.map((d, j) => (
                    <path key={j} d={d} fill="none" stroke={theme.ink} strokeWidth={5} strokeLinecap="round" opacity={0.12} />
                  ))}
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ZONE B — readings + meaning + memory hook + examples */}
      <div style={{position: 'absolute', left: L.zoneB.x, top: L.zoneB.y, width: L.zoneB.w}}>
        <div style={{display: 'flex', gap: 24}}>
          {/* ON — filled accent, white text (track spec) */}
          <div
            style={{
              width: rb.w, height: rb.h, borderRadius: 16, padding: 18, background: theme.accent, color: theme.onAccent,
              boxShadow: karaoke && karaoke.onState === 'current' ? `0 0 0 4px ${theme.surface}, 0 0 0 7px ${theme.accent}` : theme.shadowSoft,
              opacity: karaoke && karaoke.onState === 'unspoken' ? 0.5 : 1,
              transform: `scale(${karaoke && karaoke.onState === 'current' ? 1.03 : 1})`,
              ...enter(frame, drawEnd + 2, 11, 10),
            }}
          >
            <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: rb.heading, letterSpacing: 1.6}}>ON · অন পাঠ</div>
            <div style={{fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: rb.reading, lineHeight: 1.15}}>{data.onReading}</div>
          </div>
          {/* KUN — neutral, dashed; absence shows exactly 「বইয়ে নেই」 */}
          <div
            style={{
              width: rb.w, height: rb.h, borderRadius: 16, padding: 18, background: theme.surface,
              border: `2.5px dashed ${theme.mutedInk}`, color: theme.ink,
              ...enter(frame, drawEnd + 8, 11, 10),
            }}
          >
            <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: rb.heading, letterSpacing: 1.6, color: theme.mutedInk}}>KUN · কুন পাঠ</div>
            {data.kunReading ? (
              <div style={{fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: rb.reading, lineHeight: 1.15}}>{data.kunReading}</div>
            ) : (
              <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 31, color: theme.mutedInk, marginTop: 8}}>বইয়ে নেই</div>
            )}
          </div>
        </div>
        <div style={{marginTop: 14, ...enter(frame, drawEnd + 16, 12, 10)}}>
          <BnText theme={theme} size={32}>মূল অর্থ: {data.meaningBn}</BnText>
          <EnText theme={theme} size={22} style={{marginTop: 3}}>{data.meaningEn}</EnText>
        </div>
        {/* memory-hook panel (5-beat comedy lives in lesson builds; the demo
            shows beats 2+5: components + payoff) */}
        <div
          style={{
            marginTop: 14, minHeight: L.hook.h, background: theme.surfaceAlt, borderRadius: 18,
            border: `2px solid ${theme.surfaceLine}`, padding: 16, display: 'flex', gap: 20,
            ...enter(frame, drawEnd + 49, 13, 12),
          }}
        >
          <div style={{flexShrink: 0, background: theme.surface, borderRadius: 14, padding: 12, alignSelf: 'flex-start'}}>
            <V5Illustration name={data.hookIllustration || 'building'} theme={theme} size={L.hook.illustration - 24} />
          </div>
          <div>
            <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 20, color: theme.accent}}>মনে রাখার উপায় · অংশগুলো চেনো</div>
            <BnText theme={theme} size={25} style={{marginTop: 7}}>{data.hookComponentsBn}</BnText>
            <div style={{marginTop: 10, background: rgba(theme.current, 0.2), borderRadius: 10, padding: '9px 14px'}}>
              <BnText theme={theme} size={25}>{data.hookBn}</BnText>
            </div>
          </div>
        </div>
        {/* examples (karaoke states from the timestamp map) */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 9, marginTop: 14}}>
          {data.examples.map((ex, i) => {
            const st = karaoke ? karaoke.exampleStates[i] : null;
            return (
              <div
                key={i}
                style={{
                  background: theme.surfaceAlt, borderRadius: 14, padding: '9px 18px',
                  border: `2.5px solid ${st === 'current' ? theme.accent : 'transparent'}`,
                  opacity: st === 'unspoken' ? 0.45 : st === 'spoken' ? 0.82 : 1,
                  ...enter(frame, drawEnd + 62 + i * 6, 11, 10),
                }}
              >
                <div style={{display: 'flex', alignItems: 'baseline', gap: 18, flexWrap: 'wrap'}}>
                  <V5FuriganaText segments={ex.screenText.japaneseSegs} theme={theme} size={33} furiganaSize={17} />
                  <BnText theme={theme} size={23}>{ex.screenText.banglaMeaning}</BnText>
                  <EnText theme={theme} size={19}>{ex.screenText.englishGloss}</EnText>
                </div>
              </div>
            );
          })}
        </div>
        {data.lookalike && (
          <div style={{marginTop: 14, border: `3px solid ${theme.warning}`, borderRadius: 14, padding: '9px 18px', fontFamily: V5_FONTS.bn, fontSize: 24, fontWeight: 700, color: theme.ink}}>
            {data.lookalike}
          </div>
        )}
      </div>

      {/* ZONE C — Sensei (scene-supplied) */}
      {senseiNode && (
        <div style={{position: 'absolute', left: L.zoneC.x, top: L.zoneC.y, width: L.zoneC.w, height: L.zoneC.h}}>
          {senseiNode}
        </div>
      )}
    </div>
  );
};
