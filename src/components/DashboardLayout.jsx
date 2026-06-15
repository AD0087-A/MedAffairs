import React, { useState } from 'react';
import { Activity, BarChart2, RefreshCw, Search, Download, Calendar, User, FileText } from 'lucide-react';
import WeeklyInsights from './WeeklyInsights';
import ExecutiveInsights from './ExecutiveInsights';
import KOLProfileCard from './KOLProfileCard';
import Workspace from './Workspace';

const WORKSPACE_TABS = ['Meeting Prep', 'Timeline', 'Library'];

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('brief'); // 'brief', 'weekly', 'executive'
  const [workspaceTab, setWorkspaceTab] = useState('Meeting Prep');

  return (
    <div className="manager-dashboard-layout" style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Dynamic Left Sidebar */}
      <aside className="dashboard-sub-sidebar">
        <div className="sub-sidebar-header">
          <div className="brand-title">Medaffairs.ai</div>
          <div className="brand-subtitle">MSL INTELLIGENCE</div>
        </div>

        <div className="sub-sidebar-menu">
          {/* Field Medical / KOL Profile section */}
          <div className="menu-category">FIELD MEDICAL</div>
          <button 
            className={`sub-sidebar-btn ${activeTab === 'brief' ? 'active' : ''}`}
            onClick={() => setActiveTab('brief')}
          >
            <User size={18} />
            <span>MSL Call Brief</span>
          </button>

          {/* Dashboards section */}
          <div className="menu-category" style={{ marginTop: '1.5rem' }}>DASHBOARDS</div>
          
          <button 
            className={`sub-sidebar-btn ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            <Activity size={18} />
            <span>Weekly Insights</span>
          </button>

          <button 
            className={`sub-sidebar-btn ${activeTab === 'executive' ? 'active' : ''}`}
            onClick={() => setActiveTab('executive')}
          >
            <BarChart2 size={18} />
            <span>Executive Insights</span>
          </button>
        </div>

        <div className="sub-sidebar-footer">
          <div className="ai-engine-box">
            <div className="ai-engine-status">
              <RefreshCw size={14} className="spin-slow" />
              <span>AI Engine</span>
            </div>
            <div className="ai-engine-refresh-text">Last model refresh — 14 min ago.</div>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="dashboard-main-content" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
        
        {activeTab === 'brief' ? (
          /* MSL Call Brief view containing original KOLProfileCard and Workspace */
          <div className="kol-brief-container" style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Left Pane (KOL Profile Card - matches original 30% split) */}
            <KOLProfileCard />

            {/* Right Pane (Workspace - matches original 70% split) */}
            <Workspace 
              tabs={WORKSPACE_TABS} 
              activeTab={workspaceTab} 
              onTabChange={setWorkspaceTab} 
            />
          </div>
        ) : (
          /* Dashboard Views (Weekly / Executive) */
          <>
            {/* Top Header Bar for Dashboards */}
            <header className="dashboard-top-header">
              <div className="search-container">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search KOLs, topics, themes..." 
                  className="dashboard-search-input"
                />
              </div>

              <div className="header-actions">
                <div className="header-date-selector">
                  <Calendar size={14} />
                  <span>Last 7 days · Nov 10 – Nov 16</span>
                </div>

                <button className="btn-export">
                  <Download size={14} />
                  <span>Export</span>
                </button>

                <div className="header-user-profile">
                  <div className="user-avatar-badge">DR</div>
                  <div className="user-profile-info">
                    <div className="user-profile-name">Dr. R. Kapoor</div>
                    <div className="user-profile-role">Medical Director</div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Scroll Area */}
            <div className="dashboard-content-scroll">
              {activeTab === 'weekly' ? <WeeklyInsights /> : <ExecutiveInsights />}
            </div>
          </>
        )}

      </div>

    </div>
  );
}
