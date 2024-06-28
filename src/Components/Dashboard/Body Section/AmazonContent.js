import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import './NewsContent.css'; // Import the CSS file

const AmazonContent = () => {
  const location = useLocation();
  const { srno, title, offerPrice, expiryDate, newprice, truncatedPrice, discountPercentage, discountPrice, ShippingCharge, ebayAveragePrice, eBayTopPrice, eBaySales, ManufacturerPrice, Seller } = location.state.amazonItem;

  return (
    <div>
      <h2>Offer Details</h2>
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
            <td className="table-cell table-cell-bold">Offer Price:</td>
            <td className="table-cell">{newprice}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Old Price:</td>
            <td className="table-cell">{truncatedPrice}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Discount Percentage:</td>
            <td className="table-cell">{discountPercentage}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Discount Price:</td>
            <td className="table-cell">{discountPrice}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Shipping Charge:</td>
            <td className="table-cell">{ShippingCharge}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">ebay Average Price:</td>
            <td className="table-cell">{ebayAveragePrice}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">ebay Top Price:</td>
            <td className="table-cell">{eBayTopPrice}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">ebay Sales:</td>
            <td className="table-cell">{eBaySales}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Manufacturer Price:</td>
            <td className="table-cell">{ManufacturerPrice}</td>
          </tr>
          <tr>
            <td className="table-cell table-cell-bold">Seller Name:</td>
            <td className="table-cell">{Seller}</td>
          </tr>
        </tbody>
      </table>
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>
        Back
      </Button>
    </div>
  );
};

export default AmazonContent;
