import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import AmazonContent from './Body Section/AmazonContent';
const ACPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <AmazonContent/>
      </div>
    </div>
  );
};

export default ACPanel;