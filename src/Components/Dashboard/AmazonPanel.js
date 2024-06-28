import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import Amazon from './Body Section/Amazon';
const AmazonPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <Amazon/>
      </div>
    </div>
  );
};

export default AmazonPanel;