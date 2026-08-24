import React, { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle, MessageSquare, Check, X, RefreshCw, Sparkles } from 'lucide-react';

// Plain-language bucket instead of a raw decile number — "scoring" a rep
// can actually use without needing to know what a decile is.
function potentialLabel(decile) {
  if (decile === null || decile === undefined) return null;
  const d = Number(decile);
  if (Number.isNaN(d)) return null;
  if (d >= 8) return 'High';
  if (d >= 4) return 'Medium';
  return 'Low';
}

// Not Rx-derived — safe to show even for a PDRP-restricted HCP, unlike the
// decile-based potential bucket above.
function isFlag(v) {
  const s = String(v ?? '').trim().toUpperCase();
  return s === 'Y' || s === 'TRUE' || v === true;
}

// HCP Targeting List.xlsx: 5 weighted inputs -> one score, one P1-P4 band
// (Potential 25%, Momentum 30%, Recent interest 20%, Plan owed 15%, Rep
// read 10%). Only Potential and Plan owed are backed by real data anywhere
// in this engine's output — Momentum needs a lifecycle-stage field, Recent
// interest needs website/conference engagement data, Rep read needs
// AI-classified interaction notes, and none of those sources exist here.
// Per the spec's own rule a missing input is left out of the weighted
// average, never scored as zero, and Coverage (%) tracks how much of the
// model actually ran for a given HCP — so this stays a real 40%-of-model
// score, never a fabricated full one. The spec's own floor is 40% available
// weight to publish a score at all; below that, no band.
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
  const parts = {};

  // T1 Potential: M1 (category/market decile) x 10, headroom-adjusted by M2
  // (current brand decile) — M2 >= 8 means most of the headroom is already
  // taken, so it's discounted to x0.7 rather than x1.0.
  const marketDecile = Number(profile.X17W_TOTAL_EPILEPSY_MARKET_TRX_DECILE_CUSTOMER__C);
  const brandDecile = Number(profile.X17W_PRODUCT_NBRX_DECILE_CUSTOMER__C);
  if (!Number.isNaN(marketDecile)) {
    const headroom = !Number.isNaN(brandDecile) && brandDecile >= 8 ? 0.7 : 1.0;
    parts.potential = Math.min(100, Math.round(marketDecile * 10 * headroom));
    weightedSum += parts.potential * TARGETING_WEIGHTS.potential;
    weightAvailable += TARGETING_WEIGHTS.potential;
  }

  // T4 Plan owed: (planned - completed) / planned x 100, floored at zero.
  const goal = Number(profile.TRIMESTER_CALL_GOAL__C);
  const made = Number(profile.TRIMESTER_CALL_MADE__C);
  if (!Number.isNaN(goal) && goal > 0) {
    const completed = Number.isNaN(made) ? 0 : made;
    parts.planOwed = Math.max(0, Math.round(((goal - completed) / goal) * 100));
    weightedSum += parts.planOwed * TARGETING_WEIGHTS.planOwed;
    weightAvailable += TARGETING_WEIGHTS.planOwed;
  }

  if (weightAvailable < TARGETING_MIN_COVERAGE) {
    return { coverage: weightAvailable, insufficient: true };
  }

  const score = weightedSum / weightAvailable;
  return { score, band: targetingBand(score), coverage: weightAvailable, parts };
}

function TargetingBarRow({ label, weightPct, value }) {
  return (
    <div className="rq-targeting-bar-row">
      <div className="rq-targeting-bar-labels">
        <span>{label} <span className="rq-targeting-bar-weight">({weightPct}%)</span></span>
        <span className="rq-targeting-bar-value">{value}</span>
      </div>
      <div className="rq-targeting-bar-track">
        <div className="rq-targeting-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

// T9: name the largest contributing input and the limiting one.
function targetingReason(parts) {
  if (parts.potential !== undefined && parts.planOwed !== undefined) {
    return parts.potential >= parts.planOwed
      ? 'Category opportunity is the main driver here; call plan is closer to on track.'
      : 'An open call-plan gap is the main driver here; category opportunity is more limited.';
  }
  if (parts.potential !== undefined) return 'Based on category opportunity only — plan data unavailable for this HCP.';
  return 'Based on the call-plan gap only — opportunity data unavailable for this HCP.';
}

// Same six reason codes as the brief's SuggestionFeedback.reason_code model
// (NotRelevant / AlreadyDone / BadTiming / WrongChannel / HCPNotReachable /
// Other), in plain language. Required on every dismiss — the brief calls
// this "non-negotiable... the highest-value training signal the system
// gets" — even though this prototype only holds it in local state.
const DISMISS_REASONS = ['Not relevant', 'Already done', 'Bad timing', 'Wrong channel', 'HCP not reachable', 'Other'];

// How many of a territory's ~19-25 pending suggestions render open by
// default. Checked against real run data before picking this number —
// every Urgent_vod suggestion is, by construction, in the top 10% by
// priority_score (config.py's urgent_priority_percentile), so a top-N slice
// always surfaces every urgent one first with no special-casing needed.
const PRIORITY_QUEUE_SIZE = 8;

// ── Rep-facing view: "who do I see this week, and why" ─────────────────────
// One rep = one territory (confirmed), so there's no multi-territory rep
// concept to model. There's no real login in this prototype, so a territory
// picker stands in for "who's logged in" — same trick real sandbox/demo
// environments use before SSO is wired up.
//
// Deliberately shows less than the NBA Engine HQ tab, not a trimmed copy of
// it: no priority_score number, no trigger coverage %, no peer cohort, no
// MLR/Content ID footer, no source columns. A rep deciding who to see this
// week doesn't need any of that — they need who, why, and what to say.
//
// The "Targeting" P1-P4 badge below is a different, separate scoring model
// (HCP Targeting List.xlsx), not the engine's own priority_score — the two
// are not meant to agree or be compared, they answer different questions
// ("is this HCP worth targeting this cycle" vs. "why fire a suggestion
// today"). See computeTargetingScore() above for what's real vs. left out.
// trigger_headline and rep_talking_point are both already safe to show a
// PDRP-restricted HCP (see engine.py: trigger_headline is computed from
// visible_triggers() same as Reason_vod__c; rep_talking_point is
// manufacturer-owned message content, never Rx-derived) — nothing further
// needs redacting here.
//
// Mark Called / Dismiss are LOCAL STATE ONLY. They do not persist past a
// page reload and do not write anywhere. Veeva CRM owns the real
// accept/dismiss loop (Suggestion_Feedback_vod) — this is a preview of the
// UX, not a second copy of the feedback pipeline.

function StatusBadge({ status, reason }) {
  if (status === 'called') return <span className="rq-status-badge rq-status-called"><Check size={11} /> Called</span>;
  if (status === 'dismissed') {
    return (
      <span className="rq-status-badge rq-status-dismissed">
        <X size={11} /> Dismissed{reason ? ` · ${reason}` : ''}
      </span>
    );
  }
  return null;
}

function QueueCard({ s, profile, status, reason, expanded, onToggle, onMark }) {
  const [reasonOpen, setReasonOpen] = useState(false);
  const isUrgent = s.Priority_vod__c === 'Urgent_vod';
  const isHandled = status === 'called' || status === 'dismissed';
  const potential = potentialLabel(profile?.X17W_PRODUCT_NBRX_DECILE_CUSTOMER__C);
  const lastVisit = s.never_called ? 'Never' : `${s.days_since_f2f}d ago`;
  const targeting = useMemo(() => computeTargetingScore(profile), [profile]);

  function handleDismissClick() {
    if (status === 'dismissed') { onMark(null); return; } // undo needs no reason
    setReasonOpen(true);
  }
  function pickReason(r) {
    onMark('dismissed', r);
    setReasonOpen(false);
  }

  return (
    <div className={`rq-card${isHandled ? ' rq-card-handled' : ''}`}>
      {/* Action leads, HCP is secondary context — the reason this exists is
          what to do, not who it's about (matches Veeva's own suggestion row
          anatomy: bolded action title first, account name underneath). */}
      <div className="rq-card-row" onClick={onToggle}>
        <div className="rq-card-main">
          <div className="rq-card-action">
            {s.message_title}
            <span className={`rq-priority-badge${isUrgent ? ' rq-priority-high' : ''}`}>
              {isUrgent ? 'High priority' : 'Standard'}
            </span>
            {targeting && !targeting.insufficient && (
              <span className={`rq-targeting-badge rq-targeting-${targeting.band.toLowerCase()}`}>
                Targeting {targeting.band}
              </span>
            )}
            <StatusBadge status={status} reason={reason} />
          </div>
          <div className="rq-card-sub">
            {s.HCP_NM}
            {s.pdrp_restricted && <span className="nba-badge-pdrp">PDRP</span>}
            {profile && isFlag(profile.EPILEPTOLOGIST_FLG) && <span className="rq-badge-specialist">Epileptologist</span>}
            {' · '}{s.SPTY_GRP_TXT}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
      </div>

      {expanded && (
        <div className="rq-card-detail">
          {/* The clear "what to do" anchor — biggest, first thing in the open card */}
          <div className="rq-action-banner">
            <div className="rq-action-banner-icon"><Sparkles size={16} /></div>
            <div>
              <div className="rq-action-banner-label">Recommended action</div>
              <div className="rq-action-banner-title">{s.message_title}</div>
            </div>
          </div>

          {/* Everything about this HCP, in one glance, in plain language */}
          <div className="rq-attr-row">
            {potential && <span className="rq-attr-pill">Prescribing potential <strong>{potential}</strong></span>}
            {s.targeting_segment && <span className="rq-attr-pill">Segment <strong>{s.targeting_segment}</strong></span>}
            {s.loyalty_segment && <span className="rq-attr-pill">Relationship <strong>{s.loyalty_segment}</strong></span>}
            {s.attitudinal_segment && <span className="rq-attr-pill">Engagement style <strong>{s.attitudinal_segment}</strong></span>}
            <span className="rq-attr-pill">Last visit <strong>{lastVisit}</strong></span>
          </div>

          {targeting && (
            <div className="rq-targeting-box">
              <div className="rq-targeting-box-label">
                Targeting priority
                <span className="nba-draft-badge">{targeting.coverage}% of model</span>
              </div>
              {targeting.insufficient ? (
                <p>Not enough data to score this HCP — only {targeting.coverage}% of the targeting model's inputs are available.</p>
              ) : (
                <>
                  <div className="rq-targeting-score-row">
                    <span className={`rq-targeting-band rq-targeting-${targeting.band.toLowerCase()}`}>{targeting.band}</span>
                    <span className="rq-targeting-score-num">{targeting.score.toFixed(0)}/100</span>
                  </div>
                  {targeting.parts.potential !== undefined && (
                    <TargetingBarRow label="Potential" weightPct={TARGETING_WEIGHTS.potential} value={targeting.parts.potential} />
                  )}
                  {targeting.parts.planOwed !== undefined && (
                    <TargetingBarRow label="Plan owed" weightPct={TARGETING_WEIGHTS.planOwed} value={targeting.parts.planOwed} />
                  )}
                  <p>{targetingReason(targeting.parts)}</p>
                </>
              )}
            </div>
          )}

          <div className="rq-callprep-grid">
            <div className="rq-callprep-box rq-callprep-why">
              <div className="rq-callprep-box-label"><AlertTriangle size={14} /> Why this visit, now</div>
              <p>{s.trigger_headline}</p>
            </div>
            <div className="rq-callprep-box rq-callprep-play">
              <div className="rq-callprep-box-label"><MessageSquare size={14} /> What to say</div>
              <p>{s.rep_talking_point}</p>
            </div>
          </div>
          {s.label_anchor && (
            <div className="nba-callprep-ref">
              If asked about dosing or safety, reference: <strong>{s.label_anchor}</strong>
            </div>
          )}

          <div className="rq-actions">
            <button
              className={`rq-action-btn rq-action-call${status === 'called' ? ' on' : ''}`}
              onClick={() => onMark(status === 'called' ? null : 'called')}
            >
              <Check size={14} /> Mark called
            </button>
            <button
              className={`rq-action-btn rq-action-dismiss${status === 'dismissed' ? ' on' : ''}`}
              onClick={handleDismissClick}
            >
              <X size={14} /> Dismiss
            </button>
            <span className="rq-actions-note">Not saved — this session only, Veeva owns the real record</span>
          </div>

          {reasonOpen && (
            <div className="rq-dismiss-reasons">
              <span className="rq-dismiss-reasons-label">Why dismiss this?</span>
              <div className="rq-reason-chips">
                {DISMISS_REASONS.map(r => (
                  <button key={r} className="rq-reason-chip" onClick={() => pickReason(r)}>{r}</button>
                ))}
              </div>
              <button className="rq-reason-cancel" onClick={() => setReasonOpen(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RepCallQueuePage() {
  const [data, setData] = useState(undefined);
  const [territoryOverride, setTerritoryOverride] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [statusById, setStatusById] = useState({});
  const [reasonById, setReasonById] = useState({});
  const [showAllPending, setShowAllPending] = useState(false);
  const [showHandled, setShowHandled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/nba_run.json')
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(json => { if (!cancelled) setData(json); })
      .catch(() => { if (!cancelled) setData(null); });
    return () => { cancelled = true; };
  }, []);

  const territories = useMemo(
    () => (data ? Array.from(new Set(data.suggestions.map(s => s.TERRITORY_VOD__C))).sort() : []),
    [data]
  );

  // Derived, not state: defaults to the first territory once data loads,
  // without a setState-in-effect round trip. An explicit pick overrides it.
  const territory = territoryOverride || territories[0] || null;

  const queue = useMemo(() => {
    if (!data || !territory) return [];
    return data.suggestions
      .filter(s => s.TERRITORY_VOD__C === territory)
      // T10 fires off Medical Affairs' own MIC inquiry data (see
      // triggers.py) — following up on a raised medical question is Medical
      // Affairs/MSL territory end-to-end, not a commercial rep's call queue,
      // however carefully the talking point is worded not to answer it.
      // Stays fully visible in the NBA Engine (ops/audit) view.
      .filter(s => s.primary_trigger !== 'T10_MIC_NO_FOLLOWUP')
      .sort((a, b) => b.priority_score - a.priority_score);
  }, [data, territory]);

  // Brand decile (for the "Prescribing potential" bucket) isn't on the
  // suggestion row — only hcp_profiles carries it.
  const profileById = useMemo(() => {
    const m = new Map();
    if (data) data.hcp_profiles.forEach(p => m.set(p.CUSTOMER_HCP_ID, p));
    return m;
  }, [data]);

  const pending = queue.filter(s => !statusById[s.Suggestion_External_ID_vod__c]);
  const handled = queue.filter(s => statusById[s.Suggestion_External_ID_vod__c]);
  const urgentPending = pending.filter(s => s.Priority_vod__c === 'Urgent_vod').length;

  // pending is already sorted by priority_score desc (inherited from
  // `queue`), so a slice is a true top-N, not an arbitrary cut — and every
  // Urgent_vod row is in the top decile by score, so it never ends up
  // hidden behind "show more".
  const priorityQueue = pending.slice(0, PRIORITY_QUEUE_SIZE);
  const morePending = pending.slice(PRIORITY_QUEUE_SIZE);

  function mark(id, status, reason) {
    setStatusById(prev => {
      const next = { ...prev };
      if (status === null) delete next[id];
      else next[id] = status;
      return next;
    });
    setReasonById(prev => {
      const next = { ...prev };
      if (status === 'dismissed' && reason) next[id] = reason;
      else delete next[id];
      return next;
    });
  }

  if (data === undefined) {
    return (
      <div className="dashboard-content-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        <div className="page-content">
          <div className="nba-loading">
            <RefreshCw size={18} className="spin-slow" style={{ verticalAlign: -3, marginRight: 8 }} />
            Loading your queue…
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
        <div className="rq-you-are">
          <span>You're viewing as the rep for</span>
          <select
            className="filter-select"
            value={territory || ''}
            onChange={e => {
              setTerritoryOverride(e.target.value);
              setExpandedId(null);
              setShowAllPending(false);
              setShowHandled(false);
            }}
          >
            {territories.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="nba-trigger-code">no real login in this prototype — pick any territory</span>
        </div>

        <Insight territory={territory} n={pending.length} urgent={urgentPending} />

        {pending.length === 0 && handled.length === 0 ? (
          <div className="empty-state">No suggestions for your territory this cycle. Check back next week.</div>
        ) : (
          <>
            {priorityQueue.map(s => (
              <QueueCard
                key={s.Suggestion_External_ID_vod__c}
                s={s}
                profile={profileById.get(s.CUSTOMER_HCP_ID)}
                status={statusById[s.Suggestion_External_ID_vod__c]}
                reason={reasonById[s.Suggestion_External_ID_vod__c]}
                expanded={expandedId === s.Suggestion_External_ID_vod__c}
                onToggle={() => setExpandedId(id => (id === s.Suggestion_External_ID_vod__c ? null : s.Suggestion_External_ID_vod__c))}
                onMark={(status, reason) => mark(s.Suggestion_External_ID_vod__c, status, reason)}
              />
            ))}

            {morePending.length > 0 && (
              <button className="rq-showmore-btn" onClick={() => setShowAllPending(v => !v)}>
                {showAllPending ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {showAllPending ? 'Hide lower-priority suggestions' : `Show ${morePending.length} more, lower priority`}
              </button>
            )}
            {showAllPending && morePending.map(s => (
              <QueueCard
                key={s.Suggestion_External_ID_vod__c}
                s={s}
                profile={profileById.get(s.CUSTOMER_HCP_ID)}
                status={statusById[s.Suggestion_External_ID_vod__c]}
                reason={reasonById[s.Suggestion_External_ID_vod__c]}
                expanded={expandedId === s.Suggestion_External_ID_vod__c}
                onToggle={() => setExpandedId(id => (id === s.Suggestion_External_ID_vod__c ? null : s.Suggestion_External_ID_vod__c))}
                onMark={(status, reason) => mark(s.Suggestion_External_ID_vod__c, status, reason)}
              />
            ))}

            {handled.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <button className="rq-handled-toggle" onClick={() => setShowHandled(v => !v)}>
                  {handled.length} handled this session
                  {showHandled ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>
                {showHandled && handled.map(s => (
                  <QueueCard
                    key={s.Suggestion_External_ID_vod__c}
                    s={s}
                    profile={profileById.get(s.CUSTOMER_HCP_ID)}
                    status={statusById[s.Suggestion_External_ID_vod__c]}
                    reason={reasonById[s.Suggestion_External_ID_vod__c]}
                    expanded={expandedId === s.Suggestion_External_ID_vod__c}
                    onToggle={() => setExpandedId(id => (id === s.Suggestion_External_ID_vod__c ? null : s.Suggestion_External_ID_vod__c))}
                    onMark={(status, reason) => mark(s.Suggestion_External_ID_vod__c, status, reason)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Insight({ territory, n, urgent }) {
  return (
    <div className="nba-insight">
      {n === 0
        ? `Nothing left to see in ${territory} this cycle.`
        : (
          <>
            <strong>{n}</strong> HCP{n === 1 ? '' : 's'} to see in <strong>{territory}</strong> this cycle
            {urgent > 0 && <> — <strong>{urgent}</strong> urgent</>}. Tap a card for why and what to say.
          </>
        )}
    </div>
  );
}
