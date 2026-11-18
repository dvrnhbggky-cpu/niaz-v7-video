import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';
import {V5_FONTS} from '../fonts';
import {rgba} from '../theme';
import {enter, drawOn} from '../motion';
import {V5FuriganaText, BnText} from './text';

// ============================================================================
// PRACTICE ENGINE (SPEC-part-practice). ONE shared engine — timeline,
// tracker, countdown, reveal controller, explanation engine — with
// specialised renderers per question type (MCQ here; duel + ordering are
// separate renderers in lesson builds, same state machine).
// State machine (ONE question-level timeline drives everything):
//   01 QUESTION ENTRANCE → 02 OPTIONS ENTRANCE → 03 THINK → 04 REVEAL →
//   05 WHY EXPLANATION → 06 TRANSITION. Never independent counters.
// Practice colours map onto the theme's six roles: correct = success,
// clue = current (amber), explanation accent bar = success-teal family.
// Green appears ONLY for a confirmed correct answer; colour is never the
// only signal (border + stamp + ellipse + label always accompany it).
// DATA CONTRACT (build-failing): validatePracticeSet() asserts counts
// (vocab 8 · kanji 16 · grammar 7), that every correctAnswer references an
// existing option, and that every question carries a Bangla explanation.
// The book's ANSWER KEY is the only authority — never infer an answer.
// ============================================================================
// V6 UPGRADE (nihongo-visuals-v6/SYSTEM.md §V6.3 + §V6.4):
//   · QUESTION-PHASE FURIGANA GATE built into the component: callers pass
//     `phase` ('question' | 'reveal' | 'auto' — auto derives from the
//     reveal frame) and `gate` (one of RUBY_GATE_CASES, or null). For a
//     gated case at question phase the component strips ruby from the
//     gated surface (stem / options) BEFORE rendering — the data may
//     carry full ruby; the leak is structurally impossible, not a
//     per-scene promise. Ruby returns at reveal. NON-gated surfaces keep
//     furigana at every phase (furigana-always law). This is the direct
//     fix for the published KW2D3 Q12 leak (stem 神社 + じんじゃ = the
//     correct option, shown at question phase).
//   · Japanese stems: data may add screenText.promptJpSegs (ruby segs) —
//     rendered as a gated V5FuriganaText line under the Bangla prompt.
//   · THINK-STATE COMPOSITION (closes v5 Core #5 PARTIAL): during THINK
//     the caller passes `thinkScenes` (array of {segs, bn}) — designed
//     recall lanes rendered under the options, so the lower half of a
//     think frame is a filled composition, never empty space.
//   API: V5PracticeMCQ gains OPTIONAL props only (phase, gate,
//   thinkScenes) — v5 callers render identically. V6PracticeMCQ = alias.
// ============================================================================

// The four banned cases (MEMORY 2026-11-14, refined scope) + where the
// ruby is suppressed at question phase:
//   kanji-practice2-stem    Kanji Practice II (reading) — STEM ruby banned
//   kanji-practice3-options Kanji Practice III (kanji choice) — OPTION ruby banned
//   kanji-test1-target      Kanji test-day 問題1 (reading) — TARGET(=stem) ruby banned
//   kanji-test2-options     Kanji test-day 問題2 (kanji writing) — OPTION ruby banned
// Everything else (Kanji Practice I, test 問題3, ALL vocab practice,
// ALL grammar practice, every reveal) keeps furigana — gate === null.
export const RUBY_GATE_CASES = {
  'kanji-practice2-stem': {surface: 'stem'},
  'kanji-practice3-options': {surface: 'options'},
  'kanji-test1-target': {surface: 'stem'},
  'kanji-test2-options': {surface: 'options'},
};

// Strip ruby from segments (returns new segment objects; input untouched).
export const stripRubySegs = (segs) => (segs || []).map((s) => ({...s, r: undefined}));

// The structural switch: applies the gate for ONE surface at ONE phase.
// phase 'reveal' (or a null/unknown gate) returns the segments untouched.
export const rubyForPhase = (segs, {phase, gate, surface}) => {
  if (!segs) return segs;
  if (phase !== 'question') return segs;
  const g = RUBY_GATE_CASES[gate];
  if (!g || g.surface !== surface) return segs;
  return stripRubySegs(segs);
};

// Build-time assertion (Gate V6-G1 support): a question whose DATA marks
// a gated surface must declare a known gate; an unknown gate string is a
// build error, never a silent pass.
export const validateQuestionGate = (question) => {
  const g = question && question.gate;
  if (g != null && !RUBY_GATE_CASES[g]) {
    throw new Error(`practice: unknown ruby gate "${g}" on ${question.questionId || 'question'}`);
  }
  return true;
};

export const validatePracticeSet = (questions, track) => {
  const expected = {vocab: 8, kanji: 16, grammar: 7}[track];
  if (expected != null && questions.length !== expected) {
    throw new Error(`practice: ${track} must have ${expected} questions, got ${questions.length}`);
  }
  const ids = new Set();
  for (const q of questions) {
    if (!q.questionId || ids.has(q.questionId)) throw new Error(`practice: missing/duplicate questionId ${q.questionId}`);
    ids.add(q.questionId);
    if (!q.options || q.options.length < 2) throw new Error(`practice: ${q.questionId} needs ≥2 options`);
    if (q.correctIndex == null || !q.options[q.correctIndex]) throw new Error(`practice: ${q.questionId} correctIndex does not reference an option`);
    if (!q.explanationBn) throw new Error(`practice: ${q.questionId} missing Bangla explanation`);
  }
  return true;
};

// Countdown ring — Ø86, thickness 7, derived from the question timeline:
// p(f) = clamp(1 − (f − thinkStart) / thinkDur, 0, 1); completes exactly
// at the reveal frame. Deterministic; no independent timer.
export const V5CountdownRing = ({theme, thinkStart, thinkDur, size = 86}) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, 1 - (frame - thinkStart) / thinkDur));
  const C = 2 * Math.PI * 39;
  const secs = Math.ceil((p * thinkDur) / 30);
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <svg viewBox="0 0 86 86" width={size} height={size}>
        <circle cx="43" cy="43" r="39" fill="none" stroke={rgba(theme.ink, 0.16)} strokeWidth="7" />
        <circle
          cx="43" cy="43" r="39" fill="none" stroke={theme.current} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - p)}
          transform="rotate(-90 43 43)"
        />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 27, color: theme.ink}}>
        {frame < thinkStart ? Math.ceil(thinkDur / 30) : secs}
      </div>
    </div>
  );
};

// Practice tracker — a SEPARATE data system from teaching progress
// (practice spec §6): dots 18px current/completed, 12px upcoming, part
// label; advances only on reveal, never derived from teaching entries.
export const V5PracticeTracker = ({theme, total, current, completed, label}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
    <span style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 20, letterSpacing: 1.6, color: theme.onBase}}>
      {label}
    </span>
    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
      {Array.from({length: total}).map((_, i) => {
        const n = i + 1;
        const done = n <= completed;
        const cur = n === current && !done;
        return (
          <span
            key={i}
            style={{
              width: done || cur ? 18 : 12, height: done || cur ? 18 : 12, borderRadius: '50%',
              background: done ? theme.success : cur ? theme.ink : 'transparent',
              border: cur ? `3px solid ${theme.current}` : done ? `2px solid ${theme.success}` : `2px solid ${rgba(theme.onBase, 0.35)}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: theme.onSuccess, fontSize: 11, fontWeight: 800,
            }}
          >
            {done ? '✓' : ''}
          </span>
        );
      })}
    </div>
    <span style={{fontFamily: V5_FONTS.en, fontWeight: 700, fontSize: 20, color: theme.mutedOnBase}}>
      {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
    </span>
  </div>
);

// V6 THINK-STATE COMPOSITION — fills the think frame's lower half with a
// designed recall state (SYSTEM §V6.3 gate iii / §V6.4): up to 3 lanes,
// each a dimmed "memory lane" (a previously taught item shown WITH its
// ruby — teaching content, not this question's answer surface) plus the
// Sensei think zone is staged by the scene, not here. Lanes fade in over
// the hold (stagger 20f) and exit at the reveal frame. OCCUPANCY: with
// the question panel this block brings a think frame to ≥65% designed
// area (measured at the Phase-2 polish loop, Gate V6-G3).
export const V6ThinkState = ({theme, scenes, thinkStart, thinkDur}) => {
  const frame = useCurrentFrame();
  if (!scenes || !scenes.length) return null;
  return (
    <div style={{display: 'flex', gap: 18, marginTop: 26}}>
      {scenes.slice(0, 3).map((s, i) => (
        <div
          key={i}
          style={{
            flex: 1, background: rgba(theme.ink, 0.05), border: `2px dashed ${rgba(theme.ink, 0.28)}`,
            borderRadius: 18, padding: '20px 22px', minHeight: 118, boxSizing: 'border-box',
            ...enter(frame, thinkStart + 12 + i * 20, 14, 10),
          }}
        >
          <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 15, letterSpacing: 1.8, color: theme.mutedInk}}>
            RECALL {i + 1}
          </div>
          <div style={{marginTop: 8}}>
            <V5FuriganaText segments={s.segs} theme={theme} size={30} furiganaSize={16} weight={700} />
          </div>
          {s.bn && <BnText theme={theme} size={22} muted style={{marginTop: 6}}>{s.bn}</BnText>}
        </div>
      ))}
    </div>
  );
};

// The MCQ question life (practice spec §2–§5), on the spec's frame plan:
//   panel 006–017 · question 018–029 · options stagger from 042 (6f) ·
//   settle by 077 · THINK thinkStart..thinkStart+thinkDur (default 180f)
//   · REVEAL R+0 ring out, R+6 border, R+12 stamp, R+24 ellipse, R+24
//   wrong recede (opacity floor 58%) · EXPLANATION E+0 panel, E+12
//   heading 「কেন এই উত্তরটি সঠিক？」, E+24 clue, E+42 proof, then the
//   Bangla why — narration-led, never cut.
// `question` = {screenText: {partLabel, promptSegs [{t, clue?}], options:
// [{segs}], whyBn}, correctIndex, explanation: {clueBn, proofSegs,
// proofBn}} — the renderer consumes screenText only.
export const V5PracticeMCQ = ({theme, question, correctIndex, thinkStart = 78, thinkDur = 180, width = 1300, phase = 'auto', gate = null, thinkScenes = null}) => {
  const frame = useCurrentFrame();
  const R = thinkStart + thinkDur; // reveal frame
  const E = R + 72; // explanation frame
  const revealed = frame >= R;
  const q = question.screenText;
  const cluePulse = frame >= 120 && frame <= 132 ? 1 : 0;
  // V6 gate: effective phase + gated surfaces (see header). An explicit
  // phase prop wins; 'auto' derives from the reveal frame. gate falls
  // back to question.gate so data can carry it.
  const effGate = gate || question.gate || null;
  validateQuestionGate({gate: effGate, questionId: question.questionId});
  const effPhase = phase === 'auto' ? (revealed ? 'reveal' : 'question') : phase;
  const stemSegs = rubyForPhase(q.promptJpSegs, {phase: effPhase, gate: effGate, surface: 'stem'});
  const optionSegs = (opt) => rubyForPhase(opt.segs, {phase: effPhase, gate: effGate, surface: 'options'});
  const proofSegs = rubyForPhase(question.explanation && question.explanation.proofSegs, {phase: 'reveal', gate: effGate, surface: 'options'});
  return (
    <div style={{width}}>
      {/* question panel */}
      <div
        style={{
          background: theme.surface, borderRadius: 28, border: `2px solid ${theme.surfaceLine}`,
          boxShadow: theme.shadow, padding: '36px 42px 40px',
          ...enter(frame, 6, 12, 32),
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20}}>
          <div style={{...enter(frame, 18, 12, 8)}}>
            <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 19, letterSpacing: 2, color: theme.accent}}>{q.partLabel}</div>
            <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 39, color: theme.ink, marginTop: 10, lineHeight: 1.35}}>
              {(q.promptSegs || [{t: q.promptBn}]).map((s, i) => (
                <span
                  key={i}
                  style={s.clue ? {
                    background: cluePulse ? rgba(theme.current, 0.45) : rgba(theme.current, 0.2),
                    borderRadius: 8, padding: '0 8px',
                    boxShadow: revealed && frame >= E + 24 ? `inset 0 -6px 0 ${theme.current}` : 'none',
                  } : undefined}
                >
                  {s.t}
                </span>
              ))}
            </div>
            {/* V6: Japanese stem line — ruby gated by phase (see header).
                At question phase under a stem gate this renders the stem
                BARE (segments keep their height slot, ruby is empty). */}
            {stemSegs && (
              <div style={{marginTop: 14}}>
                <V5FuriganaText segments={stemSegs} theme={theme} size={44} furiganaSize={22} weight={800} />
              </div>
            )}
          </div>
          <div style={{opacity: frame >= R + 6 ? 0 : 1, flexShrink: 0}}>
            <V5CountdownRing theme={theme} thinkStart={thinkStart} thinkDur={thinkDur} />
          </div>
        </div>
        {/* options — independent entrances, 6f stagger, from f042 */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, marginTop: 30}}>
          {q.options.map((opt, i) => {
            const isCorrect = i === correctIndex;
            const showCorrect = revealed && isCorrect;
            const recede = revealed && !isCorrect;
            const ellipseP = isCorrect ? drawOn(frame, R + 24, 14) : 0;
            return (
              <div
                key={i}
                style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 20,
                  borderRadius: 16, padding: '22px 26px', minHeight: 92, boxSizing: 'border-box',
                  background: showCorrect ? rgba(theme.success, 0.13) : theme.surfaceAlt,
                  border: `${showCorrect ? 5 : 2}px solid ${showCorrect ? theme.success : theme.surfaceLine}`,
                  opacity: recede ? 0.58 : 1,
                  ...enter(frame, 42 + i * 6, 12, 24),
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
                  {String.fromCharCode(97 + i)}
                </span>
                <span style={{position: 'relative', display: 'inline-flex', padding: '4px 10px'}}>
                  <V5FuriganaText segments={optionSegs(opt)} theme={theme} size={37} furiganaSize={19} weight={700} />
                  {isCorrect && ellipseP > 0 && (
                    <svg style={{position: 'absolute', inset: -7, width: 'calc(100% + 14px)', height: 'calc(100% + 14px)', pointerEvents: 'none'}}>
                      <ellipse cx="50%" cy="50%" rx="48%" ry="44%" fill="none" stroke={theme.current} strokeWidth="5"
                        pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - ellipseP)} strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                {showCorrect && frame >= R + 12 && (
                  <span
                    style={{
                      marginLeft: 'auto', flexShrink: 0, transform: `rotate(-4deg) scale(${interpolate(frame, [R + 12, R + 22], [0.65, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}`,
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
        {/* V6 think-state composition — fills the think frame (see
            V6ThinkState); renders only before the reveal. */}
        {!revealed && thinkScenes && (
          <V6ThinkState theme={theme} scenes={thinkScenes} thinkStart={thinkStart} thinkDur={thinkDur} />
        )}
      </div>
      {/* explanation — three layers: clue → proof → Bangla why */}
      {frame >= E && (
        <div
          style={{
            marginTop: 26, width: Math.min(1270, width), background: theme.surface, borderRadius: 20,
            border: `2px solid ${theme.surfaceLine}`, borderLeft: `8px solid ${theme.success}`,
            padding: '26px 30px', boxShadow: theme.shadowSoft,
            ...enter(frame, E, 12, 16),
          }}
        >
          <div style={{fontFamily: V5_FONTS.bn, fontWeight: 900, fontSize: 30, color: theme.ink, ...enter(frame, E + 12, 10, 8)}}>
            কেন এই উত্তরটি সঠিক?
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, ...enter(frame, E + 42, 12, 10)}}>
            <span style={{background: rgba(theme.success, 0.13), border: `2px solid ${theme.success}`, borderRadius: 12, padding: '8px 14px', display: 'inline-flex'}}>
              <V5FuriganaText segments={proofSegs} theme={theme} size={30} furiganaSize={16} weight={700} />
            </span>
            <BnText theme={theme} size={26}>{question.explanation.proofBn}</BnText>
          </div>
          <BnText theme={theme} size={29} style={{marginTop: 14, lineHeight: 1.45}}>{q.whyBn}</BnText>
        </div>
      )}
    </div>
  );
};

// v6 names — same components, same props (SYSTEM §V6.3/§V6.4).
export const V6PracticeMCQ = V5PracticeMCQ;
export const V6CountdownRing = V5CountdownRing;
export const V6PracticeTracker = V5PracticeTracker;
