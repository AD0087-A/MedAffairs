import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const THEMES = [
  {
    id: 'clinical-trials',
    theme_name: 'Clinical Trials',
    color: '#2563eb',
    bg: '#eff6ff',
    confidence: '88%',
    source_count: 4,
    kols: ['John Miller', 'Robert Johnson'],
    summary: 'Phase 3 Asia trial shows GGT elevations requiring monitoring protocol. KOL questions FBTC endpoint relevance given low baseline prevalence; planning retrospective DEE study and renal PK modeling. Recommended action: Provide GGT monitoring protocol; support research proposals.',
    narrative: 'Phase 3 Asia trial identified GGT elevations requiring active monitoring. KOL questions FBTC endpoint validity given low baseline disease prevalence in practice. Planned DEE retrospective study and renal PK modeling aim to establish dosing guidance.',
  },
  {
    id: 'scientific-exchange',
    theme_name: 'Scientific Exchange',
    color: '#6d28d9',
    bg: '#f5f3ff',
    confidence: '90%',
    source_count: 4,
    kols: ['John Miller', 'Robert Johnson'],
    summary: 'Cenobamate achieves seizure freedom at 100 mg, enabling ASM reduction; insurance denial of >400 mg dosing and Medicaid 25 mg PDL gap (resolved Oct) force suboptimal workarounds. KOL documenting outcomes to support formulary expansion. Recommended action: Provide refractory dosing rationale; expedite PDL/formulary support materials.',
    narrative: 'Cenobamate demonstrates seizure freedom at 100 mg, allowing simplification from dual-ASM regimens. Access barriers—insurance denial of higher dosing and Medicaid PDL gaps—force clinical workarounds. KOL-led outcome documentation across LA County supports formulary advocacy.',
  },
];

export default function EnhancedInsightsReport() {
  const [expandedNarratives, setExpandedNarratives] = useState({});

  const toggle = (id) => setExpandedNarratives(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="enhanced-insights-report-card">

      <div className="report-header-toolbar">
        <div className="toolbar-left">
          <h3 className="toolbar-title">Key Medical Insights — Monthly Analysis</h3>
          <div className="month-picker-container">
            <span className="picker-label">Period:</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>July 2026</span>
          </div>
        </div>
        <div className="toolbar-right">
          <span className="reporting-badge">BOARDROOM READY</span>
        </div>
      </div>

      <div className="enhanced-cards-grid">
        {THEMES.map((theme) => {
          const isExpanded = !!expandedNarratives[theme.id];
          return (
            <div
              key={theme.id}
              className="insight-smart-card"
              style={{ borderLeft: `4px solid ${theme.color}` }}
            >
              {/* Header */}
              <div className="smart-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <span style={{
                  padding: '3px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: theme.bg,
                  color: theme.color,
                  letterSpacing: '0.03em',
                }}>
                  {theme.theme_name}
                </span>
                <span className="smart-card-confidence-badge" style={{ fontSize: '0.725rem', fontWeight: 600, backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '2px 8px', borderRadius: '20px' }}>
                  Confidence: {theme.confidence}
                </span>
              </div>

              {/* Summary */}
              <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                {theme.summary}
              </p>

              {/* Sources + KOLs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  <span style={{ fontWeight: 700, color: '#1e293b' }}>{theme.source_count}</span> sources
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>KOLs:</span>
                  {theme.kols.map((kol, i) => (
                    <span key={i} style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: theme.bg,
                      color: theme.color,
                      border: `1px solid ${theme.color}22`,
                    }}>
                      {kol}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Narrative toggle */}
              <div className="smart-card-narrative-box" style={{ marginTop: '12px' }}>
                <button
                  className="narrative-toggle-btn"
                  onClick={() => toggle(theme.id)}
                >
                  <span>{isExpanded ? 'Hide AI Narrative' : 'Show Full AI Narrative'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isExpanded && (
                  <div className="raw-narrative-text">
                    {theme.narrative}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
