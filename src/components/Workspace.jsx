import React from 'react';
import { Sparkles } from 'lucide-react';
import TabNavigation from './TabNavigation';
import MeetingPrep from './tabs/MeetingPrep';
import Timeline from './tabs/Timeline';
import Library from './tabs/Library';

const TAB_COMPONENTS = {
  'Meeting Prep': MeetingPrep,
  'Timeline': Timeline,
  'Library': Library
};

export default function Workspace({ tabs, activeTab, onTabChange }) {
  const ActiveComponent = TAB_COMPONENTS[activeTab] || MeetingPrep;

  return (
    <div className="right-pane">
      {/* App Header mimicking the screenshot */}
      <header className="app-header">
        <div className="app-logo">
          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>iZO</span>
          <span style={{ fontWeight: 600, marginLeft: '0.25rem' }}>KOL Identify</span>
        </div>
        <div className="app-actions">
          <button className="btn-ask-izo" aria-label="Ask AI Assistant">
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
        <ActiveComponent />
      </main>
    </div>
  );
}
