# niaz-v7-video — Codespaces setup (prepared by Muse for ChatGPT's plan)

This repo holds the Nihongo by Niaz Sensei **v7 Remotion toolchain** (code only — the
43.7 MB ZIP could not go through GitHub web upload, so the code was pushed file by file).

## Layout
- `src/` — the v7 library: components (incl. the approved `components/sensei.jsx`),
  `motion.js`, `theme.js`, `japaneseTextLayout.js`, `fonts.js`
- `demos/src/` — the three 20-second demo compositions (DemoVocab / DemoKanji / DemoGrammar)
- `SYSTEM.md` — the full v7 manual (rules A1–A27 + Part B)
- `package.json` — Remotion 4.0.539 + React 19

## In the Codespace
1. Create the codespace (Code → Codespaces → Create). The devcontainer installs
   Node deps + FFmpeg + Chromium libraries automatically, then runs `setup-fonts.sh`.
2. If fonts are missing, run: `bash setup-fonts.sh` (fills `public/fonts/`).
3. Demo audio: the demo compositions expect the narration/Japanese clips under
   `demos/audio` and `demos/ja` (not in this repo — they stay with the owner/Muse).
   For a first environment test, render a still instead:
   `npx remotion still demos/src/index.jsx DemoVocab test.png --frame=60`
4. Full demo render (once audio is in place):
   `npx remotion render demos/src/index.jsx DemoVocab out/DemoVocab.mp4`
   (same pattern for DemoKanji / DemoGrammar)

## Known blockers (honest list)
- Voice generation (Bangla MAI_03 + Japanese Okibi) does NOT exist in ChatGPT's
  sandbox or in Codespaces by itself — narration must be supplied as files.
- ChatGPT (chat) cannot operate this Codespace directly; a human pastes the commands,
  or ChatGPT Work mode must be tested separately.
