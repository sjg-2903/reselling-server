import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import News from './Body Section/News';
const NewsPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <News/>
      </div>
    </div>
  );
};

export default NewsPanel;