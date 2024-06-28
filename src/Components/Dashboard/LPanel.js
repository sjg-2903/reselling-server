import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import LegoContent from './Body Section/LegoContent';
const LPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <LegoContent/>
      </div>
    </div>
  );
};

export default LPanel;