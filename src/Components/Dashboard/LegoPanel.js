import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import Lego from './Body Section/Lego';
const LegoPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <Lego/>
      </div>
    </div>
  );
};

export default LegoPanel;