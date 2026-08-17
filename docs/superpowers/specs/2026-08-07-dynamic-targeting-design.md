# Dynamic Targeting (Targeting Agent) — Design

## Goal
Add a standalone "Dynamic Targeting" screen to medical-crm, porting the
user-supplied Targeting Agent prototype's scoring engine as-is, restyled
into the existing Improzo theme components.

## Nav
- New `LeftNav.jsx` item: key `targeting`, label "Dynamic Targeting", icon
  `Target` (lucide).
- `AppShell.jsx`: routes `activePage === 'targeting'` to
  `DynamicTargetingPage`.

## Scoring engine (ported verbatim from the prototype)
- Six weighted inputs: Potential 25%, Lifecycle Stage 20%, Recent Interest
  20%, Plan Gap 15%, Momentum 10%, Rep Read 10%.
- `LOY` matrix: S2 Lifecycle Stage scored per objective (Grow / Convert /
  Recover / Maintain), `Insufficient History` is null (fallback, not zero).
- `EV` interest ladder (sample_request, rep_visit, form, conf, cta,
  download, email_click, deep_visit, none, nomatch) decayed with a 45-day
  half-life off the single strongest event in the last 90 days.
- `REP` rep-read ladder, 120-day shelf life then decays toward neutral (50)
  with a 60-day half-life.
- Missing inputs (`null`) are excluded from numerator and denominator both
  — weight redistributes across available inputs rather than scoring zero.
- Band thresholds: avail < 40% → `--`; total ≥80 P1, ≥60 P2, ≥40 P3, else
  P4.
- Suppression gates checked independently of score: `NO_CTAC_FLG === 'Y'`
  (No Contact) and `PDRP_FLG === 'Y'` (PDRP) — HCP is scored but flagged
  and excluded from the rep-facing list philosophy (shown here with a
  visible "suppressed" tag + gate explanation for prototype transparency).
- Same 14 synthetic HCPs and `SRC` source-table/column strings as the
  prototype, so the join spec stays intact for engineering handoff.

## Layout
- Page header: title + subtitle; territory/cycle/refresh meta block,
  right-aligned.
- Controls row: Objective chips (4), Priority Band chips (5, incl. All),
  two toggles (rep note field live / show source table & column).
- Stats row: 5 tiles reusing `.kpi-card` — total scored, P1 count, "hot"
  (interest ≥60) count, partial-data count, suppressed count.
- Two-column body:
  - Left: ranked HCP list — rank, name + specialty, score, band badge,
    suppressed tag when blocked. Click to select.
  - Right: detail panel for the selected HCP — name/specialty/ID/
    attainment, big score + band, suppression gate box if blocked, the
    six-input breakdown table (value read, score, weight, contribution +
    mini bar; source table/column shown under each label when the toggle
    is on; missing inputs shown as a muted row with a "weight
    redistributed" tag), partial-data coverage note when avail < 100%,
    a computed "why this HCP is here" reasoning paragraph + suggested
    action line (same logic branches as the prototype: band-driven
    baseline, interest-freshness addendum, rep-preference overrides,
    plan-already-served override).
- Footer explainer card, adapted from the prototype's "Reading this" note.

## Out of scope
- No backend wiring — same synthetic dataset as the prototype.
- Not merged into the HCP Segmentation & Targeting wizard's stage 10;
  this is a separate, standalone tool.
