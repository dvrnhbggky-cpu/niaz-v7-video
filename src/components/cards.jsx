import React from 'react';
import {useCurrentFrame} from 'remotion';
import {V5_FONTS} from '../fonts';
import {V5_TYPE, rgba} from '../theme';
import {enter, popAt, V5_MOTION} from '../motion';
import {V5FuriganaText, BnText, EnText} from './text';
import {V5Illustration} from './icons';
import {V5CrossRefDot} from './crossref';

// ============================================================================
// V5 CARDS — teaching surfaces (spec §B2–B3, §F6–F7, §G). Layered shadows
// are mandatory; borders carry STATE (active = 3px accent outline, empty =
// 2px dashed, completed = success border + icon). Card heights are flexible
// — content is never cropped to preserve a fixed height (spec §G4).
// All text comes from lesson-data screenText fields only (spec §E7/H4).
// ============================================================================

export const cardShadow = (theme, state) =>
  state === 'active'
    ? `${theme.shadow}, 0 0 0 3px ${theme.accent}`
    : state === 'done'
      ? `${theme.shadowSoft}, 0 0 0 2px ${theme.success}`
      : theme.shadow;

export const V5TeachingCard = ({theme, state = 'idle', style, children, enterAt = 6, pad = 36}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: theme.surface, borderRadius: theme.radius.main, padding: pad,
        border: state === 'empty' ? `2px dashed ${theme.mutedInk}` : `2px solid ${theme.surfaceLine}`,
        boxShadow: state === 'empty' ? 'none' : cardShadow(theme, state),
        color: theme.ink, position: 'relative',
        ...enter(frame, enterAt, V5_MOTION.cardEntrance),
        ...style,
      }}
    >
      {state === 'done' && (
        <div style={{position: 'absolute', top: -13, right: -13, width: 34, height: 34, borderRadius: '50%', background: theme.success, color: theme.onSuccess, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 19}}>✓</div>
      )}
      {children}
    </div>
  );
};

// V5GrammarPattern — the construction/formula block for the grammar
// two-column layout (spec §G2): pattern in J2 type, connection diagram
// (what attaches on the left), Bangla explanation, accent key component.
export const V5GrammarPattern = ({theme, patternSegs, connection, bangla, gloss, enterAt = 8, popFrame = null}) => {
  const frame = useCurrentFrame();
  const pop = popFrame != null ? popAt(frame, popFrame, 1.045, 10) : 1;
  return (
    <div>
      <div style={{...enter(frame, enterAt, 12), transform: `${enter(frame, enterAt, 12).transform} scale(${pop})`}}>
        <V5FuriganaText segments={patternSegs} theme={theme} size={64} furiganaSize={24} weight={900} />
      </div>
      {connection && (
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 26, ...enter(frame, enterAt + 8, 12, 12)}}>
          {connection.map((c, i) => (
            <React.Fragment key={i}>
              <span style={{background: c.hot ? theme.accent : theme.surfaceAlt, color: c.hot ? theme.onAccent : theme.ink, border: `2px solid ${c.hot ? theme.accent : theme.surfaceLine}`, borderRadius: 10, padding: '8px 14px', fontFamily: V5_FONTS.jp, fontWeight: 700, fontSize: 25, whiteSpace: 'nowrap'}}>
                {c.text}
              </span>
              {i < connection.length - 1 && <span style={{fontSize: 26, color: theme.mutedInk, fontWeight: 800}}>+</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{marginTop: 28, ...enter(frame, enterAt + 14, 12, 12)}}>
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 15, letterSpacing: 2.4, color: theme.accent}}>MEANING · অর্থ</div>
        <BnText theme={theme} size={V5_TYPE.b1} style={{marginTop: 8}}>{bangla}</BnText>
        {gloss && <EnText theme={theme} style={{marginTop: 8}}>{gloss}</EnText>}
      </div>
    </div>
  );
};

// V5ExampleCard — three-language treatment is MANDATORY (spec §F7):
// Japanese (furigana) + Bangla meaning + English gloss, one illustration.
// `state` highlights the card while its sentence is being spoken.
export const V5ExampleCard = ({theme, example, state = 'idle', enterAt = 0, illustration}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        background: theme.surface, borderRadius: theme.radius.card, padding: 28,
        border: `2px solid ${state === 'active' ? theme.accent : theme.surfaceLine}`,
        boxShadow: state === 'active' ? cardShadow(theme, 'active') : theme.shadowSoft,
        display: 'flex', gap: 22, alignItems: 'flex-start',
        ...enter(frame, enterAt, V5_MOTION.cardEntrance),
      }}
    >
      <div style={{flex: 1, minWidth: 0}}>
        <V5FuriganaText segments={example.screenText.japaneseSegs} theme={theme} size={V5_TYPE.j1 - 4} furiganaSize={20} />
        <BnText theme={theme} size={V5_TYPE.b2} style={{marginTop: 14}}>{example.screenText.banglaMeaning}</BnText>
        <EnText theme={theme} style={{marginTop: 6}}>{example.screenText.englishGloss}</EnText>
      </div>
      {(illustration || example.screenText.illustration) && (
        <div style={{flexShrink: 0, background: theme.surfaceAlt, borderRadius: 16, padding: 10}}>
          <V5Illustration name={illustration || example.screenText.illustration} theme={theme} size={88} />
        </div>
      )}
    </div>
  );
};

// V5VocabularyCard — the word hero: huge word + furigana, Bangla meaning,
// English gloss, memory-hook line. Karaoke state is applied by the parent
// through `wordStates` when the word is voiced from the timestamp map.
export const V5VocabularyCard = ({theme, entry, enterAt = 0, wordStates = null, popFrame = null}) => {
  const frame = useCurrentFrame();
  const pop = popFrame != null ? popAt(frame, popFrame, 1.05, 9) : 1;
  return (
    <V5TeachingCard theme={theme} enterAt={enterAt} style={{padding: 40}}>
      <V5CrossRefDot theme={theme} crossRef={entry.crossRef} />
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{background: theme.current, color: theme.ink, borderRadius: 10, padding: '5px 13px', fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 17, letterSpacing: 1.4}}>
          {entry.screenText.tag}
        </span>
        <EnText theme={theme} size={19}>{entry.screenText.groupLabel}</EnText>
      </div>
      <div style={{marginTop: 22, transform: `scale(${pop})`, transformOrigin: 'left center'}}>
        <V5FuriganaText segments={entry.screenText.wordSegs} states={wordStates} theme={theme} size={92} furiganaSize={30} weight={900} />
      </div>
      <div style={{display: 'flex', gap: 26, marginTop: 26, alignItems: 'flex-start'}}>
        <div style={{flex: 1}}>
          <BnText theme={theme} size={37}>{entry.screenText.banglaMeaning}</BnText>
          <EnText theme={theme} size={V5_TYPE.e1} style={{marginTop: 7}}>{entry.screenText.englishGloss}</EnText>
        </div>
        {entry.screenText.illustration && (
          <div style={{background: theme.surfaceAlt, borderRadius: 16, padding: 10, flexShrink: 0}}>
            <V5Illustration name={entry.screenText.illustration} theme={theme} size={92} />
          </div>
        )}
      </div>
      {entry.screenText.hookBn && (
        <div style={{marginTop: 24, borderLeft: `5px solid ${theme.current}`, paddingLeft: 16, ...enter(frame, enterAt + 20, 12, 8)}}>
          <BnText theme={theme} size={27} weight={600} color={theme.mutedInk}>{entry.screenText.hookBn}</BnText>
        </div>
      )}
    </V5TeachingCard>
  );
};

// V5VocabularyGrid — summary word grid. Two modes:
//  · 'flow' (core spec §F6): uniform sizes, entries wrap naturally.
//  · 'page' (SPEC-vocab §05 — governs for vocab builds): SIX cells per
//    page, 3 col × 2 rows, FIXED typography (JP 48 · furigana 25 · Bangla
//    32 · English 23 · index 20) that NEVER auto-shrinks; long entries
//    wrap to a second line at full size and the cell grows instead.
export const V5VocabularyGrid = ({theme, entries, columns, enterAt = 0, activeIndex = -1, mode = 'flow', pageLabel = null}) => {
  const frame = useCurrentFrame();
  const page = mode === 'page';
  const cols = columns || (page ? 3 : 4);
  return (
    <div>
      {page && pageLabel && (
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
          <span style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 21, letterSpacing: 1.6, color: theme.onBase}}>
            WORD BANK · PAGE {pageLabel.current} / {pageLabel.total}
          </span>
          <span style={{fontFamily: V5_FONTS.en, fontWeight: 600, fontSize: 19, color: theme.mutedOnBase}}>
            {pageLabel.range}
          </span>
        </div>
      )}
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: page ? 26 : 18}}>
        {entries.map((e, i) => (
          <div
            key={i}
            style={{
              background: theme.surface, borderRadius: 18, padding: page ? '24px 26px' : '18px 20px',
              minHeight: page ? 284 : 148,
              border: `2px solid ${i === activeIndex ? theme.current : theme.surfaceLine}`,
              boxShadow: i === activeIndex ? cardShadow(theme, 'active') : theme.shadowSoft,
              position: 'relative',
              ...enter(frame, enterAt + i * (page ? 4 : V5_MOTION.stagger), page ? 16 : 12, 14),
            }}
          >
            <V5CrossRefDot theme={theme} crossRef={e.crossRef} />
            {page && (
              <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 20, color: theme.mutedInk, marginBottom: 8}}>
                {String(e.screenText.index || i + 1).padStart(2, '0')}
              </div>
            )}
            <V5FuriganaText segments={e.screenText.wordSegs} theme={theme} size={page ? 48 : 31} furiganaSize={page ? 25 : 18} weight={700} />
            <BnText theme={theme} size={page ? 32 : 24} style={{marginTop: page ? 12 : 9}}>{e.screenText.banglaMeaning}</BnText>
            <EnText theme={theme} size={page ? 23 : 19} style={{marginTop: page ? 6 : 3}}>{e.screenText.englishGloss}</EnText>
          </div>
        ))}
      </div>
    </div>
  );
};

// V5AnswerReveal — the full practice block (spec §A3 practice + reveal):
// question card, options entering sequentially, linear think progress
// (starts only once question + options are readable), then the reveal:
// correct option success outline + ✓ pop 0.5→1.08→1, wrong options fall to
// 45–55% opacity, explanation panel enters after. Timings are props, driven
// by the lesson's timing map in real builds.
export const V5AnswerReveal = ({theme, practice, revealAt, thinkStartAt, thinkEndAt, enterAt = 0}) => {
  const frame = useCurrentFrame();
  const revealed = frame >= revealAt;
  const thinkP = thinkEndAt > thinkStartAt
    ? Math.min(1, Math.max(0, (frame - thinkStartAt) / (thinkEndAt - thinkStartAt)))
    : 0;
  return (
    <div>
      <V5TeachingCard theme={theme} enterAt={enterAt} pad={32}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <span style={{background: theme.accent, color: theme.onAccent, borderRadius: 10, padding: '5px 14px', fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 17, letterSpacing: 1.2}}>
            {practice.screenText.partLabel}
          </span>
          <BnText theme={theme} size={31}>{practice.screenText.promptBn}</BnText>
        </div>
        {practice.screenText.promptSegs && (
          <div style={{marginTop: 18}}>
            <V5FuriganaText segments={practice.screenText.promptSegs} theme={theme} size={V5_TYPE.j1 - 6} furiganaSize={20} />
          </div>
        )}
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 24}}>
          {practice.screenText.options.map((opt, i) => {
            const isCorrect = i === practice.correctIndex;
            const st = !revealed ? 'idle' : isCorrect ? 'correct' : 'wrong';
            const checkPop = revealed && isCorrect ? popAt(frame, revealAt + 2, 1.08 / 0.5, 12) : 1;
            return (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  background: st === 'correct' ? rgba(theme.success, 0.10) : theme.surfaceAlt,
                  border: `3px solid ${st === 'correct' ? theme.success : 'transparent'}`,
                  borderRadius: 16, padding: '15px 20px',
                  opacity: st === 'wrong' ? 0.5 : 1,
                  ...enter(frame, enterAt + 25 + i * 6, 12, 12),
                }}
              >
                <span style={{width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: st === 'correct' ? theme.success : theme.surface, border: `2px solid ${st === 'correct' ? theme.success : theme.surfaceLine}`, color: st === 'correct' ? theme.onSuccess : theme.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 19}}>
                  {String.fromCharCode(97 + i)}
                </span>
                <V5FuriganaText segments={opt.segs} theme={theme} size={33} furiganaSize={18} weight={700} />
                {st === 'correct' && (
                  <span style={{marginLeft: 'auto', width: 44, height: 44, borderRadius: '50%', background: theme.success, color: theme.onSuccess, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 25, fontWeight: 800, transform: `scale(${0.5 * checkPop})`}}>
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {!revealed && (
          <div style={{marginTop: 22, height: 9, borderRadius: 5, background: theme.surfaceAlt, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${thinkP * 100}%`, background: theme.current, borderRadius: 5}} />
          </div>
        )}
      </V5TeachingCard>
      {revealed && (
        <div
          style={{
            marginTop: 20, background: theme.surface, borderRadius: theme.radius.card, padding: '24px 30px',
            borderLeft: `7px solid ${theme.success}`, boxShadow: theme.shadowSoft,
            ...enter(frame, revealAt + 10, 14, 16),
          }}
        >
          <div style={{fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 25, color: theme.success}}>কেন এটাই সঠিক?</div>
          <BnText theme={theme} size={29} style={{marginTop: 6}}>{practice.screenText.whyBn}</BnText>
        </div>
      )}
    </div>
  );
};

// V5SummaryGrid — end-of-lesson takeaways; cards enter in pairs, Japanese
// first with furigana, Bangla under it; final takeaway pops last (spec §A3).
export const V5SummaryGrid = ({theme, items, enterAt = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            background: theme.surface, borderRadius: theme.radius.card, padding: '26px 30px',
            border: `2px solid ${theme.surfaceLine}`, boxShadow: theme.shadowSoft,
            ...enter(frame, enterAt + Math.floor(i / 2) * 10 + (i % 2) * V5_MOTION.stagger, 13, 16),
          }}
        >
          <V5FuriganaText segments={it.screenText.wordSegs} theme={theme} size={39} furiganaSize={20} weight={900} />
          <BnText theme={theme} size={27} style={{marginTop: 10}}>{it.screenText.banglaMeaning}</BnText>
          <EnText theme={theme} size={20} style={{marginTop: 4}}>{it.screenText.englishGloss}</EnText>
        </div>
      ))}
    </div>
  );
};

// V5Outro — closing composition (spec §A3 outro): brand lockup, closing
// line, next-lesson card when appropriate. The Sensei (waving, 410px) is
// placed by the scene next to this panel.
export const V5Outro = ({theme, closingSegs, closingBn, nextLabel, enterAt = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{...enter(frame, enterAt + 12, 14, 18)}}>
      <div style={{fontFamily: V5_FONTS.display, fontWeight: 800, fontSize: 54, letterSpacing: 0.5, color: theme.onBase, whiteSpace: 'nowrap'}}>
        NIHONGO <span style={{color: theme.accent}}>BY</span> NIAZ SENSEI
      </div>
      <div style={{marginTop: 30, background: theme.surface, borderRadius: theme.radius.main, padding: '30px 36px', boxShadow: theme.shadow, maxWidth: 880}}>
        <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 15, letterSpacing: 2.4, color: theme.accent}}>TODAY'S LINE · きょうの一言</div>
        <div style={{marginTop: 14}}>
          <V5FuriganaText segments={closingSegs} theme={theme} size={40} furiganaSize={20} />
        </div>
        <BnText theme={theme} size={27} weight={600} color={theme.mutedInk} style={{marginTop: 12}}>{closingBn}</BnText>
      </div>
      {nextLabel && (
        <div style={{marginTop: 22, display: 'inline-flex', alignItems: 'center', gap: 12, background: theme.current, color: theme.ink, borderRadius: 14, padding: '13px 20px', fontFamily: V5_FONTS.bn, fontWeight: 700, fontSize: 24, boxShadow: theme.shadowSoft, ...enter(frame, enterAt + 30, 12, 10)}}>
          পরের পাঠ → {nextLabel}
        </div>
      )}
    </div>
  );
};
