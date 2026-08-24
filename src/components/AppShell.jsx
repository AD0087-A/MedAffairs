import React, { useState } from 'react';
import { Sparkles, Bell, Menu } from 'lucide-react';
import LeftNav from './LeftNav';
import KOLProfileCard from './KOLProfileCard';
import Workspace from './Workspace';
import WeeklyInsights from './WeeklyInsights';
import ExecutiveInsights from './ExecutiveInsights';
import AskIzoChat from './AskIzoChat';
import HCPSegmentationPage from './pages/HCPSegmentationPage';
import DynamicTargetingPage from './pages/DynamicTargetingPage';
import NBAConsolePage from './pages/NBAConsolePage';

const WORKSPACE_TABS = ['Meeting Prep', 'Timeline', 'Library'];

const PAGE_LABELS = {
  brief: 'MSL Call Brief',
  weekly: 'Weekly Insights',
  executive: 'Executive Insights',
  'hcp-segmentation': 'HCP Segmentation and Targeting',
  targeting: 'Dynamic Targeting',
  'nba-console': 'NBA Console',
};
const NBA_VIEW_LABELS = { command: 'NBA Command Center', hcps: 'HCPs' };

export default function AppShell() {
  const [activePage, setActivePage] = useState('weekly');
  const [nbaView, setNbaView] = useState('command');
  const [workspaceTab, setWorkspaceTab] = useState('Meeting Prep');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleNavigate(page, sub) {
    setActivePage(page);
    if (page === 'nba-console' && sub) setNbaView(sub);
    setMobileNavOpen(false);
  }

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

    if (activePage === 'targeting') {
      return <DynamicTargetingPage />;
    }

    if (activePage === 'nba-console') {
      return <NBAConsolePage view={nbaView} key={nbaView} />;
    }

    return (
      <div className="dashboard-content-scroll">
        <WeeklyInsights />
      </div>
    );
  }

  const pageTitle = activePage === 'nba-console'
    ? (NBA_VIEW_LABELS[nbaView] || PAGE_LABELS['nba-console'])
    : (PAGE_LABELS[activePage] || activePage);

  return (
    <div className="app-shell">
      <LeftNav
        activePage={activePage}
        activeSubPage={activePage === 'nba-console' ? nbaView : null}
        onNavigate={handleNavigate}
        mobileOpen={mobileNavOpen}
      />
      {mobileNavOpen && <div className="mobile-nav-scrim" onClick={() => setMobileNavOpen(false)} />}

      <div className="app-shell-main">
        <header className="app-header">
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileNavOpen(v => !v)}
            aria-label="Toggle navigation"
          >
            <Menu size={20} />
          </button>
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
