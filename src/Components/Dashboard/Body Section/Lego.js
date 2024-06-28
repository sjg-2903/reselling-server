import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import { Delete, Edit, Restore, MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Lego = () => {
  const [lego, setLego] = useState([]);
  const [srno, setSrno] = useState('');
  const [title, setTitle] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
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
  const [contentimage, setContentImage] = useState(null);
  const [contentimageError, setContentImageError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openRestoreForm, setOpenRestoreForm] = useState(false);
  const [currentLego, setCurrentLego] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(''); // Location state

  const navigate = useNavigate();

  useEffect(() => {
    fetchLego();
  }, []);

  const fetchLego = async () => {
    try {
      const [legoResponse, amazonResponse, hmResponse, tommyResponse] = await Promise.all([
        axios.get('http://localhost:3005/legodata'),
        axios.get('http://localhost:3005/amazondata'),
        axios.get('http://localhost:3005/hmdata'),
        axios.get('http://localhost:3005/tommydata'),
      ]);
      const combinedData = [
        ...legoResponse.data.map(item => ({ ...item, location: 'Lego' })),
        ...amazonResponse.data.map(item => ({ ...item, location: 'Amazon' })),
        ...hmResponse.data.map(item => ({ ...item, location: 'H&M' })),
        ...tommyResponse.data.map(item => ({ ...item, location: 'Tommy' })),
      ];
      setLego(combinedData);
    } catch (error) {
      console.error('Error fetching offer:', error);
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
    if (contentimage) {
      formData.append('contentimage', contentimage);
    }

    try {
      if (confirmAction === 'edit') {
        await axios.put(`http://localhost:3005/${location}-edit/${currentLego._id}`, formData);
        setSnackbarMessage('Offer updated successfully');
      } else {
        await axios.post(`http://localhost:3005/${location}upload`, formData);
        setSnackbarMessage('Offer uploaded successfully');
      }
      setSnackbarOpen(true);
      fetchLego();
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (legoItem) => {
    setSrno(legoItem.srno);
    setCurrentLego(legoItem);
    setTitle(legoItem.title);
    setExpiryDate(legoItem.expiryDate);
    setOfferPrice(legoItem.offerPrice);
    setNewprice(legoItem.newprice);
    setTruncatedPrice(legoItem.truncatedPrice);
    setDiscountPercentage(legoItem.discountPercentage);
    setDiscountPrice(legoItem.discountPrice);
    setShippingCharge(legoItem.ShippingCharge);
    setEbayAveragePrice(legoItem.ebayAveragePrice);
    setEBayTopPrice(legoItem.eBayTopPrice);
    setEBaySales(legoItem.eBaySales);
    setManufacturerPrice(legoItem.ManufacturerPrice);
    setSeller(legoItem.Seller);
    setLocation(legoItem.location);
    setOpenForm(true);
    setConfirmAction('edit');
  };

  const handleDelete = async (id, location) => {
    try {
      await axios.delete(`http://localhost:3005/${location}-delete/${id}`);
      setSnackbarMessage('Offer deleted successfully');
      setSnackbarOpen(true);
      fetchLego();
    } catch (error) {
      console.error('Error deleting lego:', error);
    }
  };

  const handleRestore = (legoItem) => {
    setCurrentLego(legoItem);
    setExpiryDate('');
    setOpenRestoreForm(true);
  };

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3005/${currentLego.location}-restore/${currentLego._id}`, {
        srno: currentLego.srno,
        title: currentLego.title,
        offerPrice: currentLego.offerPrice,
        newprice: currentLego.newprice,
        truncatedPrice: currentLego.truncatedPrice,
        discountPercentage: currentLego.discountPercentage,
        discountPrice: currentLego.discountPrice,
        ShippingCharge: currentLego.ShippingCharge,
        ebayAveragePrice: currentLego.ebayAveragePrice,
        eBayTopPrice: currentLego.eBayTopPrice,
        eBaySales: currentLego.eBaySales,
        ManufacturerPrice: currentLego.ManufacturerPrice,
        Seller: currentLego.Seller,
        expiryDate: expiryDate,
        uploadDate: new Date().toISOString(),
      });
      setSnackbarMessage('Offer restored successfully');
      setSnackbarOpen(true);
      fetchLego();
      handleCloseRestore();
    } catch (error) {
      console.error('Error restoring lego:', error);
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

  const handleContentImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setContentImage(file);
        setContentImageError('');
      };
    }
  };

  const handleClose = () => {
    setOpenForm(false);
    setSrno('');
    setTitle('');
    setExpiryDate('');
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
    setContentImage(null);
    setImageError('');
    setContentImageError('');
    setCurrentLego(null);
    setConfirmAction('');
    setLocation('');
  };

  const handleCloseRestore = () => {
    setOpenRestoreForm(false);
    setExpiryDate('');
    setCurrentLego(null);
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
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleMoreVertClick = (legoItem) => {
    navigate('/legocontent', { state: { legoItem } });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredlego = lego.filter(lego =>
    lego.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lego.offerPrice.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="brand-slider">
      <h2 className="slider-title">Offers Management</h2>

      <div className="uploadbuttoncompany">
        <Button variant="contained" color="primary" onClick={() => { setOpenForm(true); setConfirmAction('add'); }}>
          Add Offer
        </Button>

      </div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
      />
      <div className="image-table-container">
        <table className="image-table">
          <thead>
            <tr>
              <th>Srno</th>
              <th>Title</th>
              <th>Offer Price</th>
              <th>Expiry Date</th>
              <th>Location</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredlego.map((legoItem) => (
              <tr key={legoItem._id} className={isPastDate(legoItem.expiryDate) ? 'expired' : ''}>
                <td>{legoItem.srno}</td>
                <td>{legoItem.title}</td>
                <td>{legoItem.offerPrice}</td>
                <td>{formatDate(legoItem.expiryDate)}</td>
                <td>{legoItem.location}</td>
                <td>
                  {legoItem.imageSource && (
                    <img
                      src={`http://localhost:3005/${legoItem.imageSource}`}
                      alt={legoItem.title}
                      style={{ width: '50px', height: '50px' }}
                    />
                  )}
                </td>
                <td>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isPastDate(legoItem.expiryDate) ? (
                    <>
                      <IconButton onClick={() => handleRestore(legoItem)}>
                        <Restore />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(legoItem._id, legoItem.location)}>
                        <Delete />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton onClick={() => handleEdit(legoItem)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleMoreVertClick(legoItem)}>
                        <MoreVert />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(legoItem._id, legoItem.location)}>
                        <Delete />
                      </IconButton>
                    </>
                  )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{confirmAction === 'edit' ? 'Edit Lego' : 'Add New Lego'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Srno"
              variant="outlined"
              value={srno}
              onChange={(e) => setSrno(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
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
              label="Offer Price"
              variant="outlined"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="lego">Lego</MenuItem>
              <MenuItem value="amazon">Amazon</MenuItem>
              <MenuItem value="hm">H&M</MenuItem>
              <MenuItem value="tommy">Tommy</MenuItem>
            </TextField>
            <TextField
              label="New Price"
              variant="outlined"
              value={newprice}
              onChange={(e) => setNewprice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Truncated Price"
              variant="outlined"
              value={truncatedPrice}
              onChange={(e) => setTruncatedPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount Percentage"
              variant="outlined"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Discount Price"
              variant="outlined"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Shipping Charge"
              variant="outlined"
              value={ShippingCharge}
              onChange={(e) => setShippingCharge(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="eBay Average Price"
              variant="outlined"
              value={ebayAveragePrice}
              onChange={(e) => setEbayAveragePrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="eBay Top Price"
              variant="outlined"
              value={eBayTopPrice}
              onChange={(e) => setEBayTopPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="eBay Sales"
              variant="outlined"
              value={eBaySales}
              onChange={(e) => setEBaySales(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Manufacturer Price"
              variant="outlined"
              value={ManufacturerPrice}
              onChange={(e) => setManufacturerPrice(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Seller"
              variant="outlined"
              value={Seller}
              onChange={(e) => setSeller(e.target.value)}
              fullWidth
              margin="normal"
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
            {imageError && <p className="error">{imageError}</p>}
            <TextField
              label="Choose content file"
              type="file"
              accept="image/*"
              onChange={handleContentImageChange}
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
            {contentimageError && <p className="error">{contentimageError}</p>}
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
        <DialogTitle>Restore Lego</DialogTitle>
        <DialogContent>
          <form onSubmit={handleRestoreSubmit}>
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

export default Lego;
