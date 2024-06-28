import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import CouponsContent from './Body Section/CouponsContent';
const CContent = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
       <CouponsContent/>
      </div>
    </div>
  );
};

export default CContent;