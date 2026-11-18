// ============================================================================
// V5 THEME — one theme object per video (spec §C, §H2).
// Six mandatory semantic roles: base · surface · ink · accent · success ·
// current. Everything else is DERIVED from those six — components never
// hardcode scene colours, and a role's meaning never changes mid-video:
//   accent  = current teaching focus      success = correct / completed
//   current = active position/navigation  ink     = readable text
//   surface = container                   base    = background
// Contrast (spec §C3): body text >= 4.5:1, large display >= 3:1. Validate
// every theme with tools/check-palette.js before rendering.
// ============================================================================

const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

export const rgba = (hex, a) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

// Relative luminance + WCAG contrast ratio (used by the palette checker and
// available to components that need to pick an ink for an accent fill).
export const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};
// Mix two hex colours: mix('#000000','#FFFFFF',0.5) -> mid grey.
export const mix = (a, b, t) => {
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const c = [r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t].map((v) =>
    Math.round(v).toString(16).padStart(2, '0')
  );
  return `#${c.join('')}`;
};

// createTheme: pass the six roles (+ optional explicit overrides); all
// derived tokens are computed here so every video gets the full token set.
export const createTheme = (roles) => {
  const {base, surface, ink, accent, success, current} = roles;
  const onBase = roles.onBase || (contrast('#FFFFFF', base) >= contrast('#111318', base) ? '#FFFFFF' : '#111318');
  const mutedInk = roles.mutedInk || mix(ink, surface, 0.42);
  const mutedOnBase = roles.mutedOnBase || mix(onBase, base, 0.38);
  const surfaceAlt = roles.surfaceAlt || mix(surface, ink, 0.055);
  const accentInk = roles.accentInk || (contrast('#FFFFFF', accent) >= 3 ? '#FFFFFF' : ink);
  // Foreground for text sitting ON a filled role colour — whichever of
  // white / near-black wins on contrast, per theme (audit: tools/check-palette).
  const bestOn = (bg) => (contrast('#FFFFFF', bg) >= contrast('#14181D', bg) ? '#FFFFFF' : '#14181D');
  const onAccent = bestOn(accent);
  const onSuccess = bestOn(success);
  const onCurrent = bestOn(current);
  return {
    name: roles.name || 'v5-theme',
    // six semantic roles
    base, surface, ink, accent, success, current,
    // derived
    onBase, mutedInk, mutedOnBase, surfaceAlt, accentInk, onAccent, onSuccess, onCurrent,
    surfaceLine: roles.surfaceLine || rgba(ink, 0.16),
    warning: roles.warning || '#E8A13A',
    error: roles.error || '#D64541',
    decorative: roles.decorative || rgba(onBase, 0.10),
    textureInk: rgba(onBase, 0.05), // background motifs at 3–7% (spec §B4)
    // layered card shadows (spec §B2) — mandatory, never flat 1px definition
    shadow: '0 3px 8px rgba(0,0,0,0.20), 0 12px 26px rgba(0,0,0,0.22), 0 24px 48px rgba(0,0,0,0.14)',
    shadowSoft: '0 2px 6px rgba(0,0,0,0.16), 0 8px 18px rgba(0,0,0,0.14)',
    radius: {card: 22, main: 28, chip: 12, node: 18},
  };
};

// DRIVEWAY EDITORIAL (VW2D4 package palette) — asphalt base, warm-white
// surfaces, signal-red accent, headlight-amber "current", steering-teal success.
export const DRIVEWAY = createTheme({
  name: 'driveway-editorial',
  base: '#171A1C',
  surface: '#F7F3EA',
  ink: '#1D2126',
  accent: '#C93327', // signal red, darkened from #E2483D so white text on it passes 4.5:1
  success: '#177A68', // steering teal, darkened for text-on-surface contrast
  current: '#FFB020', // headlight amber (navigation fills; ink text on it)
  onBase: '#F7F3EA',
});

// CARBON LEXICON (GW2D4 package palette) — carbon base, ivory surfaces,
// persimmon accent (sole vivid accent), derived gold "current", leaf success.
export const CARBON = createTheme({
  name: 'carbon-lexicon',
  base: '#202429',
  surface: '#F5F1E8',
  ink: '#22262B',
  accent: '#C25327', // persimmon, darkened from #F07842 for 4.5:1 text contrast
  success: '#35794A',
  current: '#E9B44C',
  onBase: '#F5F1E8',
});

// CITY ATLAS (KW2D4 package palette) — a LIGHT theme: atlas-paper base,
// ink-charcoal text, map-pin coral accent, park-green success, gold current.
export const CITY = createTheme({
  name: 'city-atlas',
  base: '#F5F0E5',
  surface: '#FFFDF6',
  ink: '#27343A',
  accent: '#BE4B28', // map-pin coral, darkened from #E66B48 for 4.5:1 on paper
  success: '#2F6B64', // park green, darkened for text contrast
  current: '#D7B66C', // intersection gold (navigation fills; ink text on it)
  onBase: '#27343A',
});

// ============================================================================
// V5.1 ADDENDUM WORKED PALETTES (SPEC-addendum §2) — implemented EXACTLY as
// specified (hex + mutedInk), each pre-validated by ChatGPT for Bangla
// ink-on-surface contrast (13.88 / 12.50 / 12.29 : 1). Subject-environment
// themes; lesson builds may also use their package palette (see SYSTEM.md
// conflict register). Builder must still test every pair actually used.
// ============================================================================

// A — Train & Station "Rail Journey" (light)
export const RAIL = createTheme({
  name: 'rail-journey',
  base: '#EAF1F5', surface: '#F7FAFC', ink: '#172B3A',
  accent: '#D45135', success: '#187A57', current: '#176B87',
  mutedInk: '#526575', onBase: '#172B3A',
});

// B — Hospital "Healthcare" (light)
export const HEALTH = createTheme({
  name: 'healthcare',
  base: '#E7F2ED', surface: '#F3FAF7', ink: '#17352F',
  accent: '#167E78', success: '#287A48', current: '#3867A8',
  mutedInk: '#526E67', onBase: '#17352F',
});

// C — Night City (dark; ink is LIGHT because surfaces are dark)
export const NIGHTCITY = createTheme({
  name: 'night-city',
  base: '#11182B', surface: '#252D46', ink: '#F7F3EA',
  accent: '#FFB454', success: '#65D6A5', current: '#73B9F5',
  mutedInk: '#C0C9D9', onBase: '#F7F3EA',
});

// Type scale (spec §F2, px at 1920×1080). Nothing essential below 16px.
export const V5_TYPE = {
  h0: 84, h1: 58, h2: 46, h3: 37,
  j1: 48, j2: 43, j3: 34,
  b1: 35, b2: 31,
  e1: 24,
  furigana: 21, furiganaMin: 18,
  hud: 20, micro: 17,
};

// Safe area (spec §E1): margins L/R 72, T/B 48 → usable 1776×984.
export const V5_SAFE = {left: 72, right: 72, top: 48, bottom: 48, width: 1776, height: 984};
