import React, { useState } from 'react';
import { Sparkles, Bell } from 'lucide-react';
import LeftNav from './LeftNav';
import KOLProfileCard from './KOLProfileCard';
import Workspace from './Workspace';
import WeeklyInsights from './WeeklyInsights';
import ExecutiveInsights from './ExecutiveInsights';
import AskIzoChat from './AskIzoChat';
import HCPSegmentationPage from './pages/HCPSegmentationPage';

const WORKSPACE_TABS = ['Meeting Prep', 'Timeline', 'Library'];

const PAGE_LABELS = {
  brief: 'MSL Call Brief',
  weekly: 'Weekly Insights',
  executive: 'Executive Insights',
  'hcp-segmentation': 'HCP Segmentation and Targeting',
};

export default function AppShell() {
  const [activePage, setActivePage] = useState('weekly');
  const [workspaceTab, setWorkspaceTab] = useState('Meeting Prep');
  const [isChatOpen, setIsChatOpen] = useState(false);

  function renderMainContent() {
    if (activePage === 'brief') {
      return (
        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
          <KOLProfileCard />
          <Workspace
            tabs={WORKSPACE_TABS}
            activeTab={workspaceTab}
            onTabChange={setWorkspaceTab}
          />
        </div>
      );
    }

    if (activePage === 'executive') {
      return (
        <div className="dashboard-content-scroll">
          <ExecutiveInsights />
        </div>
      );
    }

    if (activePage === 'hcp-segmentation') {
      return <HCPSegmentationPage />;
    }

    return (
      <div className="dashboard-content-scroll">
        <WeeklyInsights />
      </div>
    );
  }

  const pageTitle = PAGE_LABELS[activePage] || activePage;

  return (
    <div className="app-shell">
      <LeftNav activePage={activePage} onNavigate={setActivePage} />

      <div className="app-shell-main">
        <header className="app-header">
          <span className="app-header-title">{pageTitle}</span>
          <input
            type="text"
            className="app-header-search"
            placeholder="Search KOLs, HCPs, insights..."
          />
          <div className="app-header-actions header-right">
            <button className="ask-izo-btn" onClick={() => setIsChatOpen(true)}>
              <Sparkles size={14} />
              Ask Izo
            </button>
            <button className="notif-btn" aria-label="Notifications">
              <Bell size={16} />
              <span className="notif-dot">3</span>
            </button>
            <div className="header-user-badge">
              <span>R. Kapoor</span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {renderMainContent()}
        </div>
      </div>

      <AskIzoChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
