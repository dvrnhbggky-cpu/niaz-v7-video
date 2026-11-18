import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {V5FuriganaText, BnText, EnText, rubySeg, plainSeg} from '../../src/components/text';
import {V6Stage, V6Wipe, V6Tape, V6SenseiSpot, v6ifyTheme} from '../../src/components/stage';
import {V5_FONTS} from '../../src/fonts';
import {createTheme, rgba} from '../../src/theme';
import {enter, popAt, V5_MOTION} from '../../src/motion';
import {JourneyHUD, RecallCard, KaraokeSweep, Captions, ChainNode, ChainJoin, ChainPanel, CL, AMBER} from './v7ui';

// ============================================================================
// V7 DEMO A — VOCABULARY (N3): 相手 (あいて), theme "LETTER POST".
// Beats: HUD → word card (手 solid, 相 ghost slot) → Recall Card (手 = N5
// Kanji L4, 手紙の手) → 相 flies in, locks, 相手 completes → あいて Okibi ×1
// (f251, 0.84s) → Bangla meaning → mistake-forecast (手 = て, not しゅ) →
// mini chain map 手(N5) + 相(N3) = 相手(N3). Narration: MAI_03 Bangla +
// Okibi slot; timing built from measured clip durations.
// ============================================================================

const T = v6ifyTheme(createTheme({
  base: '#F3E7CE', surface: '#FFF9EE', ink: '#2E2118',
  accent: '#C8372D', success: '#2E7D4F', current: '#D98E1B',
}));

export const VOCAB_TOTAL = 600;

const CAPTIONS = [
  {from: 5, to: 81, text: 'আজকের শব্দের অর্ধেকটা তুমি আগে থেকেই জানো!'},
  {from: 86, to: 226, text: 'এই হাতটা মনে আছে? এন ফাইভের কানজি লেসন ফোর — তেগামির সেই হাত!'},
  {from: 295, to: 435, text: 'মানে — সঙ্গী, অপর পক্ষ। পুরনো হাতটাই নতুন শব্দটা মনে রাখিয়ে দিল!'},
  {from: 440, to: 547, text: 'একটা ফাঁদ! এখানে হাতের পড়া তে — শু না!'},
];

const HeroCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // 相 fly-in f226–f250 (spring travel), land pop at f250.
  const fly = spring({frame: Math.max(0, frame - 226), fps, config: V5_MOTION.spring});
  const flyX = interpolate(fly, [0, 1], [-580, 0]);
  const flyY = interpolate(fly, [0, 1], [-320, 0]);
  const flyScale = interpolate(fly, [0, 1], [0.65, 1]);
  const landPop = frame >= 248 ? popAt(frame, 250, 1.045, 12) : 1;
  const ringP = interpolate(frame, [250, 272], [0, 1], CL);
  const seamGlow = interpolate(frame, [250, 262, 282], [0, 1, 0.25], CL);
  const exitP = interpolate(frame, [547, 562], [0, 1], CL);
  const glow = interpolate(frame, [251, 268, 292], [0.06, 0.30, 0.08], CL);
  const glyph = {fontFamily: V5_FONTS.jp, fontWeight: 900, fontSize: 196, lineHeight: 1.08};
  return (
    <>
      {/* karaoke glow behind the card during the ×1 voicing */}
      <div style={{position: 'absolute', left: 520, top: 190, width: 1020, height: 520, borderRadius: 40, background: `radial-gradient(ellipse at 50% 42%, ${rgba(T.accent, glow)}, transparent 70%)`, pointerEvents: 'none', opacity: 1 - exitP}} />
      <div
        style={{
          position: 'absolute', left: 600, top: 250, width: 880, height: 400,
          background: T.surface, borderRadius: 34, boxShadow: T.shadow,
          opacity: 1 - exitP, transform: `translateY(${-exitP * 46}px)`,
        }}
      >
        <div style={{position: 'absolute', top: 22, left: 30, background: T.accent, color: T.onAccent, fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 16, letterSpacing: 2, padding: '6px 13px', borderRadius: 8}}>
          TODAY'S WORD · আজকের শব্দ
        </div>
        {/* the pair — 相 (flies in) + 手 (already known, solid from f0) */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 108, display: 'flex', justifyContent: 'center', transform: `scale(${landPop})`}}>
          <div style={{display: 'flex', alignItems: 'flex-start'}}>
            {/* 相 slot / glyph */}
            <div style={{width: 208, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontFamily: V5_FONTS.jp, fontSize: 44, fontWeight: 600, color: T.accent, height: 50, opacity: frame >= 250 ? 1 : 0}}>あい</div>
              {frame < 226 ? (
                <div style={{...glyph, color: rgba(T.ink, 0.13), border: `3px dashed ${rgba(T.current, 0.55)}`, borderRadius: 18, padding: '0 10px'}}>相</div>
              ) : (
                <div style={{...glyph, color: T.ink, transform: `translate(${flyX}px, ${flyY}px) scale(${flyScale})`, padding: '0 10px'}}>相</div>
              )}
            </div>
            {/* seam pulse at the join */}
            <div style={{width: 5, height: 215, marginTop: 48, borderRadius: 3, background: rgba('#FFC53D', seamGlow), boxShadow: seamGlow > 0.3 ? `0 0 18px ${rgba('#FFC53D', seamGlow)}` : 'none'}} />
            {/* 手 — the old friend */}
            <div style={{width: 208, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{fontFamily: V5_FONTS.jp, fontSize: 44, fontWeight: 600, color: T.accent, height: 50}}>て</div>
              <div style={{...glyph, color: T.ink, padding: '0 10px'}}>手</div>
            </div>
          </div>
          {/* lock-in gold ring */}
          {frame >= 250 && ringP < 1 && (
            <div style={{position: 'absolute', top: 56, left: '50%', width: 470, height: 238, marginLeft: -235, borderRadius: 26, border: `4px solid ${rgba('#FFC53D', 1 - ringP)}`, transform: `scale(${1 + ringP * 0.10})`, pointerEvents: 'none'}} />
          )}
        </div>
        <div style={{position: 'absolute', bottom: 13, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
          <span style={{fontFamily: V5_FONTS.en, fontWeight: 600, fontSize: 19, color: T.mutedInk, letterSpacing: 1}}>
            {frame >= 250 ? 'one word · two old friends' : 'one half is still missing…'}
          </span>
        </div>
        <V6Tape x={782} y={-18} rotate={28} width={118} />
      </div>
    </>
  );
};

const MeaningBand = () => {
  const frame = useCurrentFrame();
  const exitP = interpolate(frame, [547, 562], [0, 1], CL);
  return (
    <div style={{position: 'absolute', left: 600, top: 692, width: 880, opacity: 1 - exitP, transform: `translateY(${-exitP * 40}px)`}}>
      <div style={{background: T.surface, borderRadius: 24, padding: '20px 32px', boxShadow: T.shadow, ...enter(frame, 295, 14, 14)}}>
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 15.5, letterSpacing: 1.8, color: T.accent}}>MEANING · অর্থ</div>
        <div style={{marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 22}}>
          <BnText theme={T} size={40} weight={700}>সঙ্গী · অপর পক্ষ</BnText>
          <EnText theme={T} size={23} muted>partner / the other side</EnText>
        </div>
      </div>
    </div>
  );
};

const MistakeFlash = () => {
  const frame = useCurrentFrame();
  const exitP = interpolate(frame, [547, 560], [0, 1], CL);
  const s = popAt(frame, 440, 1.05, 11);
  return (
    <div style={{position: 'absolute', left: 600, top: 836, width: 880, opacity: (1 - exitP) * interpolate(frame, [440, 448], [0, 1], CL), transform: `scale(${s}) translateY(${-exitP * 30}px)`, zIndex: 26}}>
      <div style={{background: '#3A1420', borderRadius: 18, padding: '14px 26px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 16px 34px rgba(40,6,16,0.4)', border: `2px solid ${rgba('#FF7A6B', 0.55)}`}}>
        <span style={{fontSize: 30}}>⚠</span>
        <BnText theme={T} size={29} weight={700} color="#FFE9E4">একটা ফাঁদ!</BnText>
        <V5FuriganaText segments={[rubySeg('手', 'て'), plainSeg('の読み方')]} theme={T} size={31} furiganaSize={16} weight={700} color="#FFE9E4" furiganaColor="#FFB4A6" />
        <span style={{fontFamily: V5_FONTS.jp, fontSize: 34, fontWeight: 900, color: '#7BE495'}}>て ✓</span>
        <span style={{fontFamily: V5_FONTS.jp, fontSize: 34, fontWeight: 700, color: 'rgba(255,233,228,0.45)', textDecoration: 'line-through', textDecorationThickness: 4}}>しゅ</span>
      </div>
    </div>
  );
};

const ChainMap = () => (
  <ChainPanel theme={T} at={547} header="CHAIN MAP · যোগসূত্র">
    <ChainNode theme={T} at={552} segs={[rubySeg('手', 'て')]} sub="N5 · KANJI L4" big />
    <ChainJoin theme={T} at={564} symbol="+" />
    <ChainNode theme={T} at={570} segs={[rubySeg('相', 'あい')]} sub="N3 · NEW" big accentBorder />
    <ChainJoin theme={T} at={580} symbol="=" />
    <ChainNode theme={T} at={586} segs={[rubySeg('相', 'あい'), rubySeg('手', 'て')]} sub="N3 · TODAY'S WORD" big accentBorder />
  </ChainPanel>
);

const SenseiTrack = () => (
  <>
    <Sequence from={0} durationInFrames={86}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="pointingLeft" gesture="pointLeft" gestureStart={8} /></div>
    </Sequence>
    <Sequence from={86} durationInFrames={165}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="explaining" gesture="pointLeft" gestureStart={6} /></div>
    </Sequence>
    <Sequence from={251} durationInFrames={189}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="smile" gesture="explain" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={440} durationInFrames={107}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="serious" gesture="think" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={547} durationInFrames={53}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="happy" gesture="celebrate" gestureStart={4} /></div>
    </Sequence>
  </>
);

export const V7DemoVocab = () => (
  <AbsoluteFill>
    <V6Stage theme={T} motif="手" texture="grain" particles="dust" particleColor={rgba(T.current, 0.85)}>
      <HeroCard />
      <RecallCard theme={T} at={86} goneAt={547} x={80} y={270} glyphSegs={[rubySeg('手', 'て')]} provenance="N5 · KANJI L4" subSegs={[rubySeg('手', 'て'), rubySeg('紙', 'がみ')]} subBn="চিঠি" />
      <KaraokeSweep theme={T} x={648} y={664} width={784} start={251} end={290} />
      <MeaningBand />
      <MistakeFlash />
      <ChainMap />
      <SenseiTrack />
      <Captions theme={T} lines={CAPTIONS} />
      <JourneyHUD itemLabel="N3 · VOCABULARY" n3Fill={0.45} />
      <V6Wipe theme={T} warm={T.current} />
    </V6Stage>
  </AbsoluteFill>
);
