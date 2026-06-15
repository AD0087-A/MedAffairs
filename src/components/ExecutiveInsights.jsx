import React from 'react';
import { Sparkles, Calendar, Download, Award, ShieldAlert, BarChart3, Star, Filter, ArrowUpRight } from 'lucide-react';
import EnhancedInsightsReport from './EnhancedInsightsReport';

export default function ExecutiveInsights() {
  const kpis = [
    { label: 'TOTAL INTERACTIONS', value: '5,284', change: '+14.2%', trend: 'up' },
    { label: 'KOLS ENGAGED', value: '842', change: '+6.8%', trend: 'up' },
    { label: 'HCOS ENGAGED', value: '412', change: '+3.4%', trend: 'up' },
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
              Confidence 96%
            </span>
            <span className="generated-timestamp">Generated Nov 30, 2025</span>
          </div>
        </div>

        <div className="ai-summary-body-grid">
          <div className="ai-summary-text-col">
            <h3>Monthly Medical Affairs Intelligence Report</h3>
            <div className="ai-report-meta-subtitle">November 2025 · Cross-portfolio synthesis across 12 therapeutic areas</div>
            <p>
              Scientific Exchange remains the dominant theme across all regions, accounting for <strong>31%</strong> of all interactions. Safety-related discussions increased <strong>22%</strong> month-over-month, with the strongest concentration in oncology and immunology portfolios. Emerging questions around combination therapies were observed across top oncology KOLs in North America, EU5 and Japan — signaling an opportunity for proactive scientific narrative shaping ahead of Q1 advisory boards.
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

      {/* Enhanced Insights Section (October Report) */}
      <div className="executive-report-section" style={{ marginTop: '2rem' }}>
        <EnhancedInsightsReport />
      </div>

    </div>
  );
}
