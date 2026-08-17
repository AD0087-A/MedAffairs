import React, { useState } from 'react';
import { X } from 'lucide-react';

// ── raw HCP data, exactly as it would arrive from the source tables ──────────
const HCPS = [
  { id: 'H-100418', nm: 'Dr. Elena Marchetti', sp: 'Neurology, Epilepsy',         dec: 9,  loy: 'Trialist',               dcl: 'N', plan: 6, done: 1, att: 17,  ev: 'sample_request', evd: 6,  rep: 'interested',   repd: 10,  noc: 'N', pdrp: 'N' },
  { id: 'H-100562', nm: 'Dr. Ravi Shankaran',  sp: 'Neurology, Epilepsy',         dec: 8,  loy: 'Grower',                 dcl: 'Y', plan: 6, done: 2, att: 33,  ev: 'conf',           evd: 22, rep: 'receptive',    repd: 30,  noc: 'N', pdrp: 'N' },
  { id: 'H-100733', nm: 'Dr. Priya Anand',     sp: 'Neurology, General',          dec: 9,  loy: 'Churner',               dcl: 'Y', plan: 5, done: 3, att: 60,  ev: 'cta',            evd: 40, rep: 'neutral',      repd: 55,  noc: 'N', pdrp: 'N' },
  { id: 'H-100811', nm: 'Dr. Thomas Okafor',   sp: 'Neurology, Epilepsy',         dec: 7,  loy: 'Non-User',              dcl: 'N', plan: 5, done: 2, att: 40,  ev: 'form',           evd: 12, rep: null,           repd: 0,   noc: 'N', pdrp: 'N' },
  { id: 'H-100925', nm: 'Dr. Hannah Weiss',    sp: 'Neurology, General',          dec: 8,  loy: 'Grower',                dcl: 'N', plan: 4, done: 3, att: 75,  ev: 'email_click',    evd: 18, rep: 'receptive',    repd: 20,  noc: 'N', pdrp: 'N' },
  { id: 'H-101044', nm: 'Dr. Marcus Bell',     sp: 'Neurology, Epilepsy',         dec: 10, loy: 'Established Prescriber', dcl: 'N', plan: 6, done: 5, att: 83,  ev: 'deep_visit',     evd: 60, rep: 'interested',   repd: 15,  noc: 'N', pdrp: 'N' },
  { id: 'H-101190', nm: 'Dr. Sofia Ferreira',  sp: 'Neurology, General',          dec: 6,  loy: 'Trialist',               dcl: 'N', plan: 4, done: 1, att: 25,  ev: 'rep_visit',      evd: 3,  rep: null,           repd: 0,   noc: 'N', pdrp: 'N' },
  { id: 'H-101276', nm: 'Dr. Daniel Kwon',     sp: 'Psychiatry, Neuropsychiatry', dec: 5,  loy: 'Non-User',              dcl: 'N', plan: 3, done: 1, att: 33,  ev: 'none',           evd: 0,  rep: 'not_now',      repd: 40,  noc: 'N', pdrp: 'N' },
  { id: 'H-101358', nm: 'Dr. Aisha Rahman',    sp: 'Neurology, Epilepsy',         dec: 7,  loy: 'Churner',               dcl: 'Y', plan: 4, done: 4, att: 100, ev: 'download',       evd: 75, rep: 'virtual',      repd: 25,  noc: 'N', pdrp: 'N' },
  { id: 'H-101431', nm: 'Dr. Grace Lindqvist', sp: 'Neurology, General',          dec: 4,  loy: 'Lapsed',                dcl: 'N', plan: 3, done: 2, att: 67,  ev: 'nomatch',        evd: 0,  rep: 'neutral',      repd: 200, noc: 'N', pdrp: 'N' },
  { id: 'H-101507', nm: 'Dr. Peter Nkemdirim', sp: 'Internal Medicine',           dec: 3,  loy: 'Insufficient History',  dcl: 'N', plan: 2, done: 0, att: 0,   ev: 'none',           evd: 0,  rep: 'not_relevant', repd: 30,  noc: 'N', pdrp: 'N' },
  { id: 'H-101688', nm: 'Dr. Laura Sandoval',  sp: 'Neurology, General',          dec: 5,  loy: 'Lapsed',                dcl: 'N', plan: 2, done: 2, att: 100, ev: 'none',           evd: 0,  rep: null,           repd: 0,   noc: 'N', pdrp: 'N' },
  { id: 'H-101742', nm: 'Dr. Ian Fitzgerald',  sp: 'Neurology, Epilepsy',         dec: 9,  loy: 'Established Prescriber', dcl: 'Y', plan: 6, done: 2, att: 33,  ev: 'conf',           evd: 15, rep: 'interested',   repd: 12,  noc: 'Y', pdrp: 'N' },
  { id: 'H-101890', nm: 'Dr. Nadia Petrov',    sp: 'Neurology, General',          dec: 8,  loy: 'Grower',                dcl: 'N', plan: 5, done: 2, att: 40,  ev: 'cta',            evd: 30, rep: 'receptive',    repd: 45,  noc: 'N', pdrp: 'Y' },
];

// ── the six inputs ────────────────────────────────────────────────────────
const W = { pot: 25, loy: 20, int: 20, gap: 15, mom: 10, rep: 10 };

// S2 Lifecycle Stage, taken verbatim from sheet 5 of the value mapping workbook.
// 'Insufficient History' is null on purpose: it means fall back, not score zero.
const LOY = {
  Grow:     { 'Non-User': 20, 'Trialist': 80, 'Grower': 100, 'Established Prescriber': 40,  'Churner': 30, 'Lapsed': 10,  'Insufficient History': null },
  Convert:  { 'Non-User': 90, 'Trialist': 70, 'Grower': 40,  'Established Prescriber': 10,  'Churner': 20, 'Lapsed': 40,  'Insufficient History': null },
  Recover:  { 'Non-User': 0,  'Trialist': 0,  'Grower': 0,   'Established Prescriber': 0,   'Churner': 90, 'Lapsed': 100, 'Insufficient History': null },
  Maintain: { 'Non-User': 0,  'Trialist': 30, 'Grower': 60,  'Established Prescriber': 100, 'Churner': 70, 'Lapsed': 0,   'Insufficient History': null },
};

// interest ladder: strongest event in the last 90 days, then decayed by age
const EV = {
  sample_request: { v: 100, l: 'Requested a sample' },
  rep_visit:      { v: 100, l: 'Requested a rep visit' },
  form:           { v: 90,  l: 'Submitted a form' },
  conf:           { v: 75,  l: 'Attended a congress session' },
  cta:            { v: 60,  l: 'Clicked a call to action' },
  download:       { v: 60,  l: 'Downloaded an asset' },
  email_click:    { v: 40,  l: 'Clicked an email' },
  deep_visit:     { v: 30,  l: 'Deep site visit' },
  none:           { v: 0,   l: 'Nothing in 90 days' },
  nomatch:        { v: null, l: 'No digital identity match' },
};

const REP = {
  interested:   { v: 100, l: 'Interested, asked for follow up' },
  receptive:    { v: 70,  l: 'Receptive, no commitment' },
  neutral:      { v: 50,  l: 'Neutral' },
  virtual:      { v: 40,  l: 'Prefers virtual only' },
  not_now:      { v: 20,  l: 'Not interested right now' },
  not_relevant: { v: 0,   l: 'Not relevant' },
};

const SRC = {
  pot: 'VW_PRE_CALL_KPI_EXTRACT . TARGET_BRAND_NBRX_DECILE__C',
  loy: 'VW_PRE_CALL_KPI_EXTRACT . PRODUCT_LOYALTY_SEGMENT__C',
  int: 'Website_Engagement . Sample_Request_Triggered / Rep_Visit_Triggered / Form_Submitted / Call_to_Action_Clicked  +  Conference_Engagement . attended',
  gap: 'VW_TRGT_DTL_FACT . UPDT_FREQ_NUM  minus  VW_CRM_CALL_ACTIVITY count',
  mom: 'VW_PRE_CALL_KPI_EXTRACT . DECLINING_PRODUCT_INITIATOR__C',
  rep: 'REP_INTERACTION_NOTE . outcome   (field does not exist yet)',
};

const LBL = {
  pot: 'Potential', loy: 'Lifecycle stage', int: 'Recent interest',
  gap: 'Plan still owed', mom: 'Momentum', rep: 'Rep read',
};

const OBJECTIVES = ['Grow', 'Convert', 'Recover', 'Maintain'];
const BANDS = ['All', 'P1', 'P2', 'P3', 'P4'];
const BAND_COLOR = { P1: '#166534', P2: '#92400e', P3: '#334155', P4: '#64748b', '--': '#94a3b8' };
const BAND_BG = { P1: '#dcfce7', P2: '#fef3c7', P3: '#eef1f4', P4: '#f2f2f2', '--': '#f1f5f9' };

function scoreHcp(h, obj, noteLive) {
  const pot = h.dec * 10;
  const loy = LOY[obj][h.loy];
  const gap = h.plan > 0 ? Math.max(0, Math.round((h.plan - h.done) / h.plan * 100)) : 0;
  const mom = h.dcl === 'Y' ? 100 : 40;

  const e = EV[h.ev];
  let int = null;
  if (e.v !== null) int = e.v === 0 ? 0 : Math.round(e.v * Math.pow(0.5, h.evd / 45));

  let rep = null;
  if (noteLive && h.rep) {
    const b = REP[h.rep].v;
    rep = h.repd <= 120 ? b : Math.round(50 + (b - 50) * Math.pow(0.5, (h.repd - 120) / 60));
  }

  const parts = { pot, loy, int, gap, mom, rep };
  let num = 0, avail = 0;
  for (const k in W) { if (parts[k] !== null) { num += W[k] * parts[k]; avail += W[k]; } }
  const total = avail ? Math.round(num / avail * 10) / 10 : 0;
  const band = avail < 40 ? '--' : total >= 80 ? 'P1' : total >= 60 ? 'P2' : total >= 40 ? 'P3' : 'P4';

  let block = null;
  if (h.noc === 'Y') block = 'No Contact flag is set on this HCP. NO_CTAC_FLG = Y. They are scored but never surfaced to a rep.';
  if (h.pdrp === 'Y') block = 'PDRP is active. PDRP_FLG = Y. Prescribing detail is suppressed at retrieval, so the score is shown without the decile inputs behind it.';

  return { parts, total, band, block, gap, avail, ev: e };
}

function StatTile({ n, t }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-value">{n}</div>
      <div className="kpi-card-label">{t}</div>
    </div>
  );
}

function ChipGroup({ options, current, onPick }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map(v => (
        <button key={v} className={`tgt-chip${v === current ? ' on' : ''}`} onClick={() => onPick(v)}>{v}</button>
      ))}
    </div>
  );
}

export default function DynamicTargetingPage() {
  const [obj, setObj] = useState('Grow');
  const [bandF, setBandF] = useState('All');
  const [noteLive, setNoteLive] = useState(false);
  const [showSrc, setShowSrc] = useState(false);
  const [sel, setSel] = useState(null);

  const all = HCPS.map(h => ({ h, r: scoreHcp(h, obj, noteLive) })).sort((a, b) => b.r.total - a.r.total);
  const vis = all.filter(x => bandF === 'All' || x.r.band === bandF);

  const p1 = all.filter(x => x.r.band === 'P1').length;
  const hot = all.filter(x => x.r.parts.int !== null && x.r.parts.int >= 60 && !x.r.block).length;
  const miss = all.filter(x => x.r.avail < 100).length;
  const blocked = all.filter(x => x.r.block).length;

  const activeSel = vis.some(x => x.h.id === sel) ? sel : null;
  const cur = activeSel ? all.find(x => x.h.id === activeSel) : null;

  function toggleRow(id) {
    setSel(prev => prev === id ? null : id);
  }

  function renderDetail() {
    if (!cur) return null;
    const { h, r } = cur;

    const fresh = (h.ev === 'none' || h.ev === 'nomatch') ? '' : ` · ${h.evd} days ago`;
    const repRaw = !noteLive ? 'Field not built yet'
      : !h.rep ? 'No note on file'
      : REP[h.rep].l + (h.repd > 120 ? ` · ${h.repd} days ago, decaying` : ` · ${h.repd} days ago`);

    const raw = {
      pot: `Decile ${h.dec} of 10`,
      loy: h.loy,
      int: EV[h.ev].l + fresh,
      gap: `${h.plan} planned, ${h.done} done`,
      mom: h.dcl === 'Y' ? 'Declining initiator = Y' : 'Declining initiator = N',
      rep: repRaw,
    };

    const live = Object.keys(W).filter(k => r.parts[k] !== null)
      .map(k => ({ k, c: W[k] * r.parts[k] / r.avail })).sort((a, b) => b.c - a.c);
    const top = live.length ? LBL[live[0].k].toLowerCase() : '';
    const low = live.length ? LBL[live[live.length - 1].k].toLowerCase() : '';
    const iv = r.parts.int;

    let why, act;
    if (r.band === 'P1') {
      why = `Strong where it counts, and ${top} is carrying the score.`;
      act = `See this week. ${h.plan - h.done} of ${h.plan} planned calls still owed.`;
    } else if (r.band === 'P2') {
      why = `A real target, but not the sharpest call this week. ${top} holds it up while ${low} pulls it down.`;
      act = 'Schedule inside the cycle, not necessarily this week.';
    } else if (r.band === 'P3') {
      why = `Worth keeping in the plan, not worth crowding out a P1. ${low} is the limiting factor.`;
      act = 'Cover with a remote touch or fold into a nearby route.';
    } else {
      why = 'Low potential and nothing recent to act on. Calling here costs a slot a P1 would use better.';
      act = 'No planned visit this cycle.';
    }
    if (iv !== null && iv >= 60) why += ` They came to us: ${EV[h.ev].l.toLowerCase()} ${h.evd} days ago, which is the freshest reason on this list to go now.`;
    else if (h.ev === 'none') why += ' Nothing in 90 days, so there is no recent signal pulling this up.';
    if (h.rep === 'virtual' && noteLive) act = 'Virtual only. The rep recorded a channel preference, so route this as a remote call.';
    if (h.rep === 'not_relevant' && noteLive) act = 'Rep says not relevant. Flag for target list review rather than scheduling.';
    if (r.parts.gap === 0 && h.rep !== 'virtual') act = `Plan already served, ${h.done} of ${h.plan}. Any further visit is over and above.`;

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: '#1e293b' }}>{h.nm}</h3>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>{h.sp} · {h.id}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span className="tier-badge" style={{ background: BAND_BG[r.band], color: BAND_COLOR[r.band] }}>{r.band}</span>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#0284c7', lineHeight: 1 }}>{r.total.toFixed(1)}</div>
            <button className="tgt-close-btn" onClick={() => setSel(null)} aria-label="Close"><X size={16} /></button>
          </div>
        </div>

        <div className="tgt-gauge">
          <div className="tgt-gauge-marker" style={{ left: `${Math.min(100, Math.max(0, r.total))}%` }}>
            <div className="tgt-gauge-marker-value">{r.total.toFixed(1)}</div>
            <div className="tgt-gauge-marker-arrow" />
          </div>
          <div className="tgt-gauge-track">
            <div className="tgt-gauge-zone" style={{ width: '40%', background: '#e2e8f0' }} />
            <div className="tgt-gauge-zone" style={{ width: '20%', background: '#cbd5e1' }} />
            <div className="tgt-gauge-zone" style={{ width: '20%', background: '#fde68a' }} />
            <div className="tgt-gauge-zone" style={{ width: '20%', background: '#86efac' }} />
          </div>
          <div className="tgt-gauge-ticks">
            {[0, 40, 60, 80, 100].map(t => (
              <span key={t} style={{ left: `${t}%` }}>{t}</span>
            ))}
          </div>
          <div className="tgt-gauge-bands">
            {[['P4', 20], ['P3', 50], ['P2', 70], ['P1', 90]].map(([label, mid]) => (
              <span key={label} style={{ left: `${mid}%` }}>{label}</span>
            ))}
          </div>
        </div>

        <div className="tgt-gauge-caption">{obj} objective</div>
        <hr className="tgt-hr" />

        {r.block && (
          <div className="tgt-gate">
            <b>Not shown to the rep</b>
            {r.block}
          </div>
        )}

        <div className="secl">The six inputs</div>
        <table className="data-table">
          <thead>
            <tr><th>Input</th><th>Value read</th><th className="r">Score</th><th className="r">Weight</th><th className="r">Contribution</th></tr>
          </thead>
          <tbody>
            {Object.keys(W).map(k => {
              const s = r.parts[k];
              if (s === null) {
                return (
                  <tr key={k} className="tgt-miss">
                    <td className="inp">{LBL[k]}{showSrc && <div className="tgt-src">{SRC[k]}</div>}</td>
                    <td>{raw[k]}</td>
                    <td className="r">-</td>
                    <td className="r num">{W[k]}%</td>
                    <td className="r"><span className="tgt-redis">weight redistributed</span></td>
                  </tr>
                );
              }
              const c = Math.round(W[k] * s / r.avail * 10) / 10;
              return (
                <tr key={k}>
                  <td className="inp">{LBL[k]}{showSrc && <div className="tgt-src">{SRC[k]}</div>}</td>
                  <td>{raw[k]}</td>
                  <td className="r num">{s}</td>
                  <td className="r num">{W[k]}%</td>
                  <td className="r num">
                    {c.toFixed(1)}
                    <div className="kpi-bar-bg" style={{ marginTop: 5, minWidth: 70 }}><div className="kpi-bar-fill" style={{ width: `${s}%` }} /></div>
                  </td>
                </tr>
              );
            })}
            <tr className="tgt-tot">
              <td>Total</td><td></td><td></td>
              <td className="r num">{r.avail}%</td>
              <td className="r num">{r.total.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>

        {r.avail < 100 && (
          <div className="tgt-cov">Scored on {r.avail}% of the configured weight. The missing inputs are excluded from both sides of the calculation, so a data gap does not read as a bad HCP.</div>
        )}

        <div className="tgt-why">
          <div className="tgt-why-h">Why this HCP is here</div>
          <p>{why}</p>
          <div className="tgt-act"><b>Suggested action.</b> {act}</div>
        </div>
      </>
    );
  }

  return (
    <div className="dashboard-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      <div className="page-content">
        <div className="tgt-meta-strip">
          <span>Territory <strong>NE-04 Boston</strong></span>
          <span>Cycle <strong>Q3 2026</strong>, week 6 of 13</span>
          <span>Refreshed <strong>17 Aug 2026, 06:00</strong></span>
        </div>

        <div className="tgt-controls">
          <div className="tgt-ctl-group"><span className="cohort-form-label">Objective</span><ChipGroup options={OBJECTIVES} current={obj} onPick={setObj} /></div>
          <div className="tgt-ctl-group"><span className="cohort-form-label">Priority</span><ChipGroup options={BANDS} current={bandF} onPick={setBandF} /></div>
          <label className="tgt-sw-label" style={{ marginLeft: 'auto' }}>
            <input type="checkbox" checked={noteLive} onChange={e => setNoteLive(e.target.checked)} /> Rep note field is live
          </label>
          <label className="tgt-sw-label">
            <input type="checkbox" checked={showSrc} onChange={e => setShowSrc(e.target.checked)} /> Show source table and column
          </label>
        </div>

        <div className="kpi-cards-row">
          <StatTile n={all.length} t="HCPs scored in territory" />
          <StatTile n={p1} t="P1, see these first" />
          <StatTile n={hot} t="showed real interest recently" />
          <StatTile n={miss} t="scored on partial data" />
          <StatTile n={blocked} t="suppressed, not shown to the rep" />
        </div>

        {(() => {
          const listCard = (
            <div className="dashboard-card" style={{ padding: 0 }}>
              <div className="dashboard-card-header" style={{ padding: '12px 16px', margin: 0, borderBottom: '1px solid #e2e8f0' }}>
                <span className="dashboard-card-title">Territory list, ranked by score</span>
              </div>
              {vis.length === 0 ? (
                <div className="empty-state">No HCPs in {bandF} under a {obj} objective.</div>
              ) : vis.map((x, i) => (
                <div
                  key={x.h.id}
                  className={`tgt-row${x.h.id === activeSel ? ' sel' : ''}${x.r.block ? ' blocked' : ''}`}
                  onClick={() => toggleRow(x.h.id)}
                >
                  <div className="tgt-rk">{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: '#1e293b' }}>
                      {x.h.nm}{x.r.block && <span className="tgt-supp">suppressed</span>}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.h.sp}</div>
                  </div>
                  <div className="tgt-mini-gauge">
                    <div className="tgt-mini-gauge-track">
                      <div style={{ width: '40%', background: '#e2e8f0' }} />
                      <div style={{ width: '20%', background: '#cbd5e1' }} />
                      <div style={{ width: '20%', background: '#fde68a' }} />
                      <div style={{ width: '20%', background: '#86efac' }} />
                    </div>
                    <div className="tgt-mini-gauge-dot" style={{ left: `${Math.min(100, Math.max(0, x.r.total))}%` }} />
                  </div>
                  <div style={{ fontSize: 19, fontWeight: 700, color: '#1e293b' }}>{x.r.total.toFixed(1)}</div>
                  <span className="tier-badge" style={{ background: BAND_BG[x.r.band], color: BAND_COLOR[x.r.band] }}>{x.r.band}</span>
                </div>
              ))}
            </div>
          );

          if (!cur) return listCard;

          return (
            <div className="charts-grid" style={{ gridTemplateColumns: 'minmax(320px, 1fr) minmax(420px, 1.35fr)', alignItems: 'start' }}>
              {listCard}
              <div className="dashboard-card">
                {renderDetail()}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
