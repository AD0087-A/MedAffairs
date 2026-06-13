import React from 'react';
import { Sparkles, Calendar, Lightbulb, MessageSquare, BookOpen } from 'lucide-react';

const TAB_ICONS = {
  'AI Overview': Sparkles,
  'Interactions': Calendar,
  'Insights': Lightbulb,
  'Inquiries': MessageSquare,
  'Publications': BookOpen
};

export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="tabs-navbar" aria-label="Workspace Tabs">
      <div className="tabs-list" role="tablist">
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab] || Sparkles;
          const isActive = activeTab === tab;
          
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.replace(/\s+/g, '-').toLowerCase()}-panel`}
              id={`${tab.replace(/\s+/g, '-').toLowerCase()}-tab`}
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              <Icon size={16} />
              <span>{tab}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
