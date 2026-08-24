import React, { useState, useEffect } from 'react';
import { ArrowLeft, X, Handshake, Mail, Phone, Video, FileText, Lightbulb, MapPin } from 'lucide-react';
import './NBAConsolePage.css';
import { CONTENT, SIGNAL_LABEL, HCPS, DISMISS_REASONS, CHANNEL_NAMES, THEME_NAMES } from './nbaConsoleDemoData';

// ── NBA Console ──────────────────────────────────────────────────────────
// Uses the "Rep Decision Console" reference file's own 12-HCP demo dataset
// (nbaConsoleDemoData.js) — a deliberate, final decision after comparing
// against the real-data version: consent, channel/theme affinity, and
// multi-step sequencing have zero backing in nba_v1_izo's actual output
// (confirmed against izo_binding.py), and rather than ship a visibly
// thinner tool, this prototype is a visual reference, not a data-accurate
// one. See NBAEnginePage-era work in git history for the real-data-only
// alternative if that's ever wanted again.
//
// Nested inside Improzo's own shell — Improzo's left rail supplies the
// Command Center / HCPs switch and its own header supplies the page title,
// so this component only ever renders content (styled with Improzo's own
// palette/typography below), never its own rail, topbar, or theme toggle.

const DIGITAL = { Email: 1, Virtual: 1 };
function byId(id) { return HCPS.find(h => h.id === id) || null; }
function channelAllowed(h, ch) {
  if (ch === '—') return true;
  if (h.consent === 'Denied' && DIGITAL[ch]) return false;
  if (h.consent === 'Unknown' && ch === 'Email') return false;
  return h.prefs.indexOf(ch) !== -1 || ch === 'F2F';
}
// Gating stays live (consent still determines what's actionable) — only the
// visible "Consent: Granted/Denied/Unknown" field is gone, so the reason
// text here is deliberately generic rather than naming consent explicitly.
function blockReason(h, ch) {
  if (h.consent === 'Denied' && DIGITAL[ch]) return 'This channel is not currently available for this HCP';
  if (h.consent === 'Unknown' && ch === 'Email') return 'This channel is not currently available for this HCP';
  if (h.prefs.indexOf(ch) === -1) return 'Not a stated channel preference';
  return '';
}
function consentBlocked(h, ch) {
  if (h.consent === 'Denied' && DIGITAL[ch]) return 'Not currently available';
  if (h.consent === 'Unknown' && ch === 'Email') return 'Not currently available';
  return '';
}
function sev(h) {
  if (h.rec.type === 'Insight') return 'pos';
  if (h.priority === 'Urgent') return 'crit';
  return h.score >= 60 ? 'warn' : '';
}
function band(v) { return v >= 75 ? 'High' : v >= 50 ? 'Medium' : 'Low'; }
function tier(v) { return v >= 75 ? 'hi' : v >= 50 ? 'mid' : 'lo'; }

// ── small chips ──────────────────────────────────────────────────────────
function PriorityChip({ h }) {
  if (h.rec.type === 'Insight') return <span className="ndc-chip acc">Insight</span>;
  return h.priority === 'Urgent' ? <span className="ndc-chip crit">Urgent</span> : <span className="ndc-chip neu">Normal</span>;
}

// ── signal bars (card + hero — width relative to the largest signal) ─────
function SignalRows({ h }) {
  const max = h.signals.reduce((a, s) => Math.max(a, s.w), 0) || 1;
  return (
    <div className="ndc-sigs">
      {h.signals.map(s => (
        <div key={s.k} className={`ndc-sig ${s.sev}`}>
          <span className="n">{SIGNAL_LABEL[s.k]}</span>
          <span className="bar"><i style={{ width: `${Math.round((s.w / max) * 100)}%` }} /></span>
          <span className="v">{s.disp}</span>
        </div>
      ))}
    </div>
  );
}

function ContentFact({ h }) {
  const c = h.rec.content ? CONTENT[h.rec.content] : null;
  if (!c) return <div className="ndc-fact"><span className="ndc-lbl">Content</span><div className="t">None required</div></div>;
  const ok = c.mlr === 'Approved';
  return (
    <div className="ndc-fact">
      <span className="ndc-lbl">Content</span>
      <div className="t">{c.title}<small>{ok ? 'MLR approved' : `⚠ ${c.mlr} — cannot be used`}</small></div>
    </div>
  );
}

// ── dismiss reason menu ──────────────────────────────────────────────────
function DismissMenu({ onPick }) {
  return (
    <div className="ndc-menu">
      <div className="mh">Why not?</div>
      {DISMISS_REASONS.map(r => (
        <button key={r} onClick={() => onPick(r)}>{r}</button>
      ))}
    </div>
  );
}

// ── NBA card (hero on Command Center) ────────────────────────────────────
function NbaCard({ h, status, onAccept, onDismiss, onUndo, onOpenDetail, onWhy, onBrief, onAck, menuOpen, setMenuOpen }) {
  const isInsight = h.rec.type === 'Insight';
  const allowed = channelAllowed(h, h.rec.channel);
  const cls = `ndc-nba sev-${sev(h)}${status ? ' done' : ''}`;

  const head = (
    <div className="ndc-nba-hd">
      <div className="who">
        <button className="ndc-nba-name ndc-link" onClick={() => onOpenDetail(h.id)}>{h.name}</button>
        <div className="ndc-nba-meta">{h.spec} · {h.org} · {h.terr} · Tier {h.tier}</div>
        <div className="ndc-nba-state">{h.state} — {h.stateNote}</div>
        {!isInsight && <div className="ndc-nba-verb">→ {h.rec.action}</div>}
      </div>
      <div className="ndc-nba-tags">
        <span className="ndc-nba-score"><span className="ndc-num">{h.score}</span><span className="lbl">Score</span></span>
        <PriorityChip h={h} />
      </div>
    </div>
  );

  if (isInsight) {
    return (
      <div className={cls}>
        {head}
        <div className="ndc-nba-body">
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>{h.rec.insight}</p>
          <div className="ndc-acts">
            <button className="ndc-btn sm" onClick={() => onWhy(h.id)}>Why this?</button>
            <span className="sp" />
            <button className="ndc-btn sm" onClick={() => onAck(h.id)}>Acknowledge</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cls}>
      {head}
      <div className="ndc-nba-body">
        <div>
          <span className="ndc-lbl" style={{ display: 'block', marginBottom: 7 }}>Why now</span>
          <SignalRows h={h} />
        </div>
        <div className="ndc-facts">
          <div className="ndc-fact"><span className="ndc-lbl">Objective</span><div className="t">{h.rec.objective}</div></div>
          <ContentFact h={h} />
          <div className="ndc-fact"><span className="ndc-lbl">Best time</span><div className="t">{h.rec.window}<small>{h.rec.channel}</small></div></div>
        </div>
        {status ? (
          <div className="ndc-acts">
            <span className={`ndc-chip ${status.v === 'accepted' ? 'pos' : 'neu'}`}>
              {status.v === 'accepted' ? 'Accepted — added to your plan' : `Dismissed — ${status.reason}`}
            </span>
            <span className="sp" />
            <button className="ndc-btn sm" onClick={() => onUndo(h.id)}>Undo</button>
          </div>
        ) : (
          <>
            <div className="ndc-acts">
              <button className="ndc-btn pri" disabled={!allowed} onClick={() => onAccept(h.id)}>Accept</button>
              <button className="ndc-btn sm" onClick={() => onBrief(h.id)}>Pre-call brief</button>
              <button className="ndc-btn sm" onClick={() => onWhy(h.id)}>Why this?</button>
              <span className="sp" />
              <div className="ndc-menu-wrap">
                <button className="ndc-btn sm" onClick={() => setMenuOpen(v => (v === h.id ? null : h.id))}>Not relevant ▾</button>
                {menuOpen === h.id && <DismissMenu onPick={r => { onDismiss(h.id, r); setMenuOpen(null); }} />}
              </div>
            </div>
            {!allowed && (
              <p className="ndc-note" style={{ margin: 0, color: 'var(--crit)' }}>
                ⚠ {blockReason(h, h.rec.channel)}. The engine must re-route this to an allowed channel before it can be actioned.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function QueueRow({ h, i, status, selected, onOpen }) {
  return (
    <button className={`ndc-qrow sev-${sev(h)}${status ? ' done' : ''}`} style={selected ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent-soft)' } : undefined} onClick={onOpen} data-i={i}>
      <span style={{ minWidth: 0 }}>
        <span className="qn">{h.name}</span>
        <span className="qm">{h.rec.type === 'Insight' ? 'Insight — no action' : `${h.rec.action} · ${h.rec.objective}`}</span>
      </span>
      <span className="ndc-nba-tags"><PriorityChip h={h} /></span>
      <span className="qw"><span className="qv ndc-num">{h.score}</span><span className="qm">{h.state}</span></span>
    </button>
  );
}

// ── Command Center ──────────────────────────────────────────────────────
const DAY_RE = /Mon|Tue|Wed|Thu|Fri|Sat|Sun|This week/;

function CommandCenter({ open, status, sel, mark, undo, onOpenDetail, onWhy, onBrief, onAck, onGoAll, menuOpen, setMenuOpen }) {
  const hero = open[0] || null;
  const rest = open.slice(1, 6);
  const due = open.filter(h => h.rec.type !== 'Insight' && DAY_RE.test(h.rec.window)).length;
  const newSignals = HCPS.filter(h => h.rec.refreshed.indexOf('Today') === 0 && h.priority === 'Urgent').length;
  const overdue = HCPS.filter(h => h.lastF2F > 45).length;
  const accepted = Object.values(status).filter(v => v.v === 'accepted').length;
  const dismissed = Object.values(status).filter(v => v.v === 'dismissed').length;

  return (
    <>
      <div className="ndc-kpis">
        <div className="ndc-kpi"><span className="ndc-lbl">Today</span><span className="v ndc-num">{open.length}</span><span className="s">Priority HCPs</span></div>
        <div className="ndc-kpi"><span className="ndc-lbl">Actions</span><span className="v ndc-num">{due}</span><span className="s">Due this week</span></div>
        <div className="ndc-kpi"><span className="ndc-lbl">New signals</span><span className="v ndc-num">{newSignals}</span><span className="s">Since yesterday</span></div>
        <div className="ndc-kpi ndc-kpi-lg"><span className="ndc-lbl">Overdue</span><span className="v ndc-num">{overdue}</span><span className="s">No F2F in 45+ days</span></div>
      </div>

      <div className="ndc-grid2">
        <div>
          <div className="ndc-card-hd" style={{ border: 'none', padding: '0 0 10px' }}>
            <h2>Top opportunity</h2>
            <div className="ndc-r"><span className="ndc-note">Ranked by opportunity × urgency</span></div>
          </div>
          {hero
            ? <NbaCard h={hero} status={status[hero.id]} onAccept={id => mark(id, 'accepted')} onDismiss={(id, r) => mark(id, 'dismissed', r)} onUndo={undo} onOpenDetail={onOpenDetail} onWhy={onWhy} onBrief={onBrief} onAck={onAck} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            : <div className="ndc-card"><div className="ndc-empty">Queue cleared. Every recommendation has been actioned or dismissed.</div></div>}
        </div>

        <div>
          <div className="ndc-card">
            <div className="ndc-card-hd">
              <h2>Next in queue</h2>
              <div className="ndc-r"><span className="ndc-note"><span className="ndc-kbd">↑</span> <span className="ndc-kbd">↓</span> move · <span className="ndc-kbd">↵</span> open · <span className="ndc-kbd">D</span> dismiss</span></div>
            </div>
            <div style={{ padding: 12, display: 'grid', gap: 8 }}>
              {rest.length === 0
                ? <div className="ndc-empty">Nothing else waiting.</div>
                : rest.map((h, i) => (
                  <QueueRow key={h.id} h={h} i={i + 1} status={status[h.id]} selected={sel === i + 1} onOpen={() => onOpenDetail(h.id)} />
                ))}
              <button className="ndc-link" style={{ textAlign: 'left', padding: '4px 4px 0' }} onClick={onGoAll}>
                See all {HCPS.length} recommendations →
              </button>
            </div>
          </div>

          <div className="ndc-card" style={{ marginTop: 14 }}>
            <div className="ndc-card-hd"><h2>Learning loop</h2></div>
            <div className="ndc-loop">
              <div className="it"><b className="ndc-num">{accepted}</b><span className="s ndc-note">Accepted</span></div>
              <div className="it"><b className="ndc-num">{dismissed}</b><span className="s ndc-note">Dismissed</span></div>
              <div className="it"><b className="ndc-num">{accepted}</b><span className="s ndc-note">Activities attributed</span></div>
            </div>
            <p className="ndc-note" style={{ padding: '0 16px 15px', margin: 0 }}>
              Every accept stamps <code>source_recommendation_id</code> onto the activity it creates, and every dismissal
              writes a reason. Without both, the model cannot learn and the engine cannot be credited.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ── All Recommendations ─────────────────────────────────────────────────
function AllRecommendations({ status, onOpen }) {
  const [filters, setFilters] = useState({ priority: 'All', channel: 'All', trigger: 'All' });
  const [sortKey, setSortKey] = useState('score');

  const triggers = Array.from(new Set(HCPS.map(h => h.signals[0].k)));

  let rows = HCPS.filter(h => {
    if (filters.priority !== 'All' && h.priority !== filters.priority) return false;
    if (filters.channel !== 'All' && h.rec.channel !== filters.channel) return false;
    if (filters.trigger !== 'All' && h.signals[0].k !== filters.trigger) return false;
    return true;
  });
  rows = [...rows].sort((a, b) => {
    if (sortKey === 'urgency') return b.lastF2F - a.lastF2F;
    if (sortKey === 'opportunity') return b.dna['Commercial opportunity'] - a.dna['Commercial opportunity'];
    return b.score - a.score;
  });

  return (
    <>
      <div className="ndc-filters">
        <span className="ndc-sel">Priority
          <select value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}>
            <option>All</option><option>Urgent</option><option>Normal</option>
          </select>
        </span>
        <span className="ndc-sel">Channel
          <select value={filters.channel} onChange={e => setFilters(f => ({ ...f, channel: e.target.value }))}>
            {['All', 'F2F', 'Email', 'Phone', 'Virtual', '—'].map(c => <option key={c}>{c}</option>)}
          </select>
        </span>
        <span className="ndc-sel">Top trigger
          <select value={filters.trigger} onChange={e => setFilters(f => ({ ...f, trigger: e.target.value }))}>
            <option value="All">All</option>
            {triggers.map(t => <option key={t} value={t}>{SIGNAL_LABEL[t]}</option>)}
          </select>
        </span>
        <span className="ndc-sel">Sort by
          <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
            <option value="score">Score</option><option value="urgency">Urgency</option><option value="opportunity">Opportunity</option>
          </select>
        </span>
        <span className="ndc-note" style={{ marginLeft: 'auto' }}>{rows.length} of {HCPS.length}</span>
      </div>

      <div className="ndc-tbl-wrap">
        <table className="ndc-tbl">
          <thead>
            <tr><th>HCP</th><th>Why now</th><th>Recommendation</th><th>Channel</th><th>Priority</th><th style={{ textAlign: 'right' }}>Score</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows.map(h => {
              const st = status[h.id];
              const s0 = h.signals[0];
              const blocked = !channelAllowed(h, h.rec.channel);
              return (
                <tr key={h.id} onClick={() => onOpen(h.id)}>
                  <td><span className={`ndc-srail ${sev(h)}`} /><b>{h.name}</b><div className="why">{h.spec} · {h.terr}</div></td>
                  <td className="why">{SIGNAL_LABEL[s0.k]} {s0.disp}</td>
                  <td>{h.rec.type === 'Insight' ? <span className="why">Insight — no action</span> : h.rec.action}</td>
                  <td>{h.rec.channel}{blocked && <span className="ndc-chip crit" style={{ marginLeft: 4 }}>blocked</span>}</td>
                  <td><PriorityChip h={h} /></td>
                  <td className="ndc-num" style={{ textAlign: 'right', fontWeight: 600 }}>{h.score}</td>
                  <td>{st ? <span className={`ndc-chip ${st.v === 'accepted' ? 'pos' : 'neu'}`}>{st.v}</span> : <span className="why">Open</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="ndc-note" style={{ marginTop: 12 }}>Sorting by distance or today's route is deliberately absent — geo-routing is a separate product.</p>
    </>
  );
}

// ── HCPs reference table ────────────────────────────────────────────────
function HCPsTable({ onOpen }) {
  return (
    <div className="ndc-tbl-wrap">
      <table className="ndc-tbl">
        <thead><tr><th>HCP</th><th>Organisation</th><th>Territory</th><th>Segment</th><th>State</th><th style={{ textAlign: 'right' }}>Last F2F</th></tr></thead>
        <tbody>
          {HCPS.map(h => (
            <tr key={h.id} onClick={() => onOpen(h.id)}>
              <td><b>{h.name}</b><div className="why">{h.spec}</div></td>
              <td>{h.org}</td><td>{h.terr}</td><td>{h.seg}</td><td>{h.state}</td>
              <td className="ndc-num" style={{ textAlign: 'right', color: h.lastF2F > 45 ? 'var(--crit)' : undefined, fontWeight: h.lastF2F > 45 ? 600 : 400 }}>{h.lastF2F}d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── HCP snapshot: channel affinity + content-theme affinity ─────────────
function ChannelChart({ h }) {
  // auto-flag the standout channel the same way ThemeChart already does via
  // its sort — a reader shouldn't have to scan five bars to find the max.
  const maxV = Math.max(...CHANNEL_NAMES.map((n, i) => (consentBlocked(h, n) ? -1 : h.ch[i])));
  return (
    <div className="ndc-chart">
      <h3>Channel affinity</h3>
      <span className="cap">How this HCP has responded, by channel, 0–100. A blocked channel isn't currently available for this HCP — not a reflection of affinity.</span>
      <div className="ndc-vbars">
        {CHANNEL_NAMES.map((n, i) => {
          const v = h.ch[i]; const blocked = consentBlocked(h, n);
          return (
            <div key={n} className={`ndc-vb ${blocked ? 'blk' : tier(v)}`} title={`${n} affinity ${v}${blocked ? ` — ${blocked}` : ''}`}>
              <span className="vv">{v}</span>
              <span className="ndc-vbar" style={{ height: Math.round((v / 100) * 120) }} />
            </div>
          );
        })}
      </div>
      <div className="ndc-vlabels">
        {CHANNEL_NAMES.map((n, i) => {
          const blocked = consentBlocked(h, n); const isRec = h.rec.channel === n && !blocked;
          const isTop = !isRec && !blocked && h.ch[i] === maxV;
          return <span key={n}>{n}{isRec ? <em className="on">NBA</em> : blocked ? <em className="no">Blocked</em> : isTop ? <em className="top">Highest</em> : <em>&nbsp;</em>}</span>;
        })}
      </div>
    </div>
  );
}
function ThemeChart({ h }) {
  const rows = THEME_NAMES.map((n, i) => ({ n, v: h.th[i] })).sort((a, b) => b.v - a.v);
  return (
    <div className="ndc-chart">
      <h3>Content affinity by theme</h3>
      <span className="cap">Ranked by engagement with content on each theme, 0–100. The top theme sets the talking point.</span>
      <div className="ndc-vbars">
        {rows.map(r => (
          <div key={r.n} className={`ndc-vb ${tier(r.v)}`} title={`${r.n} — ${r.v}`}>
            <span className="vv">{r.v}</span>
            <span className="ndc-vbar" style={{ height: Math.round((r.v / 100) * 120) }} />
          </div>
        ))}
      </div>
      <div className="ndc-vlabels">
        {rows.map((r, i) => (
          <span key={r.n}>{r.n}{i === 0 ? <em className="on">Top</em> : <em>&nbsp;</em>}</span>
        ))}
      </div>
    </div>
  );
}
function SnapshotCard({ h }) {
  const co = h.dna['Commercial opportunity'], ep = h.dna['Engagement propensity'];
  return (
    <div className="ndc-card">
      <div className="ndc-card-hd"><h2>HCP snapshot</h2><div className="ndc-r"><span className="ndc-note">0–100</span></div></div>
      <div className="ndc-snap">
        <div className="ndc-snap-tiles">
          <div className="ndc-st"><span className="ndc-lbl">Commercial</span><span className="v">{band(co)}</span><span className="s">Brand opportunity · {co}</span></div>
          <div className="ndc-st"><span className="ndc-lbl">Engagement</span><span className="v">{ep}</span><span className="s">Propensity to respond</span></div>
          <div className="ndc-st"><span className="ndc-lbl">Relationship</span><span className="v">{h.lastF2F}d</span><span className="s">Since last face-to-face</span></div>
        </div>
        <div className="ndc-snap-charts">
          <ChannelChart h={h} />
          <ThemeChart h={h} />
        </div>
      </div>
    </div>
  );
}

function shortAct(t) {
  return t.replace(/^Send /, '').replace(/ summary$/, '')
    .replace(/^Approved email$/, 'Email').replace(/^Virtual meeting$/, 'Virtual')
    .replace(/^Follow-up call$/, 'Follow-up').replace(/^F2F visit$/, 'F2F')
    .replace(/^Phone call$/, 'Phone').replace(/^Access discussion$/, 'Access')
    .replace(/^Refer to MSL$/, 'MSL');
}
// Matched against the un-shortened title + description, since shortAct()
// strips the very words ("call", "email"...) this keys off of — e.g.
// "Follow-up call" becomes "Follow-up" by the time it'd reach a plain
// title-only match. Returns a lucide-react icon component (the same icon
// set used everywhere else in this app), not an emoji — flat line icons
// read as intentional design, not a decorative afterthought.
function journeyIcon(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('insight')) return Lightbulb;
  if (t.includes('f2f') || t.includes('visit') || t.includes('face')) return Handshake;
  if (t.includes('email')) return Mail;
  if (t.includes('call') || t.includes('phone')) return Phone;
  if (t.includes('virtual') || t.includes('webinar')) return Video;
  if (t.includes('content')) return FileText;
  return MapPin;
}
function JourneyCard({ h }) {
  const ev = [];
  ev.push({ w: `${h.lastF2F}d ago`, t: 'F2F', ic: journeyIcon('F2F'), m: 'Done', s: 'done' });
  const em = Math.max(2, Math.round(h.lastF2F * 0.42));
  ev.push({ w: `${em}d ago`, t: 'Email', ic: journeyIcon('Email'), m: 'Done', s: 'done' });
  const ct = Math.max(1, Math.round(h.lastF2F * 0.09));
  ev.push({ w: ct <= 1 ? 'Yesterday' : `${ct}d ago`, t: 'Content', ic: journeyIcon('Content'), m: 'Done', s: 'done' });
  if (h.rec.type === 'Insight') {
    ev.push({ w: 'Today', t: 'Insight', ic: journeyIcon('Insight'), m: 'No action', s: 'today' });
  } else {
    ev.push({ w: 'Today', t: h.rec.channel, ic: journeyIcon(h.rec.channel), m: 'NBA', s: 'today' });
    // h.next[0] is "Now" — the same action already shown as the "Today"
    // node above, so the rest of the recommended sequence continues the
    // same line: the immediate next step reads "Suggested", anything
    // further out reads "Future" and gets a lighter, dashed node.
    const future = (h.next || []).slice(1);
    if (future.length) {
      future.forEach((nx, i) => {
        ev.push({ w: nx.when, t: shortAct(nx.t), ic: journeyIcon(`${nx.t} ${nx.d}`), d: nx.d, m: i === 0 ? 'Suggested' : 'Future', s: i === 0 ? 'next' : 'future' });
      });
    } else {
      ev.push({ w: '+7 days', t: 'Follow-up', ic: journeyIcon('Follow-up call'), m: 'Suggested', s: 'next' });
    }
  }
  return (
    <div className="ndc-card" style={{ marginTop: 16 }}>
      <div className="ndc-card-hd"><h2>Engagement journey</h2><div className="ndc-r"><span className="ndc-note">Past · today · next</span></div></div>
      <div className="ndc-jrny">
        {ev.map((e, i) => {
          const Icon = e.ic;
          return (
            <div key={i} className={`ndc-jstep ${e.s}`} title={e.d || undefined}>
              <span className="ndc-jw">{e.w}</span>
              <span className="ndc-jnode" aria-hidden="true"><Icon size={15} /></span>
              <span className="ndc-jt">{e.t}</span>
              <span className="ndc-jm">{e.m}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── HCP detail screen ────────────────────────────────────────────────────
function HcpDetail({ h, status, note, onNote, onAccept, onWhy, onBrief, onBack }) {
  const isInsight = h.rec.type === 'Insight';
  const c = h.rec.content ? CONTENT[h.rec.content] : null;

  return (
    <>
      <div className="ndc-card" style={{ marginBottom: 16 }}>
        <div style={{ padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <button className="ndc-btn sm" style={{ marginBottom: 9 }} onClick={onBack}><ArrowLeft size={13} /> Back</button>
            <h2 style={{ fontSize: 21, letterSpacing: '-.02em' }}>{h.name}</h2>
            <div className="ndc-nba-meta">{h.spec} · {h.org} · {h.terr} · Tier {h.tier} · {h.seg}</div>
          </div>
          <div className="ndc-nba-tags"><PriorityChip h={h} /><span className="ndc-chip acc">{h.state}</span></div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', padding: '11px 18px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <span className="ndc-note"><b style={{ color: 'var(--ink)' }}>Why</b> {h.stateNote}</span>
          <span className="ndc-note"><b style={{ color: 'var(--ink)' }}>Last F2F</b> <span className="ndc-num">{h.lastF2F}</span> days ago</span>
          <span className="ndc-note"><b style={{ color: 'var(--ink)' }}>Channels</b> {h.prefs.join(', ')}</span>
        </div>
      </div>

      <div className="ndc-grid3 ndc-hero3">
        <div className="ndc-card">
          <div className="ndc-card-hd"><h2>Next best action</h2></div>
          <div className="bd">
            <div className="ndc-big">{isInsight ? 'No action recommended' : h.rec.action}</div>
            <dl className="ndc-kv">
              <dt>Objective</dt><dd>{h.rec.objective}</dd>
              <dt>Channel</dt><dd>{h.rec.channel}</dd>
              <dt>Best time</dt><dd>{h.rec.window}</dd>
            </dl>
            {!isInsight && (
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <button className="ndc-btn pri" disabled={!!status || !channelAllowed(h, h.rec.channel)} onClick={() => onAccept(h.id)}>
                  {status ? 'Accepted' : 'Accept'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="ndc-card">
          <div className="ndc-card-hd"><h2>Why now</h2></div>
          <div className="bd">
            <SignalRows h={h} />
            <button className="ndc-btn sm" style={{ marginTop: 6, justifySelf: 'start' }} onClick={() => onWhy(h.id)}>See full evidence</button>
          </div>
        </div>

        <div className="ndc-card">
          <div className="ndc-card-hd"><h2>What to discuss</h2></div>
          <div className="bd">
            {h.rec.discuss.length
              ? <ul style={{ margin: 0, paddingLeft: 17, fontSize: 13.5, lineHeight: 1.6 }}>{h.rec.discuss.map((d, i) => <li key={i}>{d}</li>)}</ul>
              : <p className="ndc-note" style={{ margin: 0 }}>{h.rec.insight || 'Nothing specific this cycle.'}</p>}
            {c && (
              <div className="ndc-fact" style={{ borderTop: '1px solid var(--line)', paddingTop: 10 }}>
                <span className="ndc-lbl">Content</span>
                <div className="t">{c.title}<small>{c.mlr === 'Approved' ? 'MLR approved' : `⚠ ${c.mlr}`}</small></div>
              </div>
            )}
            {!isInsight && <button className="ndc-btn sm" style={{ justifySelf: 'start' }} onClick={() => onBrief(h.id)}>Open pre-call brief</button>}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SnapshotCard h={h} />
        <JourneyCard h={h} />
        <div className="ndc-card" style={{ marginTop: 16 }}>
          <div className="ndc-card-hd"><h2>Rep context</h2><div className="ndc-r"><span className="ndc-chip neu">Yours, not the model's</span></div></div>
          <div className="ndc-ctx">
            <div><span className="ndc-lbl">Last call</span><p className="q">{h.ctx.lastCall}</p></div>
            <div><span className="ndc-lbl">Open commitment</span><p className="q">{h.ctx.commitment}</p></div>
            <div>
              <span className="ndc-lbl">Your note</span>
              <textarea placeholder="What do you know that the data doesn't?" value={note ?? h.ctx.note} onChange={e => onNote(h.id, e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Why drawer ───────────────────────────────────────────────────────────
function WhyDrawer({ h, onClose }) {
  if (!h) return null;
  const total = h.signals.reduce((a, s) => a + s.w, 0);
  const bars = [...h.signals].sort((a, b) => b.w - a.w);
  const impact = h.dna['Commercial opportunity'];
  const urgency = Math.min(100, h.lastF2F * 1.4 + (h.priority === 'Urgent' ? 30 : 0));

  return (
    <>
      <div className="ndc-scrim on" onClick={onClose} />
      <aside className="ndc-drawer on" role="dialog" aria-modal="true">
        <div className="ndc-drawer-hd">
          <h2>Why this recommendation?</h2>
          <button className="ndc-x" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
        <div className="ndc-drawer-bd">
          <div>
            <span className="ndc-lbl" style={{ display: 'block', marginBottom: 4 }}>Recommendation</span>
            <div className="ndc-big">{h.rec.type === 'Insight' ? 'Insight — no action' : h.rec.action}</div>
            <div className="ndc-note">{h.name} · {h.rec.objective}</div>
          </div>
          <div>
            <span className="ndc-lbl" style={{ display: 'block', marginBottom: 8 }}>Signal contribution</span>
            <div className="ndc-sigs">
              {bars.map(s => (
                <div key={s.k} className={`ndc-sig ${s.sev}`}>
                  <span className="n">{SIGNAL_LABEL[s.k]}</span>
                  <span className="bar"><i style={{ width: `${Math.round((s.w / total) * 100)}%` }} /></span>
                  <span className="v">{Math.round((s.w / total) * 100)}%</span>
                </div>
              ))}
            </div>
            <p className="ndc-note" style={{ marginTop: 9 }}>Weights sum to 100%. This is what the model actually used — not a score to argue with.</p>
          </div>
          <div>
            <span className="ndc-lbl" style={{ display: 'block', marginBottom: 8 }}>Impact × urgency</span>
            <div className="ndc-plot">
              <svg viewBox="0 0 240 150" width="100%" height="150" role="img" aria-label="Impact against urgency">
                <line x1="30" y1="120" x2="228" y2="120" stroke="var(--line-2)" strokeWidth="1" />
                <line x1="30" y1="12" x2="30" y2="120" stroke="var(--line-2)" strokeWidth="1" />
                <line x1="30" y1="66" x2="228" y2="66" stroke="var(--grid)" />
                <line x1="129" y1="12" x2="129" y2="120" stroke="var(--grid)" />
                {HCPS.map(o => {
                  if (o.id === h.id) return null;
                  const ix = 30 + (o.dna['Commercial opportunity'] / 100) * 198;
                  const uy = 120 - (Math.min(100, o.lastF2F * 1.4 + (o.priority === 'Urgent' ? 30 : 0)) / 100) * 108;
                  return <circle key={o.id} cx={ix} cy={uy} r="3" fill="var(--line-2)" />;
                })}
                <circle cx={30 + (impact / 100) * 198} cy={120 - (urgency / 100) * 108} r="6" fill="var(--mk)" stroke="var(--surface-2)" strokeWidth="2" />
                <text x="129" y="140" textAnchor="middle" fontSize="9" fill="var(--mut)" fontFamily="IBM Plex Mono">IMPACT →</text>
              </svg>
              <p className="ndc-note" style={{ margin: '8px 0 0' }}>{h.name} against the other 11 HCPs in your territory.</p>
            </div>
          </div>
          <div className="ndc-meta-grid">
            <div><span className="ndc-lbl">Model</span><div className="mv">{h.rec.model}</div></div>
            <div><span className="ndc-lbl">Signals evaluated</span><div className="mv mono">{h.rec.evaluated}</div></div>
            <div><span className="ndc-lbl">Confidence</span><div className="mv mono">{h.rec.confidence != null ? `${h.rec.confidence}%` : '—'}</div></div>
            <div><span className="ndc-lbl">Last refresh</span><div className="mv mono">{h.rec.refreshed}</div></div>
          </div>
          <p className="ndc-note">Confidence lives here, next to the evidence — not on the card. A bare percentage on the queue invites reps to argue with the number instead of reading the signals.</p>
        </div>
      </aside>
    </>
  );
}

// ── Pre-call brief modal ────────────────────────────────────────────────
function BriefModal({ h, onClose, onAccept }) {
  if (!h) return null;
  const c = h.rec.content ? CONTENT[h.rec.content] : null;
  return (
    <div className="ndc-modal on" role="dialog" aria-modal="true">
      <div className="ndc-sheet">
        <div className="ndc-sheet-hd">
          <div style={{ flex: 1 }}>
            <span className="ndc-lbl">Pre-call brief</span>
            <h2>{h.name}</h2>
            <div className="ndc-note">{h.spec} · {h.org} · {h.rec.window}</div>
          </div>
          <button className="ndc-x" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>
        <div className="ndc-sheet-bd">
          <div className="ndc-sec"><h3>Call objective</h3><p>{h.rec.objective}</p></div>
          <div className="ndc-sec">
            <h3>What you should know</h3>
            <ul>{h.signals.map(s => <li key={s.k}>{SIGNAL_LABEL[s.k]} — {s.disp}</li>)}<li>Last face-to-face: {h.lastF2F} days ago</li></ul>
          </div>
          <div className="ndc-sec"><h3>Recommended conversation</h3><ul>{h.rec.discuss.map((d, i) => <li key={i}>{d}</li>)}</ul></div>
          <div className="ndc-sec">
            <h3>What you know that the model doesn't</h3>
            <p style={{ color: 'var(--ink-2)' }}>{h.ctx.lastCall}</p>
            <p style={{ color: 'var(--ink-2)', marginTop: 6 }}><b>Open commitment:</b> {h.ctx.commitment}</p>
          </div>
          {c && (
            <div className="ndc-sec">
              <h3>Content</h3>
              <p>{c.title} <span className={`ndc-chip ${c.mlr === 'Approved' ? 'pos' : 'crit'}`} style={{ marginLeft: 6 }}>{c.mlr}</span></p>
            </div>
          )}
        </div>
        <div className="ndc-sheet-ft">
          <button className="ndc-btn pri" onClick={() => { onAccept(h.id); onClose(); }}>Accept and add to plan</button>
          <button className="ndc-btn sm" onClick={onClose}>Close</button>
          <span className="ndc-note" style={{ marginLeft: 'auto' }}>Printable · works offline</span>
        </div>
      </div>
    </div>
  );
}

// ── Page shell ───────────────────────────────────────────────────────────
// 'all' (All Recommendations) is deliberately not a nav destination — it's
// the same 12 HCPs Command Center already surfaces (hero + queue + "See all
// N" link). A persistent nav entry for it would invite browsing the full
// list as a habit, which undercuts the point of a priority queue. It's still
// reachable, just as a drill-through from Command Center, not a shortcut.
//
// `view` ('command' | 'hcps') is driven by Improzo's own left-nav sub-items
// (see LeftNav.jsx / AppShell.jsx), which key this component by that value —
// switching tabs remounts it fresh rather than syncing state via an effect,
// so internal drill-throughs (opening an HCP, "See all N recommendations")
// always start clean on a tab switch, the same way any other page's local
// state resets when you navigate away and back.
export default function NBAConsolePage({ view }) {
  const [internalView, setInternalView] = useState(view);
  const [detailId, setDetailId] = useState(null);
  const [status, setStatus] = useState({});
  const [ctxEdits, setCtxEdits] = useState({});
  const [sel, setSel] = useState(0);
  const [drawerId, setDrawerId] = useState(null);
  const [briefId, setBriefId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const open = HCPS.filter(h => !status[h.id]);

  function mark(id, v, reason) { setStatus(prev => ({ ...prev, [id]: { v, reason } })); }
  function undo(id) { setStatus(prev => { const n = { ...prev }; delete n[id]; return n; }); }
  function ack(id) { mark(id, 'dismissed', 'Acknowledged'); }
  function setNote(id, text) { setCtxEdits(prev => ({ ...prev, [id]: text })); }
  function goDetail(id) { setDetailId(id); setMenuOpen(null); }

  useEffect(() => {
    function onKey(e) {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'Escape') { setDrawerId(null); setBriefId(null); return; }
      if (internalView !== 'command' || detailId) return;
      if (!open.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSel(s => Math.max(0, Math.min(open.length - 1, s + (e.key === 'ArrowDown' ? 1 : -1))));
      } else if (e.key === 'Enter') {
        const h = open[sel]; if (h) goDetail(h.id);
      } else if (e.key.toLowerCase() === 'd') {
        const h = open[sel]; if (h) mark(h.id, 'dismissed', 'Not relevant');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, sel, internalView, detailId]);

  const drawerH = drawerId ? byId(drawerId) : null;
  const briefH = briefId ? byId(briefId) : null;
  const detailH = detailId ? byId(detailId) : null;

  const pageTitle = detailH ? detailH.name
    : internalView === 'all' ? 'All Recommendations'
    : internalView === 'hcps' ? 'HCPs' : 'NBA Command Center';
  const pageSubtitle = detailH ? `${detailH.spec} · ${detailH.org} · ${detailH.terr}`
    : internalView === 'all' ? 'Every open recommendation across your territory.'
    : internalView === 'hcps' ? 'Full HCP reference for your territory.'
    : 'What should I do today — ranked by opportunity × urgency.';

  return (
    <div className="dashboard-content-scroll">
      <div className="page-content ndc-app">
        <div className="page-header">
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>

        <div className="ndc-topbar">
          <span className="ndc-sel">Brand <b style={{ marginLeft: 4 }}>Veltrixa</b></span>
          <span className="ndc-sel">Territory <b style={{ marginLeft: 4 }}>All</b></span>
          <span className="ndc-sel">Today</span>
        </div>

        <div className="ndc-page">
          {detailH ? (
            <HcpDetail
              h={detailH} status={status[detailH.id]} note={ctxEdits[detailH.id]}
              onNote={setNote} onAccept={id => mark(id, 'accepted')} onWhy={setDrawerId} onBrief={setBriefId}
              onBack={() => setDetailId(null)}
            />
          ) : internalView === 'command' ? (
            <CommandCenter
              open={open} status={status} sel={sel} mark={mark} undo={undo}
              onOpenDetail={goDetail} onWhy={setDrawerId} onBrief={setBriefId} onAck={ack} onGoAll={() => setInternalView('all')}
              menuOpen={menuOpen} setMenuOpen={setMenuOpen}
            />
          ) : internalView === 'all' ? (
            <AllRecommendations status={status} onOpen={goDetail} />
          ) : (
            <HCPsTable onOpen={goDetail} />
          )}
        </div>

        <WhyDrawer h={drawerH} onClose={() => setDrawerId(null)} />
        <BriefModal h={briefH} onClose={() => setBriefId(null)} onAccept={id => mark(id, 'accepted')} />
      </div>
    </div>
  );
}
