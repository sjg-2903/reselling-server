import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import NewsContent from './Body Section/NewsContent';
const NContent = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <NewsContent/>
      </div>
    </div>
  );
};

export default NContent;