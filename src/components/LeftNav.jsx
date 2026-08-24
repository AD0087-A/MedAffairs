import React, { useState } from 'react';
import { User, Activity, BarChart2, Users, Target, Zap, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'brief', label: 'MSL Call Brief', icon: User },
  { key: 'weekly', label: 'Weekly Insights', icon: Activity },
  { key: 'executive', label: 'Executive Insights', icon: BarChart2 },
  { key: 'hcp-segmentation', label: 'HCP Segmentation & Targeting', icon: Users },
  { key: 'targeting', label: 'Dynamic Targeting', icon: Target },
  {
    key: 'nba-console', label: 'NBA Console', icon: Zap,
    subItems: [
      { key: 'command', label: 'Command Center' },
      { key: 'hcps', label: 'HCPs' },
    ],
  },
];

export default function LeftNav({ activePage, activeSubPage, onNavigate }) {
  const [expandedKey, setExpandedKey] = useState(null);

  function handleItemClick(item) {
    if (item.subItems && item.subItems.length > 0) {
      const alreadyActive = activePage === item.key;
      if (alreadyActive) {
        setExpandedKey(k => (k === item.key ? null : item.key));
      } else {
        setExpandedKey(item.key);
        onNavigate(item.key, item.subItems[0].key);
      }
    } else {
      setExpandedKey(null);
      onNavigate(item.key);
    }
  }

  function renderItem(item) {
    const Icon = item.icon;
    const isActive = activePage === item.key;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = isActive || expandedKey === item.key;

    return (
      <li key={item.key} className="left-nav-item">
        <button
          className={`left-nav-btn${isActive && !hasSubItems ? ' active' : ''}`}
          onClick={() => handleItemClick(item)}
          title={item.label}
        >
          <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {hasSubItems && (
            <ChevronDown size={13} className={`nav-chevron${isExpanded ? ' open' : ''}`} />
          )}
        </button>
        {hasSubItems && isExpanded && (
          <ul className="left-nav-subitems">
            {item.subItems.map(sub => (
              <li key={sub.key}>
                <button
                  className={`left-nav-subbtn${isActive && activeSubPage === sub.key ? ' active' : ''}`}
                  onClick={() => { setExpandedKey(item.key); onNavigate(item.key, sub.key); }}
                >
                  {sub.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <nav className="left-nav">
      <div className="left-nav-logo">
        <span>🏠</span>
        <span>Improzo</span>
      </div>

      <ul className="left-nav-items">
        {NAV_ITEMS.map(item => renderItem(item))}
      </ul>
    </nav>
  );
}
