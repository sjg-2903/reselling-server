import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar Section/Sidebar';
import Top from './Body Section/Top Section/Top'
import Form from './Body Section/Form';
const Segment = () => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <Top/>
        <Form />
      </div>
    </div>
  );
};

export default Segment;