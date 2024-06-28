import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top'
import Body from './Body Section/Body';
const Dashboard = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <Body />
      </div>
    </div>
  );
};

export default Dashboard;
