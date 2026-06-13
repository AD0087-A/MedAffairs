import React, { useState } from 'react';
import KOLProfileCard from './components/KOLProfileCard';
import Workspace from './components/Workspace';
import './App.css';

const TABS = ['Meeting Prep', 'Timeline', 'Library'];

function App() {
  const [activeTab, setActiveTab] = useState('Meeting Prep');

  return (
    <div className="dashboard-container">
      {/* Left Pane (30% Width - Sticky) */}
      <KOLProfileCard />

      {/* Right Pane (70% Width - Scrollable Workspace) */}
      <Workspace 
        tabs={TABS} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
    </div>
  );
}

export default App;
