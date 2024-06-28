import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import Analytics from './Body Section/Analytics';
const AnalyticsPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <Analytics/>
      </div>
    </div>
  );
};

export default AnalyticsPanel;