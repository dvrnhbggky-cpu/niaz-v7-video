import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {V5_FONTS} from '../fonts';
import {V5_MOTION, blinkOpenness} from '../motion';

// ============================================================================
// V5Sensei — the upgraded Niaz Sensei (spec §D). Built ON the locked master
// character (swept black hair, thick brows, brown eyes, subtle jaw stubble —
// face geometry unchanged from the approved v4 artwork) and enriched:
//   · face shading (cheek/jaw shading, ear detail, hair strand highlights)
//   · waistcoat + tie + pocket square + name badge over the jacket
//   · SVG LAYER structure: head / brows / eyes / mouth / arms are separate
//     groups, so expressions and gestures swap cleanly
//   · 11 expressions (visually distinct — brows + mouth + pupil direction,
//     not just mouth swaps): neutral smile thinking explaining pointingLeft
//     pointingRight surprised happy serious confident waving
//   · pointing arms AIMED at content (gesture prop + gestureStart frame;
//     arm travels 12–18f, holds, returns — spec §D4)
//   · deterministic blink loop (90–150f varied intervals, 4–6f blink with
//     1–2f closed hold, one double blink — see motion.js blinkOpenness)
//   · subtle idle breathing + head sway, suppressed under gestures
// Sizes (spec §D1–D2): pass height 324–410 (title 390 · grammar 350 ·
// vocab 350 · example 330–360 · practice 340 · reveal 370 · outro 410).
// ============================================================================
// V6 UPGRADE (nihongo-visuals-v6/SYSTEM.md §V6.4 — closes v5 §13 gap P1):
//   · FULL BODY: legs + shoes in the same viewBox (0 0 320 560); the figure
//     is ~4.6 heads tall, legs ≈ 40% of total height (addendum §1: 39–42%).
//   · TRUE 3-TONE shading per material: every material now carries L/base/D
//     (skin, hair, jacket, vest, trousers) — highlight + base + shadow pass.
//   · TRUE POINT GESTURE: two-segment arm (upper arm from the shoulder
//     pivot + forearm group rotated at the ELBOW joint) with the index
//     finger on the FOREARM's axis and the other fingers curled — v5's
//     single-piece arm rotated a hand whose "point" read as a thumbs-up
//     at small sizes; the v6 point silhouette is a straight arm line
//     ending in ONE extended finger (see Arm below + POINT_GESTURE note).
//   · Face geometry, expressions, blink, breathing, badge = v5, unchanged.
//   API is unchanged (V5Sensei props identical); V6Sensei is an alias.
//   SIZE NOTE: `height` is now the FULL figure (560 units). To keep the
//   head at its v5 stage size, scale v5 heights by 560/392 ≈ 1.43 (v5
//   title 390 → v6 ≈ 558; v5 practice 340 → v6 ≈ 486; v5 outro 410 →
//   v6 ≈ 586). Scenes may also crop at the waist via container overflow —
//   the legs exist for full-stage framings (intro/outro/think-state).
// ============================================================================

// V6 model sheet (SYSTEM §V6.4) — the proportions every scene must keep.
export const SENSEI_MODEL_SHEET = {
  viewBox: '-48 0 416 560', // POLISH PASS 2c: canvas widened ±48 — a fully
  // extended point arm reaches x≈−39 (left) / x≈359 (right); the v5
  // 0..320 canvas CLIPPED the fingertip (the hidden cause of the old
  // "thumbs-up" read: only the fist ball survived the clip).
  headsTall: 4.6, // addendum §1 band 4.5–4.8
  legShareOfHeight: 0.42, // waist→sole; addendum band 0.39–0.42
  tonesPerMaterial: 3, // L / base / D for skin, hair, jacket, vest, trousers
  pointGesture: 'two-segment arm, elbow 0 at point, index on the forearm axis, curled fingers below the axis, thumb below the axis — no upward thumb silhouette',
  outline: '#26323D',
  badge: 'NIAZ SENSEI',
};

const SKIN = '#C68863';
const SKIN_L = '#E0AA77';
const SKIN_D = '#A96F47';
const HAIR = '#20242C';
const HAIR_L = '#454E60';
const JACKET = '#232936';
const JACKET_L = '#333D52';
const JACKET_D = '#171C26';
const VEST = '#2E3B33';
const VEST_L = '#3D4F44';
const TROUSER = '#2A3040';
const TROUSER_L = '#39415A';
const TROUSER_D = '#1B1F2A';
const SHOE = '#17130F';
const SHOE_L = '#3A2E22';

const EXPRESSIONS = {
  neutral:      {browY: 0, browTilt: 0, mouth: 'smile', pupils: [0, 0], tilt: 0},
  smile:        {browY: -2, browTilt: 0, mouth: 'smileBig', pupils: [0, 0], tilt: 0},
  thinking:     {browY: 2, browTilt: 6, mouth: 'flat', pupils: [-2.5, -2], tilt: -5},
  explaining:   {browY: -1, browTilt: 0, mouth: 'open', pupils: [0, 0], tilt: 0},
  pointingLeft: {browY: -2, browTilt: 0, mouth: 'smile', pupils: [-3, 0], tilt: -2},
  pointingRight:{browY: -2, browTilt: 0, mouth: 'smile', pupils: [3, 0], tilt: 2},
  surprised:    {browY: -6, browTilt: 0, mouth: 'o', pupils: [0, -1], tilt: 0},
  happy:        {browY: -3, browTilt: 0, mouth: 'laugh', pupils: [0, 0], tilt: 0},
  serious:      {browY: 4, browTilt: -5, mouth: 'straight', pupils: [0, 0.5], tilt: 1},
  confident:    {browY: 1, browTilt: -3, mouth: 'smirk', pupils: [1.5, 0], tilt: -1},
  waving:       {browY: -3, browTilt: 0, mouth: 'smileBig', pupils: [0, 0], tilt: -2},
};

const MOUTHS = {
  smile:    <path d="M147,123 Q160,133 173,123" fill="none" stroke="#7A3B2E" strokeWidth="3.4" strokeLinecap="round" />,
  smileBig: <path d="M146,122 Q160,138 174,122 Q160,130 146,122 Z" fill="#7A3B2E" stroke="#7A3B2E" strokeWidth="2" strokeLinejoin="round" />,
  laugh:    <path d="M144,121 Q160,142 176,121 Q160,128 144,121 Z" fill="#6E3327" stroke="#6E3327" strokeWidth="2" strokeLinejoin="round" />,
  open:     <ellipse cx="160" cy="126" rx="7.5" ry="9" fill="#6E3327" />,
  o:        <ellipse cx="160" cy="127" rx="6" ry="7.5" fill="#6E3327" />,
  flat:     <line x1="150" y1="128" x2="170" y2="128" stroke="#7A3B2E" strokeWidth="3.4" strokeLinecap="round" />,
  straight: <line x1="149" y1="126" x2="171" y2="126" stroke="#7A3B2E" strokeWidth="3.6" strokeLinecap="round" />,
  smirk:    <path d="M148,126 Q162,132 174,121" fill="none" stroke="#7A3B2E" strokeWidth="3.4" strokeLinecap="round" />,
};

// V6 ARM — two-segment (SYSTEM §V6.4): UPPER ARM from the shoulder pivot
// (drawn along +Y, length 56), then a FOREARM group pivoted at the ELBOW
// (0,56) whose rotation is `elbow` degrees relative to the upper arm.
// variant: 'fist' | 'point' | 'palm' — drawn at the forearm's end (0,112).
// POINT (the v6 fix): the hand sits ON the forearm axis; the index finger
// extends a further 30px along that SAME axis while three curled fingers
// tuck as arcs BELOW the axis — the silhouette is one straight line
// shoulder→elbow→wrist→fingertip with NO thumb sticking up, so it reads
// as a point (never a thumbs-up) down to ~120px stage height. Parents
// pass elbow ≈ 0 for point (arm fully straight) so the aim line is exact.
const Arm = ({side, variant, elbow = 0}) => {
  const dir = side === 'left' ? -1 : 1;
  return (
    <g>
      {/* upper arm */}
      <rect x="-14" y="-6" width="28" height="62" rx="14" fill="url(#v5senseiJack)" />
      <rect x="-14" y="-6" width="10" height="62" rx="5" fill={JACKET_L} opacity="0.55" />
      <g transform={`rotate(${elbow} 0 56)`}>
        {/* forearm */}
        <rect x="-12.5" y="50" width="25" height="56" rx="12.5" fill="url(#v5senseiJack)" />
        <rect x="-12.5" y="88" width="25" height="11" fill="#F2EDE2" /> {/* cuff */}
        {variant === 'fist' && <circle cx="0" cy="106" r="12" fill={SKIN} />}
        {variant === 'point' && (
          <g>
            {/* POLISH PASS 2 (v6 demo, 2026-11-14): the first build's
                hand read as a THUMBS-UP at stage size — the shared
                thumb path rotates to screen-UP on a raised point arm,
                and the 8.4-wide index was lost inside the fist ball.
                Redrawn: ONE long tapered index on the axis (tip
                y≈143, ~28 past the ball), curled fingers as bumps at
                the BASE of the ball, thumb as a low side ellipse on
                the side that rotates DOWN-screen (−dir). */}
            {/* POLISH PASS 2b: knuckle bumps + thumb ellipse removed —
                at stage size they fattened the cluster back into a
                mitten. Pure silhouette now: fist ball + ONE long
                tapered index (tip y≈152, ~39 past the ball) with a
                shadow seam where the finger leaves the fist. */}
            <path d="M-4.6,96 L4.6,96 L3,147 Q0,152.5 -3,147 Z" fill={SKIN} />
            <path d="M-4.4,114 Q0,117.5 4.4,114" fill="none" stroke={SKIN_D} strokeWidth="1.7" opacity="0.6" strokeLinecap="round" />
            <circle cx="0" cy="103" r="10" fill={SKIN} />
          </g>
        )}
        {variant === 'palm' && (
          <g stroke={SKIN} strokeWidth="5.5" strokeLinecap="round">
            <circle cx="0" cy="104" r="10.5" fill={SKIN} stroke="none" />
            <line x1="-8" y1="106" x2="-13" y2="120" /><line x1="0" y1="109" x2="0" y2="125" /><line x1="8" y1="106" x2="13" y2="120" />
          </g>
        )}
        {/* thumb: fist/palm only — the point variant carries its own
            tucked thumb (the shared path rotates to screen-UP on a
            raised point arm and reads as a thumbs-up: polish pass 2) */}
        {variant !== 'point' && (
          <path d={`M${dir * 9},102 q${dir * 8},3 ${dir * 6},10`} fill="none" stroke={SKIN} strokeWidth="5" strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};

export const V5Sensei = ({
  theme,
  height = 360,
  expression = 'neutral',
  gesture = 'rest', // rest | pointLeft | pointRight | explain | wave | think | celebrate
  gestureStart = 0,
  gestureHold = 9999, // frames the gesture holds before returning
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ex = EXPRESSIONS[expression] || EXPRESSIONS.neutral;
  const blink = blinkOpenness(frame);
  const breathe = Math.sin(frame / 23) * 1.5;
  const headSway = Math.sin(frame / 51) * 0.6;

  // Gesture envelope: travel in 15f (spring), hold, return in 12f.
  const age = frame - gestureStart;
  const travel = spring({frame: Math.max(0, age), fps, config: V5_MOTION.spring});
  const returning = gestureHold < 9000 && age > gestureHold
    ? spring({frame: age - gestureHold, fps, config: {damping: 20, stiffness: 160, mass: 0.8}})
    : 0;
  const g = Math.max(0, travel - returning);

  const waveOsc = gesture === 'wave' ? Math.sin(frame / 4.5) * 9 * g : 0;
  const armR = gesture === 'pointRight' ? interpolate(g, [0, 1], [16, -112])
    : gesture === 'explain' ? interpolate(g, [0, 1], [16, -42])
    : gesture === 'wave' ? interpolate(g, [0, 1], [16, -152]) + waveOsc
    : gesture === 'celebrate' ? interpolate(g, [0, 1], [16, -158])
    : 16;
  const armL = gesture === 'pointLeft' ? interpolate(g, [0, 1], [-16, 112])
    : gesture === 'celebrate' ? interpolate(g, [0, 1], [-16, 158])
    : -16;
  // V6 elbow bends (forearm relative to upper arm): POINT = 0 — shoulder,
  // elbow, wrist and fingertip on one straight aim line (SYSTEM §V6.4);
  // the other gestures keep a natural bend.
  const elbowR = gesture === 'pointRight' ? 0 : gesture === 'explain' ? -18 : gesture === 'wave' ? -12 : gesture === 'celebrate' ? -25 : 6;
  const elbowL = gesture === 'pointLeft' ? 0 : gesture === 'celebrate' ? 25 : -6;
  const variantR = gesture === 'pointRight' ? 'point' : gesture === 'explain' ? 'palm' : 'fist';
  const variantL = gesture === 'pointLeft' ? 'point' : 'fist';
  const thinkArm = gesture === 'think';

  const eye = (cx) => (
    <g transform={`translate(${cx} 97) scale(1 ${Math.max(0.08, blink)})`}>
      <ellipse rx="9.5" ry="10.5" fill="#FFFFFF" />
      <circle r="5.4" cy="1" fill="#5A3A22" transform={`translate(${ex.pupils[0]} ${ex.pupils[1]})`} />
      <circle r="2.9" cy="1" fill="#17110B" transform={`translate(${ex.pupils[0]} ${ex.pupils[1]})`} />
      <circle r="1.6" cx="1.8" cy="-1.6" fill="#FFFFFF" transform={`translate(${ex.pupils[0]} ${ex.pupils[1]})`} />
    </g>
  );
  const sparkle = (cx, cy, s, c, ph) => {
    const p = 0.6 + 0.4 * Math.sin(frame / 5 + ph);
    return <path transform={`translate(${cx} ${cy}) scale(${s * p})`} fill={c} d="M0,-10 L2.6,-2.6 L10,0 L2.6,2.6 L0,10 L-2.6,2.6 L-10,0 L-2.6,-2.6 Z" />;
  };

  const width = Math.round(height * (416 / 560));
  return (
    <div style={{width, height, position: 'relative', ...style}}>
      <svg viewBox="-48 0 416 560" width={width} height={height}>
        <defs>
          <radialGradient id="v5senseiSkin" cx="50%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#D69A6B" /><stop offset="70%" stopColor="#C68863" /><stop offset="100%" stopColor="#B57A4C" />
          </radialGradient>
          <linearGradient id="v5senseiHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2B3038" /><stop offset="55%" stopColor="#20242C" /><stop offset="100%" stopColor="#171B21" />
          </linearGradient>
          <linearGradient id="v5senseiJack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A3140" /><stop offset="100%" stopColor="#1D232F" />
          </linearGradient>
        </defs>
        <ellipse cx="160" cy="540" rx="110" ry="12" fill="rgba(0,0,0,0.32)" />
        {/* V6 legs (static layer — the breathing group below carries the
            torso/head only): trousers in 3 tones, crease line, shoes.
            Full leg waist (y≈300, under the jacket) → sole (y≈534) is
            ≈ 42% of the 560 figure — inside addendum §1's 39–42% band;
            ≈ 31% shows below the jacket hem. Figure ≈ 4.6 heads tall. */}
        <g>
          <path d="M118,344 L152,344 L150,506 L116,506 Z" fill={TROUSER} />
          <path d="M168,344 L202,344 L204,506 L170,506 Z" fill={TROUSER} />
          <path d="M118,344 L129,344 L128,506 L116,506 Z" fill={TROUSER_L} opacity="0.7" />
          <path d="M191,344 L202,344 L204,506 L193,506 Z" fill={TROUSER_D} opacity="0.8" />
          <line x1="133" y1="352" x2="132" y2="500" stroke={TROUSER_D} strokeWidth="2.4" opacity="0.8" />
          <line x1="187" y1="352" x2="188" y2="500" stroke={TROUSER_D} strokeWidth="2.4" opacity="0.8" />
          <path d="M108,506 L152,506 L156,524 Q157,534 146,534 L104,534 Q100,534 101,524 Z" fill={SHOE} />
          <path d="M168,506 L212,506 L219,524 Q221,534 210,534 L172,534 Q165,534 166,524 Z" fill={SHOE} />
          <path d="M104,522 L154,522 M168,522 L216,522" stroke={SHOE_L} strokeWidth="2.2" opacity="0.9" />
        </g>
        {/* POLISH PASS 2: neck narrowed (44→36 at top) and the bright
            centre stripe dimmed — the v6 full-body reveal made the
            inherited neck read over-long at stage size; the head group
            also sits 6 lower (below) so the chin seats into the collar. */}
        <path d="M143,138 L177,138 L182,214 L138,214 Z" fill={SKIN_D} />
        <path d="M150,142 L160,142 L161,208 L151,208 Z" fill={SKIN} opacity="0.28" />
        <g transform={`translate(0 ${breathe})`}>
          {/* torso: shirt + waistcoat + tie + jacket (spec §D richer outfit) */}
          <path d="M100,206 L220,206 L234,352 L86,352 Z" fill="#EFE9DB" />
          <path d="M128,206 L192,206 L186,352 L134,352 Z" fill={VEST} />
          <path d="M134,206 L152,206 L150,352 L136,352 Z" fill={VEST_L} opacity="0.65" />
          {[248, 282, 316].map((y) => <circle key={y} cx="160" cy={y} r="4.4" fill="#C9CFD6" />)}
          <path d="M152,206 L168,206 L166,232 L160,246 L154,232 Z" fill={theme.accent} />
          <path d="M156,246 L164,246 L167,318 L160,330 L153,318 Z" fill={theme.accent} />
          <path d="M100,206 L140,206 L148,352 L84,352 Z" fill="url(#v5senseiJack)" />
          <path d="M220,206 L180,206 L172,352 L236,352 Z" fill="url(#v5senseiJack)" />
          <path d="M104,214 L124,214 L130,348 L94,348 Z" fill={JACKET_L} opacity="0.5" />
          <path d="M206,214 L218,214 L230,348 L196,348 Z" fill={JACKET_D} opacity="0.55" />
          <path d="M140,206 L160,240 L180,206 L171,201 L160,219 L149,201 Z" fill={JACKET_D} />
          <rect x="196" y="238" width="17" height="17" rx="2" fill={theme.current} transform="rotate(8 204 246)" />
          {/* name badge */}
          <g transform="rotate(-4 116 262)">
            <rect x="88" y="248" width="56" height="27" rx="5" fill="#F7F3EA" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" />
            <text x="116" y="262" textAnchor="middle" fontFamily={V5_FONTS.en} fontWeight="800" fontSize="12.5" fill="#171A22">NIAZ</text>
            <text x="116" y="272" textAnchor="middle" fontFamily={V5_FONTS.en} fontWeight="600" fontSize="6.8" letterSpacing="1.6" fill="#5A6068">SENSEI</text>
          </g>
          {/* arms (layers swap by gesture) */}
          {!thinkArm && (
            <>
              <g transform={`translate(102 218) rotate(${armL})`}><Arm side="left" variant={variantL} elbow={elbowL} /></g>
              <g transform={`translate(218 218) rotate(${armR})`}><Arm side="right" variant={variantR} elbow={elbowR} /></g>
            </>
          )}
          {thinkArm && (
            <>
              <g transform="translate(102 218) rotate(-16)"><Arm side="left" variant="fist" /></g>
              <path d="M216,226 Q246,196 214,168 Q200,157 190,160" fill="none" stroke={JACKET} strokeWidth="26" strokeLinecap="round" />
              <circle cx="188" cy="161" r="12.5" fill={SKIN} />
            </>
          )}
          {/* head (seated 6 lower — polish pass 2 neck fix) */}
          <g transform={`translate(0 6) rotate(${ex.tilt + headSway} 160 148)`}>
            <rect x="146" y="128" width="28" height="34" rx="9" fill={SKIN_D} />
            <circle cx="103" cy="98" r="10" fill={SKIN} />
            <circle cx="217" cy="98" r="10" fill={SKIN} />
            <path d="M99,92 a5,7 0 1 1 8,8 M221,92 a5,7 0 1 0 -8,8" fill="none" stroke={SKIN_D} strokeWidth="1.8" opacity="0.7" />
            <ellipse cx="160" cy="94" rx="57" ry="61" fill="url(#v5senseiSkin)" />
            <ellipse cx="146" cy="78" rx="24" ry="30" fill={SKIN_L} opacity="0.38" />
            <ellipse cx="128" cy="112" rx="11" ry="6.5" fill="#B57A4C" opacity="0.25" />
            <ellipse cx="192" cy="112" rx="11" ry="6.5" fill="#B57A4C" opacity="0.25" />
            <ellipse cx="160" cy="138" rx="34" ry="16" fill="#B57A4C" opacity="0.13" />
            <path d="M104,102 C99,44 120,27 160,27 C200,27 221,44 216,102 C211,78 198,66 184,63 C171,71 149,71 136,63 C120,65 109,78 104,102 Z" fill="url(#v5senseiHair)" />
            <path d="M126,40 C140,32 168,30 186,36 C168,36 144,38 126,40 Z" fill="#454E60" opacity="0.9" />
            <path d="M118,64 C138,46 176,40 200,50" fill="none" stroke="#454E60" strokeWidth="2.2" opacity="0.75" strokeLinecap="round" />
            <path d="M124,78 C142,60 172,54 194,60" fill="none" stroke="#31363F" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
            <path d="M112,90 C124,70 140,60 156,56" fill="none" stroke="#31363F" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />
            <g transform={`translate(0 ${ex.browY})`}>
              <path d="M124,86 Q138,81 152,86" fill="none" stroke={HAIR} strokeWidth="6.5" strokeLinecap="round" transform={`rotate(${ex.browTilt} 138 86)`} />
              <path d="M168,86 Q182,81 196,86" fill="none" stroke={HAIR} strokeWidth="6.5" strokeLinecap="round" transform={`rotate(${-ex.browTilt} 182 86)`} />
            </g>
            <path d="M117,124 C125,147 142,157 160,157 C178,157 195,147 203,124 C197,141 181,151 160,151 C139,151 123,141 117,124 Z" fill={HAIR} opacity="0.32" />
            <ellipse cx="160" cy="146" rx="15" ry="7.5" fill={HAIR} opacity="0.22" />
            <path d="M145,117 Q160,111 175,117 Q160,115 145,117 Z" fill={HAIR} opacity="0.45" />
            {eye(138)}{eye(182)}
            <path d="M160,104 Q155,114 160,118" fill="none" stroke={SKIN_D} strokeWidth="2.6" strokeLinecap="round" />
            {MOUTHS[ex.mouth]}
          </g>
          {gesture === 'celebrate' && g > 0.4 && (<>
            {sparkle(62, 60, 1.05, theme.current, 0)}{sparkle(258, 48, 0.85, theme.accent, 2)}
            {sparkle(274, 128, 0.65, theme.current, 4)}{sparkle(44, 140, 0.6, theme.onBase, 1)}
          </>)}
        </g>
      </svg>
    </div>
  );
};

// v6 name — same component, same props (SYSTEM §V6.4).
export const V6Sensei = V5Sensei;
