import {delayRender, continueRender, staticFile} from 'remotion';

// ============================================================================
// V5 FONTS — bundled locally, loaded via FontFace + delayRender.
// NEVER external requests at render time, NEVER bare /fonts/... URLs without
// staticFile() (that was the v4-era GW2D3 404 failure: the planned typeface
// silently fell back to system fonts for a whole video).
//
// Faces:
//   'Noto Sans JP'       400 / 700 / 900   (Japanese)
//   'Noto Sans Bengali'  400 / 700         (Bangla)
//   'Inter'              400 / 600 / 800   (English gloss / HUD latin)
//   'V5 Display'         700 / 800         (bold condensed display — brand/title)
// A FontCheck composition (Root.jsx) renders one line per face; render it as
// a still before any lesson render and eyeball it (see SYSTEM.md §Fonts).
// ============================================================================

export const V5_FONTS = {
  jp: "'Noto Sans JP', sans-serif",
  bn: "'Noto Sans Bengali', sans-serif",
  en: "'Inter', sans-serif",
  display: "'V5 Display', 'Inter', sans-serif",
};

const DEFS = [
  ['Noto Sans JP', 'fonts/NotoSansJP-Regular.otf', '400'],
  ['Noto Sans JP', 'fonts/NotoSansJP-Bold.otf', '700'],
  ['Noto Sans JP', 'fonts/NotoSansJP-Black.otf', '900'],
  ['Noto Sans Bengali', 'fonts/NotoSansBengali-Regular.ttf', '400'],
  ['Noto Sans Bengali', 'fonts/NotoSansBengali-Bold.ttf', '700'],
  ['Inter', 'fonts/Inter-Regular.ttf', '400'],
  ['Inter', 'fonts/Inter-SemiBold.ttf', '600'],
  ['Inter', 'fonts/Inter-ExtraBold.ttf', '800'],
  ['V5 Display', 'fonts/V5Display-Bold.ttf', '700'],
  ['V5 Display', 'fonts/V5Display-ExtraBold.ttf', '800'],
];

const handle = delayRender('v5-fonts');
if (typeof document !== 'undefined') {
  Promise.all(
    DEFS.map(([family, url, weight]) => {
      const face = new FontFace(family, `url(${staticFile(url)})`, {weight});
      document.fonts.add(face);
      return face.load();
    })
  )
    .then(() => {
      window.__V5_FONTS_READY = true;
      continueRender(handle);
    })
    .catch((err) => {
      // Do not silently continue: surface the failure in the rendered frame
      // metadata so the font-check still shows it.
      window.__V5_FONTS_ERROR = String(err);
      continueRender(handle);
    });
}
