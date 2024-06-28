import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import AnalyticsContent from './Body Section/AnalyticsContent';
const AContent = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <AnalyticsContent/>
      </div>
    </div>
  );
};

export default AContent;