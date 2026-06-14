import React, { useState } from 'react';
import { Sparkles, Calendar, ArrowRight, BookOpen, ExternalLink, Info, CheckCircle2, AlertTriangle, MapPin, Target, User } from 'lucide-react';

export default function MeetingPrep() {
  const [hoveredId, setHoveredId] = useState(null);

  const talkingPoints = [
    {
      id: 'tp1',
      sourceId: 'src1',
      title: 'Address Caution on IO Re-challenge with RWE Study',
      description: 'Dr. Chen is highly cautious about immunotherapy re-challenge post-discontinuation due to high toxicity concerns from 2025 WCLC reports. Present the newer, positive Real-World Evidence (RWE) study showing that toxicity is manageable with early intervention.',
      action: 'Share RWE study reprint and review safety timelines.',
      iconColor: '#ef4444'
    },
    {
      id: 'tp2',
      sourceId: 'src2',
      title: 'Extend Speaking Invitation for October ADC Roundtable',
      description: 'At a recent advisory board, Dr. Chen emphasized that standardizing pneumonitis grading systems is critical. Invite her to lead/speak at the upcoming ADC ILD Grading Roundtable in October.',
      action: 'Offer panel speaker slot & confirm availability.',
      iconColor: '#3b82f6'
    },
    {
      id: 'tp3',
      sourceId: 'src3',
      title: 'Resolve Investigator Site Enrollment Bottlenecks',
      description: 'Dr. Chen’s clinic has low accrual in the active ADC trial. The site coordinator reported screening bottlenecks due to previous protocol exclusion criteria for prior IO treatment.',
      action: 'Clarify current protocol updates allowing prior IO.',
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
      quote: '"We saw three separate studies showing severe immune-related adverse events during immunotherapy re-challenge. Without clear safety guidelines, clinicians will remain hesitant to re-introduce IO agents post-toxicity."',
      sourceMeta: 'Chaired by Dr. Sarah Chen. Note: Recent RWE studies showing 82% safety compliance were not included in her session.'
    },
    {
      id: 'src2',
      talkingPointId: 'tp2',
      type: 'ROUNDTABLE LOG',
      title: 'ADC Safety Roundtable Discussion',
      date: 'May 10, 2026',
      quote: '"We need to align on grading. Grade 3 pneumonitis in clinical practice is often managed differently than in clinical trial templates, causing unnecessary trial discontinuations. Early detection must be standardized."',
      sourceMeta: 'Recorded by Elena Rostova (MSL). Dr. Chen expressed strong advocacy for standardized steroid guidelines.'
    },
    {
      id: 'src3',
      talkingPointId: 'tp3',
      type: 'CLINICAL OPERATIONS',
      title: 'Site Accrual Bottleneck Report',
      date: 'April 2026',
      quote: '"Dr. Chen’s team noted that the previous 12-month exclusion criteria on prior adjuvant IO disqualified 4 of their eligible patients last month, unaware that amendment V3 has shortened this window to 6 months."',
      sourceMeta: 'Reported by Study Coordinator. Amendment V3 was approved by IRB last quarter.'
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
              <strong>Strategic Objective:</strong> Address Dr. Chen's recent shift in prescribing habits toward <strong>Enhertu</strong>. Re-contextualize Enhertu's recent clinical data by highlighting our drug's superior Overall Survival (OS) tail and lower toxicity profile to regain trial enrollment momentum.
            </div>
          </div>
          <div className="objective-row mt-sm">
            <User size={16} className="objective-icon" />
            <div>
              <strong>Engagement Style:</strong> Highly data-driven, expects concise executive summaries. Prefers charts over text.
            </div>
          </div>
        </div>
      </div>

      {/* Competitive Intelligence Panel */}
      <div className="competitive-intelligence-panel">
        <div className="ci-header">
          <AlertTriangle size={18} className="ci-icon" />
          <h3>COMPETITIVE INTELLIGENCE: Enhertu (Competitor)</h3>
        </div>
        <div className="ci-content">
          <p><strong>The Situation:</strong> At the recent medical congress, Enhertu presented updated Progression-Free Survival (PFS) data showing a 1.2-month advantage over the standard of care. Claims data indicates Dr. Chen has initiated 3 new patients on Enhertu in the past month.</p>
          <p><strong>The Vulnerability:</strong> Enhertu's Grade 3+ ILD (Interstitial Lung Disease) rates were significantly higher (15% vs our 4%).</p>
          <p><strong>Actionable Strategy:</strong> Do not engage in a direct PFS debate. Pivot the conversation to long-term Overall Survival (OS) and Quality of Life (QoL) metrics, focusing on the ILD safety profile which aligns with Dr. Chen's known patient-centric approach.</p>
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

      {/* 2-Column Split Workspace */}
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
                  <p className="tp-desc">{tp.description}</p>
                  
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

    </div>
  );
}
