import React, { useState, useEffect, useMemo } from 'react';
import { X, ChevronUp, ChevronDown, ChevronRight, RefreshCw, Search, Sparkles, AlertTriangle, MessageSquare } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

// ── HQ/QA view over the output of nba_v1_izo/run_nba.py --json ─────────────
// Reads out/nba_run.json, mirrored as a static asset into public/ (same
// pattern every other tab uses: no backend, no fetch layer, no state
// manager — just fetch() + useState, matching DynamicTargetingPage.jsx).

const TRIGGER_COLORS = {
  T1_NEW_WRITER_DECAY: '#0284c7',
  T2_EARLY_DISCONTINUATION: '#6366f1',
  T3_ACCESS_FRICTION: '#10b981',
  T4_SWITCH_OUT: '#f59e0b',
  T5_WHITESPACE: '#ef4444',
  T6_CALL_PLAN_GAP: '#8b5cf6',
  T7_MKT_GROWTH_NO_SHARE: '#0ea5e9',
  T8_REFRACTORY_OPPORTUNITY: '#14b8a6',
  T9_COMPETITOR_LOE_SHIFT: '#f43f5e',
  T10_MIC_NO_FOLLOWUP: '#a855f7',
};
const FALLBACK_TRIGGER_COLOR = '#94a3b8';
function triggerColor(t) { return TRIGGER_COLORS[t] || FALLBACK_TRIGGER_COLOR; }

// Plain-language names + one-line explanations for the 10 trigger codes.
// Every major NBA vendor (Aktana, Veeva, Axtria, ODAIA) translates the
// underlying rule/model into a sentence before it ever reaches a screen —
// nobody reads "T8_REFRACTORY_OPPORTUNITY" and knows what it means. The
// code is kept alongside the name for audit trail back to config.py, never
// shown alone.
const TRIGGER_INFO = {
  T1_NEW_WRITER_DECAY: {
    name: 'New-writer decay',
    blurb: 'Was writing regularly, then dropped to zero in the last 4 weeks with no recent visit.',
  },
  T2_EARLY_DISCONTINUATION: {
    name: 'Early discontinuation',
    blurb: 'A high share of their patients come off therapy within 90 days of starting.',
  },
  T3_ACCESS_FRICTION: {
    name: 'Access friction',
    blurb: 'Scripts for this HCP are getting denied or abandoned at the pharmacy.',
  },
  T4_SWITCH_OUT: {
    name: 'Switch-out accelerating',
    blurb: 'Patients are leaving the brand faster than in the prior 4-week period.',
  },
  T5_WHITESPACE: {
    name: 'Whitespace',
    blurb: 'High category volume, but our brand only holds a small share of it.',
  },
  T6_CALL_PLAN_GAP: {
    name: 'Call-plan gap',
    blurb: "Behind the trimester call goal past the cycle's midpoint. Fallback trigger only — never the primary driver.",
  },
  T7_MKT_GROWTH_NO_SHARE: {
    name: 'Market growing, brand flat',
    blurb: "The category is growing here, but our brand isn't capturing any of that growth.",
  },
  T8_REFRACTORY_OPPORTUNITY: {
    name: 'Refractory opportunity',
    blurb: 'A large pool of uncontrolled-seizure patients who could be a fit, and brand share here is still low.',
  },
  T9_COMPETITOR_LOE_SHIFT: {
    name: 'Competitor post-LOE shift',
    blurb: "A key competitor is declining post-loss-of-exclusivity and this HCP hasn't moved to us yet.",
  },
  T10_MIC_NO_FOLLOWUP: {
    name: 'Medical inquiry, no follow-up',
    blurb: 'Asked a medical question through Medical Information and nobody has followed up.',
  },
};
function triggerName(t) { return TRIGGER_INFO[t]?.name || t; }

// Gate/eligibility block reasons come straight out of eligibility.py as full
// sentences with the iZO column baked in — correct for an audit trail, too
// long to read as a chart axis label. Matched by prefix since one of them
// (the F2F recency gate) carries a config-driven number.
const GATE_REASON_LABELS = [
  [r => r.startsWith('not on VW_TRGT_DTL_FACT'), 'Not on the target list this trimester'],
  [r => r.startsWith('trimester frequency already met'), 'Already at their call-frequency cap'],
  [r => r.startsWith('called F2F within the last'), 'Visited too recently'],
  [r => r.startsWith('NO_CTAC_FLG'), 'Requested no contact'],
  [r => r.startsWith('EXCLUDE_HCP_CUSTOMER__C'), 'Commercially excluded'],
  [r => r.startsWith('DO_NOT_CALL_VOD__C'), 'On the Do Not Call list'],
  [r => r.startsWith('LEGAL_EXCLUSION_CUSTOMER__C'), 'Legal hold'],
  [r => r.startsWith('no TERRITORY_VOD__C'), 'Not aligned to a territory'],
];
function gateReasonLabel(reason) {
  const hit = GATE_REASON_LABELS.find(([test]) => test(reason));
  return hit ? hit[1] : reason;
}

function GateAuditTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="nba-chart-tooltip">
      <div className="nba-chart-tooltip-title">{gateReasonLabel(row.block_reason)}</div>
      <div className="nba-chart-tooltip-count">{row.hcp_count} HCPs</div>
      <div className="nba-trigger-code" style={{ display: 'block', marginTop: 4 }}>{row.block_reason}</div>
    </div>
  );
}

// Small chip: plain name + raw code, hover for the one-line rule.
function TriggerBadge({ code, primary }) {
  const info = TRIGGER_INFO[code];
  return (
    <span
      className={`nba-trigger-chip${primary ? ' primary' : ''}`}
      style={!primary ? { background: `${triggerColor(code)}22`, color: triggerColor(code) } : undefined}
      title={info ? info.blurb : undefined}
    >
      {triggerName(code)}
      <span className="nba-trigger-code">{code}</span>
      {primary ? ' · primary' : ''}
    </span>
  );
}

// ── tiny allowlist HTML sanitizer for Reason_vod__c ─────────────────────────
// Reason_vod__c is a Veeva long-text field that accepts HTML. The engine
// (nba_v1/engine.py _reason_html) only ever emits <p> <b> <i> <ul> <li> with
// no attributes, but this is rendered content loaded from a data file, not
// engine source, so it's sanitized defensively before render rather than
// trusted. No new dependency: DOMParser is a native browser API.
const ALLOWED_REASON_TAGS = new Set(['P', 'B', 'I', 'UL', 'LI', 'BR', 'STRONG', 'EM']);

function sanitizeNode(el) {
  const kids = Array.from(el.childNodes);
  kids.forEach(child => {
    if (child.nodeType === 1) {
      const tag = child.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') { el.removeChild(child); return; }
      sanitizeNode(child);
      if (ALLOWED_REASON_TAGS.has(tag)) {
        Array.from(child.attributes).forEach(a => child.removeAttribute(a.name));
      } else {
        while (child.firstChild) el.insertBefore(child.firstChild, child);
        el.removeChild(child);
      }
    } else if (child.nodeType !== 3) {
      el.removeChild(child);
    }
  });
}

function sanitizeHtml(html) {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(String(html), 'text/html');
  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}

function safeParse(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}

// ── humanizing helpers ──────────────────────────────────────────────────────
// Several fields carry raw identifiers by design (message IDs, MLR codes,
// trigger codes embedded in free text) because that's what a real Veeva
// Reason_vod__c / content_reason field would contain. The iZO source-column
// citations inside Reason_vod__c (e.g. "(VW_SLS_XPO_WKLY_FACT.NEW_RX)") are
// NOT touched here — verify.py asserts every reason carries a real source
// column, that's the audit trail this whole engine exists to provide. What
// gets cleaned up is everything that reads as a raw ID with zero framing.

// "MSG_DDI_MANAGEMENT" -> "DDI Management", "CLM_ACCESS_PA_01" -> "Access Pa 01"
function humanizeId(id) {
  if (!id) return '';
  return String(id)
    .split('_')
    .filter(w => w && w !== 'MSG' && w !== 'CLM')
    .map(w => (w.length <= 3 && w === w.toUpperCase() && !/^\d+$/.test(w)) ? w : w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

// Replaces any bare trigger code (T1_..T10_...) inside a free-text string
// with its plain-language name, e.g. content_reason's
// "Selected for T6_CALL_PLAN_GAP (affinity 1.00)" -> "Selected for
// Call-plan gap (affinity 1.00)".
function humanizeTriggerRefs(text) {
  if (!text) return '';
  return String(text).replace(/T([1-9]|10)_[A-Z_]+/g, code => triggerName(code));
}

// content_catalog.py ships placeholder MLR job codes on purpose (real ones
// don't exist until MLR connects a system) - see its module docstring. The
// engine embeds them in Reason_vod__c as a bare "[MLR-PLACEHOLDER-0007]",
// which is correct Veeva-field behavior but reads like unfilled template
// text without framing. This reframes it as a labelled, clearly-draft
// reference instead of hiding or deleting it - the placeholder-ness is real
// and worth surfacing, not real MLR data to pretend otherwise about.
function humanizeMlrRefs(html) {
  if (!html) return '';
  return html.replace(/\[([\w.-]+)\]/g, (_, code) => (
    /^MLR-PLACEHOLDER-/i.test(code)
      ? `(MLR reference ${code} — draft, no MLR system connected yet)`
      : `(MLR reference ${code})`
  ));
}

function mlrIsPlaceholder(code) {
  return /^MLR-PLACEHOLDER-/i.test(String(code || ''));
}

// Every evidence line in Reason_vod__c ends with its raw source-column
// citation — engine.py's _reason_html bakes it in as
// "<i>(CRM_ACCOUNT.TRIMESTER_CALL_GOAL__C)</i>" — real and deliberate
// (verify.py asserts every reason traces to an actual column; that's the
// audit trail this engine exists to provide), but not something to print
// on every card until there's a field-mapping sheet for someone to read it
// against. Strips it from display only — Reason_vod__c itself is untouched.
function stripSourceCitations(html) {
  if (!html) return '';
  return html.replace(/\s*<i>\([^)]*\)<\/i>/g, '');
}

const VIEWS = [
  { key: 'summary', label: 'Run Summary' },
  { key: 'capacity', label: 'Capacity by Territory' },
  { key: 'suggestions', label: 'Suggestion Detail' },
  { key: 'hcp', label: 'HCP Lookup' },
  { key: 'feedback', label: 'Feedback & ROI' },
];

function StatTile({ n, t }) {
  return (
    <div className="kpi-card">
      <div className="kpi-card-value">{n}</div>
      <div className="kpi-card-label">{t}</div>
    </div>
  );
}

function Insight({ children }) {
  return <div className="nba-insight">{children}</div>;
}

function TabBar({ current, onPick }) {
  return (
    <div className="nba-tabs">
      {VIEWS.map(v => (
        <button
          key={v.key}
          className={`nba-tab${v.key === current ? ' on' : ''}`}
          onClick={() => onPick(v.key)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

// Aggregated across all triggers from feedback.py's driver_performance —
// same numbers FeedbackROIView's table already shows per-trigger, just
// summed here for the run-level "how is the field responding" read every
// NBA vendor screen (Veeva NBA Overview, Salesforce Agentforce) leads with.
function SuggestionResponseBar({ agg, simulated }) {
  if (!agg || agg.suggested === 0) return null;
  const pending = agg.suggested - agg.executed - agg.dismissed;
  const pct = n => (n / agg.suggested) * 100;
  return (
    <div className="dashboard-card" style={{ marginBottom: 16 }}>
      <div className="dashboard-card-header">
        <span className="dashboard-card-title">
          Suggestion response this run{simulated && <span className="nba-draft-badge">simulated</span>}
        </span>
      </div>
      <div className="nba-response-bar">
        <div className="nba-response-seg nba-response-executed" style={{ width: `${pct(agg.executed)}%` }} />
        <div className="nba-response-seg nba-response-dismissed" style={{ width: `${pct(agg.dismissed)}%` }} />
        <div className="nba-response-seg nba-response-pending" style={{ width: `${pct(pending)}%` }} />
      </div>
      <div className="nba-response-legend">
        <span><i className="nba-response-dot nba-response-executed" />Executed ({agg.executed})</span>
        <span><i className="nba-response-dot nba-response-dismissed" />Dismissed ({agg.dismissed})</span>
        <span><i className="nba-response-dot nba-response-pending" />Pending ({pending})</span>
      </div>
      <div className="kpi-cards-row" style={{ marginTop: 14, marginBottom: 0 }}>
        <StatTile n={agg.suggested} t="Total suggestions" />
        <StatTile n={agg.executed} t="Actioned" />
        <StatTile n={pending} t="Pending" />
      </div>
    </div>
  );
}

// Ranked across every territory, not one at a time — an ops user shouldn't
// have to pick a territory first just to see what needs attention today.
function TopSuggestions({ suggestions, onSelect }) {
  const top = useMemo(
    () => [...suggestions].sort((a, b) => b.priority_score - a.priority_score).slice(0, 8),
    [suggestions]
  );

  return (
    <div className="dashboard-card" style={{ marginBottom: 16 }}>
      <div className="dashboard-card-header">
        <span className="dashboard-card-title">Top suggestions this run — across all territories</span>
      </div>
      {top.length === 0 ? (
        <div className="empty-state">No suggestions were emitted in this run.</div>
      ) : (
        <div className="nba-top-sugg-list">
          {/* No Urgent/Normal badge here — this list is already the top 8 by
              score, and Urgent_vod is defined as the top 10th percentile
              run-wide (config.py's urgent_priority_percentile), so every row
              in a top-8-across-all-territories list is always Urgent. The
              badge would be true on every row and say nothing. Rank is the
              thing that actually varies here. */}
          {top.map((s, idx) => (
            <div
              key={s.Suggestion_External_ID_vod__c}
              className="nba-top-sugg-row"
              onClick={() => onSelect(s.Suggestion_External_ID_vod__c)}
            >
              <span className="nba-top-sugg-rank">{idx + 1}</span>
              <div className="nba-top-sugg-main">
                <div className="nba-top-sugg-name">
                  {s.HCP_NM}
                  {s.pdrp_restricted && <span className="nba-badge-pdrp">PDRP</span>}
                  <span className="nba-top-sugg-territory">{s.TERRITORY_VOD__C}</span>
                </div>
                <div className="nba-top-sugg-why">{s.trigger_headline || triggerName(s.primary_trigger)}</div>
              </div>
              <ChevronRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── View 1: Run Summary ─────────────────────────────────────────────────────
function RunSummary({ data, onSelectSuggestion }) {
  const f = data.meta.funnel;
  const suggestions = data.suggestions;
  // A block reason with 0 HCPs this run still rendered as an empty row on
  // a scale sized for reasons that barely reach double digits — dropping
  // the zero-count rows lets the axis actually fit the real numbers.
  const gateAudit = data.gate_audit.filter(g => g.hcp_count > 0);

  const responseAgg = useMemo(() => {
    const perf = data.feedback?.driver_performance;
    if (!perf || perf.length === 0) return null;
    return perf.reduce((acc, d) => ({
      suggested: acc.suggested + d.suggested,
      executed: acc.executed + d.executed,
      dismissed: acc.dismissed + d.dismissed,
    }), { suggested: 0, executed: 0, dismissed: 0 });
  }, [data.feedback]);

  const driverMix = useMemo(() => {
    const byTrig = {};
    suggestions.forEach(s => {
      const t = s.primary_trigger;
      if (!byTrig[t]) byTrig[t] = { trigger: t, n: 0, scoreSum: 0, urgent: 0 };
      byTrig[t].n += 1;
      byTrig[t].scoreSum += s.priority_score;
      if (s.Priority_vod__c === 'Urgent_vod') byTrig[t].urgent += 1;
    });
    return Object.values(byTrig)
      .map(d => ({ ...d, mean_score: d.scoreSum / d.n, share: d.n / suggestions.length }))
      .sort((a, b) => b.n - a.n);
  }, [suggestions]);

  const contentMix = useMemo(() => {
    const byMsg = {};
    suggestions.forEach(s => {
      const k = s.message_id;
      if (!byMsg[k]) byMsg[k] = { message_id: k, message_title: s.message_title, n: 0 };
      byMsg[k].n += 1;
    });
    return Object.values(byMsg)
      .map(d => ({ ...d, share: d.n / suggestions.length }))
      .sort((a, b) => b.n - a.n);
  }, [suggestions]);

  return (
    <>
      <Insight>
        <strong>{f.n_emitted}</strong> of <strong>{f.n_universe}</strong> HCPs get a suggestion this run —{' '}
        <strong>{f.n_pdrp_restricted}</strong> PDRP-restricted, <strong>{f.n_capacity_overflow}</strong> deferred by capacity.
        {' '}Read on for why the other {f.n_universe - f.n_emitted} didn't.
      </Insight>

      <details className="nba-glossary">
        <summary>What do T1, T2… mean? — the 10 triggers, in plain language</summary>
        <div className="nba-glossary-grid">
          {Object.entries(TRIGGER_INFO).map(([code, info]) => (
            <div key={code} className="nba-glossary-row">
              <div>
                <span className="nba-glossary-name">{info.name}</span>
                <span className="nba-trigger-code">{code}</span>
              </div>
              <p>{info.blurb}</p>
            </div>
          ))}
        </div>
      </details>

      <div className="kpi-cards-row">
        <StatTile n={f.n_universe} t="HCPs in universe" />
        <StatTile n={f.n_passed_gates} t="Passed compliance / frequency gates" />
        <StatTile n={f.n_fired_trigger} t="Fired >= 1 trigger" />
        <StatTile n={f.n_emitted} t="Emitted within rep capacity" />
      </div>

      <SuggestionResponseBar agg={responseAgg} simulated={data.feedback?.simulated} />
      <TopSuggestions suggestions={suggestions} onSelect={onSelectSuggestion} />

      <div className="dashboard-card" style={{ marginBottom: 16 }}>
        <div className="dashboard-card-header">
          <span className="dashboard-card-title">Why HCPs were blocked — every reason traces to an iZO column</span>
        </div>
        {gateAudit.length === 0 ? (
          <div className="empty-state">No HCPs were blocked in this run.</div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(160, gateAudit.length * 42)}>
            <BarChart data={gateAudit} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="block_reason"
                width={210}
                tick={{ fontSize: 11.5 }}
                tickFormatter={gateReasonLabel}
              />
              <Tooltip content={<GateAuditTooltip />} />
              <Bar dataKey="hcp_count" fill="#0284c7" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="charts-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Driver mix — what the field is being asked to do</span>
          </div>
          {driverMix.length === 0 ? (
            <div className="empty-state">No suggestions were emitted in this run.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Trigger</th><th className="r">n</th><th className="r">Share</th><th className="r">Mean score</th><th className="r">Urgent</th></tr>
              </thead>
              <tbody>
                {driverMix.map(d => (
                  <tr key={d.trigger}>
                    <td><TriggerBadge code={d.trigger} /></td>
                    <td className="r num">{d.n}</td>
                    <td className="r num">{(d.share * 100).toFixed(0)}%</td>
                    <td className="r num">{d.mean_score.toFixed(1)}</td>
                    <td className="r num">{d.urgent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Content mix</span>
          </div>
          {contentMix.length === 0 ? (
            <div className="empty-state">No suggestions were emitted in this run.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Message</th><th className="r">n</th><th className="r">Share</th></tr></thead>
              <tbody>
                {contentMix.map(d => (
                  <tr key={d.message_id}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{d.message_title}</td>
                    <td className="r num">{d.n}</td>
                    <td className="r num">{(d.share * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

// ── View 2: Capacity by Territory ───────────────────────────────────────────
function CapacityView({ data }) {
  const capacity = data.capacity;

  if (capacity.length === 0) {
    return <div className="empty-state">No territories to report — this run produced no capacity table.</div>;
  }

  const sorted = [...capacity].sort((a, b) => b.overflow - a.overflow);
  const oversubscribed = sorted.filter(c => c.overflow > 0);
  const totalOverflow = sorted.reduce((sum, c) => sum + c.overflow, 0);
  const chartData = sorted.map(c => ({
    territory: c.TERRITORY_VOD__C,
    Generated: c.suggestions_generated,
    Slots: c.capacity_slots,
  }));

  return (
    <>
      <Insight>
        {oversubscribed.length > 0 ? (
          <>
            <strong>{oversubscribed.length}</strong> of <strong>{sorted.length}</strong> territories are oversubscribed this cycle
            — <strong>{totalOverflow}</strong> suggestions deferred in total, not dropped. They're marked in red below.
          </>
        ) : (
          <>All <strong>{sorted.length}</strong> territories are within capacity this cycle.</>
        )}
      </Insight>

      <div className="dashboard-card" style={{ marginBottom: 16 }}>
        <div className="dashboard-card-header">
          <span className="dashboard-card-title">Suggestions generated vs. capacity slots, per territory</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ left: 8, right: 20, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="territory" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Generated" fill="#0284c7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Slots" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="dashboard-card" style={{ padding: 0 }}>
        <div className="dashboard-card-header" style={{ padding: '12px 16px', margin: 0, borderBottom: '1px solid #e2e8f0' }}>
          <span className="dashboard-card-title">Capacity by territory — overflow is deferred, never silently dropped</span>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Territory</th><th className="r">Generated</th><th className="r">Within capacity</th><th className="r">Slots</th><th className="r">Overflow</th></tr>
          </thead>
          <tbody>
            {sorted.map(c => (
              <tr key={c.TERRITORY_VOD__C} className={c.overflow > 0 ? 'nba-overflow-row' : ''}>
                <td style={{ fontWeight: 600, color: '#1e293b' }}>{c.TERRITORY_VOD__C}</td>
                <td className="r num">{c.suggestions_generated}</td>
                <td className="r num">{c.within_capacity}</td>
                <td className="r num">{c.capacity_slots}</td>
                <td className="r num">
                  {c.overflow > 0
                    ? <span className="nba-overflow-badge">{c.overflow} deferred</span>
                    : <span className="nba-ok-badge">0</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── View 3: Suggestion Detail ───────────────────────────────────────────────
// HCP Targeting List.xlsx: same model RepCallQueuePage.jsx computes for the
// rep card, duplicated here (not shared) matching this codebase's existing
// convention of self-contained page files. Only Potential (25%) and Plan
// owed (15%) are backed by real data anywhere in this engine's output —
// Momentum, Recent interest and Rep read all need data sources (lifecycle
// stage, website/conference engagement, AI-classified rep notes) that don't
// exist here. A missing input is left out of the weighted average, never
// scored as zero — see RepCallQueuePage.jsx's computeTargetingScore for the
// full reasoning.
const TARGETING_WEIGHTS = { potential: 25, planOwed: 15 };
const TARGETING_MIN_COVERAGE = 40;

function targetingBand(score) {
  if (score >= 80) return 'P1';
  if (score >= 60) return 'P2';
  if (score >= 40) return 'P3';
  return 'P4';
}

function computeTargetingScore(profile) {
  if (!profile) return null;
  let weightAvailable = 0;
  let weightedSum = 0;

  const marketDecile = Number(profile.X17W_TOTAL_EPILEPSY_MARKET_TRX_DECILE_CUSTOMER__C);
  const brandDecile = Number(profile.X17W_PRODUCT_NBRX_DECILE_CUSTOMER__C);
  if (!Number.isNaN(marketDecile)) {
    const headroom = !Number.isNaN(brandDecile) && brandDecile >= 8 ? 0.7 : 1.0;
    const potential = Math.min(100, Math.round(marketDecile * 10 * headroom));
    weightedSum += potential * TARGETING_WEIGHTS.potential;
    weightAvailable += TARGETING_WEIGHTS.potential;
  }

  const goal = Number(profile.TRIMESTER_CALL_GOAL__C);
  const made = Number(profile.TRIMESTER_CALL_MADE__C);
  if (!Number.isNaN(goal) && goal > 0) {
    const completed = Number.isNaN(made) ? 0 : made;
    const planOwed = Math.max(0, Math.round(((goal - completed) / goal) * 100));
    weightedSum += planOwed * TARGETING_WEIGHTS.planOwed;
    weightAvailable += TARGETING_WEIGHTS.planOwed;
  }

  if (weightAvailable < TARGETING_MIN_COVERAGE) return { coverage: weightAvailable, insufficient: true };
  const score = weightedSum / weightAvailable;
  return { score, band: targetingBand(score), coverage: weightAvailable };
}

const SORT_KEYS = {
  hcp: 'HCP_NM',
  score: 'priority_score',
  trigger: 'primary_trigger',
  message: 'message_title',
};

function SortTh({ k, sortKey, sortDir, onSort, children }) {
  return (
    <th className="nba-th-sort" onClick={() => onSort(k)}>
      {children}
      {sortKey === k && (
        <span className="arrow">
          {sortDir === 'asc' ? <ChevronUp size={11} style={{ verticalAlign: -1 }} /> : <ChevronDown size={11} style={{ verticalAlign: -1 }} />}
        </span>
      )}
    </th>
  );
}

function SuggestionDetailView({ data, selId, onSelect }) {
  const suggestions = data.suggestions;
  const [territoryF, setTerritoryF] = useState('All');
  const [triggerF, setTriggerF] = useState('All');
  const [messageF, setMessageF] = useState('All');
  const [pdrpOnly, setPdrpOnly] = useState(false);
  const [sortKey, setSortKey] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  const territories = useMemo(
    () => Array.from(new Set(suggestions.map(s => s.TERRITORY_VOD__C))).sort(),
    [suggestions]
  );
  const triggers = useMemo(
    () => Array.from(new Set(suggestions.map(s => s.primary_trigger))).sort(),
    [suggestions]
  );
  const messages = useMemo(() => {
    const m = new Map();
    suggestions.forEach(s => m.set(s.message_id, s.message_title));
    return Array.from(m.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [suggestions]);

  // Brand decile isn't on the suggestion row itself (only hcp_profiles
  // carries it) — days_since_f2f and targeting_segment already are, no
  // join needed for those two.
  const profileById = useMemo(() => {
    const m = new Map();
    data.hcp_profiles.forEach(p => m.set(p.CUSTOMER_HCP_ID, p));
    return m;
  }, [data.hcp_profiles]);

  const filtered = useMemo(() => {
    let rows = suggestions;
    if (territoryF !== 'All') rows = rows.filter(s => s.TERRITORY_VOD__C === territoryF);
    if (triggerF !== 'All') rows = rows.filter(s => s.primary_trigger === triggerF);
    if (messageF !== 'All') rows = rows.filter(s => s.message_id === messageF);
    if (pdrpOnly) rows = rows.filter(s => s.pdrp_restricted);
    const key = SORT_KEYS[sortKey];
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[key], bv = b[key];
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [suggestions, territoryF, triggerF, messageF, pdrpOnly, sortKey, sortDir]);

  // Grouped by territory — a rep's week is a territory, not a row in a
  // 273-row spreadsheet. Sort order picked above still applies within
  // each group.
  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach(s => {
      const key = s.TERRITORY_VOD__C;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(s);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  // Resolved against the full list, not `filtered` — a suggestion picked
  // from Run Summary's Top Suggestions panel (no filters applied there)
  // must still resolve here even if this view's own filters would
  // currently hide its row.
  const selected = suggestions.find(s => s.Suggestion_External_ID_vod__c === selId) || null;
  const selectedProfile = selected ? profileById.get(selected.CUSTOMER_HCP_ID) : null;

  return (
    <>
      <Insight>
        Showing <strong>{filtered.length}</strong> of <strong>{suggestions.length}</strong> suggestions, grouped by territory
        and ranked within each. Click any row for the full score breakdown and the reasoning behind it.
      </Insight>

      <div className="nba-filter-row">
        <div className="nba-filter-field">
          <span className="cohort-form-label">Territory</span>
          <select className="filter-select" value={territoryF} onChange={e => setTerritoryF(e.target.value)}>
            <option>All</option>
            {territories.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="nba-filter-field">
          <span className="cohort-form-label">Trigger</span>
          <select className="filter-select" value={triggerF} onChange={e => setTriggerF(e.target.value)}>
            <option>All</option>
            {triggers.map(t => <option key={t} value={t}>{triggerName(t)}</option>)}
          </select>
        </div>
        <div className="nba-filter-field">
          <span className="cohort-form-label">Message</span>
          <select className="filter-select" value={messageF} onChange={e => setMessageF(e.target.value)}>
            <option value="All">All</option>
            {messages.map(([id, title]) => <option key={id} value={id}>{title}</option>)}
          </select>
        </div>
        <label className="nba-pdrp-toggle">
          <input type="checkbox" checked={pdrpOnly} onChange={e => setPdrpOnly(e.target.checked)} />
          PDRP only
        </label>
      </div>

      <div className="dashboard-card" style={{ padding: 0, marginBottom: 16 }}>
        <div className="dashboard-card-header" style={{ padding: '12px 16px', margin: 0, borderBottom: '1px solid #e2e8f0' }}>
          <span className="dashboard-card-title">{filtered.length} suggestion{filtered.length === 1 ? '' : 's'} across {grouped.length} territor{grouped.length === 1 ? 'y' : 'ies'}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">No suggestions match these filters.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <SortTh k="hcp" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort}>HCP</SortTh>
                  <th>Tier</th>
                  <th>Specialty</th>
                  <th>Brand decile</th>
                  <th>Segment</th>
                  <th>Last F2F</th>
                  <SortTh k="score" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort}>Priority score</SortTh>
                  <th>Veeva priority</th>
                  <SortTh k="trigger" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort}>Primary trigger</SortTh>
                  <SortTh k="message" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort}>Message</SortTh>
                </tr>
              </thead>
              <tbody>
                {grouped.map(([terr, rows]) => (
                  <React.Fragment key={terr}>
                    <tr className="nba-group-row">
                      <td colSpan={10}>{terr} — {rows.length} suggestion{rows.length === 1 ? '' : 's'}</td>
                    </tr>
                    {rows.map(s => {
                      const isUrgent = s.Priority_vod__c === 'Urgent_vod';
                      const rowClass = [
                        'nba-row-clickable',
                        selId === s.Suggestion_External_ID_vod__c ? 'nba-row-sel' : '',
                        isUrgent ? 'nba-urgent-row' : '',
                        s.pdrp_restricted ? 'nba-pdrp-row' : '',
                      ].filter(Boolean).join(' ');
                      const profile = profileById.get(s.CUSTOMER_HCP_ID);
                      const targeting = computeTargetingScore(profile);
                      return (
                        <tr
                          key={s.Suggestion_External_ID_vod__c}
                          className={rowClass}
                          onClick={() => onSelect(prev => (prev === s.Suggestion_External_ID_vod__c ? null : s.Suggestion_External_ID_vod__c))}
                        >
                          <td style={{ fontWeight: 600, color: '#1e293b' }}>
                            {s.HCP_NM}
                            {s.pdrp_restricted && <span className="nba-badge-pdrp">PDRP</span>}
                          </td>
                          <td>
                            {targeting && !targeting.insufficient
                              ? <span className={`rq-targeting-badge rq-targeting-${targeting.band.toLowerCase()}`}>{targeting.band}</span>
                              : <span className="nba-score-dash">—</span>}
                          </td>
                          <td>{s.SPTY_GRP_TXT}</td>
                          <td className="num">{fmtNum(profile?.X17W_PRODUCT_NBRX_DECILE_CUSTOMER__C)}</td>
                          <td>{s.targeting_segment || '—'}</td>
                          <td>{s.never_called ? 'Never' : `${s.days_since_f2f}d ago`}</td>
                          <td className="num">
                            {s.pdrp_restricted
                              ? <span className="nba-score-dash">not displayed</span>
                              : s.priority_score.toFixed(1)}
                          </td>
                          <td>
                            <span className={isUrgent ? 'nba-badge-urgent' : 'nba-badge-normal'}>
                              {isUrgent ? 'Urgent' : 'Normal'}
                            </span>
                          </td>
                          <td><TriggerBadge code={s.primary_trigger} /></td>
                          <td>{s.message_title}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* A slide-over, not a block appearing below a 273-row table — clicking
          a row shouldn't mean losing your place and scrolling somewhere else
          to see who it is and what the recommended action is. HCP identity,
          the NBA hero card, and the full attribute profile all land in one
          place, in view, immediately. */}
      {selected && (
        <div className="nba-drawer-overlay" onClick={() => onSelect(null)}>
          <div className="nba-drawer" onClick={e => e.stopPropagation()}>
            <div className="nba-drawer-scroll">
              <SuggestionDetailPanel s={selected} onClose={() => onSelect(null)} data={data} />
              <AttrGroupsCard profile={selectedProfile} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Reused by Suggestion Detail (a live, emitted suggestion) and by HCP Lookup
// (which may also pass a *candidate* row — fired a trigger, scored, but not
// emitted — in which case `s.Priority_vod__c` is undefined and
// `s.within_capacity === false`). `data` is the full run payload, used only
// to compute the two real cross-run metrics below (trigger coverage, peer
// cohort) — nothing here is a learned/uplift number, this is a rules
// engine by design (see README: "No ML in V1, deliberately").
function SuggestionDetailPanel({ s, onClose, data }) {
  const contributions = useMemo(() => safeParse(s.contributions, {}), [s.contributions]);
  const alternatives = useMemo(() => safeParse(s.content_alternatives, []), [s.content_alternatives]);
  const allTriggers = useMemo(() => (s.all_triggers || '').split('|').filter(Boolean), [s.all_triggers]);
  const cleanReason = useMemo(
    () => stripSourceCitations(humanizeMlrRefs(sanitizeHtml(s.Reason_vod__c))),
    [s.Reason_vod__c]
  );

  const contribEntries = Object.entries(contributions).sort((a, b) => b[1] - a[1]);
  const contribTotal = contribEntries.reduce((sum, [, v]) => sum + v, 0) || 1;
  const isCandidateOnly = s.Priority_vod__c === undefined;

  // Trigger coverage: what share of the full 10-trigger weight framework
  // corroborates this suggestion (sum of fired triggers' configured
  // weight / sum of all configured weights). Real, computed from
  // config.py's own TRIGGER_WEIGHTS — not a model confidence score.
  const weights = data?.meta?.config?.trigger_weights || {};
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const firedWeight = allTriggers.reduce((sum, t) => sum + (weights[t] || 0), 0);
  const coveragePct = Math.round((firedWeight / totalWeight) * 100);

  // Peer cohort: how many other suggestions this run share the same
  // primary trigger — "is this a one-off or a pattern this cycle".
  const peerCount = data?.suggestions
    ? data.suggestions.filter(x => x.primary_trigger === s.primary_trigger && x.CUSTOMER_HCP_ID !== s.CUSTOMER_HCP_ID).length
    : null;

  const priorityLabel = isCandidateOnly
    ? 'Deferred by capacity'
    : (s.Priority_vod__c === 'Urgent_vod' ? 'Urgent this week' : 'Normal priority');

  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', paddingBottom: 14, borderBottom: '1px solid #e2e8f0', marginBottom: 16 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: '#1e293b' }}>
            {s.HCP_NM}
            {s.pdrp_restricted && <span className="nba-badge-pdrp">PDRP</span>}
          </h3>
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
            {s.SPTY_GRP_TXT} · {s.TERRITORY_VOD__C} · {s.CUSTOMER_HCP_ID}
          </div>
          {(s.targeting_segment || s.loyalty_segment || s.attitudinal_segment) && (
            <div className="nba-segment-tags">
              {s.targeting_segment && <span className="nba-segment-tag">Segment <strong>{s.targeting_segment}</strong></span>}
              {s.loyalty_segment && <span className="nba-segment-tag">Relationship <strong>{s.loyalty_segment}</strong></span>}
              {s.attitudinal_segment && <span className="nba-segment-tag">Engagement style <strong>{s.attitudinal_segment}</strong></span>}
            </div>
          )}
        </div>
        {onClose && <button className="nba-close-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>}
      </div>

      {s.within_capacity === false && (
        <div className="nba-deferred-note">
          Fired <b>{triggerName(s.primary_trigger)}</b> and scored <b>{Number(s.priority_score).toFixed(1)}</b>, but ranked
          {' '}<b>#{s.rank_in_territory}</b> in {s.TERRITORY_VOD__C} — outside this cycle's capacity. Deferred, not
          dropped; see Capacity by Territory for the slot count.
        </div>
      )}

      <div className="nba-hero-card">
        <div className="nba-hero-badge"><Sparkles size={16} /></div>
        <div className="nba-hero-body">
          <div className="nba-hero-eyebrow">Next Best Action · NBA Engine {data?.meta?.engine_version}</div>
          <div className="nba-hero-title">{s.message_title}</div>
          <div className="nba-hero-subtitle">F2F · {priorityLabel}</div>
        </div>
      </div>

      <div className="nba-hero-tiles">
        <div className="nba-hero-tile">
          <div className="nba-hero-tile-label">Priority score</div>
          <div className="nba-hero-tile-value">{s.pdrp_restricted ? '—' : Number(s.priority_score).toFixed(1)}</div>
          <div className="nba-hero-tile-sub">
            {s.pdrp_restricted
              ? 'hidden — PDRP'
              : `signal ${Number(s.signal).toFixed(2)} × opp ${Number(s.opportunity).toFixed(2)} × resp ${Number(s.responsiveness).toFixed(2)}`}
          </div>
        </div>
        <div className="nba-hero-tile">
          <div className="nba-hero-tile-label">Trigger coverage</div>
          <div className="nba-hero-tile-value">{coveragePct}%</div>
          <div className="nba-hero-tile-sub">of the 10-trigger weight framework corroborates this</div>
        </div>
        <div className="nba-hero-tile">
          <div className="nba-hero-tile-label">Peer cohort</div>
          <div className="nba-hero-tile-value">{peerCount === null ? '—' : peerCount}</div>
          <div className="nba-hero-tile-sub">other HCPs fired {triggerName(s.primary_trigger)} this run</div>
        </div>
      </div>

      <div className="secl">
        Why this action <span className="nba-trigger-code" style={{ textTransform: 'none' }}>Reason_vod__c, sanitized HTML</span>
      </div>
      <div className="nba-reason-box" dangerouslySetInnerHTML={{ __html: cleanReason }} style={{ marginBottom: 16 }} />

      {s.pdrp_restricted && (
        <div className="nba-pdrp-note">
          <b>Priority score not displayed</b>
          This prescriber is PDRP-restricted (Display_Score_vod__c = false). Individual
          prescribing-derived numbers — priority score, signal, opportunity and
          responsiveness — are withheld here, mirroring what the rep sees. The
          suggestion itself is still made; the reason above has already had
          IQVIA-derived triggers stripped by the engine.
        </div>
      )}

      {!s.pdrp_restricted && contribEntries.length > 0 && (
        <>
          <div className="secl">Score breakdown by trigger</div>
          <div className="nba-contrib-bar">
            {contribEntries.map(([t, v]) => (
              <div
                key={t}
                className="nba-contrib-seg"
                style={{ width: `${(v / contribTotal) * 100}%`, background: triggerColor(t) }}
                title={`${triggerName(t)}: ${v}`}
              />
            ))}
          </div>
          <div className="nba-contrib-legend">
            {contribEntries.map(([t, v]) => (
              <div key={t} className="nba-contrib-legend-row">
                <span className="nba-contrib-swatch" style={{ background: triggerColor(t) }} />
                {triggerName(t)}
                <span className="nba-trigger-code">{t}</span>
                <span className="nba-contrib-legend-val">{v.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="secl" style={{ marginTop: s.pdrp_restricted ? 4 : 8 }}>All triggers fired ({allTriggers.length})</div>
      <div style={{ marginBottom: 16 }}>
        {allTriggers.map(t => (
          <TriggerBadge key={t} code={t} primary={t === s.primary_trigger} />
        ))}
      </div>

      <div className="secl">Call prep for this visit</div>
      <div className="nba-callprep-grid">
        <div className="nba-callprep-box nba-callprep-why">
          <div className="nba-callprep-box-label"><AlertTriangle size={13} /> Why this visit, now</div>
          <p>{s.trigger_headline || triggerName(s.primary_trigger)}</p>
        </div>
        <div className="nba-callprep-box nba-callprep-play">
          <div className="nba-callprep-box-label"><MessageSquare size={13} /> What to say</div>
          <p>{s.rep_talking_point}</p>
        </div>
      </div>
      {s.label_anchor && (
        <div className="nba-callprep-ref">
          If asked about dosing or safety, reference: <strong>{s.label_anchor}</strong>
        </div>
      )}

      <div className="nba-callprep-tech">
        MLR reference: {s.mlr_code}
        {mlrIsPlaceholder(s.mlr_code) && <span className="nba-draft-badge">draft</span>}
        {' '}· Content ID: {s.clm_key}
        {' '}· {humanizeTriggerRefs(s.content_reason)}
      </div>

      {alternatives.length > 0 && (
        <>
          <div className="secl">Content runners-up</div>
          <div style={{ marginBottom: 16 }}>
            {alternatives.map(([id, score]) => (
              <div key={id} className="nba-alt-row">
                <span>{humanizeId(id)}<span className="nba-trigger-code">{id}</span></span>
                <span>{Number(score).toFixed(3)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── View 4: HCP Lookup ──────────────────────────────────────────────────────
// "How is the NBA defined for a particular person" — a full attribute
// profile for any HCP in the universe (suggested or not), plus a plain
// explanation of the outcome resolved against the same data every other
// view uses (suggestions -> all_candidates -> diagnostics -> block_reasons).

function fmtFlag(v) {
  const s = String(v ?? '').trim().toUpperCase();
  return s === 'Y' || s === 'TRUE' || v === true;
}
function fmtNum(v, digits = 2) {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—';
  const n = Number(v);
  return Number.isInteger(n) ? String(n) : n.toFixed(digits);
}
function fmtPct(v) {
  if (v === null || v === undefined || v === '' || Number.isNaN(Number(v))) return '—';
  return `${(Number(v) * 100).toFixed(0)}%`;
}
function fmtDate(v) {
  if (!v) return '—';
  return String(v).slice(0, 10);
}
function fmtStr(v) {
  return v === null || v === undefined || v === '' ? '—' : String(v);
}

const ATTR_GROUPS = [
  {
    title: 'Eligibility & compliance',
    fields: [
      ['NO_CTAC_FLG', 'No Contact flag', 'flag'],
      ['PDRP_FLG', 'PDRP flag', 'flag'],
      ['DO_NOT_CALL_VOD__C', 'Do Not Call', 'flag'],
      ['LEGAL_EXCLUSION_CUSTOMER__C', 'Legal exclusion', 'flag'],
      ['EXCLUDE_HCP_CUSTOMER__C', 'Commercially excluded', 'flag'],
      ['on_target_list', 'On target list', 'flag'],
      ['SAMPLE_ELIGIBILITY_CUSTOMER__C', 'Sample eligibility', 'str'],
      ['STARTER_PACK_ELIGIBILITY_CUSTOMER__C', 'Starter pack eligibility', 'str'],
      ['REMAINING_SPEND_FOR_HCP_CUSTOMER__C', 'Sunshine spend headroom ($)', 'num'],
    ],
  },
  {
    title: 'Targeting & segmentation',
    fields: [
      ['HCP_TARGETING_SEGMENT_CUSTOMER__C', 'Targeting segment', 'str'],
      ['HCP_ATTITUDINAL_SEGMENT_EPILEPSY_CUSTOMER__C', 'Attitudinal segment', 'str'],
      ['PRODUCT_LOYALTY_SEGMENT__C', 'Loyalty segment', 'str'],
      ['EPILEPTOLOGIST_FLG', 'Epileptologist', 'flag'],
      ['EPILEPSY_CENTER_LINK_FLG', 'Epilepsy center link', 'flag'],
    ],
  },
  {
    title: 'Potential & performance',
    fields: [
      ['X17W_PRODUCT_NBRX_DECILE_CUSTOMER__C', 'Brand NBRx decile (17wk)', 'num'],
      ['X52W_PRODUCT_NBRX_DECILE_CUSTOMER__C', 'Brand NBRx decile (52wk)', 'num'],
      ['X17W_TOTAL_EPILEPSY_MARKET_TRX_DECILE_CUSTOMER__C', 'Market TRx decile (17wk)', 'num'],
      ['REFRACTORY_PATIENT_DECILE__C', 'Refractory patient decile', 'num'],
      ['LACOSAMIDE_NBRX_TREND_POST_LOE__C', 'Lacosamide post-LOE trend', 'str'],
      ['DECLINING_PRODUCT_INITIATOR__C', 'Declining initiator', 'flag'],
      ['brand_trend_ratio', 'Brand trend (recent / prior)', 'num'],
      ['mkt_trend_ratio', 'Market trend (recent / prior)', 'num'],
      ['brand_share_17', 'Brand share of market (17wk)', 'pct'],
      ['TERR_17W_PRODUCT_NBRX_RANK_CUSTOMER__C', 'Rank in territory (17wk)', 'num'],
    ],
  },
  {
    title: 'Recent prescribing dynamics (4wk)',
    fields: [
      ['switch_out_recent', 'Switch-outs', 'num'],
      ['switch_in_recent', 'Switch-ins', 'num'],
      ['add_on_recent', 'Add-ons', 'num'],
      ['new_therapy_recent', 'New therapy starts', 'num'],
      ['contd_refill_recent', 'Continued refills', 'num'],
    ],
  },
  {
    title: 'Market Access',
    fields: [
      ['pa_cases', 'Prior auth cases (180d)', 'num'],
      ['pa_denied', 'Prior auth denied', 'num'],
      ['pa_denial_rate', 'Denial rate', 'pct'],
      ['pa_top_denial_reason', 'Top denial reason', 'str'],
      ['claims', 'Pharmacy claims (180d)', 'num'],
      ['abandoned', 'Claims abandoned', 'num'],
      ['abandon_rate', 'Abandonment rate', 'pct'],
      ['therapy_starts', 'Therapy starts (365d)', 'num'],
      ['early_disc', 'Early discontinuations', 'num'],
      ['early_disc_rate', 'Early discontinuation rate', 'pct'],
      ['mean_pdc', 'Mean adherence (PDC)', 'pct'],
    ],
  },
  {
    title: 'Medical',
    fields: [
      ['mic_category', 'Open MIC inquiry category', 'str'],
      ['mic_subcategory', 'MIC sub-category', 'str'],
      ['mic_date', 'MIC inquiry date', 'date'],
      ['mic_days_open', 'Days open', 'num'],
    ],
  },
  {
    title: 'Call history & capacity',
    fields: [
      ['LAST_CALL_DATE_CUSTOMER__C', 'Last call date', 'date'],
      ['days_since_f2f', 'Days since last F2F', 'num'],
      ['never_called', 'Never called', 'flag'],
      ['f2f_in_trimester', 'F2F calls this trimester', 'num'],
      ['UPDT_FREQ_NUM', 'Trimester frequency cap', 'num'],
      ['ORGL_FREQ_NUM', 'HQ original frequency', 'num'],
      ['TRIMESTER_CALL_GOAL__C', 'Trimester call goal', 'num'],
      ['TRIMESTER_CALL_MADE__C', 'Trimester calls made', 'num'],
    ],
  },
];

function AttrValue({ type, value }) {
  if (type === 'flag') {
    const on = fmtFlag(value);
    return <span className={on ? 'nba-flag-yes' : 'nba-flag-no'}>{on ? 'Yes' : 'No'}</span>;
  }
  if (type === 'pct') return <span>{fmtPct(value)}</span>;
  if (type === 'date') return <span>{fmtDate(value)}</span>;
  if (type === 'num') return <span>{fmtNum(value)}</span>;
  return <span>{fmtStr(value)}</span>;
}

// Shared by HCP Lookup and Suggestion Detail's click-through — one HCP,
// one screen: the recommended action plus the full attribute set that
// explains it, instead of forcing a second trip through HCP Lookup to see
// what the row's profile actually looks like.
function AttrGroupsCard({ profile }) {
  const [expanded, setExpanded] = useState(false);
  if (!profile) return null;
  return (
    <div className="dashboard-card" style={{ marginTop: 16 }}>
      <div className="dashboard-card-header" style={{ marginBottom: expanded ? 12 : 0 }}>
        <span className="dashboard-card-title">Every attribute that defines this HCP's NBA</span>
        <button className="nba-attr-toggle-btn" onClick={() => setExpanded(v => !v)}>
          {expanded ? 'Hide details' : 'Show details'}
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
      {expanded && ATTR_GROUPS.map(group => (
        <div key={group.title} className="nba-attr-group">
          <div className="nba-attr-group-title">{group.title}</div>
          <div className="nba-attr-grid">
            {group.fields.map(([key, label, type]) => (
              <div key={key} className="nba-attr-row">
                <span className="nba-attr-label">{label}</span>
                <span className="nba-attr-val"><AttrValue type={type} value={profile[key]} /></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function resolveHcpOutcome(profile, data) {
  const id = profile.CUSTOMER_HCP_ID;
  const suggestion = data.suggestions.find(s => s.CUSTOMER_HCP_ID === id);
  if (suggestion) return { kind: 'suggested', suggestion };
  const candidate = data.all_candidates.find(c => c.CUSTOMER_HCP_ID === id);
  if (candidate) return { kind: 'deferred', candidate };
  const diag = data.diagnostics.find(d => d.CUSTOMER_HCP_ID === id);
  if (diag) return { kind: 'diagnostic', reason: diag.reason };
  if (!profile.eligible) return { kind: 'blocked' };
  return { kind: 'unknown' };
}

function HCPOutcomePanel({ profile, data }) {
  const outcome = useMemo(() => resolveHcpOutcome(profile, data), [profile, data]);

  if (outcome.kind === 'suggested') {
    return <SuggestionDetailPanel s={outcome.suggestion} onClose={null} data={data} />;
  }
  if (outcome.kind === 'deferred') {
    return <SuggestionDetailPanel s={outcome.candidate} onClose={null} data={data} />;
  }
  if (outcome.kind === 'blocked') {
    return (
      <div className="tgt-gate">
        <b>No suggestion — blocked before scoring</b>
        {profile.block_reasons && profile.block_reasons.length > 0
          ? profile.block_reasons.join('; ')
          : 'Blocked by an eligibility gate.'}
      </div>
    );
  }
  if (outcome.kind === 'diagnostic') {
    return (
      <div className="nba-info-note">
        <b style={{ display: 'block', marginBottom: 3 }}>No suggestion this run</b>
        {outcome.reason}
      </div>
    );
  }
  return (
    <div className="nba-info-note">
      Eligible, but did not appear in this run's candidates or diagnostics — likely no trigger condition was met.
    </div>
  );
}

function HCPLookupView({ data }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return data.hcp_profiles
      .filter(p => p.HCP_NM.toLowerCase().includes(q) || p.CUSTOMER_HCP_ID.toLowerCase().includes(q))
      .slice(0, 25);
  }, [query, data.hcp_profiles]);

  const selected = useMemo(
    () => data.hcp_profiles.find(p => p.CUSTOMER_HCP_ID === selectedId) || null,
    [selectedId, data.hcp_profiles]
  );

  function pick(id) {
    setSelectedId(id);
    setQuery('');
  }

  return (
    <>
      <Insight>
        Search any of the <strong>{data.hcp_profiles.length}</strong> HCPs in this territory universe — suggested or
        not — to see exactly which attributes defined their outcome.
      </Insight>

      <div className="nba-hcp-search-box">
        <Search size={14} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
        <input
          type="text"
          className="nba-hcp-search-input"
          style={{ paddingLeft: 34 }}
          placeholder="Search by HCP name or ID…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {results.length > 0 && (
          <div className="nba-hcp-results">
            {results.map(p => (
              <div key={p.CUSTOMER_HCP_ID} className="nba-hcp-result-row" onClick={() => pick(p.CUSTOMER_HCP_ID)}>
                <span>
                  <strong>{p.HCP_NM}</strong> · {p.SPTY_GRP_TXT} · {p.TERRITORY_VOD__C}
                </span>
                <span style={{ color: '#94a3b8', fontSize: 11.5 }}>{p.CUSTOMER_HCP_ID}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {!selected ? (
        <div className="empty-state">Search for an HCP above to see their full profile and NBA outcome.</div>
      ) : (
        <>
          <div className="dashboard-card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 21, fontWeight: 700, color: '#1e293b' }}>
                  {selected.HCP_NM}
                  {selected.pdrp_restricted && <span className="nba-badge-pdrp">PDRP</span>}
                </h3>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>
                  {selected.SPTY_GRP_TXT} · {selected.TERRITORY_VOD__C} · {selected.CUSTOMER_HCP_ID} · NPI {fmtStr(selected.NPI_VOD__C)}
                </div>
              </div>
              <span className={selected.eligible ? 'nba-ok-badge' : 'nba-overflow-badge'}>
                {selected.eligible ? 'Eligible' : 'Blocked'}
              </span>
            </div>
          </div>

          <HCPOutcomePanel profile={selected} data={data} />
          <AttrGroupsCard profile={selected} />
        </>
      )}
    </>
  );
}

// ── View 5: Feedback & ROI ──────────────────────────────────────────────────
// feedback.py's measurement machinery (holdout lift, driver performance,
// dismiss diagnosis) already existed but had no caller anywhere and no
// data to run on — no field-feedback cycle exists yet for a fresh run.
// This view is that wiring's output: the math in feedback.py is real, run
// against synthetic outcomes fabricated for this run (synth.py's
// build_feedback / build_prepost_rx). The banner below says so plainly.
function FeedbackROIView({ data }) {
  const fb = data.feedback;

  if (!fb || !fb.lift || fb.lift.error) {
    return (
      <>
        <Insight>
          This view demos feedback.py's measurement loop — holdout lift, driver execution rates, ROI —
          against synthetic outcome data generated for this run, since no real Suggestion_Feedback_vod
          history exists yet.
        </Insight>
        <div className="empty-state">
          {fb?.lift?.error || 'No suggestions were emitted in this run, so there is nothing to measure.'}
        </div>
      </>
    );
  }

  const { lift, roi, driver_performance: driverPerf, dismiss_diagnosis: dismissDiag } = fb;

  return (
    <>
      <div className="nba-sim-banner">
        <b>Simulated feedback.</b> Lift, driver performance and ROI below are computed by the real
        feedback.py functions, but run against synthetic outcomes fabricated for this run — there is no
        real Suggestion_Feedback_vod history yet. The math is real; the inputs are not.
      </div>

      <Insight>
        A deterministic {(fb.holdout_share * 100).toFixed(0)}% holdout ({lift.n_holdout} HCPs) is what makes
        the lift number mean something — the {lift.n_treated} treated HCPs picked up{' '}
        <strong>{lift.diff_in_diff.toFixed(2)}</strong> more NBRx on average than the {lift.n_holdout} held
        back (t = {lift.t_stat}).
      </Insight>

      {roi && (
        <div className="nba-roi-hero">
          <div className="nba-roi-hero-label">Net value this cycle <span className="nba-draft-badge">placeholder $ assumptions</span></div>
          <div className="nba-roi-hero-value">
            {roi.net_value >= 0 ? '+' : ''}${roi.net_value.toLocaleString()}
          </div>
          <div className="nba-roi-hero-ratio">{roi.roi_ratio}x return</div>
          <div className="nba-roi-formula">
            {lift.diff_in_diff.toFixed(3)} incremental NBRx/HCP &times; {lift.n_treated} treated &times; ${roi.value_per_incremental_nbrx.toLocaleString()}/NBRx
            {' '}= <strong>${roi.incremental_nbrx_value.toLocaleString()}</strong> value,
            {' '}minus {roi.executed_calls} calls &times; ${roi.cost_per_f2f_call}/call = <strong>${roi.cost.toLocaleString()}</strong> cost
          </div>
        </div>
      )}

      <div className="kpi-cards-row">
        <StatTile n={lift.n_treated} t="Treated HCPs" />
        <StatTile n={lift.n_holdout} t="Holdout HCPs" />
        <StatTile n={lift.mean_delta_treated.toFixed(2)} t="Mean NBRx change, treated" />
        <StatTile n={lift.mean_delta_holdout.toFixed(2)} t="Mean NBRx change, holdout" />
      </div>
      <div className="nba-callprep-tech">{lift.note}</div>

      <div className="dashboard-card" style={{ marginBottom: 16 }}>
        <div className="dashboard-card-header">
          <span className="dashboard-card-title">Driver performance — which triggers survive into V2</span>
        </div>
        {driverPerf.length === 0 ? (
          <div className="empty-state">No emitted suggestions to measure.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Trigger</th><th className="r">Suggested</th><th className="r">Executed</th>
                <th className="r">Dismissed</th><th className="r">Execution rate</th><th className="r">Dismiss rate</th>
              </tr>
            </thead>
            <tbody>
              {driverPerf.map(d => (
                <tr key={d.primary_trigger}>
                  <td><TriggerBadge code={d.primary_trigger} /></td>
                  <td className="r num">{d.suggested}</td>
                  <td className="r num">{d.executed}</td>
                  <td className="r num">{d.dismissed}</td>
                  <td className="r num">{(d.execution_rate * 100).toFixed(0)}%</td>
                  <td className="r num">{(d.dismiss_rate * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <span className="dashboard-card-title">Dismiss diagnosis — "the data is wrong" concentrated on one driver is a bug report, not rep resistance</span>
        </div>
        {dismissDiag.length === 0 ? (
          <div className="empty-state">No dismissals recorded.</div>
        ) : (
          <table className="data-table">
            <thead><tr><th>Trigger</th><th>Dismiss reason</th><th className="r">n</th></tr></thead>
            <tbody>
              {dismissDiag.map((d, i) => (
                <tr key={`${d.primary_trigger}-${d.dismiss_reason}-${i}`}>
                  <td><TriggerBadge code={d.primary_trigger} /></td>
                  <td>{d.dismiss_reason}</td>
                  <td className="r num">{d.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

// ── Page shell ───────────────────────────────────────────────────────────
export default function NBAEnginePage() {
  const [data, setData] = useState(undefined); // undefined = loading, null = fetch failed
  const [view, setView] = useState('summary');
  const [selSuggestionId, setSelSuggestionId] = useState(null);

  function jumpToSuggestion(id) {
    setSelSuggestionId(id);
    setView('suggestions');
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/nba_run.json')
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(json => { if (!cancelled) setData(json); })
      .catch(() => { if (!cancelled) setData(null); });
    return () => { cancelled = true; };
  }, []);

  if (data === undefined) {
    return (
      <div className="dashboard-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="page-content">
          <div className="nba-loading">
            <RefreshCw size={18} className="spin-slow" style={{ verticalAlign: -3, marginRight: 8 }} />
            Loading NBA run…
          </div>
        </div>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="dashboard-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="page-content">
          <div className="nba-fetch-error">
            No NBA run found.
            <br />
            Generate one from the engine repo:
            <br />
            <code>python run_nba.py --json</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
      <div className="page-content">
        <div className="nba-meta-strip">
          <span>Engine <strong>{data.meta.engine_version}</strong></span>
          <span>As of <strong>{data.meta.asof}</strong></span>
          <span>Generated <strong>{new Date(data.meta.generated_at).toLocaleString()}</strong></span>
        </div>

        <TabBar current={view} onPick={setView} />

        {view === 'summary' && <RunSummary data={data} onSelectSuggestion={jumpToSuggestion} />}
        {view === 'capacity' && <CapacityView data={data} />}
        {view === 'suggestions' && (
          <SuggestionDetailView data={data} selId={selSuggestionId} onSelect={setSelSuggestionId} />
        )}
        {view === 'hcp' && <HCPLookupView data={data} />}
        {view === 'feedback' && <FeedbackROIView data={data} />}
      </div>
    </div>
  );
}
