import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import './NewsContent.css'; // Import the CSS file

const AnalyticsContent = () => {
  const location = useLocation();
  const { srno, title, heading, subheading, paragraph, subparagraph, contentimage } = location.state.analyticsItem;

  return (
    <div>
      <h2>Analytics Details</h2>
      <table className="table-container">
        <tbody>
          <tr>
            <td className="table-cell table-cell-bold">SR No:</td>
            <td className="table-cell">{srno}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Title:</td>
            <td className="table-cell">{title}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Heading:</td>
            <td className="table-cell">{heading}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Paragraph:</td>
            <td className="table-cell">{paragraph}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Subheading:</td>
            <td className="table-cell">{subheading}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Subparagraph:</td>
            <td className="table-cell">{subparagraph}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Image:</td>
            <td className="table-cell">{contentimage && (
                <img src={`http://localhost:3005/${contentimage}`} alt="Content Image" style={{ width: '100px', height: '50px' }} />
              )}</td>
          </tr>
        </tbody>
      </table>
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>
        Back
      </Button>
    </div>
  );
};

export default AnalyticsContent;
