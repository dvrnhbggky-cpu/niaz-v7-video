import React from 'react';

// ============================================================================
// V5Illustration — small meaningful drawn icons (spec §B5). One consistent
// 2D style: rounded shapes, 5px line weight on a 100×100 grid, palette
// colours only (ink lines, accent/success/current fills from the theme).
// Every example carries one; an illustration must reinforce the example's
// context — never unrelated filler. Size 64–112px in scenes.
// Usage: <V5Illustration name="camera" theme={theme} size={96}/>
// ============================================================================

const P = ({d, fill, stroke, sw = 5, children, ...rest}) =>
  children ? (
    <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest}>
      {children}
    </g>
  ) : (
    <path d={d} fill={fill || 'none'} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" {...rest} />
  );

export const V5Illustration = ({name, theme, size = 96, style}) => {
  const ink = theme.ink;
  const acc = theme.accent;
  const suc = theme.success;
  const cur = theme.current;
  const surf = theme.surface;
  const art = {
    // v6 additions (2026-11-14): snow (frost — kanji 凍 hook) and heart
    // (relationship vocab — VW3D1 J01) were missing from the v5 set;
    // §V6.3 G4 (an illustration on EVERY example) requires real glyphs,
    // not silent substitutions.
    snow: (
      <>
        <P d="M50 12 L50 88 M17 31 L83 69 M83 31 L17 69" stroke={acc} sw={5} />
        <P d="M42 22 L50 30 L58 22 M42 78 L50 70 L58 78 M24 40 L34 44 L32 54 M76 60 L66 56 L68 46" stroke={acc} sw={4} />
        <circle cx="50" cy="50" r="4.5" fill={acc} />
      </>
    ),
    heart: (
      <>
        <P d="M50 85 C22 64 14 47 21 33 C27 20 45 21 50 35 C55 21 73 20 79 33 C86 47 78 64 50 85 Z" fill={acc} />
        <P d="M32 34 a10 8 0 0 1 8-6" stroke={surf} sw={4.5} />
      </>
    ),
    camera: (
      <>
        <P fill={acc}><rect x="10" y="34" width="80" height="48" rx="10" /></P>
        <P fill={surf}><rect x="34" y="24" width="32" height="12" rx="5" /></P>
        <circle cx="50" cy="58" r="15" fill={surf} />
        <circle cx="50" cy="58" r="7" fill={ink} />
        <circle cx="80" cy="44" r="3.6" fill={surf} stroke="none" />
      </>
    ),
    car: (
      <>
        <P d="M12 66 L20 44 Q22 37 30 36 L68 36 Q76 37 79 44 L88 66" fill={acc} />
        <P fill={surf}><path d="M26 45 L36 45 L36 57 L22 57 Z" stroke="none" /><path d="M41 45 L60 45 L66 57 L41 57 Z" stroke="none" /></P>
        <P fill={surf}><rect x="8" y="62" width="84" height="13" rx="6" /></P>
        <circle cx="28" cy="78" r="8" fill={ink} /><circle cx="72" cy="78" r="8" fill={ink} />
        <circle cx="28" cy="78" r="3.4" fill={surf} stroke="none" /><circle cx="72" cy="78" r="3.4" fill={surf} stroke="none" />
      </>
    ),
    rain: (
      <>
        <P d="M28 42 a15 15 0 1 1 6-28 a19 19 0 0 1 34 6 a13 13 0 1 1 -2 22 Z" fill={theme.surfaceAlt} stroke={ink} />
        {[26, 48, 70].map((x) => (
          <P key={x} d={`M${x} 58 L${x - 5} 74 M${x + 8} 60 L${x + 3} 76`} stroke={acc} sw={5.5} />
        ))}
      </>
    ),
    wiper: (
      <>
        <P fill={theme.surfaceAlt} stroke={ink}><rect x="12" y="18" width="76" height="52" rx="9" /></P>
        <P d="M50 66 L76 30" stroke={acc} sw={6} />
        <circle cx="50" cy="66" r="5.5" fill={ink} />
        <P d="M24 30 q6 5 12 1 M22 44 q7 5 13 1" stroke={suc} sw={4} />
      </>
    ),
    wheel: (
      <>
        <circle cx="50" cy="50" r="36" fill="none" stroke={ink} strokeWidth="7" />
        <circle cx="50" cy="50" r="10" fill={acc} />
        <P d="M50 40 L50 16 M42 56 L20 66 M58 56 L80 66" stroke={ink} sw={6.5} />
      </>
    ),
    key: (
      <>
        <circle cx="36" cy="38" r="17" fill="none" stroke={cur} strokeWidth="7" />
        <P d="M48 50 L80 82 M66 68 L76 58 M74 76 L84 66" stroke={cur} sw={7} />
      </>
    ),
    mirror: (
      <>
        <P fill={theme.surfaceAlt} stroke={ink}><rect x="24" y="16" width="52" height="40" rx="12" /></P>
        <P d="M50 56 L50 72 M34 84 L66 84 M50 72 L50 84" stroke={ink} />
        <P d="M34 44 L52 26 M44 48 L60 32" stroke={acc} sw={4.5} />
      </>
    ),
    building: (
      <>
        <P fill={theme.surfaceAlt} stroke={ink}><rect x="24" y="14" width="52" height="72" /></P>
        <P d="M18 86 L82 86" stroke={ink} sw={6} />
        {[30, 46, 62].map((y) => [34, 46, 58].map((x) => <rect key={`${x}${y}`} x={x} y={y - 16} width="9" height="11" fill={cur} />))}
        <rect x="44" y="66" width="12" height="20" fill={acc} />
      </>
    ),
    pin: (
      <>
        <P d="M50 88 C50 88 22 58 22 38 a28 28 0 1 1 56 0 C78 58 50 88 50 88 Z" fill={acc} />
        <circle cx="50" cy="38" r="12" fill={surf} />
      </>
    ),
    check: (
      <>
        <circle cx="50" cy="50" r="38" fill={suc} />
        <P d="M33 51 L45 63 L68 38" stroke="#FFFFFF" sw={8} />
      </>
    ),
    cross: (
      <>
        <circle cx="50" cy="50" r="38" fill={theme.error} />
        <P d="M38 38 L62 62 M62 38 L38 62" stroke="#FFFFFF" sw={8} />
      </>
    ),
    book: (
      <>
        <P d="M22 20 C34 13 44 15 50 22 L50 82 C44 75 34 73 22 80 Z" fill={acc} />
        <P d="M78 20 C66 13 56 15 50 22 L50 82 C56 75 66 73 78 80 Z" fill={suc} />
        <P d="M29 30 C36 26 42 27 46 30 M29 42 C36 38 42 39 46 42 M54 30 C58 27 64 26 71 30 M54 42 C58 39 64 38 71 42" stroke={surf} sw={3.6} />
      </>
    ),
    sun: (
      <>
        <circle cx="50" cy="50" r="17" fill={cur} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = (a * Math.PI) / 180;
          return <P key={a} d={`M${50 + 24 * Math.cos(r)} ${50 + 24 * Math.sin(r)} L${50 + 33 * Math.cos(r)} ${50 + 33 * Math.sin(r)}`} stroke={cur} sw={6} />;
        })}
      </>
    ),
    road: (
      <>
        <P d="M38 88 L47 14 L53 14 L62 88 Z" fill={ink} />
        <P d="M50 78 L50 68 M50 56 L50 46 M50 34 L50 26" stroke={cur} sw={4} />
        <P d="M14 88 L86 88" stroke={suc} sw={6} />
      </>
    ),
    sparkle: (
      <>
        <P d="M50 12 L57 40 L86 48 L57 56 L50 86 L43 56 L14 48 L43 40 Z" fill={cur} stroke="none" />
        <P d="M80 66 L83 76 L93 79 L83 82 L80 92 L77 82 L67 79 L77 76 Z" fill={acc} stroke="none" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
      {art[name] || art.sparkle}
    </svg>
  );
};
