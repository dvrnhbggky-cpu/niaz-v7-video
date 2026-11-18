import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {V5FuriganaText, BnText, rubySeg, plainSeg} from '../../src/components/text';
import {V6Stage, V6Wipe, V6SenseiSpot, v6ifyTheme} from '../../src/components/stage';
import {V5_FONTS} from '../../src/fonts';
import {createTheme, rgba} from '../../src/theme';
import {enter, popAt} from '../../src/motion';
import {JourneyHUD, KaraokeSweep, Captions, CL} from './v7ui';

// ============================================================================
// V7 DEMO C — GRAMMAR (N3): ちゃう, theme "CAFÉ CHAT".
// Beats: HUD → N4 card 食べてしまいます → Okibi long form (f95, 1.23s) →
// card morphs/shrinks into 食べちゃう (N3) while Bangla narrates → Okibi
// short form (f232, 0.99s) → rule banner → 2s "তুমি বলো" beat (飲んでしまう
// → ? on screen only, NO audio answer) → visual completion + end card.
// ============================================================================

const T = v6ifyTheme(createTheme({
  base: '#F6E7D8', surface: '#FFF7EC', ink: '#33231D',
  accent: '#C85A2E', success: '#3E9B4F', current: '#2E7D6B',
}));

export const GRAMMAR_TOTAL = 600;

const CAPTIONS = [
  {from: 30, to: 79, text: 'এন ফোরের এই লম্বা ফর্মটা মনে আছে তো?'},
  {from: 160, to: 225, text: 'ওটাই মুখের ভাষায় ছোট হয়ে গেছে —'},
  {from: 278, to: 352, text: 'নিয়ম একটাই — তে শিমাউ থাকলেই হয়ে যায় চাউ!'},
  {from: 368, to: 397, text: 'এবার তুমি বলো!'},
];

const MorphCard = () => {
  const frame = useCurrentFrame();
  const width = interpolate(frame, [160, 214], [1000, 800], CL);
  const dip = interpolate(frame, [160, 187, 214], [1, 0.85, 1], CL);
  const oldO = interpolate(frame, [170, 186], [1, 0], CL);
  const newO = interpolate(frame, [188, 204], [0, 1], CL);
  const exitP = interpolate(frame, [352, 368], [0, 1], CL);
  const card = (children, extra = {}) => (
    <div
      style={{
        position: 'absolute', left: (1920 - width) / 2, top: 300, width, height: 330,
        background: T.surface, borderRadius: 34, boxShadow: T.shadow,
        transform: `scaleX(${dip}) translateY(${-exitP * 44}px)`, opacity: 1 - exitP,
        ...extra,
      }}
    >
      {children}
    </div>
  );
  const chip = (text, bg, fg) => (
    <div style={{position: 'absolute', top: 24, left: 28, background: bg, color: fg, fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 16.5, letterSpacing: 1.8, padding: '6px 14px', borderRadius: 8}}>{text}</div>
  );
  return (
    <>
      {card(
        <>
          <div style={{opacity: oldO}}>
            {chip('N4 · LONG FORM', T.current, T.onCurrent)}
            <div style={{position: 'absolute', left: 0, right: 0, top: 118, display: 'flex', justifyContent: 'center'}}>
              <V5FuriganaText segments={[rubySeg('食', 'た'), plainSeg('べてしまいます')]} theme={T} size={94} furiganaSize={32} weight={900} align="center" />
            </div>
          </div>
          <div style={{opacity: newO}}>
            {chip('N3 · CASUAL · মুখের ভাষা', T.accent, T.onAccent)}
            <div style={{position: 'absolute', left: 0, right: 0, top: 108, display: 'flex', justifyContent: 'center'}}>
              <V5FuriganaText segments={[rubySeg('食', 'た'), plainSeg('べちゃう')]} theme={T} size={118} furiganaSize={38} weight={900} align="center" />
            </div>
          </div>
        </>
      )}
      {/* karaoke sweeps ride the card (local coords via a positioned shell) */}
      <div style={{position: 'absolute', left: (1920 - width) / 2, top: 300, width, height: 330, pointerEvents: 'none', opacity: 1 - exitP}}>
        {frame < 160 && <KaraokeSweep theme={T} x={110} y={278} width={780} start={95} end={152} />}
        {frame >= 204 && <KaraokeSweep theme={T} x={130} y={278} width={540} start={232} end={271} />}
      </div>
    </>
  );
};

const RuleBanner = () => {
  const frame = useCurrentFrame();
  const exitP = interpolate(frame, [352, 368], [0, 1], CL);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 692, display: 'flex', justifyContent: 'center', opacity: 1 - exitP, transform: `translateY(${-exitP * 30}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20, background: '#2B1B16', borderRadius: 999, padding: '16px 34px', boxShadow: '0 18px 36px rgba(43,20,8,0.35)', ...enter(frame, 278, 13, 12)}}>
        <span style={{fontFamily: V5_FONTS.jp, fontSize: 40, fontWeight: 900, color: '#FFE9DC'}}>てしまう</span>
        <span style={{fontFamily: V5_FONTS.display, fontSize: 34, fontWeight: 800, color: T.current === '#2E7D6B' ? '#7BD8C0' : T.current}}>→</span>
        <span style={{fontFamily: V5_FONTS.jp, fontSize: 44, fontWeight: 900, color: '#FFB98A'}}>ちゃう</span>
        <span style={{width: 2, height: 40, background: 'rgba(255,233,220,0.25)'}} />
        <BnText theme={T} size={27} weight={700} color="#FFE9DC">নিয়মটা এটাই</BnText>
      </div>
    </div>
  );
};

const BeatAndEnd = () => {
  const frame = useCurrentFrame();
  if (frame < 360) return null;
  const beatP = interpolate(frame, [397, 457], [0, 1], CL);
  const CIRC = 2 * Math.PI * 36;
  const done = frame >= 470;
  const stampS = done ? popAt(frame, 470, 1.25, 10) : 0;
  return (
    <>
      {/* prompt card */}
      <div style={{position: 'absolute', left: 430, top: 268, width: 1060, height: 300, background: T.surface, borderRadius: 30, boxShadow: T.shadow, ...enter(frame, 368, 13, 16)}}>
        <div style={{position: 'absolute', top: 22, left: 26, background: T.current, color: T.onCurrent, fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 16, letterSpacing: 1.8, padding: '6px 13px', borderRadius: 8}}>
          YOUR TURN · তুমি বলো
        </div>
        {/* countdown ring — drains over the 2s beat (f397–457) */}
        <div style={{position: 'absolute', top: 18, right: 24, width: 84, height: 84}}>
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" fill="none" stroke={rgba(T.ink, 0.14)} strokeWidth="7" />
            <circle cx="42" cy="42" r="36" fill="none" stroke={T.accent} strokeWidth="7" strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={CIRC * beatP} transform="rotate(-90 42 42)" />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 19, color: T.ink}}>
            {frame < 397 ? '2s' : frame >= 457 ? '✓' : `${Math.max(0, Math.ceil((457 - frame) / 30))}s`}
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 104, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26}}>
          <V5FuriganaText segments={[rubySeg('飲', 'の'), plainSeg('んでしまう')]} theme={T} size={76} furiganaSize={27} weight={900} />
          <span style={{fontFamily: V5_FONTS.display, fontSize: 44, fontWeight: 800, color: T.accent}}>→</span>
          <div style={{width: 330, height: 128, borderRadius: 18, border: `3px dashed ${rgba(T.accent, 0.65)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? rgba(T.success, 0.10) : 'transparent'}}>
            {done ? (
              <V5FuriganaText segments={[rubySeg('飲', 'の'), plainSeg('んじゃう')]} theme={T} size={54} furiganaSize={21} weight={900} align="center" />
            ) : (
              <span style={{fontFamily: V5_FONTS.jp, fontSize: 62, fontWeight: 900, color: rgba(T.accent, 0.55)}}>?</span>
            )}
          </div>
          {done && (
            <div style={{position: 'absolute', right: 108, top: 84, width: 62, height: 62, borderRadius: '50%', background: T.success, color: T.onSuccess, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, transform: `scale(${stampS}) rotate(-10deg)`, boxShadow: T.shadowSoft}}>✓</div>
          )}
        </div>
      </div>
      {/* mini chain: N4 form → N3 form */}
      {frame >= 492 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18}}>
          <div style={{background: T.surface, borderRadius: 16, padding: '10px 24px 6px', boxShadow: T.shadowSoft, ...enter(frame, 492, 11, 10)}}>
            <V5FuriganaText segments={[rubySeg('食', 'た'), plainSeg('べてしまいます')]} theme={T} size={38} furiganaSize={16} weight={700} />
            <div style={{textAlign: 'center', fontFamily: V5_FONTS.display, fontSize: 13.5, fontWeight: 800, letterSpacing: 1.4, color: T.mutedInk, marginTop: 2}}>N4</div>
          </div>
          <span style={{fontFamily: V5_FONTS.display, fontSize: 30, fontWeight: 800, color: T.accent, opacity: interpolate(frame, [504, 514], [0, 1], CL)}}>→</span>
          <div style={{background: T.surface, borderRadius: 16, padding: '10px 24px 6px', boxShadow: T.shadowSoft, border: `2.5px solid ${rgba(T.accent, 0.6)}`, ...enter(frame, 512, 11, 10)}}>
            <V5FuriganaText segments={[rubySeg('食', 'た'), plainSeg('べちゃう')]} theme={T} size={38} furiganaSize={16} weight={700} />
            <div style={{textAlign: 'center', fontFamily: V5_FONTS.display, fontSize: 13.5, fontWeight: 800, letterSpacing: 1.4, color: T.accent, marginTop: 2}}>N3 · CASUAL</div>
          </div>
        </div>
      )}
      {/* end title */}
      {frame >= 520 && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 128, display: 'flex', justifyContent: 'center', ...enter(frame, 520, 12, 10)}}>
          <div style={{background: 'rgba(12,18,36,0.92)', borderRadius: 999, padding: '10px 30px'}}>
            <span style={{fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 21, letterSpacing: 3, color: '#F4F6FB'}}>V7 · GRAMMAR — つづく</span>
          </div>
        </div>
      )}
    </>
  );
};

const SenseiTrack = () => (
  <>
    <Sequence from={0} durationInFrames={160}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="explaining" gesture="explain" gestureStart={12} /></div>
    </Sequence>
    <Sequence from={160} durationInFrames={118}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="smile" gesture="pointLeft" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={278} durationInFrames={90}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="confident" gesture="explain" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={368} durationInFrames={89}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="thinking" gesture="think" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={457} durationInFrames={63}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="happy" gesture="celebrate" gestureStart={4} /></div>
    </Sequence>
    <Sequence from={520} durationInFrames={80}>
      <div style={{position: 'absolute', right: 44, bottom: 24}}><V6SenseiSpot theme={T} height={300} expression="waving" gesture="wave" gestureStart={3} /></div>
    </Sequence>
  </>
);

export const V7DemoGrammar = () => (
  <AbsoluteFill>
    <V6Stage theme={T} motif="茶" texture="stripes" particles="dust" particleColor={rgba(T.accent, 0.75)}>
      <MorphCard />
      <RuleBanner />
      <BeatAndEnd />
      <SenseiTrack />
      <Captions theme={T} lines={CAPTIONS} />
      <JourneyHUD itemLabel="N3 · GRAMMAR" n3Fill={0.4} />
      <V6Wipe theme={T} warm={T.accent} />
    </V6Stage>
  </AbsoluteFill>
);
