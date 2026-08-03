import React, { useState } from 'react';
import { User, Activity, BarChart2, Users, ChevronDown } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'brief', label: 'MSL Call Brief', icon: User },
  { key: 'weekly', label: 'Weekly Insights', icon: Activity },
  { key: 'executive', label: 'Executive Insights', icon: BarChart2 },
  { key: 'hcp-segmentation', label: 'HCP Segmentation & Targeting', icon: Users },
];

export default function LeftNav({ activePage, onNavigate }) {
  const [expandedKey, setExpandedKey] = useState(null);

  function handleItemClick(item) {
    if (item.subItems && item.subItems.length > 0) {
      if (expandedKey === item.key) {
        setExpandedKey(null);
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
    const isExpanded = expandedKey === item.key;
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <li key={item.key} className="left-nav-item">
        <button
          className={`left-nav-btn${isActive ? ' active' : ''}`}
          onClick={() => handleItemClick(item)}
          title={item.label}
        >
          <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>{item.label}</span>
          {hasSubItems && (
            <ChevronDown size={13} className={`nav-chevron${isExpanded ? ' open' : ''}`} />
          )}
        </button>
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
