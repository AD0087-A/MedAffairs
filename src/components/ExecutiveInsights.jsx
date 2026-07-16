import React, { useState } from 'react';
import { Sparkles, Download, Star, Filter, ArrowUpRight, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import EnhancedInsightsReport from './EnhancedInsightsReport';

const MONTHLY_THEMES = [
  {
    theme_name: 'Clinical Trials',
    theme_title: 'Safety monitoring and endpoint validity in development',
    theme_summary: 'Phase 3 Asia trial shows GGT elevations requiring monitoring protocol. KOL questions FBTC endpoint relevance given low baseline prevalence; planning retrospective DEE study and renal PK modeling.',
    key_insights: [
      'GGT elevations in Phase 3 Asia trial signal safety monitoring need.',
      'FBTC endpoint clinical relevance questioned due to low baseline prevalence.',
      'KOL planning DEE retrospective study and renal PK dosing guidance.',
      'GGT protocol and research proposal support requested by KOL.',
    ],
    recommended_action: 'Provide GGT monitoring protocol; support research proposals.',
    source_count: 4,
    kol_count: 2,
    msl_count: 2,
    confidence_score: 0.88,
    impact_level: 'High',
    trend: 'Increasing',
    key_entities: 'Phase 3 Asia trial, GGT elevations, FBTC endpoint, DEE retrospective study, renal PK modeling',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    theme_name: 'Scientific Exchange',
    theme_title: 'Cenobamate Access Barriers & Dosing Optimization',
    theme_summary: 'Cenobamate achieves seizure freedom at 100 mg, enabling ASM reduction; insurance denial of >400 mg dosing and Medicaid 25 mg PDL gap (resolved Oct) force suboptimal workarounds. KOL documenting outcomes to support formulary expansion.',
    key_insights: [
      'Seizure-free response at 100 mg enables discontinuation of prior ASMs.',
      'Insurance blocks >400 mg off-label dosing despite clinical need.',
      'Medicaid 25 mg PDL gap forces 50 mg tablet substitution.',
      'KOL coordinating outcome data for formulary expansion advocacy.',
    ],
    recommended_action: 'Provide refractory dosing rationale; expedite PDL/formulary support materials.',
    source_count: 4,
    kol_count: 2,
    msl_count: 2,
    confidence_score: 0.90,
    impact_level: 'High',
    trend: 'Increasing',
    key_entities: 'Cenobamate, Levetiracetam, Lacosamide, Medicaid, LA County',
    color: '#6d28d9',
    bg: '#f5f3ff',
  },
];

function ThemeCard({ theme }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round(theme.confidence_score * 100);
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
      <div style={{ padding: '16px 20px', borderLeft: `4px solid ${theme.color}`, background: theme.bg + '55' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, background: theme.bg, color: theme.color, letterSpacing: '0.04em' }}>
                {theme.theme_name}
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, background: '#ecfdf5', color: '#059669' }}>
                {theme.impact_level} Impact
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                <TrendingUp size={11} /> {theme.trend}
              </span>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>{theme.theme_title}</div>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>{theme.theme_summary}</div>
          </div>
          <div style={{ textAlign: 'center', minWidth: '64px' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: theme.color }}>{pct}%</div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>CONFIDENCE</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          {[
            { label: 'Sources', value: theme.source_count },
            { label: 'KOLs', value: theme.kol_count },
            { label: 'MSLs', value: theme.msl_count },
          ].map(m => (
            <div key={m.label} style={{ fontSize: '12px', color: '#64748b' }}>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>{m.value}</span> {m.label}
            </div>
          ))}
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: theme.color, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            {expanded ? 'Hide details' : 'Show details'}
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '8px' }}>KEY INSIGHTS</div>
            <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {theme.key_insights.map((ins, i) => (
                <li key={i} style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{ins}</li>
              ))}
            </ul>
          </div>
          <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400e' }}>RECOMMENDED ACTION · </span>
            <span style={{ fontSize: '12px', color: '#78350f' }}>{theme.recommended_action}</span>
          </div>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
            Key entities: {theme.key_entities}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExecutiveInsights() {
  const kpis = [
    { label: 'TOTAL INTERACTIONS', value: '5,284', change: '+14.2%', trend: 'up' },
    { label: 'KOLS ENGAGED', value: '842', change: '+6.8%', trend: 'up' },
    { label: 'INSIGHTS GENERATED', value: '1,968', change: '+22.1%', trend: 'up' },
    { label: 'EMERGING TOPICS', value: '47', change: '+34.3%', trend: 'up' },
    { label: 'MEDICAL INFO REQUESTS', value: '624', change: '+8.9%', trend: 'up' },
    { label: 'SAFETY SIGNALS', value: '38', change: '+41.2%', trend: 'up' },
    { label: 'SCIENTIFIC OPPORTUNITIES', value: '56', change: '+17.6%', trend: 'up' }
  ];

  return (
    <div className="executive-insights-dashboard fade-in">
      
      {/* Title Header */}
      <div className="dashboard-title-row">
        <div>
          <h2 className="dashboard-title">Monthly Executive Insights</h2>
          <p className="dashboard-subtitle">Strategic intelligence and trend analysis for Medical Affairs leadership.</p>
        </div>
        <div>
          <button className="btn-boardroom-ready">
            <Star size={14} style={{ fill: '#d97706', color: '#d97706' }} />
            <span>Boardroom-ready</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="filters-container-box">
        <div className="filters-header">
          <Filter size={14} />
          <span>Filters</span>
        </div>
        <div className="filters-row-scroll">
          <select className="filter-dropdown date-range"><option>Date Range: Last 7 days</option></select>
          <select className="filter-dropdown"><option>Product</option></select>
          <select className="filter-dropdown"><option>Therapeutic Area</option></select>
          <select className="filter-dropdown"><option>Region</option></select>
          <select className="filter-dropdown"><option>MSL</option></select>
          <select className="filter-dropdown"><option>KOL</option></select>
          <select className="filter-dropdown"><option>HCO</option></select>
          <select className="filter-dropdown"><option>Theme</option></select>
          <select className="filter-dropdown"><option>Topic</option></select>
          <button className="btn-filter-reset">Reset</button>
        </div>
      </div>

      {/* AI Executive Report Panel */}
      <div className="ai-summary-card executive">
        <div className="ai-summary-header-row">
          <div className="ai-summary-title">
            <span className="ai-badge">
              <Sparkles size={12} />
              AI GENERATED
            </span>
            <span className="confidence-badge">
              Confidence 89%
            </span>
            <span className="generated-timestamp">Generated Jul 15, 2026</span>
          </div>
        </div>

        <div className="ai-summary-body-grid">
          <div className="ai-summary-text-col">
            <h3>Monthly Medical Affairs Intelligence Report</h3>
            <div className="ai-report-meta-subtitle">July 2026 · 2 active themes · 8 field sources across 2 KOLs</div>
            <p>
              Two high-impact themes emerged this month: <strong>Clinical Trials</strong> (safety monitoring, GGT signals, endpoint validity) and <strong>Scientific Exchange</strong> (cenobamate access barriers, dosing optimization). Both themes are trending upward with high confidence scores (88–90%). Key actions: provide GGT monitoring protocol for Phase 3 Asia trial findings and expedite PDL/formulary support materials for Medicaid access barriers.
            </p>
            <div className="ai-actions-row">
              <button className="btn-ppt">
                <Download size={14} />
                <span>Export to PPT</span>
              </button>
              <button className="btn-secondary-link">
                <span>View source insights</span>
              </button>
            </div>
          </div>

          <div className="ai-confidence-col">
            <div className="confidence-layer-title">EXECUTIVE SCORING</div>
            
            <div className="confidence-layer-row">
              <span className="layer-label">Executive Confidence</span>
              <span className="layer-pill strong">96%</span>
            </div>

            <div className="confidence-layer-row">
              <span className="layer-label">Emerging Risk Score</span>
              <span className="layer-pill warning-orange">Medium</span>
            </div>

            <div className="confidence-layer-row">
              <span className="layer-label">Scientific Opportunity</span>
              <span className="layer-pill opportunity-blue">High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Scorecard Grid (8 Cards) */}
      <div className="kpis-grid executive">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card-box exec-card">
            <div className="kpi-label-row">
              <span className="kpi-label">{kpi.label}</span>
              <span className="kpi-change up" style={{ color: '#10b981' }}>
                <ArrowUpRight size={12} />
                {kpi.change}
              </span>
            </div>
            
            <div className="kpi-value-row">
              <span className="kpi-value">{kpi.value}</span>
            </div>

            <div className="kpi-prior-text">vs. prior week</div>
          </div>
        ))}
      </div>

      {/* Monthly Theme Intelligence */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Monthly Theme Intelligence</div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>July 2026 · AI-generated from 8 field sources · Generated Jul 15, 2026</div>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6d28d9', background: '#f5f3ff', padding: '3px 10px', borderRadius: '12px' }}>
            2 themes · 2 KOLs · 2 MSLs
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MONTHLY_THEMES.map((theme, i) => <ThemeCard key={i} theme={theme} />)}
        </div>
      </div>

      {/* Enhanced Insights Section */}
      <div className="executive-report-section" style={{ marginTop: '2rem' }}>
        <EnhancedInsightsReport />
      </div>

    </div>
  );
}
