import React, { useState } from 'react';
import { Sparkles, X, PlusCircle } from 'lucide-react';
import TabNavigation from './TabNavigation';
import MeetingPrep from './tabs/MeetingPrep';
import Timeline from './tabs/Timeline';
import Library from './tabs/Library';
import AskIzoChat from './AskIzoChat';

const TAB_COMPONENTS = {
  'Meeting Prep': MeetingPrep,
  'Timeline': Timeline,
  'Library': Library
};

export default function Workspace({ tabs, activeTab, onTabChange }) {
  const [isIzoOpen, setIsIzoOpen] = useState(false);
  const [showSlidePreview, setShowSlidePreview] = useState(false);
  const ActiveComponent = TAB_COMPONENTS[activeTab] || MeetingPrep;

  return (
    <div className="right-pane">
      {/* App Header mimicking the screenshot */}
      <header className="app-header">
        <div className="app-logo">
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>iZO</span>
          <span style={{ fontWeight: 600, marginLeft: '0.25rem' }}>KOL Expert 360</span>
        </div>
        <div className="app-actions">
          <button 
            className="btn-ask-izo" 
            aria-label="Ask AI Assistant"
            onClick={() => setIsIzoOpen(true)}
          >
            <Sparkles size={16} />
            <span>Ask iZO</span>
          </button>
        </div>
      </header>

      {/* Top horizontal tab navigation */}
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />

      {/* Scrollable workspace content */}
      <main 
        className="workspace-content" 
        id={`${activeTab.replace(/\s+/g, '-').toLowerCase()}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeTab.replace(/\s+/g, '-').toLowerCase()}-tab`}
      >
        <ActiveComponent onViewSlide={() => setShowSlidePreview(true)} />
      </main>

      {/* Slide Preview Modal (Rendered globally) */}
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
                
                <button className="btn-add-briefcase" onClick={() => alert("Slide deck added to Dr. Chen's pre-call briefcase.")}>
                  <PlusCircle size={16} /> Add to Dr. Chen's Briefcase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ask iZO Smart Assist Chat Panel Overlay */}
      <AskIzoChat 
        isOpen={isIzoOpen} 
        onClose={() => setIsIzoOpen(false)} 
        onViewSlide={() => {
          setShowSlidePreview(true);
          setIsIzoOpen(false);
        }}
        onViewTimeline={(tabName) => {
          onTabChange(tabName);
          setIsIzoOpen(false);
        }}
      />
    </div>
  );
}
