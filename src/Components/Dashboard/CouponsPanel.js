import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top';
import Coupons from './Body Section/Coupons';
const CouponsPanel = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <Coupons/>
      </div>
    </div>
  );
};

export default CouponsPanel;