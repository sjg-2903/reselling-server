import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top'
import BrandSlider from './Body Section/BrandSlider';
const Company = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <BrandSlider />
      </div>
    </div>
  );
};

export default Company;