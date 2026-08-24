// Adapter: maps real nba_run.json suggestions into the exact shape the UI
// components already consume (same fields the reference-file demo dataset
// used: id/name/spec/org/terr/tier/seg/consent/prefs/state/stateNote/score/
// priority/lastF2F/dna/signals/rec{}/ctx{}/next/ch/th) — so no component
// needed rewriting, only the data layer changed.
//
// Real where derivable, explicitly null/placeholder where not — checked
// field-by-field against izo_binding.py (the engine's own contract layer)
// before writing this. See the comment block at the bottom of
// NBAConsolePage.jsx for the full real-vs-not-yet-bound breakdown.

export const TRIGGER_NAME = {
  T1_NEW_WRITER_DECAY: 'New-writer decay',
  T2_EARLY_DISCONTINUATION: 'Early discontinuation',
  T3_ACCESS_FRICTION: 'Access friction',
  T4_SWITCH_OUT: 'Switch-out accelerating',
  T5_WHITESPACE: 'Whitespace',
  T6_CALL_PLAN_GAP: 'Call-plan gap',
  T7_MKT_GROWTH_NO_SHARE: 'Market growing, brand flat',
  T8_REFRACTORY_OPPORTUNITY: 'Refractory opportunity',
  T9_COMPETITOR_LOE_SHIFT: 'Competitor post-LOE shift',
  T10_MIC_NO_FOLLOWUP: 'Medical inquiry, no follow-up',
};
export function triggerName(code) { return TRIGGER_NAME[code] || code; }

// synth.py names every HCP "Dr. {Letter}. Provider{NNNN}" — a real record,
// but an ugly, obviously-synthetic label. Neither that nor a fabricated
// "Dr. Anjali Mehta" is this person's real name (no HCP in this engine has
// one). This is a cosmetic display alias only, deterministically derived
// from the real CUSTOMER_HCP_ID so the same HCP always gets the same name
// — never a source of new data, and the real ID stays in every payload for
// traceability.
const FIRST_NAMES = ['James', 'Maria', 'Robert', 'Linda', 'Michael', 'Priya', 'David', 'Sarah',
  'Wei', 'Anna', 'Carlos', 'Emily', 'Ahmed', 'Grace', 'Thomas', 'Rachel', 'Kevin', 'Olivia', 'Daniel', 'Sofia'];
const LAST_NAMES = ['Nguyen', 'Patel', 'Kim', 'Johnson', 'Garcia', 'Chen', 'Brown', 'Okafor',
  'Rossi', 'Larsen', 'Ibrahim', 'Fischer', 'Kowalski', 'Suzuki', 'Martin', 'Reyes', 'Hughes', 'Novak', 'Silva', 'Bianchi'];
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}
export function displayName(hcpId) {
  const h = hashCode(String(hcpId || ''));
  return `Dr. ${FIRST_NAMES[h % FIRST_NAMES.length]} ${LAST_NAMES[Math.floor(h / FIRST_NAMES.length) % LAST_NAMES.length]}`;
}

const SEV_CRIT = new Set(['T4_SWITCH_OUT', 'T2_EARLY_DISCONTINUATION', 'T9_COMPETITOR_LOE_SHIFT']);
const SEV_WARN = new Set(['T1_NEW_WRITER_DECAY', 'T3_ACCESS_FRICTION', 'T6_CALL_PLAN_GAP', 'T10_MIC_NO_FOLLOWUP']);
export function severity(code) {
  if (SEV_CRIT.has(code)) return 'crit';
  if (SEV_WARN.has(code)) return 'warn';
  return 'pos';
}

export function safeParse(str, fallback) { try { return JSON.parse(str); } catch { return fallback; } }
export function mlrIsPlaceholder(code) { return /^MLR-PLACEHOLDER-/i.test(String(code || '')); }
export function splitSentences(text) {
  if (!text) return [];
  return text.split(/(?<=[.!?])\s+/).map(t => t.trim()).filter(Boolean);
}

// Same HCP Targeting List.xlsx model used elsewhere — only Potential (25%)
// and Plan owed (15%) are real; everything else is left out of the weighted
// average, never scored as zero.
export function computeTargetingScore(profile) {
  if (!profile) return null;
  let weightAvailable = 0, weightedSum = 0;
  const parts = {};
  const marketDecile = Number(profile.X17W_TOTAL_EPILEPSY_MARKET_TRX_DECILE_CUSTOMER__C);
  const brandDecile = Number(profile.X17W_PRODUCT_NBRX_DECILE_CUSTOMER__C);
  if (!Number.isNaN(marketDecile)) {
    const headroom = !Number.isNaN(brandDecile) && brandDecile >= 8 ? 0.7 : 1.0;
    parts.potential = Math.min(100, Math.round(marketDecile * 10 * headroom));
    weightedSum += parts.potential * 25; weightAvailable += 25;
  }
  const goal = Number(profile.TRIMESTER_CALL_GOAL__C);
  const made = Number(profile.TRIMESTER_CALL_MADE__C);
  if (!Number.isNaN(goal) && goal > 0) {
    const completed = Number.isNaN(made) ? 0 : made;
    parts.planOwed = Math.max(0, Math.round(((goal - completed) / goal) * 100));
    weightedSum += parts.planOwed * 15; weightAvailable += 15;
  }
  if (weightAvailable < 40) return { coverage: weightAvailable, insufficient: true, parts };
  const score = weightedSum / weightAvailable;
  const band = score >= 80 ? 'P1' : score >= 60 ? 'P2' : score >= 40 ? 'P3' : 'P4';
  return { score, band, coverage: weightAvailable, parts };
}

// Real derived "how much evidence backs this" composite, built entirely
// from fields already in the JSON (trigger coverage against config.py's own
// weights, the Beta-Binomial responsiveness posterior, and how many
// triggers corroborate it). Explicitly NOT a model confidence score —
// engine.py/README are deliberate that nothing here is learned. Shown with
// that label attached everywhere it's displayed, never as a bare "%".
export function evidenceStrength(s, weights) {
  if (s.pdrp_restricted) return null;
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
  const allTriggers = (s.all_triggers || '').split('|').filter(Boolean);
  const coverage = Math.round((allTriggers.reduce((sum, t) => sum + (weights[t] || 0), 0) / totalWeight) * 100);
  const responsiveness = Math.min(1.45, Number(s.responsiveness) || 1) / 1.45 * 100;
  const triggerDepth = Math.min(5, Number(s.n_triggers) || 0) / 5 * 100;
  return Math.round(coverage * 0.5 + responsiveness * 0.3 + triggerDepth * 0.2);
}

// Real content-side facts, sourced straight from the suggestion row.
function contentFrom(s) {
  return {
    title: s.message_title,
    mlr: mlrIsPlaceholder(s.mlr_code) ? 'Draft' : 'Approved',
    mlrCode: s.mlr_code,
  };
}

// Maps one suggestion (+ its profile) into the HCPS-shaped object every UI
// component already knows how to render. `weekRank` is this HCP's 1-based
// rank by priority_score within the territory this run — the honest
// substitute for a fabricated clock-time "best time to call": real ranking,
// no invented calendar.
export function hcpFromSuggestion(s, profile, data, weekRank, weekTotal) {
  const weights = data.meta?.config?.trigger_weights || {};
  const contributions = safeParse(s.contributions, {});
  const contribEntries = Object.entries(contributions).filter(([, v]) => v > 0);
  const contribTotal = contribEntries.reduce((sum, [, v]) => sum + v, 0) || 1;
  // k = trigger code (label comes from TRIGGER_NAME[k], same map the old
  // SIGNAL_LABEL lookup used); disp = this trigger's real share of the
  // suggestion's score; w = that same share as a 0-1 fraction, reused for
  // both the card's relative bar width and the drawer's "sums to 100%" math.
  const signals = contribEntries
    .sort((a, b) => b[1] - a[1])
    .map(([code, v]) => ({ k: code, disp: `${Math.round((v / contribTotal) * 100)}%`, sev: severity(code), w: v / contribTotal }));

  const targeting = computeTargetingScore(profile);
  const c = contentFrom(s);

  return {
    id: s.Suggestion_External_ID_vod__c,
    name: displayName(s.CUSTOMER_HCP_ID),
    recordId: s.CUSTOMER_HCP_ID, // real ID — kept for traceability under the cosmetic display name
    spec: s.SPTY_GRP_TXT,
    // Institution: VW_CMMN_CUST_RLTP_DIM is declared in izo_binding.py but
    // has zero columns bound — real view, not wired yet. Sample text, not a
    // fabricated per-HCP name.
    org: 'Institution — pending',
    terr: s.TERRITORY_VOD__C,
    tier: targeting && !targeting.insufficient ? targeting.band : null,
    tierCoverage: targeting ? targeting.coverage : 0,
    tierPotential: targeting && targeting.parts ? (targeting.parts.potential ?? null) : null,
    seg: s.targeting_segment || '—',
    // Consent: confirmed zero consent/opt-in data anywhere in the engine.
    // Deferred to the new table being built — sample value only.
    consent: 'Pending',
    prefs: ['F2F'], // real — the only channel that exists in this engine
    state: triggerName(s.primary_trigger),
    stateNote: s.loyalty_segment || s.attitudinal_segment || '',
    score: s.pdrp_restricted ? null : Math.round(s.priority_score),
    priority: s.Priority_vod__c === 'Urgent_vod' ? 'Urgent' : 'Normal',
    lastF2F: s.never_called ? null : s.days_since_f2f,
    neverCalled: !!s.never_called,
    pdrpRestricted: !!s.pdrp_restricted,
    signals,
    rec: {
      type: 'Action', // this engine never emits an Insight-type suggestion
      action: 'F2F visit',
      objective: s.message_title,
      channel: 'F2F',
      content: c,
      weekRank, weekTotal, // real — replaces fabricated scheduling window
      confidence: evidenceStrength(s, weights), // real composite, see above
      model: data.meta.engine_version, // real — "nba-v1.0.0"
      ruleConfig: data.meta.config, // real — full weights/half-lives/seed
      evaluated: s.n_triggers, // real
      refreshed: data.meta.generated_at, // real
      discuss: splitSentences(s.rep_talking_point), // real (one sentence, not three fabricated bullets)
      labelAnchor: s.label_anchor,
    },
    ctx: {
      // No real call-log narrative or commitment history exists anywhere
      // in the engine (confirmed: no REP_INTERACTION_NOTE table live yet).
      lastCall: null,
      commitment: null,
      note: '', // real — local-only editable, same rule as everywhere else in this app
    },
    next: [], // no real multi-step sequencing in this engine
    ch: null, // no real per-channel affinity — engine is F2F-only
    th: null, // no real content-theme affinity yet (7 groups exist as
    // comments in content_catalog.py, not exported)
  };
}

export function buildHCPS(data, territory) {
  if (!data || !territory) return [];
  const profileById = new Map(data.hcp_profiles.map(p => [p.CUSTOMER_HCP_ID, p]));
  const rows = data.suggestions
    .filter(s => s.TERRITORY_VOD__C === territory && s.primary_trigger !== 'T10_MIC_NO_FOLLOWUP')
    .sort((a, b) => b.priority_score - a.priority_score);
  return rows.map((s, i) => hcpFromSuggestion(s, profileById.get(s.CUSTOMER_HCP_ID), data, i + 1, rows.length));
}
