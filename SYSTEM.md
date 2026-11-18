# NIHONGO VISUALS v7 — SYSTEM MANUAL

The v7 visual + script system for **Nihongo by Niaz Sensei** lesson videos
(JLPT N5–N3 · Vocabulary / Kanji / Grammar), ordered by Niaz on 2026-11-17.

**VERSIONING RULE (Niaz, 2026-11-17):** a new version COMPILES FORWARD
every rule and animation change from v1→v6 — each was given because it
matters — and only then adds the new version's changes. A new version is
never built from a summary of the old ones, and never focuses only on
what is new. Accordingly, **Part A of this manual restates every carried
rule as a complete, explicit section**, each tagged with its source so
Niaz can audit that nothing was dropped. **Part B** then adds v7's own
changes. Where a Part B rule and a Part A rule ever conflict, the
conflict is registered in §V7.9 — never resolved silently.

**What v7 is, in one line:** v1–v6 complete, plus a teacher's script
that remembers — every lesson now teaches like one continuous teacher
across N5 → N4 → N3, recalling earlier-level material at the exact
moment a new item connects to it (Part B, §V7.0–§V7.7).

**Spec map:**
- Part A sources: `nihongo-visuals-v5/SYSTEM.md`, `nihongo-visuals-v5/
  RULES-MASTER-v1-v6.md`, `nihongo-visuals-v6/SYSTEM.md`, and Niaz's
  standing rules as recorded in MEMORY.md.
- Part B source: `jlpt-master-study/v7-design.md` (Niaz's direction,
  2026-11-17) + his approval of suggestions 1–7 the same evening.
  Suggestion #8 (Recall Shorts) was **explicitly excluded by Niaz** and
  is NOT part of v7 (§V7.8).

---

# PART A — CARRIED FORWARD FROM v1–v6 (complete, auditable)

## A1. Audio law — the narration is the only audio
*(carried from v6/standing rule — RULES-MASTER "AUDIO LAW", v6 §V6.0)*

- The pre-generated narration file is the ONLY audio source. Never
  generate, replace, re-record, translate or paraphrase narration;
  never change speaker identity, pitch, accent, vocal texture, style
  or speed. Visuals adapt to the audio, never the reverse.
- Japanese audio plays as loud as Bangla and finishes fully before the
  Bangla begins — preserve the narration's order and timing exactly.
- Mix: one fixed gain + deterministic limiter only; never dynamic
  loudnorm on lesson audio. Delivery loudness target is **−15±1 LUFS**
  (standing rule, §A23).

## A2. Voice casting
*(carried from v6/standing rule — MEMORY voice rules)*

- Bangla narration: **MAI_03, speed 100** (natural speed), always.
- Japanese, Days 1–6: **ElevenLabs v4 "Okibi — Calm, Warm,
  Conversational"** only (~1 credit/character, web UI, Account B).
  Local Japanese voices (MAI_03 Japanese, gTTS) were rejected by Niaz
  (2026-11-14) and are never substituted.
- Japanese, Day 7 (weekly test/review lessons) ONLY: **VoiceVox
  青山龍星 (Aoyama Ryusei), style 13**, Japanese only (scoped exception,
  Niaz 2026-11-15).
- **Voice-before-command:** real Japanese clips are generated FIRST;
  narration is assembled at the clips' real durations; only then is a
  build written against the real timing map. Never build against
  silent-placeholder timing for delivery. **No-voice-no-upload:** a
  lesson with placeholder (silent) Japanese is never uploaded; if a
  real voice exceeds its slot, extend/pause that scene ~0.1–0.4s so the
  voice finishes before Bangla begins — no full re-time rebuild.

## A3. The ×1 rule (vocabulary + kanji)
*(carried from v6/standing rule — RULES-MASTER, clarified 2026-11-07)*

- In Vocabulary and Kanji lessons, each Japanese word is **HEARD
  exactly once in the whole video**. No spoken recap/revision.
- Explanation text never contains the kana word (say "এই শব্দটা");
  example sentences are shown on screen only — only their Bangla
  meaning is spoken.
- Summary/outro are screen-only — no spoken revision (§A18).
- v7 interaction: a recalled item's Japanese is shown on its Recall
  Card (§V7.4) but is **NOT re-spoken** in vocab/kanji lessons; the new
  word's single spoken moment is the only Japanese audio for that item.

## A4. Verbatim law
*(carried from v6/standing rule — RULES-MASTER "VERBATIM LAW")*

- All lesson content (words, readings, meanings, examples, practice
  questions, answer keys) comes from the book data, character-for-
  character. Never invent a word, reading, gloss, translation, example
  or answer. The book ANSWER KEY is the only authority for answers.
- Missing data = **BLOCKER**, never filled by invention.
- Book printing errors: per Niaz's 2026-11-17 decision, misprints are
  CORRECTED — voice and screen both use standard forms; the verbatim
  transcription files stay as the untouched record of what was printed.

## A5. Furigana law — Rule Zero
*(carried from v6/standing rule — RULES-MASTER "FURIGANA LAW", v6 §V6.0, §V6.9 item 12)*

- EVERY kanji on screen carries its reading in ruby directly above it,
  in the same frame, from the first frame it appears — titles, word
  cards, diagram labels, callouts, practice, summary, signs. The only
  exception is the question-phase ban class in §A6.
- Katakana/hiragana need no ruby. Ruby ≥28% of base glyph size
  (optical target ≈0.5× per §V6.9 item 12), accent or warm-white
  colour, never dim grey; ruby arrives WITH its glyph, never as a
  ghost, and never detaches (phrase-segment layout, §A27).
- Every build carries a complete per-kanji ruby map for its scope and
  a delivery gate listing every kanji string in sampled stills with
  its ruby.

## A6. Practice furigana bans + answer-leak gate
*(carried from v6/standing rule — MEMORY 2026-11-14 refined scope; v6 §V6.3 Gate V6-G1)*

- Furigana is BANNED at question phase (before the reveal) ONLY where
  it hands over the answer:
  1. Kanji Practice II — none on the stem word.
  2. Kanji Practice III — none on the kanji options.
  3. Kanji test 問題1 — none on the target word.
  4. Kanji test 問題2 — none on the kanji options.
  Furigana RETURNS at the reveal in all four. Everywhere else it stays:
  Kanji Practice I, kanji test 問題3, ALL Vocab and Grammar practice.
  The gate is structural (component strips ruby under a gate at
  question phase) and QA inspects every practice-question still AT
  QUESTION PHASE; a banned furigana = FAIL, no upload. Also FAIL at
  question phase: the correct option highlighted, hinted, emphasised
  in audio-visual sync, or pre-marked in any way.
- **Answer-leak gate (audio):** in ANY practice/quiz section, no
  Japanese audio that reveals the answer may play before that
  question's think-time hold ends / before the reveal — above all
  問題1: the target word's pronunciation sits AT the reveal, never
  before it. Reading the printed question text aloud is fine. HARD QA
  GATE every build: audit every practice question's Japanese units
  against its hold.

## A7. Motion system — Level-Up v3 + v5 motion values
*(carried from v6/standing rule — MEMORY "LEVEL-UP v3" 2026-11-10; RULES-MASTER v3; v5 SYSTEM §3)*

- **Spring-physics entrances** (no linear slides): spring damping 18,
  stiffness 140, mass 0.8. Motion presets (30fps): micro 6f ·
  transition 18f · card entrance 14f · emphasis 10f · exit 12f ·
  stagger 5f · karaoke colour transition 4f · pop scale 1.035→1.
- **Parallax + ambient motion — no fully static frame, ever.** Slow
  background parallax drift + theme particles on every scene (§A12
  item 6).
- **Self-drawing lines**, **morphing cards**, **masked wipes**,
  **particle/stamp feedback**, **slim progress HUD**.
- **Scene change every 1–2s**; visuals track the narration word by
  word; a meaningful composition change every 30–60f, timed by the
  narration — never purposeless loops.
- **Word-by-word kinetic typography**; premium 2D editorial motion
  graphics; karaoke liveliness: the spoken word carries an underline
  sweep + slight scale pulse timed to its voicing window (§A12 item 7),
  with karaoke timing taken from the FINAL audio timestamps.
- Designed exits: anything that entered with animation leaves with
  animation (slide / morph / eased fade) — no hard element cuts
  (§A12 item 4). Deterministic blink (90–150f interval, 5f closed) +
  ±3px breathing; no Math.random anywhere in renders.
- Helpers are law, not suggestions: `enter()`, `fadeIn()`, `popAt()`,
  `settleSpring()`, `drawOn()`, `blinkOpenness()` in `src/motion.js`.

## A8. Sensei law — the drawn Niaz Sensei
*(carried from v6/standing rule — RULES-MASTER "SENSEI LAW"; v5 SYSTEM §7; v6 §V6.4, §V6.8, §V6.9 item 13)*

- The drawn 2D motion-graphics "Niaz Sensei" character appears in every
  lesson — **library component ONLY** (`V6Sensei`/`V5Sensei` in
  `src/components/sensei.jsx`), never hand-redrawn (long neck / stick
  arm = automatic fail). Face INSPIRED BY Niaz's photo: swept black
  hair, thick brows, brown eyes, subtle jaw stubble; navy suit,
  waistcoat, red tie, readable **"NIAZ SENSEI"** name badge. Drawn
  character — never a real photo.
- Full-body model sheet (v6 §V6.4): viewBox with widened canvas (the
  v6 fix: `−48 0 416 560`), legs + shoes, figure ≈4.6 heads (band
  4.5–4.8), full leg ≈42% of height (band 39–42%), neck shorter than
  head height, outline #26323D, **3 tones per material** (L/base/D:
  skin, hair, jacket, vest, trousers).
- **True point gesture:** two-segment arm; point = elbow 0, index
  extended ON the forearm axis, curled fingers + thumb tucked below
  the axis — one straight shoulder→fingertip line, never a thumbs-up
  silhouette at any size. Gestures travel out over 10f, hold, return
  over 12f (spring-settled).
- **Size: ~300px at 1080p** (§V6.8 directive, §V6.9 item 13 — this
  overrides the v5 ≥324px/30%-of-frame staging), soft ground shadow,
  rim light from the scene's declared light side; expressions change
  at narration beats.
- **Behaviours (locked semantics):** point at the active word/rule ·
  nod = correct · facepalm = ダメ/wrong · celebrate = reveal ·
  open-palm explain · think · wave (outro). 11 expressions in the
  library set. Sensei never covers the teaching target; staging moves
  12–18f, never teleports.

## A9. Themes — fresh per lesson, no continuity
*(carried from v6/standing rule — MEMORY theme rule 2026-11-08/10; v5 SYSTEM §2)*

- EVERY lesson gets its own fresh premium theme, even within a track —
  no continuity of palette between lessons. A theme is data, never
  code: six semantic roles (`base · surface · ink · accent · success ·
  current`) via `createTheme()`; all other tokens derived; text on a
  filled role colour always uses the derived on-fill foreground.
- Contrast law: body text ≥4.5:1, large display ≥3:1; every theme is
  validated with the palette checker before rendering (ALL PAIRS PASS
  or the theme does not render).

## A10. Editorial system — rhythm, framing, energy
*(carried from v6/standing rule — v5 SYSTEM §4)*

- **Micro-rhythm (invariant):** IDENTIFY → REVEAL → TEACH → APPLY →
  ANCHOR per item. **Macro-rhythm (varied):** framings, staging,
  entrances and background intensity change per deterministic
  variation schedules; **never the same (framing + Sensei position +
  background + entrance) combination in consecutive scenes; max 2 in a
  row overall.**
- **Framings F1–F5:** F1 Hero Stage · F2 Explanation Board · F3
  Comparison Stage · F4 Classroom Stage · F5 Context Stage.
- **Backgrounds B1–B3:** quiet 10–20% detail (long explanations) ·
  active 25–40% (diagrams/examples) · impact 40–60% (reveals/jokes
  only, 30–90f).
- **Chapters:** vocab 6×5 (chapter card 24–36f, no narration) · kanji
  2×4 · grammar per point. HUD shows item + chapter + % and updates
  AFTER the item's anchor.
- **Energy curve:** high open → moderate explain → mid-high examples →
  controlled complex → mid-lesson refresh at the real ~min 5–6 point
  (3-stage, 81–117f, only at an approved narration pause) → practice
  higher → reveal peak → calmer summary → confident outro.

## A11. Per-scene bespoke law — composition registry
*(carried from v6/standing rule — v6 §V6.1)*

- A lesson uses **≥12 distinct compositions** from the registry; no
  composition repeats more than **2× consecutively**.
- Every scene type carries a **named per-theme treatment** (treatment
  names derived from the lesson's own theme), recorded in the build's
  polish log. A scene rendered with the bare default treatment when a
  named one exists = polish-loop FAIL.
- Registry: **C01** Word-Hero Stage · **C02** Kanji Stroke Stage
  (3-zone) · **C03** Grammar Connection Board （接続） · **C04**
  Classroom Dialogue Stage · **C05** Comparison / Twin Stage · **C06**
  Diagram / Map Stage · **C07** Example Reading Stage (three-layer) ·
  **C08** Grid / Wall Stage · **C09** Practice Question Stage · **C10**
  Practice Think Stage · **C11** Reveal / Stamp Stage · **C12**
  Summary / Mind-Map Stage · **C13** Intro Hook / Title Stage · **C14**
  Outro / Next-Lesson Stage · **C15** Signboard Environment Stage
  (kanji) · **C16** CrossRef Callout Stage. (v7 adds C17–C19 in
  §V7.4/§V7.6.)

## A12. Graphics-redesign law — the 15 items
*(carried from v6/standing rule — v6 §V6.9, approved by Niaz 2026-11-14)*

1. **Layered backgrounds:** gradient + visible texture (paper grain /
   blueprint grid / stripes) + large soft theme motif behind
   everything + vignette. Flat single-colour backgrounds are banned.
2. **Card depth:** 3-layer shadows + inset top edge-light + slight
   glass feel.
3. **One light direction** per scene; shadows, glows and Sensei rim
   light all agree with it.
4. **Designed exits** (see §A7).
5. **Transition language:** masked wipes, morphs or camera pushes — a
   named signature per theme — not plain cuts.
6. **Ambient motion** on every scene (see §A7).
7. **Karaoke liveliness** (see §A7).
8. **Composition variety:** subject placement rotates (centre / right /
   two-column, golden-ratio aware); one fixed arrangement must not
   dominate.
9. **Foreground framing:** a designed element crosses at least one
   frame edge per scene type (tape, stamp, ticket corner, strap,
   hazard stripe).
10. **Richer palettes, warm accent USED:** base + accent + secondary
    gradient pair; the theme's warm accent visibly appears on every
    scene type.
11. **Display typography:** headlines in true display weights
    (black/extra-bold); numerals and badges in the condensed display
    face. One-weight rendering is banned.
12. **Furigana optical tuning** (see §A5).
13. **Sensei smaller + grounded** (see §A8).
14. **Reference board first:** before a build's first still, target
    stills from Claude's best work are consulted and the richness
    traits named in the polish log.
15. **Beauty gate before render:** per scene type, on stills BEFORE
    the full render — background layers ≥3 · cast shadows present ·
    warm accent visibly present · no large dead area (occupancy ≥65%
    settled) · Sensei at the §A8 size. A failing scene type does not
    render.
- Implementation: `src/components/stage.jsx` (V6Stage / V6Wipe /
  V6Tape / V6Stamp / V6SenseiSpot / v6ifyTheme) carries items 1–3, 5,
  6, 9, 13 as shared code.

## A13. Track systems
*(carried from v6/standing rule — v5 SYSTEM §8; RULES-MASTER v4)*

- **Vocabulary:** word-hero choreography — the word's single spoken
  moment (×1) coincides with its visual peak, timed to the FINAL audio
  timestamp, never the reverse. Word bank: **6 cells per page**, fixed
  type (JP 48 / furigana 25 / Bangla 32 / EN 23 / index 20) that never
  auto-shrinks; long entries wrap at full size. HUD labels are
  section-aware single-line short labels ("WORD 02/30").
- **Kanji:** 3-zone card (A glyph stage · B readings+memory · C
  Sensei). Kanji Card 4.1: stroke-order numbers, radical highlight,
  memory-hook breakdown, lookalike warning, ALL book examples per card,
  no cap. Strokes draw with total time **Ds = clamp(38, 90, 78 −
  2.1×(n−6))** frames, distributed by path length (final stroke ×1.2);
  current stroke = accent + glow, completed = ink, radical =
  current-colour with 18% wash; numbered start dots visible from frame
  0, the active dot enlarging during its stroke. ON = filled accent
  box; KUN absence shows exactly 「বইয়ে নেই」. Index strip = track
  variant (210×90 cells, book numbers, states current/done/upcoming/
  hidden). Memory hook = 5-beat comedy (structural components, never
  presented as etymology). Recap = all 8 as a study sheet, screen-only.
- **Grammar:** funny "Niaz Sensei classroom" (see §A15). 接続 and 活用
  are SEPARATE charts; 接続 is displayed before any long example and is
  encoded from the pattern's ACTUAL connection data (never a forced
  generic table; inapplicable categories render as labelled
  non-applicable rows). Examples are three-layer (JP+furigana / Bangla
  / English) — always. Mind-map summaries use real curved connectors
  and a precise Bangla comparison callout. Ordering scenes show slots
  BEFORE tiles and never render raw placeholders.

## A14. Grammar 接続 hero treatment — slot/rail lock-in
*(carried from v6/standing rule — v6 §V6.10 + addendum)*

- The 接続 (connection) explanation is the MOST important part of a
  grammar lesson; it gets the lesson's highest animation budget and
  its own polish-loop passes. A grammar build whose 接続 scene is a
  static card FAILS the design gates.
- **Slot/rail lock-in:** the candidate base travels into the form's
  slot; the correct base LOCKS with a gold ring + check, and the join
  seam pulses exactly at the base–form boundary. Wrong candidates are
  shown too: ghosted in, slashed, ダメ stamp — contrasts (e.g. plain
  form vs ta-form) are taught side by side, never merely stated in
  Bangla.
- Morph steps show how the base itself changes (operation labels on
  the arrows); then the completed form reads as one word.
- **ALL base types:** nouns attach directly; verb plain form travels
  as-is; い-adjectives lock as their whole plain form; な-adjectives
  arrive WITH their な, which visibly drops away as the STEM alone
  locks. Each base type keeps its own morph steps and its own
  wrong-candidate slashes (a な-adjective trying to lock with な still
  attached gets the ダメ）.

## A15. Grammar script law — funny classroom, real names
*(carried from v6/standing rule — MEMORY grammar rules 2026-11-08/16)*

- Grammar lessons are a **funny "Niaz Sensei classroom"**: funny
  teacher–student conversation, sarcastic jokes, Bangladeshi-life
  examples, no repeated filler — with full accuracy for the level.
- **MAIN RULES explained properly — above all the connection rules
  （接続）:** what attaches before a form (noun directly; verb plain
  form; い-adjective whole; な-adjective stem) and how the form itself
  conjugates （みたいだ like a な-adjective; らしい/っぽい — nouns only —
  like い-adjectives). Jokes wrap rules, never replace them.
- **NO INVENTED METAPHOR NICKNAMES:** never rename grammar forms or
  connections with made-up metaphor labels; always use the form's real
  name. Metaphors only as brief jokes that never replace terminology.
- **ALL book examples and practice questions are included, none
  dropped.**

## A16. Example-reading system
*(carried from v6/standing rule — v5 SYSTEM §9)*

- One ExampleReading system, track-configured. Highlight drivers:
  vocab = Bangla meaning beats · kanji = Bangla meaning beats (+ an
  explicitly assigned existing audio event) · grammar = JP audio
  phrase timings, then Bangla beats. Grammar target emphasis is a
  SEPARATE persistent state from karaoke states. Multiple examples
  REPLACE, don't stack.
- Every example sentence in every track carries its illustration/icon
  (Gate V6-G4, §A21 — absent = FAIL).
- Kanji signboard scenes are miniature environments (a sign ≠ a
  teaching sentence).

## A17. Practice engine
*(carried from v6/standing rule — v5 SYSTEM §9; §A6 gates)*

- One Practice Engine (timeline · tracker · countdown · Sensei ·
  reveal controller · explanation engine) + renderers per type (MCQ;
  duel and ordering on the same state machine).
- Question life: entrance → options stagger → **THINK** (narration-led
  holds; template default 180f, ring p(f) = clamp(1 − (f −
  thinkStart)/thinkDur)) → **reveal** (border → stamp 「সঠিক উত্তর」→
  hand-drawn ellipse around the answer TEXT in the theme's `current`
  colour → wrong options recede to 58% floor) → explanation in 3
  layers (clue → proof → Bangla why under 「কেন এই উত্তরটি সঠিক？」),
  narration-led, never cut.
- Part title cards at every part boundary; finale treatment on the
  last question. Set sizes asserted in code (vocab/kanji/grammar
  practice contracts; book wins on option counts, ≥2 options).
- Think frames are DESIGNED compositions (Gate V6-G3 occupancy
  applies, §A21): the think-state composition (§V6.4 `V6ThinkState` —
  staggered RECALL lanes of previously taught items, never the current
  answer surface) fills the hold. v7 extends this: §V7.2.

## A18. Intro / summary / outro — roadmap becomes achievement
*(carried from v6/standing rule — v5 SYSTEM §9)*

- **The roadmap shown at the beginning becomes the achievement
  displayed at the end.** Intro: hook at F000 (a real problem, meaning
  hidden) → brand EXACTLY ONCE → title+furigana as one object →
  roadmap preview (real contents, preview state).
- Summary: the same positions resolve to learned state (✓ + completion
  animation, never colour alone); vocab recap = ALL words with
  readings+meanings in the recap grid · kanji = all 8 study sheet ·
  grammar = family mind-map + Bangla comparison panel. Reading holds
  are design targets (vocab 18–25s · kanji 12–16s · grammar 15–22s),
  extended for density, never compressed.
- Outro: Sensei mirrors the intro position, closing line, book-order-
  VERIFIED next-lesson tease (never guessed), restrained subscribe
  cue, clean final hold. Summary/outro are screen-only — no spoken
  revision (×1, §A3). Brand count in the whole video = 1.

## A19. Cross-track reminder callouts
*(carried from v6/standing rule — v5 SYSTEM §10; MEMORY 2026-11-13)*

- When a lesson hits an important kanji/grammar/vocab point from
  another track, a designed callout names the REAL other-track lesson.
  **Verified references only — never fabricate a reference;**
  unverifiable → track name only.
- Identity is CONSTANT: dark navy panel `#14273D`, teal accent
  `#1E8C82`, radius 20, reserved zone 760×176, position flexible —
  never obscuring the current target. Contents: CROSS-TRACK CONNECTION
  header, 64×64 track tile （字/文/語）, optional VERIFIED lesson
  reference, Bangla line. Timeline: 8f entrance · contents stagger ·
  hold 75–105f · 10f exit. Caps per lesson: vocab ≤6 (rec. 3–5) ·
  kanji ≤3 · grammar ≤3; multiple connections on one item group into
  one callout. An entry carrying a crossRef shows the teal
  V5CrossRefDot in grids.
- v7 note: cross-LEVEL recall (§V7.4 Recall Card) is a different,
  additional surface — it does not replace this cross-TRACK callout,
  and the two never stack on the same frame.

## A20. Polish loop law
*(carried from v6/standing rule — v6 §V6.2)*

- For **every scene type**, in order: (1) render stills (question /
  mid / settle frames for practice; hero / mid / anchor elsewhere);
  (2) inspect each still at full crop (100%, not timeline thumbnails);
  (3) write findings into the build's **POLISH-LOG.md** (per scene
  type: composition + treatment name, what was wrong, what changed —
  no log entry = the pass did not happen); (4) fix, re-render stills,
  re-inspect; (5) **minimum 2 polish passes per scene type** before
  acceptance. The polish log ships with the delivery report.

## A21. Design-first QA gates
*(carried from v6/standing rule — v6 §V6.3; RULES-MASTER executor discipline)*

- Gates run DESIGN FIRST, technical second. A design FAIL stops the
  build before any technical gate runs.
- **G1 · Practice furigana gate** (§A6) — structural, per-question
  question-phase stills.
- **G2 · Scene-type stills** — a full-crop still of every scene type,
  inspected against its spec: any production text, placeholder,
  clipped glyph, detached ruby, or obscured target = FAIL. Banned on
  screen (zero tolerance): production notes, "SCREEN ONLY", timestamps,
  frame numbers, internal labels.
- **G3 · Occupancy ≥65% on EVERY frame class**, including practice
  think frames: designed content (panels, lanes, Sensei stage, HUD,
  motif) must cover ≥65% of the frame; empty background does not count.
- **G4 · Illustration on every example** (§A16).
- **Then the inherited technical gates:** full decode exit 0 · audio
  packet identity vs the narration (final muxer-padding packet
  excepted) · loudness −15±1 LUFS · silence audit = exactly the
  planned think holds · brand count = 1 · ffprobe spec (1080p30,
  yuv420p limited, ≤ cap) · verbatim line check. A failing gate means
  fix + re-render — never deliver-with-caveats, and never claim
  delivery before an end-to-end check of the actual file.

## A22. Encode & file law
*(carried from v6/standing rule — RULES-MASTER "ENCODE & FILE LAW")*

- **1920×1080, 30fps, H.264, yuv420p LIMITED range, AAC 48kHz.**
- **Quality protection (Niaz, 2026-11-17):** NEVER reduce final
  resolution, frame rate, composition, animation smoothness,
  typography/furigana quality, subtitle readability, motion graphics,
  audio clarity/sync, voice quality, or effects/transitions to gain
  speed. Speed comes from infrastructure only.
- **Size cap:** every delivered lesson file ≤ ~105 MB — compute the
  video bitrate from duration (`100 MB × 8 ÷ seconds`), forced with
  `-maxrate`/`-bufsize` + `nal-hrd=cbr` (plain `-b:v` undershoots on
  this ffmpeg; verify the delivered stream bitrate with ffprobe,
  never trust the flag). Short demos (≤15s) use ~3.0 Mbps by the same
  formula. Builds delivered to Claude carry a ≤100 MB cap with a
  stated target bitrate.
- Filenames are versioned and final-named; a corrected file always
  gets a NEW name (iOS caches by filename).

## A23. Loudness
*(carried from v6/standing rule — MEMORY standing standard)*

- Final delivery loudness: **−15±1 LUFS** integrated, measured on the
  delivered file. (Lesson mixes reach it via §A1's fixed gain +
  deterministic limiter on the package narration; the measurement
  gate is §A21.)

## A24. Duration — flexible target
*(carried from v6/standing rule — v5 SYSTEM §4; MEMORY 2026-11-12)*

- Full lessons: **~11–12 min target, always under 15 min** — a
  planning reference met at the script/narration stage, never an
  editing constraint. **Never pad** with dead air; **never trim**
  teaching content to hit a number; narration is never stretched,
  slowed or re-recorded. Quality/beauty first. (v7's length discipline
  for scripts is §V7.0.)

## A25. Thumbnails (full lessons, not demos)
*(carried from v6/standing rule — RULES-MASTER "THUMBNAILS"; MEMORY 2026-11-08)*

- Four DIFFERENT, colourful, Japanese-themed premium designs per
  batch; contrast is the requirement; colours are the designer's
  choice. 1280×720.
- **Mandatory texts:** "NIHONGO BY NIAZ SENSEI" · big "N3 Week X
  Day Y" · the track word (VOCABULARY / KANJI / GRAMMAR) · 「জাপানি
  শিখুন বাংলায়」 · filled red pill "<NN> WORDS/KANJI/RULES · SOU
  MATOME N3".
- Upload standard (standing): final thumbnail first, title copies the
  previous same-track video's format, correct playlist, Public /
  Education / AI disclosure Yes.

## A26. Render mechanics on this VM
*(carried from v6/standing rule — v5 SYSTEM §1; production-system v2)*

- Render in **≤300-frame chunks**, fresh browser per chunk, per-chunk
  ffprobe frame-count verification before concat; **ONE render at a
  time** (serial production, Niaz 2026-11-17); Remotion
  `--concurrency=1` is the locked fastest config on this VM.
- `TMPDIR=~/workspace/tools/tmp` (the /tmp tmpfs is 512 MB); direct
  node Remotion CLI (npx is unreliable under minimal PATH); browser:
  project Chrome Headless Shell, with Brave/Edge as fallbacks —
  smoke-test before a run; ≥600 MB RAM free.
- **Font gate before any full render:** render the FontCheck
  composition (one line per face/weight) and eyeball it; a build whose
  font check has not passed does not render. Fonts are bundled locally
  and loaded via FontFace + delayRender — never external requests,
  never bare /fonts/ URLs without staticFile().
- Verify every output with ffprobe + full decode (`ffmpeg -xerror`).
  Concat with the ffmpeg concat demuxer; pad audio-less chunks with a
  silent AAC track first or the concat breaks.

## A27. Data schema — the renderer eats screenText ONLY
*(carried from v6/standing rule — v5 SYSTEM §5)*

- Lesson data follows the §5 entry schema (`screenText` is the ONLY
  field a component may render; `voiceText` / `visualDirection` /
  `metadata` are build-side only, never rendered).
- Japanese is ALWAYS phrase-segmented with furigana attached per
  segment (`rubySeg`/`plainSeg`); layout goes through
  `japaneseTextLayout.js` — a segment is never split, particles never
  start a line, furigana never detaches, single-character orphan lines
  are repaired or reported by `auditLineBreaks()`.
- Practice data contract (build-failing): `validatePracticeSet()`
  asserts set sizes, unique ids, ≥2 options each, `correctIndex`
  referencing a real option, a Bangla explanation on every question.
  Teaching counters and practice counters are separate data systems,
  always.

---

# PART B — WHAT IS NEW IN v7

## V7.0 The headline change — the teacher's script remembers
*(NEW in v7 — Niaz's core design, 2026-11-17; source: jlpt-master-study/v7-design.md)*

- The biggest change in v7 is the **teacher's script**. Students reach
  N3 having finished N5 and N4, but by then they have forgotten much
  of the N5/N4 vocabulary and kanji — they would recognise things when
  they see them, but do not remember them well. So every v7 script
  teaches like **one continuous teacher across N5 → N4 → N3** who
  remembers what he taught before: **whenever something new connects
  to something learned earlier, the script recalls the earlier item at
  that exact moment.** Nothing is taught as if it were the first time
  when the student has in fact met its parts before.
- The three recall kinds (Niaz's own examples):
  1. **Kanji / compounds** — a new word built from kanji where one part
     is new and another was learned in N5/N4: recall the old kanji
     right there, and show how its reading joins the compound
     （水曜日： 水 = N5 みず, 曜 = N4, 日 = N5 — みず joins as すい).
  2. **Vocabulary** — a word with the same meaning as an earlier-level
     word: recall the earlier ones while teaching the new one
     (N5 します → N4 やります → the N3 equivalent).
  3. **Grammar** — a form seen before (ようにします / ようになります in
     N4, again in N3): recall it. Also, when DIFFERENT forms share one
     meaning (the "জন্য" group), teaching one recalls where that
     meaning appeared before.
- **Teacher persona:** the script reads as a teacher who has himself
  truly studied N5, N4 and N3, explains realistically and practically
  from every side, and knows how to make old material come back at the
  right moment.
- **LENGTH DISCIPLINE (the counterweight — Niaz, 2026-11-17):** recall
  lines do not get ADDED on top of the old script style; they REPLACE
  filler. **Cut ALL unnecessary talk.** A v7 script keeps only: (a)
  the new point, (b) the recall references, (c) practical,
  study-helpful explanation. Duration stays within the standing
  condition (§A24: ~11–12 min, under 15) — a video that runs too long
  will not be watched. A script that adds recall by growing length
  FAILS review; a script that swaps filler for recall passes.

## V7.1 Recall Bridge Database — recall comes from data
*(NEW in v7 — suggestion #1, approved 2026-11-17)*

- All recall links come from the **Recall Bridge Database**, built
  from the master study inventories (`~/workspace/jlpt-master-study/
  n5.md`, `n4.md`, `n3.md`): every kanji, word and grammar point is
  tagged with its **first-appearance level + lesson**, plus its links
  (compounds it joins, same-meaning words at other levels, grammar
  meaning-groups it belongs to).
- A script may only recall what the Bridge verifies. **An unverified
  recall is a verbatim-law violation (§A4)** — if the Bridge has no
  entry, the recall is not written; the gap is logged as a Bridge
  TODO, never improvised.
- The Bridge is a living file set: when a study gap closes (e.g. N4
  vocab L29–50 transcription, N3 grammar W4D2–W6 transcription), the
  new entries are added with their sources before any script uses
  them.

## V7.2 Recall + the "তুমি বলো" retrieval beat
*(NEW in v7 — suggestion #2, approved 2026-11-17)*

- A recall is not a mention; it is a **retrieval**. After the Recall
  Card lands (§V7.4), the teacher pauses and the student retrieves:
  a **3-second "তুমি বলো" beat** — the new item's incomplete form is
  on screen (e.g. the compound with the recalled part blanked, or the
  prompt form with "→ ?"), Sensei in think/point pose, a slim 3s ring
  or bar draining — then the completed form locks in.
- The beat is **screen-driven**: in vocab/kanji lessons the answer's
  Japanese is NOT spoken during or after the beat beyond the item's
  single ×1 moment (§A3) — the completion is visual (lock-in +
  stamp). In grammar lessons the completed form may be voiced per the
  grammar audio rules (§A16).
- Placement: at most one retrieval beat per taught item, placed at the
  recall moment — never stacked, never in practice sections (practice
  think holds, §A17, are a separate mechanism and keep their own
  rules; the v6 think-state RECALL lanes remain the practice-side
  surface).

## V7.3 Mistake-forecast callouts
*(NEW in v7 — suggestion #3, approved 2026-11-17)*

- At the exact point where students predictably err, Sensei forecasts
  the mistake BEFORE it can happen: a short callout — the wrong
  reading/form shown ghosted + slashed, the right one beside it —
  with one Bangla line ("এখানে সবাই … পড়ে ফেলে — এটা …").
- Sources for forecasts are the books' own traps (recorded in the
  study inventories: な/N dropping だ before にしては, だ staying in
  〜だとしたら, Vるまま banned, reading changes like 手 = て in あいて
  not しゅ) and the Bridge's lookalike/confusion links. A forecast
  without a Bridge/book source is not written (§A4 applies).
- Form: a flash treatment of the lesson's theme (registry: rides the
  current composition; no new composition needed), ≤3s on screen,
  designed exit (§A12 item 4). At most one forecast per item.

## V7.4 Recall Card animation
*(NEW in v7 — suggestion #4, approved 2026-11-17; registry: **C17 Recall Card Stage**)*

- When the script recalls, the recall is VISIBLE: a **memory card**
  slides/pops in carrying the OLD item (kanji/word/form, with its
  furigana per §A5) + a **provenance label** naming where it was
  learned (e.g. "N5 · KANJI L4" — from the Bridge, §V7.1; an
  unverifiable provenance is never printed).
- **Kanji compounds assemble:** the recalled parts fly in from their
  memory cards and the new part travels in last; the parts lock
  together into the compound with the §A14 lock-in language (gold
  ring + check, seam pulse at each join). The completed compound is
  the item's hero moment — in vocab/kanji it coincides with the
  item's single spoken moment (§A13).
- The Recall Card has a constant v7 identity (so students learn to
  recognise "a memory is coming"): deep indigo card, warm amber
  provenance chip, a small "MEMORY" / স্মৃতি tab — theme-tinted edges
  allowed, identity not. It never obscures the current target, and it
  never stacks with a cross-track callout (§A19) on the same frame.
- Exits are designed (§A12 item 4): cards shrink back toward the
  Journey HUD (§V7.7) — memories visibly "file away".

## V7.5 Reading-change highlight
*(NEW in v7 — suggestion #5, approved 2026-11-17)*

- When a kanji's reading changes inside a compound (kun'yomi → on'yomi
  or any contextual change — みず → すい in 水曜日； て vs しゅ for 手）,
  the change is SHOWN, not just said: the old reading's kana sits
  above the kanji, then **morphs** — kana glyphs crossfade/slide into
  the new reading with a warm pulse on the kanji — landing as the
  compound's furigana.
- The morph is timed to the narration beat that names the change, and
  the pre-change state holds long enough to read (≥20f). Ruby law
  (§A5) holds at every frame: a reading is always present above its
  kanji; the morph replaces one reading with another, it never leaves
  the kanji bare.

## V7.6 Chain Map — the 10-second end-of-lesson map
*(NEW in v7 — suggestion #6, approved 2026-11-17; registry: **C18 Chain Map Stage**)*

- Every lesson ends its teaching body with a **10-second Chain Map**:
  today's new items shown as a small family tree — each new item
  linked by drawn connectors (§A7 self-drawing lines) to its recalled
  roots, each root carrying its provenance chip (level + lesson, from
  the Bridge). One glanceable map; screenshot-worthy by design.
- **Screen-only.** No Japanese is re-spoken for the map (§A3 ×1-safe);
  the Bangla narration over the map is a single closing line at most.
  The map extends the §A18 summary — it does not replace the recap
  grid/study sheet/mind-map, which still run per §A18.
- Connectors use real curved geometry (grammar mind-map rule, §A13);
  nodes resolve to learned state (✓ + completion animation, never
  colour alone, §A18).

## V7.7 Journey HUD
*(NEW in v7 — suggestion #7, approved 2026-11-17; registry: **C19 Journey HUD** — persistent chrome)*

- A slim persistent HUD strip rides every v7 lesson: the student's
  whole journey in one line — **N5 ✓ · N4 ✓ · N3 ▓▓░░** — level nodes
  with completion state, the current level's progress filled per
  lesson position (from the book-order lesson index), and the current
  item label (the §A10 chapter HUD data: item + chapter + %).
- It extends, and must stay consistent with, the Level-Up v3 slim
  progress HUD (§A7) and the §A10 HUD update rule (updates AFTER the
  item's anchor). Recall Cards file away toward it (§V7.4); a recall's
  provenance chip and the HUD's level nodes share one visual language.
- Occupancy: the HUD is chrome, not content — it never counts toward
  §A21 G3 occupancy, and it never covers a teaching target.

## V7.8 Explicitly NOT in v7
*(Niaz's order, 2026-11-17)*

- **Recall Shorts (suggestion #8) is EXCLUDED.** No v7 lesson work
  includes cutting recall moments into Shorts. (The standing Fact
  Shorts / Contrast Shorts series are separate, older orders and are
  unaffected.)

## V7.9 v7 QA additions + conflict register
*(NEW in v7 — extends §A21; gates run with the §A21 order: design first)*

- **V7-G1 · Recall attribution gate.** Every recall in the script +
  every provenance label on screen is checked against the Bridge
  (§V7.1): correct item, correct first-appearance level + lesson,
  correct link kind (compound part / synonym / meaning-group). A
  wrong attribution = FAIL, same severity as a verbatim error (§A4).
- **V7-G2 · ×1 audit includes recall.** The delivered audio is audited
  so that no recalled item's Japanese is re-spoken in a vocab/kanji
  lesson (§A3), and each new item's Japanese occurs exactly once.
- **V7-G3 · Length audit.** The finished script is read against
  §V7.0's discipline: every spoken line must be (a) the new point,
  (b) a recall reference, or (c) practical study help. Any other line
  is cut before voice generation. Estimated duration must land inside
  §A24 before the build proceeds.
- **V7-G4 · Retrieval-beat audit.** Each "তুমি বলো" beat (§V7.2)
  measures a full 3s, shows the incomplete form only, and leaks no
  answer in audio or ruby (§A6 principles apply to the beat's screen).
- Conflicts registered: **none at issue.** (Standing note: §V7.4's
  Recall Card and §A19's CrossRef callout are distinct surfaces with a
  no-stack rule, §V7.4 — a distinction, not a conflict.)

## V7.10 Demo programme (proof of v7, 2026-11-17)
*(NEW in v7)*

Three 20-second demos in `~/workspace/nihongo-visuals-v7/demos/`, one
per track, each proving the v7 layer on top of the full Part A rule
set (motion, Sensei ~300px, furigana, ×1, −15±1 LUFS, 1920×1080,
fresh theme per demo, Journey HUD visible throughout):
- **Vocab （相手）:** word card → Recall Card （手 = N5 Kanji L4, 手紙の手）
  → 相 flies in and assembles 相手 → あいて spoken ONCE → Bangla
  meaning → mistake-forecast flash （手 read て, not しゅ) → mini chain
  map 手 (N5) → 相手 (N3).
- **Kanji （転 in 自転車）:** 自 (N4) + 車 (N5) cards as "old friends" →
  glowing empty slot → 転 locks in, 自転車 completes → じてんしゃ spoken
  once → 転 meaning beat → chain map 自 (N4) + 転 (N3) + 車 (N5).
- **Grammar （ちゃう）:** N4 card 食べてしまいます → morphs/shrinks into
  食べちゃう (N3) → each Japanese line spoken once at its card →
  Bangla rule line → 2s "তুমি বলো" beat （飲んでしまう → ? on screen
  only, no audio answer) → end card.
Demo audio: Bangla MAI_03 (speed 100) generated for the demos;
Japanese slots are filled ONLY by real Okibi clips — never by a local
Japanese voice (§A2). A demo with silent placeholder Japanese is a
work-in-progress proof, never a delivery (§A2 no-voice rule applies
to uploads; demos are internal proofs).
