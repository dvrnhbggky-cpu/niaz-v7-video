import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {rgba, mix} from '../theme';
import {V5_FONTS} from '../fonts';
import {EASE} from '../motion';
import {V5Sensei} from './sensei';

// ============================================================================
// V6 STAGE KIT — the §V6.9 graphics-redesign layer, as shared code.
//   v6ifyTheme   card depth (item 2) + one light direction (item 3):
//                theme.shadow becomes 3 cast layers falling bottom-right
//                (light from top-left) + an inset top edge-light.
//   V6Stage      layered background (item 1): gradient · texture · giant
//                soft motif with parallax drift (item 6) · radial key
//                light from the top-left · particles (item 6) · vignette.
//   V6Wipe       the transition signature (item 5): two skewed bands
//                (accent, then surface) sweep off in the opening frames,
//                revealing the scene left→right; a warm hairline leads.
//   V6Tape / V6Stamp / V6Hazard — foreground framing (item 9).
//   V6SenseiSpot Sensei grounded (item 13): accent glow + rim light
//                from the light side + a soft ground shadow ellipse.
// Light direction for ALL of v6: from the TOP-LEFT. Shadows therefore
// fall bottom-right (positive x/y offsets) and rim light hugs the
// figure's left edge. Never mix directions inside one scene.
// ============================================================================

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

export const V6_SHADOW =
  'inset 0 1px 0 rgba(255,255,255,0.20), inset 0 0 0 1px rgba(255,255,255,0.05), ' +
  '3px 5px 12px rgba(0,0,0,0.28), 12px 24px 48px rgba(0,0,0,0.34), 22px 48px 96px rgba(0,0,0,0.26)';
export const V6_SHADOW_SOFT =
  'inset 0 1px 0 rgba(255,255,255,0.16), 2px 4px 9px rgba(0,0,0,0.22), 8px 16px 34px rgba(0,0,0,0.26)';

export const v6ifyTheme = (theme) => ({...theme, shadow: V6_SHADOW, shadowSoft: V6_SHADOW_SOFT});

// Deterministic particle field (seeded LCG — same field every render).
const particleField = (n, seed = 987654321) => {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
  return Array.from({length: n}, (_, i) => ({
    x: Math.floor(rnd() * 1920),
    y: Math.floor(rnd() * 1080),
    r: 1.6 + rnd() * 3.2,
    speed: 0.3 + rnd() * 0.55,
    sway: 6 + rnd() * 14,
    phase: rnd() * Math.PI * 2,
    o: 0.16 + rnd() * 0.26,
    i,
  }));
};

const Particles = ({kind, color}) => {
  const frame = useCurrentFrame();
  const dots = particleField(kind === 'snow' ? 30 : 24, kind === 'snow' ? 13579 : 24680);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      {dots.map((d) => {
        const fall = kind === 'snow';
        const y = fall ? (d.y + frame * d.speed) % 1140 - 30 : d.y + Math.sin(frame / 46 + d.phase) * 10;
        const x = d.x + Math.sin(frame / (fall ? 34 : 60) + d.phase) * d.sway + (fall ? 0 : -((frame * d.speed * 0.4) % 60));
        return (
          <div
            key={d.i}
            style={{
              position: 'absolute', left: x, top: y, width: d.r * 2, height: d.r * 2,
              borderRadius: '50%', background: color, opacity: d.o,
              filter: fall ? 'blur(0.6px)' : 'blur(1px)',
            }}
          />
        );
      })}
    </div>
  );
};

const Texture = ({kind, theme}) => {
  if (kind === 'grid') {
    return (
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.5,
          background:
            `repeating-linear-gradient(0deg, ${rgba(theme.onBase, 0.045)} 0 1px, transparent 1px 64px), ` +
            `repeating-linear-gradient(90deg, ${rgba(theme.onBase, 0.045)} 0 1px, transparent 1px 64px)`,
        }}
      />
    );
  }
  if (kind === 'stripes') {
    return (
      <div
        style={{
          position: 'absolute', inset: 0, opacity: 0.55,
          background: `repeating-linear-gradient(90deg, ${rgba(theme.onBase, 0.05)} 0 26px, transparent 26px 84px)`,
        }}
      />
    );
  }
  // grain — SVG fractal noise, the v5 chrome recipe at a touch more presence
  return (
    <svg style={{position: 'absolute', inset: 0, opacity: 0.07}} width="1920" height="1080">
      <filter id="v6grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" /></filter>
      <rect width="1920" height="1080" filter="url(#v6grain)" opacity="0.6" />
    </svg>
  );
};

// V6Stage — layered background (item 1) + ambient motion (item 6).
// texture: 'grid' | 'stripes' | 'grain' · particles: 'snow' | 'dust' | null
// particleColor: snow → frost white; dust → the theme's warm accent.
export const V6Stage = ({theme, motif = 'ア', texture = 'grid', particles = null, particleColor, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const drift = interpolate(frame, [0, Math.max(durationInFrames - 1, 1)], [0, -18], clamp);
  return (
    <AbsoluteFill style={{background: theme.base, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(155deg, ${mix(theme.base, theme.onBase, 0.07)} 0%, ${theme.base} 46%, ${mix(theme.base, '#000000', 0.28)} 100%)`,
        }}
      />
      <Texture kind={texture} theme={theme} />
      <div
        style={{
          position: 'absolute', right: -70, bottom: -170, transform: `translateX(${drift}px)`,
          fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 660, lineHeight: 1,
          color: rgba(theme.accent, 0.08), userSelect: 'none',
        }}
      >
        {motif}
      </div>
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(1150px 640px at 16% 6%, ${rgba(theme.onBase, 0.11)}, transparent 62%)`,
        }}
      />
      {children}
      {particles && <Particles kind={particles} color={particleColor || rgba(theme.onBase, 0.85)} />}
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 120% 105% at 50% 42%, transparent 58%, rgba(0,0,0,0.36) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

// V6Wipe — transition signature (item 5). Bands start COVERING the
// frame and sweep off to the right: warm hairline (f0–10), accent
// (f0–15), surface (f4–19). Content underneath enters from ~f6.
export const V6Wipe = ({theme, warm}) => {
  const frame = useCurrentFrame();
  const band = (delay) => {
    const p = interpolate(frame, [delay, delay + 15], [0, 1], {...clamp, easing: EASE.smoothInOut});
    return {
      position: 'absolute', top: -80, bottom: -80, left: 0, width: '150%',
      transform: `translateX(${interpolate(p, [0, 1], [-8, 118])}%) skewX(-10deg)`,
      pointerEvents: 'none',
    };
  };
  return (
    <>
      <div style={{...band(4), background: theme.surface, zIndex: 60}} />
      <div style={{...band(0), background: theme.accent, zIndex: 61}} />
      <div style={{...band(1), width: '148.6%', background: warm, zIndex: 62}} />
    </>
  );
};

// V6Tape — foreground framing (item 9): a translucent tape strip.
export const V6Tape = ({x, y, rotate = -24, width = 128, color = 'rgba(246,231,190,0.85)', style}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width, height: 34, transform: `rotate(${rotate}deg)`,
      background: color, opacity: 0.9, borderRadius: 2,
      boxShadow: '1px 3px 7px rgba(0,0,0,0.30)',
      backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.20) 0 7px, transparent 7px 14px)',
      zIndex: 40, pointerEvents: 'none', ...style,
    }}
  />
);

// V6Hazard — foreground framing (item 9): diagonal hazard stripe bar.
export const V6Hazard = ({x, y, width, colorA, colorB = 'rgba(10,12,14,0.85)', height = 18, style}) => (
  <div
    style={{
      position: 'absolute', left: x, top: y, width, height,
      background: `repeating-linear-gradient(45deg, ${colorA} 0 22px, ${colorB} 22px 44px)`,
      boxShadow: '0 3px 10px rgba(0,0,0,0.35)', zIndex: 40, pointerEvents: 'none', ...style,
    }}
  />
);

// V6Stamp — foreground signature beat (item 9): a round shipping-style
// stamp that pops in at frame `at` and stays. Render it only from the
// beat it belongs to (e.g. a reveal) so it never leaks early content.
export const V6Stamp = ({theme, at, frame, x, y, size = 148, color, label, sub, rotate = -11}) => {
  const p = interpolate(frame, [at, at + 12], [0, 1], {...clamp, easing: EASE.snapOut});
  if (frame < at) return null;
  const c = color || theme.current;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, width: size, height: size, zIndex: 45,
        transform: `rotate(${rotate}deg) scale(${0.5 + 0.5 * p})`, opacity: p,
        border: `4px solid ${c}`, borderRadius: '50%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: c, background: rgba(theme.base, 0.25), pointerEvents: 'none',
        boxShadow: '2px 5px 14px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: size * 0.30, lineHeight: 1}}>{label}</div>
      {sub && <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: size * 0.105, letterSpacing: 2.2, marginTop: 5}}>{sub}</div>}
    </div>
  );
};

// V6SenseiSpot — Sensei grounded (item 13): radial key glow behind,
// rim light from the top-left via drop-shadow on the figure's alpha,
// and a soft ground-shadow ellipse under the feet.
export const V6SenseiSpot = ({theme, height = 300, rim, style, ...senseiProps}) => {
  const glow = rim || theme.accent;
  const width = Math.round(height * (416 / 560));
  return (
    <div style={{position: 'relative', width, height, ...style}}>
      <div
        style={{
          position: 'absolute', left: -height * 0.28, top: -height * 0.10,
          width: height * 1.1, height: height * 1.1, borderRadius: '50%',
          background: `radial-gradient(circle, ${rgba(glow, 0.20)} 0%, transparent 62%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute', bottom: -6, left: width * 0.10, width: width * 0.80, height: 26,
          borderRadius: '50%', background: 'rgba(0,0,0,0.42)', filter: 'blur(9px)', pointerEvents: 'none',
        }}
      />
      <div style={{position: 'relative', filter: `drop-shadow(-3px 0 5px ${rgba(glow, 0.40)}) drop-shadow(3px 6px 10px rgba(0,0,0,0.35))`}}>
        <V5Sensei theme={theme} height={height} {...senseiProps} />
      </div>
    </div>
  );
};
