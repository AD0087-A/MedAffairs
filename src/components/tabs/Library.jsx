import React, { useState } from 'react';
import { BookOpen, Quote, ExternalLink, Calendar, FileText, Download, Eye, Award, Cpu, ArrowRight, X, PlusCircle } from 'lucide-react';

export default function Library() {
  const [showSlidePreview, setShowSlidePreview] = useState(false);
  const metrics = [
    { label: 'Total Publications', value: '134', bg: '#eff6ff', color: '#1e40af', labelColor: '#3b82f6' },
    { label: 'Total Citations', value: '2,847', bg: '#ecfdf5', color: '#065f46', labelColor: '#10b981' },
    { label: 'H-Index', value: '42', bg: '#faf5ff', color: '#6b21a8', labelColor: '#a855f7' },
    { label: 'Publications (2024)', value: '18', bg: '#fffbeb', color: '#92400e', labelColor: '#f59e0b' }
  ];

  const trends = [
    { subject: 'Immunotherapy', count: 45, max: 50 },
    { subject: 'Melanoma', count: 32, max: 50 },
    { subject: 'Clinical Trials', count: 28, max: 50 },
    { subject: 'Biomarkers', count: 19, max: 50 }
  ];

  const papers = [
    {
      id: 1,
      title: 'Efficacy of Combined Immunotherapy in Advanced Melanoma: A Phase III Randomized Trial',
      journal: 'Nature Medicine',
      role: 'First Author',
      impact: '87.2',
      date: 'Feb 2025',
      citations: 12,
      doi: '10.1038/s41591-025-02847-3',
      badgeText: 'High Impact',
      badgeColor: '#eff6ff',
      badgeTextColor: '#1d4ed8'
    },
    {
      id: 2,
      title: 'Biomarker-Driven Treatment Selection in Metastatic Breast Cancer',
      journal: 'Journal of Clinical Oncology',
      role: 'Co-Author',
      impact: '45.3',
      date: 'Jan 2025',
      citations: 8,
      doi: '10.1200/JCO.24.02156',
      badgeText: 'Peer Reviewed',
      badgeColor: '#f1f5f9',
      badgeTextColor: '#475569'
    },
    {
      id: 3,
      title: 'Real-World Evidence of Immunotherapy Combinations: A Multi-Center Analysis',
      journal: 'The Lancet Oncology',
      role: 'Senior Author',
      impact: '54.4',
      date: 'Nov 2024',
      citations: 31,
      doi: '10.1016/S1470-2045(24)00582-1',
      badgeText: 'Senior Author',
      badgeColor: '#faf5ff',
      badgeTextColor: '#7e22ce'
    }
  ];

  const references = [
    {
      id: 'ref1',
      title: 'Phase III RWE Safety Sheet Reprint (2026)',
      size: '2.4 MB',
      type: 'PDF Reprint',
      relevance: 'Linked to Talking Point #1 (IO Re-challenge safety outcomes)',
      description: 'Contains comparative Real-World Evidence tracking toxicity compliance in patients resuming PD-1 blockade.'
    },
    {
      id: 'ref2',
      title: 'ADC ILD Standard Grading Protocol (v4.2)',
      size: '1.8 MB',
      type: 'Guideline Booklet',
      relevance: 'Linked to Talking Point #2 (ADC Roundtable Speaking Proposal)',
      description: 'Clinical recommendations for grading drug-induced interstitial lung disease. Ideal speaker reference sheet.'
    },
    {
      id: 'ref3',
      title: 'Clinical Trial Amendment V3 Summary (MEL-ADC-08)',
      size: '950 KB',
      type: 'Trial Amendment Outline',
      relevance: 'Linked to Talking Point #3 (Clinic Accrual Bottleneck resolution)',
      description: 'Outlines shortened washout window of 6 months instead of 12 months for prior immunotherapy adjuvant treatment.'
    },
    {
      id: 'ref4',
      title: 'Corticosteroid Dosing for Grade 2/3 Pneumonitis',
      size: '1.2 MB',
      type: 'Clinical Reference Brochure',
      relevance: 'Historic Inquiry Support Material (MIR-2026-015)',
      description: 'Standard guidelines on steroid scheduling, dosage, and tapering protocols to share with clinical safety staff.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.25s ease-out' }}>
      
      {/* AI Predictive Content Recommender */}
      <div className="ai-predictive-banner">
        <div className="ai-banner-header">
          <Cpu className="ai-icon" size={20} />
          <h3>AI Predictive Content Recommender</h3>
          <span className="ai-badge">High Confidence (88%)</span>
        </div>
        <p className="ai-banner-context">
          <strong>Analysis:</strong> Based on Dr. Chen's recent paper on "Biomarker-Driven Treatment Selection" and the active <em>Enhertu</em> competitive scenario, she is highly likely to request specific data on managing ILD safely in HER2-low cohorts.
        </p>
        <div className="ai-recommendations">
          <div className="ai-rec-card">
            <div className="ai-rec-meta">
              <span className="ai-rec-type">Slide Deck</span>
              <span className="ai-rec-slide">Jump to Slide 12</span>
            </div>
            <h4>Enhertu Phase III Safety Updates</h4>
            <p>Direct comparison of Grade 3+ ILD rates vs standard of care.</p>
            <button className="btn-ai-action" onClick={() => setShowSlidePreview(true)}>
              <Eye size={14} /> Preview Slide
            </button>
          </div>
          <div className="ai-rec-card">
            <div className="ai-rec-meta">
              <span className="ai-rec-type">Clinical Reprint</span>
              <span className="ai-rec-slide">Page 4 Highlight</span>
            </div>
            <h4>Biomarker Predictors for Toxicity</h4>
            <p>New RWE data on identifying high-risk patients before treatment.</p>
            <button className="btn-ai-action">
              <ArrowRight size={14} /> Send via Vault
            </button>
          </div>
        </div>
      </div>

      {/* Top section: Metrics & Trends */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        
        {/* Publication Metrics */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0 }}>
          <h2 className="card-title">
            <BookOpen size={18} style={{ color: 'var(--primary)' }} />
            <span>KOL Publication Metrics</span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            flex: 1
          }}>
            {metrics.map((m, idx) => (
              <div key={idx} style={{
                backgroundColor: m.bg,
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: m.color, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 500, color: m.labelColor, marginTop: '0.5rem' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Publication Trends */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0 }}>
          <h2 className="card-title">
            <Quote size={18} style={{ color: 'var(--primary)' }} />
            <span>Publication Subject Trends</span>
          </h2>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            flex: 1
          }}>
            {trends.map((t, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ width: '120px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-heading)' }}>
                  {t.subject}
                </span>
                <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '10px', backgroundColor: 'var(--border-light)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${(t.count / t.max) * 100}%`,
                      backgroundColor: 'var(--primary)',
                      borderRadius: '5px'
                    }}></div>
                  </div>
                </div>
                <span style={{ width: '24px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-heading)', textAlign: 'right' }}>
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Middle Grid: Reference Materials on Left, Papers on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '1.5rem' }}>
        
        {/* Reference materials */}
        <div className="card" style={{ margin: 0 }}>
          <h2 className="card-title">
            <FileText size={18} style={{ color: 'var(--primary)' }} />
            <span>Reference Materials & Guidelines</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Clinical reprints, trial handouts, and educational booklets relevant for the next engagement visit.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {references.map((ref) => (
              <div 
                key={ref.id} 
                style={{ 
                  border: '1px solid var(--border-light)', 
                  borderRadius: '8px', 
                  padding: '1rem',
                  backgroundColor: 'var(--bg-workspace)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-heading)' }}>{ref.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{ref.type} • {ref.size}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{ref.description}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 500 }}>{ref.relevance}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#ffffff'
                    }}>
                      <Eye size={12} />
                      <span>View</span>
                    </button>
                    <button style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: 'var(--primary)',
                      border: '1px solid var(--primary-light)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary-light)'
                    }}>
                      <Download size={12} />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent publications list */}
        <div className="card" style={{ margin: 0 }}>
          <h2 className="card-title">
            <Award size={18} style={{ color: 'var(--primary)' }} />
            <span>KOL Co-authored Papers</span>
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Latest publications where Dr. Sarah Chen has led or contributed to clinical research.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {papers.map((p) => (
              <div key={p.id} style={{
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#ffffff'
              }} className="publication-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '1rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-heading)', lineHeight: '1.4' }}>
                    {p.title}
                  </h3>
                  <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  <span>Journal: <strong>{p.journal}</strong></span>
                  <span>•</span>
                  <span>Role: <strong>{p.role}</strong></span>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  fontSize: '0.725rem', 
                  color: 'var(--text-muted)', 
                  borderTop: '1px dashed var(--border-light)', 
                  paddingTop: '0.5rem' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={10} />
                    <span>{p.date}</span>
                  </div>
                  <span>Citations: {p.citations}</span>
                  <span style={{
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: '3px',
                    backgroundColor: p.badgeColor,
                    color: p.badgeTextColor
                  }}>
                    IF: {p.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Slide Preview Modal */}
      {showSlidePreview && (
        <div className="slide-modal-overlay" onClick={() => setShowSlidePreview(false)}>
          <div className="slide-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="slide-modal-header">
              <h3>Slide Preview: Phase III Safety Updates</h3>
              <button className="slide-modal-close" onClick={() => setShowSlidePreview(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="slide-modal-body">
              <div className="slide-image-container">
                <img src="/enhertu_ild_slide.png" alt="Enhertu ILD Safety Slide" className="slide-image" />
              </div>
              
              <div className="slide-meta-sidebar">
                <div className="mlr-badge">MLR APPROVED: V3.2</div>
                
                <div className="talk-track-section">
                  <h4>Approved Talk Track</h4>
                  <p>
                    "Median time to onset of ILD was 5.4 months. Please note that 80% of all reported cases were Grade 1 or 2, and were successfully resolved or mitigated with early corticosteroid intervention."
                  </p>
                </div>
                
                <div className="compliance-warning">
                  <strong>Compliance Note:</strong> Do not guarantee complete reversibility of Grade 3+ ILD.
                </div>
                
                <button className="btn-add-briefcase">
                  <PlusCircle size={16} /> Add to Dr. Chen's Briefcase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
