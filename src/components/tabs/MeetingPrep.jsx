import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, BookOpen, ExternalLink, Info, CheckCircle2, AlertTriangle, MapPin, Target, User } from 'lucide-react';

export default function MeetingPrep() {
  const [hoveredId, setHoveredId] = useState(null);

  const talkingPoints = [
    {
      id: 'tp1',
      sourceId: 'src1',
      title: 'Address Caution on IO Re-challenge',
      description: '• Cautious about immunotherapy re-challenge post-toxicity.\n• Present new RWE study: 82% safety compliance with early intervention.',
      action: 'Share RWE study reprint & review safety timelines.',
      iconColor: '#ef4444'
    },
    {
      id: 'tp2',
      sourceId: 'src2',
      title: 'October ADC Roundtable Invitation',
      description: '• She emphasized standardizing pneumonitis grading at recent ad-board.\n• Invite her to lead/speak at the upcoming ADC ILD Grading Roundtable.',
      action: 'Offer panel speaker slot & confirm availability.',
      iconColor: '#3b82f6'
    },
    {
      id: 'tp3',
      sourceId: 'src3',
      title: 'Resolve Trial Enrollment Bottleneck',
      description: '• Low accrual due to previous exclusion criteria for prior IO.\n• Protocol amendment V3 now allows prior IO (window shortened to 6 months).',
      action: 'Clarify protocol updates & verify IRB status.',
      iconColor: '#f59e0b'
    }
  ];

  const sourceEvidence = [
    {
      id: 'src1',
      talkingPointId: 'tp1',
      type: 'CONFERENCE EXPOSURE',
      title: 'WCLC 2025 Chair Session Notes',
      date: 'September 2025',
      quote: '"Clinicians remain hesitant to re-introduce IO agents post-toxicity without clear guidelines."',
      sourceMeta: 'Chaired by Dr. Chen. Note: Recent positive RWE safety data was not included in her session.'
    },
    {
      id: 'src2',
      talkingPointId: 'tp2',
      type: 'ROUNDTABLE LOG',
      title: 'ADC Safety Roundtable Discussion',
      date: 'May 10, 2026',
      quote: '"We need to align on grading. Early detection must be standardized to prevent unnecessary trial discontinuations."',
      sourceMeta: 'Recorded by MSL. Dr. Chen is a strong advocate for standardized steroid guidelines.'
    },
    {
      id: 'src3',
      talkingPointId: 'tp3',
      type: 'CLINICAL OPERATIONS',
      title: 'Site Accrual Bottleneck Report',
      date: 'April 2026',
      quote: '"Previous 12-month exclusion criteria disqualified 4 eligible patients. They are unaware of amendment V3."',
      sourceMeta: 'Reported by Study Coordinator. Amendment V3 approved by IRB last quarter.'
    }
  ];

  return (
    <div className="meeting-prep-tab" style={{ animation: 'fadeIn 0.25s ease-out' }}>
      
      {/* Day-Before Preparation Header */}
      <div className="prep-header-card">
        <div className="prep-header-meta">
          <span className="prep-pill">🚨 NEXT MEETING: IN 18 HOURS</span>
          <span className="prep-date">
            <MapPin size={14} style={{ marginRight: '4px' }} /> Location: Hospital General Clinic, Oncology Dept.
          </span>
          <span className="prep-date">
            <Calendar size={14} style={{ marginRight: '4px' }} /> Time: Tomorrow, 2:00 PM (45 mins)
          </span>
        </div>
        
        <h1 className="prep-header-title">Dr. Sarah Chen</h1>
        
        <div className="prep-objective-box">
          <div className="objective-row">
            <Target size={16} className="objective-icon" />
            <div>
              <strong>Goal for this Meeting:</strong> Win back trial enrollment momentum from Enhertu.
              <ul style={{ margin: '4px 0 0 20px', padding: 0 }}>
                <li><strong>The Issue:</strong> Recent shift toward prescribing Enhertu.</li>
                <li><strong>The Focus:</strong> Highlight our drug's better Overall Survival (OS) and lower toxicity.</li>
              </ul>
            </div>
          </div>
          <div className="objective-row mt-sm">
            <User size={16} className="objective-icon" />
            <div>
              <strong>Communication Style:</strong> Highly data-driven, expects concise executive summaries. Prefers charts over text.
            </div>
          </div>
        </div>
      </div>

      {/* Contextually Relevant Alert Banner */}
      <div className="context-alert-banner">
        <div className="context-banner-icon">
          <Sparkles size={20} className="sparkle-anim" />
        </div>
        <div className="context-banner-body">
          <div className="context-banner-title">★ Contextually Relevant Insight</div>
          <div className="context-banner-text">
            Dr. Chen exhibits cautious skepticism about immunotherapy re-challenge post-discontinuation due to outdated safety benchmarks. However, her publications show she values real-world outcomes. Sharing the new Phase III RWE safety sheet tomorrow bridges this gap perfectly.
          </div>
        </div>
      </div>

      {/* 2-Column Split Workspace (MOVED UP) */}
      <div className="prep-split-grid">
        
        {/* Left Column: Talking Points */}
        <div className="talking-points-col">
          <h2 className="col-section-title">
            <span>Talking Points & Strategic Actions</span>
            <span className="col-subtitle">Consolidated actions for the visit</span>
          </h2>

          <div className="talking-points-list">
            {talkingPoints.map((tp) => (
              <div 
                key={tp.id} 
                className={`talking-point-item ${hoveredId === tp.id || hoveredId === tp.sourceId ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredId(tp.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="tp-number" style={{ backgroundColor: tp.iconColor + '20', color: tp.iconColor }}>
                  <ArrowRight size={16} />
                </div>
                <div className="tp-content">
                  <h3 className="tp-title">{tp.title}</h3>
                  <div className="tp-desc" style={{ whiteSpace: 'pre-wrap' }}>{tp.description}</div>
                  
                  {/* Action box */}
                  <div className="tp-action-box">
                    <span className="action-tag">ACTION</span>
                    <span className="action-text">{tp.action}</span>
                  </div>

                  <div className="tp-source-link">
                    <Info size={12} style={{ marginRight: '4px' }} />
                    Connected Source: <strong>{sourceEvidence.find(s => s.id === tp.sourceId)?.title}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Source Evidence */}
        <div className="evidence-col">
          <h2 className="col-section-title">
            <span>Source Evidence & Context Cards</span>
            <span className="col-subtitle">Underlying transcripts, reports and notes</span>
          </h2>

          <div className="evidence-list">
            {sourceEvidence.map((src) => (
              <div 
                key={src.id} 
                className={`evidence-card ${hoveredId === src.id || hoveredId === src.talkingPointId ? 'highlighted' : ''}`}
                onMouseEnter={() => setHoveredId(src.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="src-badge-row">
                  <span className="src-type-badge">{src.type}</span>
                  <span className="src-date">{src.date}</span>
                </div>
                <h3 className="src-title">{src.title}</h3>
                
                <div className="src-quote-box">
                  <span className="quote-mark">“</span>
                  <p className="src-quote-text">{src.quote}</p>
                </div>

                <div className="src-meta-row">
                  <span className="meta-info-bullet"></span>
                  <span className="src-meta-text">{src.sourceMeta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Preparation Checklist */}
      <div className="prep-checklist-card card">
        <h3 className="card-title">
          <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
          <span>Meeting Preparation Checklist</span>
        </h3>
        <div className="checklist-grid">
          <label className="checklist-item">
            <input type="checkbox" defaultChecked />
            <span className="checkbox-custom"></span>
            <span className="checklist-text">Print Phase III RWE Safety reprints</span>
          </label>
          <label className="checklist-item">
            <input type="checkbox" defaultChecked />
            <span className="checkbox-custom"></span>
            <span className="checklist-text">Review IRB site approval status for amendment V3</span>
          </label>
          <label className="checklist-item">
            <input type="checkbox" />
            <span className="checkbox-custom"></span>
            <span className="checklist-text">Send calendar invite speaker outline for ADC Roundtable</span>
          </label>
          <label className="checklist-item">
            <input type="checkbox" />
            <span className="checkbox-custom"></span>
            <span className="checklist-text">Print ILD Grading Protocol sheets</span>
          </label>
        </div>
      </div>

      {/* Competitive Intelligence Panel (MOVED DOWN) */}
      <div className="competitive-intelligence-panel">
        <div className="ci-header">
          <AlertTriangle size={18} className="ci-icon" />
          <h3>COMPETITIVE INTELLIGENCE: Enhertu (Competitor)</h3>
        </div>
        <div className="ci-content">
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '8px' }}>
              <strong>Background:</strong> At the recent congress, Enhertu presented updated data showing a 1.2-month PFS advantage. Claims show Dr. Chen started 3 new patients on it last month.
            </li>
            <li style={{ marginBottom: '8px' }}>
              <strong>Competitor Weakness:</strong> Enhertu's Grade 3+ ILD (lung toxicity) rates were 15% (vs our 4%).
            </li>
            <li>
              <strong>Our Approach:</strong> Avoid direct PFS debate. Pivot to long-term Overall Survival (OS) and patient safety (ILD rates), which aligns with Dr. Chen's patient-centric style.
            </li>
          </ul>
        </div>
      </div>

    </div>
  );
}
