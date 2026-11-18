import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {V5_FONTS} from '../fonts';
import {rgba} from '../theme';
import {enter, drawOn} from '../motion';
import {V5FuriganaText, BnText, EnText} from './text';

// ============================================================================
// VOCAB-SCENE COMPONENTS (built for VW2D4 — the first full v5 lesson build;
// SYSTEM.md §13 scheduled "first lesson build" work). Components only —
// lesson scenes compose these; nothing here knows lesson data.
//   V5CarDiagram    side-profile car schematic; one leader-line label at a
//                   time (draw-on at its frame, later labels fade in as
//                   small chips) — storyboard D1 "labels draw onto ONE car
//                   schematic". EVERY label renders through V5FuriganaText
//                   (ruby from its first frame — the J07/J08 known-miss law).
//   V5PairTrap      two entries side by side; the scripted WRONG pairing
//                   stamps a red X at its frame, then both settle done.
//   V5ProcessStages 4-stage process (RECALL): steps enter at their frames,
//                   connect with self-drawing arrows, light up in order.
//   V5VocabMCQ      narration-led practice question: renders the JP book
//                   sentence (V5PracticeMCQ renders only a Bangla prompt),
//                   think ring driven by the question's REAL timeline.
//   V5NarrationCue  the spoken Bangla line as an on-screen cue card —
//                   text comes from lesson screenText only.
// ============================================================================

// One diagram label: leader line draw-on + label card with furigana.
const DiagramLabel = ({theme, part, state, enterF}) => {
  const frame = useCurrentFrame();
  const p = drawOn(frame, enterF, 14);
  const active = state === 'active';
  const op = state === 'upcoming' ? 0.35 : 1;
  return (
    <>
      <svg style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} width="1180" height="560">
        <path
          d={`M${part.x} ${part.y} L${part.lx} ${part.ly}`}
          fill="none" pathLength={1000} stroke={active ? theme.accent : rgba(theme.onBase, 0.45)}
          strokeWidth={active ? 4 : 2.5} strokeLinecap="round"
          strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)}
        />
        <circle cx={part.x} cy={part.y} r={active ? 9 : 6} fill={active ? theme.accent : rgba(theme.onBase, 0.5)} opacity={p} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: part.side === 'left' ? undefined : part.lx,
          right: part.side === 'left' ? 1180 - part.lx : undefined,
          top: part.ly - 34,
          opacity: op,
          background: theme.surface,
          border: `${active ? 3 : 2}px solid ${active ? theme.accent : theme.surfaceLine}`,
          borderRadius: 14, padding: '10px 16px', boxShadow: active ? theme.shadow : theme.shadowSoft,
          ...enter(frame, enterF + 6, 10, 10),
        }}
      >
        <V5FuriganaText segments={part.segs} theme={theme} size={30} furiganaSize={17} weight={800} />
      </div>
    </>
  );
};

export const V5CarDiagram = ({theme, parts, activeIndex, enterFrames}) => {
  const frame = useCurrentFrame();
  const body = drawOn(frame, 4, 40);
  const partState = (i) => (i === activeIndex ? 'active' : i < activeIndex ? 'done' : 'upcoming');
  return (
    <div style={{position: 'relative', width: 1180, height: 560}}>
      <svg width="1180" height="560" viewBox="0 0 1180 560">
        {/* side-profile schematic: body, glass, bonnet, trunk, wheels */}
        <path
          d="M70 420 L120 300 L300 268 L430 186 Q452 168 500 166 L770 166 Q820 166 852 196 L960 262 L1050 292 Q1110 312 1112 356 L1112 420"
          fill="none" pathLength={1000} stroke={theme.onBase} strokeWidth={7} strokeLinecap="round"
          strokeDasharray={1000} strokeDashoffset={1000 * (1 - body)}
        />
        <path d="M70 420 L1112 420" stroke={rgba(theme.onBase, 0.35)} strokeWidth={4} strokeDasharray="26 18" />
        <path d="M452 186 L500 186 L500 262 L428 262 Z" fill={rgba(theme.current, 0.30)} opacity={body} />
        <path d="M516 186 L640 186 L640 262 L516 262 Z" fill={rgba(theme.current, 0.16)} opacity={body} />
        <path d="M656 186 L768 186 L838 252 L656 262 Z" fill={rgba(theme.current, 0.16)} opacity={body} />
        <path d="M300 268 L428 262" stroke={theme.onBase} strokeWidth={4} opacity={body} />
        <circle cx="252" cy="424" r="52" fill="none" stroke={theme.onBase} strokeWidth={8} opacity={body} />
        <circle cx="252" cy="424" r="18" fill={rgba(theme.onBase, 0.5)} opacity={body} />
        <circle cx="928" cy="424" r="52" fill="none" stroke={theme.onBase} strokeWidth={8} opacity={body} />
        <circle cx="928" cy="424" r="18" fill={rgba(theme.onBase, 0.5)} opacity={body} />
        {/* active part highlight wash */}
        {parts.map((p, i) =>
          partState(i) === 'active' && p.zone ? (
            <rect key={i} x={p.zone[0]} y={p.zone[1]} width={p.zone[2]} height={p.zone[3]} rx={14}
              fill={rgba(theme.accent, 0.28)} stroke={theme.accent} strokeWidth={3} />
          ) : null
        )}
      </svg>
      {parts.map((p, i) => (
        <DiagramLabel key={i} theme={theme} part={p} state={partState(i)} enterF={enterFrames[i]} />
      ))}
    </div>
  );
};

// Two entries side by side; wrong-pair X stamps at wrongAt, settles at doneAt.
export const V5PairTrap = ({theme, left, right, enterAt = 0, wrongAt, doneAt}) => {
  const frame = useCurrentFrame();
  const xScale = interpolate(frame, [wrongAt, wrongAt + 8], [0.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card = (e, i) => (
    <div
      key={i}
      style={{
        flex: 1, background: theme.surface, borderRadius: 20, padding: '26px 28px',
        border: `2px solid ${frame >= doneAt ? theme.success : theme.surfaceLine}`,
        boxShadow: theme.shadowSoft, position: 'relative',
        ...enter(frame, enterAt + i * 8, 13, 14),
      }}
    >
      <V5FuriganaText segments={e.screenText.wordSegs} theme={theme} size={46} furiganaSize={21} weight={900} />
      <BnText theme={theme} size={31} style={{marginTop: 12}}>{e.screenText.banglaMeaning}</BnText>
      <EnText theme={theme} size={21} style={{marginTop: 5}}>{e.screenText.englishGloss}</EnText>
      {frame >= doneAt && (
        <div style={{position: 'absolute', top: -14, right: -14, width: 36, height: 36, borderRadius: '50%', background: theme.success, color: theme.onSuccess, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20}}>✓</div>
      )}
    </div>
  );
  return (
    <div style={{position: 'relative'}}>
      <div style={{display: 'flex', gap: 26}}>{card(left, 0)}{card(right, 1)}</div>
      {frame >= wrongAt && (
        <div
          style={{
            position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%,-50%) scale(${xScale}) rotate(-8deg)`,
            border: `5px solid ${theme.error}`, color: theme.error, borderRadius: 14, padding: '8px 26px',
            fontFamily: V5_FONTS.bn, fontWeight: 900, fontSize: 40, background: rgba(theme.surface, 0.94),
            boxShadow: theme.shadow,
          }}
        >
          ✗ উল্টো!
        </div>
      )}
    </div>
  );
};

// 4-stage process — steps enter at their frames and light up in order.
export const V5ProcessStages = ({theme, steps, enterFrames, activeIndex}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'stretch', gap: 0}}>
      {steps.map((s, i) => {
        const active = i === activeIndex;
        const done = i < activeIndex;
        const arrow = i < steps.length - 1 ? drawOn(frame, enterFrames[i + 1] - 12, 12) : 0;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                flex: 1, background: theme.surface, borderRadius: 18, padding: '24px 22px', minHeight: 210,
                border: `${active ? 3 : 2}px solid ${active ? theme.accent : done ? theme.success : theme.surfaceLine}`,
                boxShadow: active ? theme.shadow : theme.shadowSoft,
                opacity: frame < enterFrames[i] ? 0 : 1,
                ...enter(frame, enterFrames[i], 12, 12),
              }}
            >
              <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 16, letterSpacing: 1.6, color: active ? theme.accent : theme.mutedInk}}>
                STEP {i + 1}{done ? ' ✓' : ''}
              </div>
              <div style={{marginTop: 10}}>
                <V5FuriganaText segments={s.screenText.wordSegs} theme={theme} size={33} furiganaSize={17} weight={800} />
              </div>
              <BnText theme={theme} size={25} style={{marginTop: 10}}>{s.screenText.banglaMeaning}</BnText>
            </div>
            {i < steps.length - 1 && (
              <div style={{display: 'flex', alignItems: 'center', padding: '0 6px'}}>
                <svg width="52" height="30">
                  <path d="M4 15 L40 15 M32 5 L44 15 L32 25" fill="none" pathLength={100}
                    stroke={theme.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={100} strokeDashoffset={100 * (1 - arrow)} />
                </svg>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Narration-led MCQ: JP book sentence + options, think ring on the REAL
// question timeline, reveal = border + stamp + ellipse + why panel.
export const V5VocabMCQ = ({theme, question, correctIndex, thinkStart, revealAt, whyAt, width = 1440}) => {
  const frame = useCurrentFrame();
  const q = question.screenText;
  const revealed = frame >= revealAt;
  const thinkDur = Math.max(1, revealAt - thinkStart);
  const ringP = Math.max(0, Math.min(1, 1 - (frame - thinkStart) / thinkDur));
  const C = 2 * Math.PI * 39;
  return (
    <div style={{width}}>
      <div
        style={{
          background: theme.surface, borderRadius: 28, border: `2px solid ${theme.surfaceLine}`,
          boxShadow: theme.shadow, padding: '34px 42px 38px',
          ...enter(frame, 4, 12, 30),
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 22}}>
          <div style={{...enter(frame, 14, 12, 8)}}>
            <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 19, letterSpacing: 2, color: theme.accent}}>{q.partLabel}</div>
            <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 36, color: theme.ink, marginTop: 10, lineHeight: 1.35}}>{q.promptBn}</div>
            <div style={{marginTop: 16}}>
              <V5FuriganaText segments={q.promptSegs} theme={theme} size={42} furiganaSize={20} weight={700} />
            </div>
            {q.footnoteSegs && (
              <div style={{marginTop: 12, display: 'inline-flex', background: rgba(theme.current, 0.22), borderRadius: 10, padding: '6px 12px'}}>
                <V5FuriganaText segments={q.footnoteSegs} theme={theme} size={22} furiganaSize={14} weight={600} />
              </div>
            )}
          </div>
          <div style={{opacity: revealed ? 0 : 1, flexShrink: 0, position: 'relative', width: 86, height: 86}}>
            <svg viewBox="0 0 86 86" width={86} height={86}>
              <circle cx="43" cy="43" r="39" fill="none" stroke={rgba(theme.ink, 0.16)} strokeWidth="7" />
              <circle cx="43" cy="43" r="39" fill="none" stroke={theme.current} strokeWidth="7" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={C * (1 - ringP)} transform="rotate(-90 43 43)" />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 27, color: theme.ink}}>
              {Math.ceil((ringP * thinkDur) / 30)}
            </div>
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 28}}>
          {q.options.map((opt, i) => {
            const isCorrect = i === correctIndex;
            const showCorrect = revealed && isCorrect;
            const recede = revealed && !isCorrect;
            const ellipseP = isCorrect ? drawOn(frame, revealAt + 22, 14) : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 20,
                  borderRadius: 16, padding: '20px 26px', minHeight: 88, boxSizing: 'border-box',
                  background: showCorrect ? rgba(theme.success, 0.13) : theme.surfaceAlt,
                  border: `${showCorrect ? 5 : 2}px solid ${showCorrect ? theme.success : theme.surfaceLine}`,
                  opacity: recede ? 0.58 : 1,
                  ...enter(frame, 40 + i * 6, 12, 22),
                }}
              >
                <span
                  style={{
                    width: 46, height: 46, flexShrink: 0, borderRadius: '50%',
                    border: `3px solid ${showCorrect ? theme.success : theme.mutedInk}`,
                    color: showCorrect ? theme.success : theme.mutedInk,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 23,
                  }}
                >
                  {opt.label}
                </span>
                <span style={{position: 'relative', display: 'inline-flex', padding: '4px 10px'}}>
                  <V5FuriganaText segments={opt.segs} theme={theme} size={37} furiganaSize={19} weight={700} />
                  {isCorrect && ellipseP > 0 && (
                    <svg style={{position: 'absolute', inset: -7, width: 'calc(100% + 14px)', height: 'calc(100% + 14px)', pointerEvents: 'none'}}>
                      <ellipse cx="50%" cy="50%" rx="48%" ry="44%" fill="none" stroke={theme.current} strokeWidth="5"
                        pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - ellipseP)} strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                {showCorrect && frame >= revealAt + 12 && (
                  <span
                    style={{
                      marginLeft: 'auto', flexShrink: 0,
                      transform: `rotate(-4deg) scale(${interpolate(frame, [revealAt + 12, revealAt + 22], [0.65, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}`,
                      border: `3.5px solid ${theme.success}`, color: theme.success, borderRadius: 10,
                      padding: '5px 16px', fontFamily: V5_FONTS.bn, fontWeight: 900, fontSize: 24,
                      background: rgba(theme.surface, 0.92),
                    }}
                  >
                    সঠিক উত্তর
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {frame >= whyAt && (
        <div
          style={{
            marginTop: 24, background: theme.surface, borderRadius: 20,
            border: `2px solid ${theme.surfaceLine}`, borderLeft: `8px solid ${theme.success}`,
            padding: '24px 30px', boxShadow: theme.shadowSoft,
            ...enter(frame, whyAt, 12, 14),
          }}
        >
          <div style={{fontFamily: V5_FONTS.bn, fontWeight: 900, fontSize: 29, color: theme.ink}}>কেন এই উত্তরটি সঠিক?</div>
          <BnText theme={theme} size={28} style={{marginTop: 8, lineHeight: 1.45}}>{q.whyBn}</BnText>
          {q.commentBn && (
            <BnText theme={theme} size={25} weight={600} color={theme.mutedInk} style={{marginTop: 8}}>{q.commentBn}</BnText>
          )}
        </div>
      )}
    </div>
  );
};

// The spoken Bangla line as an on-screen cue card (bottom band).
export const V5NarrationCue = ({theme, text, enterF, size = 30}) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  return (
    <div
      style={{
        display: 'inline-block', maxWidth: 1560,
        background: rgba(theme.surface, 0.96), borderRadius: 16, padding: '16px 26px',
        boxShadow: theme.shadowSoft, borderLeft: `7px solid ${theme.current}`,
        ...enter(frame, enterF, 10, 8),
      }}
    >
      <BnText theme={theme} size={size}>{text}</BnText>
    </div>
  );
};
