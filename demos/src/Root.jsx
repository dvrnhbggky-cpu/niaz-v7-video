import React from 'react';
import {Composition} from 'remotion';
import {V7DemoVocab, VOCAB_TOTAL} from './DemoVocab';
import {V7DemoKanji, KANJI_TOTAL} from './DemoKanji';
import {V7DemoGrammar, GRAMMAR_TOTAL} from './DemoGrammar';

// V7 DEMO ROOT — three 20s proofs (600f @30fps, 1920×1080). Audio is NOT in
// the compositions: silent renders are muxed with each demo's assembled
// narration (MAI_03 Bangla + real Okibi slots) via demos/assemble.py.
export const DemoRoot = () => (
  <>
    <Composition id="V7DemoVocab" component={V7DemoVocab} durationInFrames={VOCAB_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="V7DemoKanji" component={V7DemoKanji} durationInFrames={KANJI_TOTAL} fps={30} width={1920} height={1080} />
    <Composition id="V7DemoGrammar" component={V7DemoGrammar} durationInFrames={GRAMMAR_TOTAL} fps={30} width={1920} height={1080} />
  </>
);
