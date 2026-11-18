import React from 'react';
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {V5FuriganaText, BnText, rubySeg} from '../../src/components/text';
import {V6Stage, V6Wipe, V6SenseiSpot, v6ifyTheme} from '../../src/components/stage';
import {V5_FONTS} from '../../src/fonts';
import {createTheme, rgba} from '../../src/theme';
import {enter, popAt, V5_MOTION} from '../../src/motion';
import {JourneyHUD, KanjiTile, KaraokeSweep, Captions, ChainNode, ChainJoin, ChainPanel, CL} from './v7ui';

// ============================================================================
// V7 DEMO B — KANJI (N3): 転 in 自転車, theme "CYCLE WORKS".
// Beats: HUD → 自 (N4) + 車 (N5) tiles as old friends, empty glowing slot →
// 転 flies in and locks (f249–279), 自転車 completes → じてんしゃ Okibi ×1
// (f279, 1.07s) → 転 meaning beat → chain map 自(N4) + 転(N3) + 車(N5).
// ============================================================================

const T = v6ifyTheme(createTheme({
  base: '#131D29', surface: '#1F2C3B', ink: '#EFF3F6',
  accent: '#FF8A3C', success: '#3ECF6F', current: '#FFC53D',
}));

export const KANJI_TOTAL = 600;

const CAPTIONS = [
  {from: 5, to: 108, text: 'এই শব্দের তিনজনের মধ্যে দুইজনই তোমার পুরনো বন্ধু!'},
  {from: 114, to: 249, text: 'প্রথমজন এন ফোরের, শেষজন এন ফাইভের। মাঝের জায়গাটা কার, বলো তো?'},
  {from: 330, to: 497, text: 'নতুন এই কানজিটার মানে — ঘোরা, গড়ানো, উল্টে যাওয়া।'},
];

const Tiles = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const exitP = interpolate(frame, [497, 512], [0, 1], CL);
  const slotGlow = frame >= 114 && frame < 249 ? 0.45 + 0.4 * Math.sin((frame - 114) / 8) : frame >= 249 ? 0 : 0.15;
  const fly = spring({frame: Math.max(0, frame - 249), fps, config: V5_MOTION.spring});
  const flyY = interpolate(fly, [0, 1], [-760, 0]);
  const landPop = frame >= 271 ? popAt(frame, 273, 1.04, 11) : 1;
  const wrap = (extra) => ({opacity: 1 - exitP, ...extra});
  return (
    <div style={{opacity: 1 - exitP}}>
      <div style={wrap({})}>
        <div style={{position: 'absolute', left: 330, top: 290, ...enter(frame, 6, 14, 22)}}>
          <KanjiTile theme={T} x={0} y={0} glyph="自" ruby="じ" chip="N4 · OLD FRIEND" chipKind="old" />
        </div>
        <div style={{position: 'absolute', left: 1290, top: 290, ...enter(frame, 20, 14, 22)}}>
          <KanjiTile theme={T} x={0} y={0} glyph="車" ruby="しゃ" chip="N5 · OLD FRIEND" chipKind="old" />
        </div>
        {frame < 249 ? (
          <KanjiTile theme={T} x={810} y={290} glyph={null} dashed glow={slotGlow} />
        ) : (
          <div style={{position: 'absolute', left: 810, top: 290, transform: `translateY(${flyY}px) scale(${landPop})`}}>
            <KanjiTile theme={T} x={0} y={0} glyph="転" ruby="てん" chip="N3 · NEW TODAY" chipKind="new" ringAt={273} />
          </div>
        )}
      </div>
    </div>
  );
};

const WordPill = () => {
  const frame = useCurrentFrame();
  const exitP = interpolate(frame, [497, 512], [0, 1], CL);
  if (frame < 279) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', opacity: 1 - exitP}}>
      <div style={{background: T.surface, borderRadius: 24, padding: '14px 44px 10px', boxShadow: T.shadow, border: `2.5px solid ${rgba(T.accent, 0.65)}`, ...enter(frame, 279, 12, 12)}}>
        <V5FuriganaText segments={[rubySeg('自', 'じ'), rubySeg('転', 'てん'), rubySeg('車', 'しゃ')]} theme={T} size={88} furiganaSize={30} weight={900} align="center" />
      </div>
    </div>
  );
};

const MeaningPanel = () => {
  const frame = useCurrentFrame();
  const exitP = interpolate(frame, [497, 512], [0, 1], CL);
  const rot = (frame * 1.1) % 360;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 812, display: 'flex', justifyContent: 'center', opacity: 1 - exitP}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, background: rgba(T.surface, 0.92), borderRadius: 22, padding: '16px 36px', boxShadow: T.shadowSoft, ...enter(frame, 330, 14, 14)}}>
        <svg width="86" height="86" viewBox="0 0 100 100" style={{transform: `rotate(${rot}deg)`}}>
          <path d="M50 8 A42 42 0 1 1 14 78" fill="none" stroke={T.accent} strokeWidth="8" strokeLinecap="round" />
          <path d="M6 62 L14 82 L30 68 Z" fill={T.accent} />
        </svg>
        <V5FuriganaText segments={[rubySeg('転', 'てん')]} theme={T} size={84} furiganaSize={28} weight={900} />
        <div style={{width: 2, height: 74, background: rgba(T.ink, 0.18)}} />
        <BnText theme={T} size={38} weight={700}>ঘোরা · গড়ানো · উল্টে যাওয়া</BnText>
      </div>
    </div>
  );
};

const ChainMap = () => (
  <ChainPanel theme={T} at={497} header="CHAIN MAP · শব্দের গঠন">
    <ChainNode theme={T} at={504} segs={[rubySeg('自', 'じ')]} sub="N4" big />
    <ChainJoin theme={T} at={514} symbol="+" />
    <ChainNode theme={T} at={520} segs={[rubySeg('転', 'てん')]} sub="N3 · NEW" big accentBorder />
    <ChainJoin theme={T} at={530} symbol="+" />
    <ChainNode theme={T} at={536} segs={[rubySeg('車', 'しゃ')]} sub="N5" big />
    <ChainJoin theme={T} at={546} symbol="=" />
    <ChainNode theme={T} at={552} segs={[rubySeg('自', 'じ'), rubySeg('転', 'てん'), rubySeg('車', 'しゃ')]} sub="N3 · TODAY'S WORD" big accentBorder />
  </ChainPanel>
);

const SenseiTrack = () => (
  <>
    <Sequence from={0} durationInFrames={114}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="explaining" gesture="pointLeft" gestureStart={8} /></div>
    </Sequence>
    <Sequence from={114} durationInFrames={135}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="pointingLeft" gesture="pointLeft" gestureStart={5} /></div>
    </Sequence>
    <Sequence from={249} durationInFrames={81}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="smile" gesture="explain" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={330} durationInFrames={167}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="explaining" gesture="explain" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={497} durationInFrames={103}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="happy" gesture="celebrate" gestureStart={5} /></div>
    </Sequence>
  </>
);

export const V7DemoKanji = () => (
  <AbsoluteFill>
    <V6Stage theme={T} motif="車" texture="grid" particles="dust" particleColor={rgba(T.accent, 0.8)}>
      <Tiles />
      <WordPill />
      <KaraokeSweep theme={T} x={795} y={810} width={330} start={279} end={324} />
      <MeaningPanel />
      <ChainMap />
      <SenseiTrack />
      <Captions theme={T} lines={CAPTIONS} />
      <JourneyHUD itemLabel="N3 · KANJI" n3Fill={0.5} />
      <V6Wipe theme={T} warm={T.accent} />
    </V6Stage>
  </AbsoluteFill>
);
