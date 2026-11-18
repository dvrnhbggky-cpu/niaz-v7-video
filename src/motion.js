import {interpolate, spring, Easing} from 'remotion';

// ============================================================================
// V5 MOTION — central motion config + easing library (spec §A1–A2, §H3).
// All animation is deterministic and frame-driven. Standard vocabulary:
//   standard transition 18f · element entrance 12–18f · stagger 4–6f ·
//   emphasis 8–12f · min readable hold 45f · teaching hold 60–120f.
// Spring: damping 18, stiffness 140, mass 0.8, overshoot < 1.06×.
// ============================================================================

export const V5_MOTION = {
  standardTransition: 18,
  cardEntrance: 14,
  textEntrance: 12,
  stagger: 5,
  emphasis: 10,
  minHold: 45,
  teachHoldMin: 60,
  teachHoldMax: 120,
  spring: {damping: 18, stiffness: 140, mass: 0.8},
  risePx: 24, // cards rise 20–28px on entrance
};

export const EASE = {
  smoothOut: Easing.out(Easing.cubic),
  smoothInOut: Easing.inOut(Easing.cubic),
  snapOut: Easing.out(Easing.back(1.15)), // restrained back-out (< 1.06 overshoot)
  fade: Easing.linear,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

// enter(frame, start, dur): staged entrance — opacity 0→1 with a 20–28px
// rise and a 0.96→1 settle. Returns a style object; elements are NEVER
// revealed all at once and NEVER sit unreadable mid-fade on light surfaces:
// the rise does the work, opacity completes in the first 60% of the move.
export const enter = (frame, start, dur = V5_MOTION.cardEntrance, rise = V5_MOTION.risePx) => {
  const p = interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: EASE.smoothOut});
  return {
    opacity: interpolate(p, [0, 0.6, 1], [0, 1, 1]),
    transform: `translateY(${(1 - p) * rise}px) scale(${0.96 + 0.04 * p})`,
  };
};

// fadeIn: pure opacity for backgrounds/textures.
export const fadeIn = (frame, start, dur = 8) =>
  interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: EASE.fade});

// popAt(frame, at, peak, dur): selective popping emphasis (spec §A5) —
// 1 → peak → 1 with snapOut. Do NOT apply to every character.
export const popAt = (frame, at, peak = 1.05, dur = 10) => {
  if (frame < at || frame > at + dur) return 1;
  const p = (frame - at) / dur;
  return p < 0.45
    ? interpolate(p, [0, 0.45], [1, peak], {easing: EASE.snapOut})
    : interpolate(p, [0.45, 1], [peak, 1], {easing: EASE.smoothInOut});
};

// settleSpring: the softSpring for character / illustration entrances.
export const settleSpring = (frame, fps, start = 0) =>
  spring({frame: frame - start, fps, config: V5_MOTION.spring});

// drawOn(frame, start, dur): 0→1 progress for self-drawing lines/connectors.
export const drawOn = (frame, start, dur = 18) =>
  interpolate(frame, [start, start + dur], [0, 1], {...clamp, easing: EASE.smoothInOut});

// Deterministic blink schedule (spec §D5): intervals 90–150f from a seeded
// LCG — naturally varied, never a rigid metronome. Each blink lasts 5f with
// a 1–2f fully-closed hold; one double blink is allowed in the pattern.
// Returns eyelid openness 0..1 at the given LOCAL frame.
const blinkStarts = (() => {
  const starts = [];
  let seed = 1234567;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  let t = 84 + Math.floor(rnd() * 40);
  for (let i = 0; i < 40; i++) {
    starts.push(t);
    if (i === 5) starts.push(t + 9); // the one double blink
    t += 90 + Math.floor(rnd() * 61);
  }
  return starts;
})();

export const blinkOpenness = (frame) => {
  for (const s of blinkStarts) {
    const d = frame - s;
    if (d >= 0 && d <= 5) {
      if (d <= 1) return interpolate(d, [0, 1], [1, 0]); // close
      if (d <= 3) return 0; // closed hold 1–2f
      return interpolate(d, [3, 5], [0, 1]); // reopen
    }
  }
  return 1;
};
