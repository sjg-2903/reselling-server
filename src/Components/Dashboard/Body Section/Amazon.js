import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import { Delete, Edit, Restore, MoreVert } from '@mui/icons-material'; 
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Amazon = () => {
  const [amazon, setAmazon] = useState([]);
  const [srno, setSrno] = useState('');
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [newprice, setNewprice] = useState('');
  const [truncatedPrice, setTruncatedPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [ShippingCharge, setShippingCharge] = useState('');
  const [ebayAveragePrice, setEbayAveragePrice] = useState('');
  const [eBayTopPrice, setEBayTopPrice] = useState('');
  const [eBaySales, setEBaySales] = useState('');
  const [ManufacturerPrice, setManufacturerPrice] = useState('');
  const [Seller, setSeller] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openRestoreForm, setOpenRestoreForm] = useState(false);
  const [currentAmazon, setCurrentAmazon] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchAmazon();
  }, []);

  const fetchAmazon = async () => {
    try {
      const response = await axios.get('http://localhost:3005/amazondata');
      setAmazon(response.data);
    } catch (error) {
      console.error('Error fetching Amazon:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('srno', srno);
    formData.append('title', title);
    formData.append('expiryDate', expiryDate);
    formData.append('uploadDate', new Date().toISOString());
    formData.append('offerPrice', offerPrice);
    formData.append('newprice', newprice);
    formData.append('truncatedPrice', truncatedPrice);
    formData.append('discountPercentage', discountPercentage);
    formData.append('discountPrice', discountPrice);
    formData.append('ShippingCharge', ShippingCharge);
    formData.append('ebayAveragePrice', ebayAveragePrice);
    formData.append('eBayTopPrice', eBayTopPrice);
    formData.append('eBaySales', eBaySales);
    formData.append('ManufacturerPrice', ManufacturerPrice);
    formData.append('Seller', Seller);

    if (image) {
      formData.append('image', image);
    }

    try {
      if (confirmAction === 'edit') {
        await axios.put(`http://localhost:3005/amazon-edit/${currentAmazon._id}`, formData);
        setSnackbarMessage('Amazon updated successfully');
      } else {
        await axios.post('http://localhost:3005/amazonupload', formData);
        setSnackbarMessage('Amazon uploaded successfully');
      }
      setSnackbarOpen(true);
      fetchAmazon();
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (amazonItem) => {
    setSrno(amazonItem.srno);
    setCurrentAmazon(amazonItem);
    setTitle(amazonItem.title);
    setExpiryDate(amazonItem.expiryDate);
    setUploadDate(new Date().toISOString());
    setOfferPrice(amazonItem.offerPrice);
    setNewprice(amazonItem.newprice);
    setTruncatedPrice(amazonItem.truncatedPrice);
    setDiscountPercentage(amazonItem.discountPercentage);
    setDiscountPrice(amazonItem.discountPrice);
    setShippingCharge(amazonItem.ShippingCharge);
    setEbayAveragePrice(amazonItem.ebayAveragePrice);
    setEBayTopPrice(amazonItem.eBayTopPrice);
    setEBaySales(amazonItem.eBaySales);
    setManufacturerPrice(amazonItem.ManufacturerPrice);
    setSeller(amazonItem.Seller);
    setOpenForm(true);
    setConfirmAction('edit');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/amazon-delete/${id}`);
      setSnackbarMessage('Amazon deleted successfully');
      setSnackbarOpen(true);
      fetchAmazon();
    } catch (error) {
      console.error('Error deleting Amazon:', error);
    }
  };

  const handleRestore = (amazonItem) => {
    setCurrentAmazon(amazonItem);
    setExpiryDate('');
    setUploadDate('');
    setOpenRestoreForm(true);
  };

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3005/amazon-restore/${currentAmazon._id}`, {
        srno: currentAmazon.srno,
        title: currentAmazon.title,
        offerPrice: currentAmazon.offerPrice,
        newprice: currentAmazon.newprice,
        truncatedPrice: currentAmazon.truncatedPrice,
        discountPercentage: currentAmazon.discountPercentage,
        discountPrice: currentAmazon.discountPrice,
        ShippingCharge: currentAmazon.ShippingCharge,
        ebayAveragePrice: currentAmazon.ebayAveragePrice,
        eBayTopPrice: currentAmazon.eBayTopPrice,
        eBaySales: currentAmazon.eBaySales,
        ManufacturerPrice: currentAmazon.ManufacturerPrice,
        Seller: currentAmazon.Seller,
        expiryDate: expiryDate,
        uploadDate: new Date().toISOString(),
      });
      setSnackbarMessage('Amazon restored successfully');
      setSnackbarOpen(true);
      fetchAmazon();
      handleCloseRestore();
    } catch (error) {
      console.error('Error restoring Amazon:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width <= 200 && img.height <= 200) {
          setImage(file);
          setImageError('');
        } else {
          setImage(null);
          setImageError('Image must be 150x150 pixels');
        }
      };
    }
  };

  const handleClose = () => {
    setOpenForm(false);
    setSrno('');
    setTitle('');
    setExpiryDate('');
    setUploadDate('');
    setOfferPrice('');
    setNewprice('');
    setTruncatedPrice('');
    setDiscountPercentage('');
    setDiscountPrice('');
    setShippingCharge('');
    setEbayAveragePrice('');
    setEBayTopPrice('');
    setEBaySales('');
    setManufacturerPrice('');
    setSeller('');
    setImage(null);
    setImageError('');
    setCurrentAmazon(null);
    setConfirmAction('');
  };

  const handleCloseRestore = () => {
    setOpenRestoreForm(false);
    setExpiryDate('');
    setUploadDate('');
    setCurrentAmazon(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const isPastDate = (selectedDate) => {
    const currentDate = new Date();
    return new Date(selectedDate) < currentDate;
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleString('en-GB', options).replace(',', '');
  };

  const filteredAmazon = amazon.filter((amazonItem) =>
    amazonItem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="brand-slider">
      <h2 className="slider-title">Amazon Offers</h2>
      <div className="uploadbuttoncompany">
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Add Offer
        </Button>
      </div>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="image-table-container">
        <table className="image-table">
          <thead>
            <tr>
              <th>SR No</th>
              <th>Title</th>
              <th>Offer Price</th>
              <th>Expiry Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAmazon.map((amazonItem, index) => (
              <tr key={amazonItem._id}>
                <td>{amazonItem.srno}</td>
                <td>{amazonItem.title}</td>
                <td>{amazonItem.offerPrice}</td>
                <td>{formatDate(amazonItem.expiryDate)}</td>
                <td>
                  {amazonItem.imageSource && (
                    <img
                      src={`http://localhost:3005/${amazonItem.imageSource}`}
                      alt={amazonItem.title}
                      style={{ width: '100px', height: '50px' }}
                    />
                  )}
                </td>
                <td>
                  {isPastDate(amazonItem.expiryDate) ? (
                    <>
                      <IconButton onClick={() => handleRestore(amazonItem)}>
                        <Restore />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(amazonItem._id)}>
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(amazonItem)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => navigate('/amazoncontent', { state: { amazonItem } })}>
                        <MoreVert />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(amazonItem._id)}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{confirmAction === 'edit' ? 'Edit Amazon' : 'Upload Amazon'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
            <TextField
              label="SR No"
              value={srno}
              onChange={(e) => setSrno(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Offer Price"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="New Price"
              value={newprice}
              onChange={(e) => setNewprice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Truncated Price"
              value={truncatedPrice}
              onChange={(e) => setTruncatedPrice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Discount Percentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Discount Price"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Shipping Charge"
              value={ShippingCharge}
              onChange={(e) => setShippingCharge(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="eBay Average Price"
              value={ebayAveragePrice}
              onChange={(e) => setEbayAveragePrice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="eBay Top Price"
              value={eBayTopPrice}
              onChange={(e) => setEBayTopPrice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="eBay Sales"
              value={eBaySales}
              onChange={(e) => setEBaySales(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Manufacturer Price"
              value={ManufacturerPrice}
              onChange={(e) => setManufacturerPrice(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Seller"
              value={Seller}
              onChange={(e) => setSeller(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Expiry Date"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split("T")[0] + "T00:00",
              }}
            />
            <TextField
              label="Choose cover file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                style: {
                  margin: '16px 0',
                },
              }}
            />
            {imageError && <div style={{ color: 'red' }}>{imageError}</div>}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {confirmAction === 'edit' ? 'Update' : 'Upload'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openRestoreForm} onClose={handleCloseRestore}>
        <DialogTitle>Restore Amazon</DialogTitle>
        <DialogContent>
          <form onSubmit={handleRestoreSubmit}>
            <TextField
              label="New Expiry Date"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              fullWidth
              required
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split("T")[0] + "T00:00",
              }}
            />
            <DialogActions>
              <Button onClick={handleCloseRestore} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Restore
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Amazon;

