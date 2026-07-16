import React from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, ChevronRight, Filter, Download } from 'lucide-react';

export default function WeeklyInsights() {
  const kpis = [
    { label: 'TOTAL INTERACTIONS', value: '1,248', change: '+12.4%', trend: 'up', prior: 'vs. prior week', color: '#10b981' },
    { label: 'ACTIVE KOLS', value: '312', change: '+4.2%', trend: 'up', prior: 'vs. prior week', color: '#10b981' },
    { label: 'ACTIVE MSLS', value: '96', change: '0.0%', trend: 'flat', prior: 'vs. prior week', color: '#6b7280' },
    { label: 'INSIGHTS GENERATED', value: '487', change: '+18.7%', trend: 'up', prior: 'vs. prior week', color: '#10b981' },
    { label: 'EMERGING TOPICS', value: '23', change: '+27.8%', trend: 'up', prior: 'vs. prior week', color: '#10b981' }
  ];

  const kolData = [
    { initials: 'JM', name: 'John Miller', institution: 'LA County Hospital', themes: ['Clinical Trials', 'Scientific Exchange'], count: 4, confidence: 83, summary: 'Flagged GGT elevations in Phase 3 Asia trial requiring close lab monitoring. Seeking cenobamate dosing >400 mg for refractory patient; insurance denies coverage above labeled maximum.' },
    { initials: 'RJ', name: 'Robert Johnson', institution: 'LA County DHS', themes: ['Clinical Trials', 'Scientific Exchange'], count: 4, confidence: 83, summary: 'Planning DEE retrospective study and renal PK modeling for dosing guidance. Coordinating outcome documentation across LA County to support Medicaid formulary expansion.' },
    { initials: 'MA', name: 'Dr. Elena Marquez', institution: 'Memorial Sloan Kettering', themes: ['Safety', 'Efficacy', 'HEOR'], count: 28, confidence: 76, summary: 'Increasing focus on long-term safety profiles in elderly oncology patients.' },
    { initials: 'PA', name: 'Dr. Rajesh Patel', institution: 'Mayo Clinic', themes: ['Clinical Trials', 'Scientific Exchange'], count: 24, confidence: 82, summary: 'Active interest in combination trial design and biomarker stratification.' },
    { initials: 'CH', name: 'Dr. Sarah Chen', institution: 'Dana-Farber Cancer Institute', themes: ['Efficacy'], count: 22, confidence: 71, summary: 'Requesting real-world efficacy data in second-line treatment populations.' },
    { initials: 'OB', name: "Dr. Michael O'Brien", institution: 'Johns Hopkins', themes: ['Scientific Exchange', 'HEOR', 'Clinical Trials', 'Safety'], count: 21, confidence: 79, summary: 'Repeated questions on mechanism of action in resistant subtypes.' },
  ];

// Render slim SVG mini-sparkline for visual excellence
  const renderSparkline = (trend) => {
    const strokeColor = trend === 'down' ? '#94a3b8' : 'var(--primary)';
    return (
      <svg className="sparkline" viewBox="0 0 100 30" width="70" height="20" style={{ stroke: strokeColor, fill: 'none', strokeWidth: 1.5 }}>
        <path d={trend === 'down' 
          ? "M0,5 Q15,15 30,8 T60,20 T90,22 T100,28" 
          : "M0,25 Q15,10 30,18 T60,5 T90,2 T100,8"} 
        />
      </svg>
    );
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'Safety': return { bg: '#eff6ff', text: '#2563eb' };
      case 'Clinical Trials': return { bg: '#e0f2fe', text: '#0369a1' };
      case 'Efficacy': return { bg: '#ecfdf5', text: '#059669' };
      case 'Scientific Exchange': return { bg: '#f5f3ff', text: '#6d28d9' };
      case 'HEOR': return { bg: '#fff7ed', text: '#c2410c' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div className="weekly-insights-dashboard fade-in">
      
      {/* Title Header */}
      <div className="dashboard-title-row">
        <div>
          <span className="operational-view-tag">OPERATIONAL VIEW · FIELD MEDICAL</span>
          <h2 className="dashboard-title">Weekly MSL Insights</h2>
          <p className="dashboard-subtitle">Scientific signals, KOL intelligence and emerging topics from this week's MSL interactions.</p>
        </div>
        <div className="live-badge-container">
          <span className="live-pulse"></span>
          <span className="live-text">Live</span>
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

      {/* KPI Cards Grid */}
      <div className="kpis-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card-box">
            <div className="kpi-label-row">
              <span className="kpi-label">{kpi.label}</span>
              <span className={`kpi-change ${kpi.trend}`} style={{ color: kpi.color }}>
                {kpi.trend === 'up' && <ArrowUpRight size={12} />}
                {kpi.trend === 'down' && <ArrowDownRight size={12} />}
                {kpi.change}
              </span>
            </div>
            
            <div className="kpi-value-row">
              <span className="kpi-value">{kpi.value}</span>
              {renderSparkline(kpi.trend)}
            </div>

            <div className="kpi-prior-text">{kpi.prior}</div>
          </div>
        ))}
      </div>

      {/* AI Intelligence Summary Panel */}
      <div className="ai-summary-card">
        <div className="ai-summary-header-row">
          <div className="ai-summary-title">
            <span className="ai-badge">
              <Sparkles size={12} />
              AI GENERATED
            </span>
            <span className="confidence-badge">
              Confidence 94%
            </span>
            <span className="generated-timestamp">Generated Today, 08:14 UTC</span>
          </div>
        </div>

        <div className="ai-summary-body-grid">
          <div className="ai-summary-text-col">
            <h3>AI Weekly Intelligence Summary</h3>
            <p>
              Safety discussions increased by <strong>18%</strong> compared to last week, driven primarily by oncology KOLs in North America and EU5. Questions related to dosing optimization and special populations continue to emerge across multiple territories, with combination therapy entering the top 10 topics for the first time this quarter.
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
            <div className="confidence-layer-title">AI CONFIDENCE LAYER</div>
            
            <div className="confidence-layer-row">
              <span className="layer-label">Signal Strength</span>
              <span className="layer-pill strong">Strong</span>
            </div>

            <div className="confidence-layer-row">
              <span className="layer-label">Action Urgency</span>
              <span className="layer-pill high">High</span>
            </div>

            <div className="confidence-layer-row">
              <span className="layer-label">Data Coverage</span>
              <span className="layer-pill coverage">1,248 records</span>
            </div>
          </div>
        </div>
      </div>

      {/* KOL Intelligence — full width */}
      <div className="table-card-container" style={{ marginTop: '1.5rem' }}>
        <div className="table-card-header">
          <h3>Top KOL Intelligence</h3>
          <span className="sub-header-link">View all KOLs <ChevronRight size={14} /></span>
        </div>
        <p className="table-card-desc">Click a row to explore the KOL profile</p>

        <div className="table-wrapper">
          <table className="insights-data-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>KOL · INSTITUTION</th>
                <th style={{ width: '22%' }}>THEMES</th>
                <th style={{ width: '12%', textAlign: 'center' }}>INTERACTIONS</th>
                <th style={{ width: '12%', textAlign: 'center' }}>CONFIDENCE</th>
                <th style={{ width: '32%' }}>AI SUMMARY</th>
              </tr>
            </thead>
            <tbody>
              {kolData.map((kol, index) => {
                return (
                  <tr key={index} className="clickable-row">
                    <td>
                      <div className="kol-profile-td">
                        <div className="kol-avatar-circle">{kol.initials}</div>
                        <div className="kol-td-info">
                          <span className="kol-td-name">{kol.name}</span>
                          <span className="kol-td-inst">{kol.institution}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {kol.themes.slice(0, 2).map((t, idx) => {
                          const colors = getThemeColor(t);
                          return (
                            <span key={idx} className="theme-pill" style={{ backgroundColor: colors.bg, color: colors.text }}>
                              {t}
                            </span>
                          );
                        })}
                        {kol.themes.length > 2 && (
                          <span className="theme-pill" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                            +{kol.themes.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center font-bold">{kol.count}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        backgroundColor: kol.confidence >= 85 ? '#ecfdf5' : kol.confidence >= 75 ? '#eff6ff' : '#fefce8',
                        color: kol.confidence >= 85 ? '#059669' : kol.confidence >= 75 ? '#2563eb' : '#ca8a04',
                      }}>
                        {kol.confidence}%
                      </span>
                    </td>
                    <td className="summary-td-cell">{kol.summary}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
