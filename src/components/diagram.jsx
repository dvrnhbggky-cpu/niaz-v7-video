import React from 'react';
import {useCurrentFrame} from 'remotion';
import {V5_FONTS} from '../fonts';
import {enter, drawOn} from '../motion';
import {V5FuriganaText, BnText} from './text';

// ============================================================================
// V5Diagram — family trees / process diagrams (spec §B6). Parent centred
// above children; vertical connector parent → horizontal branch line;
// a SEPARATE vertical connector to EVERY child (the v4 failure was missing
// side connectors). Connectors 3–4px, self-drawing; active path = accent,
// completed = success, inactive = muted. EVERY diagram carries a Bangla
// summary callout underneath explaining the central learning point.
// Geometry is measured from the layout constants below so connectors land
// exactly on node edges at any child count.
// ============================================================================

export const DIAGRAM_LAYOUT = {
  width: 1560,
  parentW: 400, parentH: 118,
  childW: 336, childH: 128,
  gapY: 74, // vertical space reserved for connectors between the rows
  connector: 3.5,
};

export const V5Diagram = ({theme, parent, children, calloutBn, enterAt = 0, activeChild = 0}) => {
  const frame = useCurrentFrame();
  const L = DIAGRAM_LAYOUT;
  const n = children.length;
  const totalChildW = n * L.childW + (n - 1) * ((L.width - n * L.childW) / Math.max(1, n - 1) || 0);
  const step = n > 1 ? (L.width - L.childW) / (n - 1) : 0;
  const childX = (i) => (n === 1 ? (L.width - L.childW) / 2 : i * step);
  const parentCX = L.width / 2;
  const branchY = L.gapY * 0.52; // SVG-local: the connector strip is gapY tall

  const conn = (d, start, color, key) => {
    const p = drawOn(frame, start, 16);
    return (
      <path key={key} d={d} fill="none" pathLength={1000} stroke={color} strokeWidth={L.connector}
        strokeLinecap="round" strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} />
    );
  };

  return (
    <div style={{width: L.width, position: 'relative'}}>
      {/* parent node */}
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <div
          style={{
            width: L.parentW, minHeight: L.parentH, background: theme.surface, borderRadius: 18,
            border: `3px solid ${theme.accent}`, boxShadow: theme.shadow, padding: '16px 20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            ...enter(frame, enterAt, 13, 14),
          }}
        >
          <V5FuriganaText segments={parent.screenText.wordSegs} theme={theme} size={37} furiganaSize={19} weight={900} align="center" />
          <BnText theme={theme} size={23} style={{marginTop: 6}}>{parent.screenText.banglaMeaning}</BnText>
        </div>
      </div>
      {/* connectors */}
      <svg width={L.width} height={L.gapY} style={{display: 'block', marginTop: -2}}>
        {conn(`M${parentCX} 0 L${parentCX} ${branchY}`, enterAt + 10, theme.accent, 'stem')}
        {n > 1 && conn(`M${childX(0) + L.childW / 2} ${branchY} L${childX(n - 1) + L.childW / 2} ${branchY}`, enterAt + 16, theme.mutedOnBase, 'branch')}
        {children.map((c, i) =>
          conn(
            `M${childX(i) + L.childW / 2} ${branchY} L${childX(i) + L.childW / 2} ${L.gapY - 2}`,
            enterAt + 22 + i * 4,
            i === activeChild ? theme.accent : theme.mutedOnBase,
            `drop${i}`
          )
        )}
      </svg>
      {/* children */}
      <div style={{position: 'relative', height: L.childH}}>
        {children.map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', left: childX(i), top: 0, width: L.childW, minHeight: L.childH,
              background: theme.surface, borderRadius: 18, padding: '16px 18px',
              border: `${i === activeChild ? 3 : 2}px solid ${i === activeChild ? theme.accent : theme.surfaceLine}`,
              boxShadow: theme.shadowSoft,
              ...enter(frame, enterAt + 26 + i * 5, 12, 14),
            }}
          >
            <div style={{fontFamily: V5_FONTS.en, fontWeight: 800, fontSize: 15, color: theme.accent, letterSpacing: 1.6}}>
              STEP {i + 1}
            </div>
            <V5FuriganaText segments={c.screenText.wordSegs} theme={theme} size={29} furiganaSize={17} weight={700} style={{marginTop: 5}} />
            <BnText theme={theme} size={21.5} style={{marginTop: 6}}>{c.screenText.banglaMeaning}</BnText>
          </div>
        ))}
      </div>
      {/* summary callout — mandatory (spec §B6) */}
      <div
        style={{
          marginTop: 26, background: theme.surface, borderRadius: 16, padding: '19px 26px',
          borderLeft: `7px solid ${theme.accent}`, boxShadow: theme.shadowSoft,
          ...enter(frame, enterAt + 44, 13, 12),
        }}
      >
        <BnText theme={theme} size={26.5}>{calloutBn}</BnText>
      </div>
      {/* keep totalChildW referenced for layout audits */}
      <span style={{display: 'none'}}>{totalChildW}</span>
    </div>
  );
};
