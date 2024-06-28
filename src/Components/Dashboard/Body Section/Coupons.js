import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import { Delete, Edit, Restore, MoreVert } from '@mui/icons-material'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Form.css'; // Including form.css for styling

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [uploadDate, setUploadDate] = useState('');
  const [heading, setHeading] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [subheading, setSubheading] = useState('');
  const [subparagraph, setSubparagraph] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [contentimage, setContentImage] = useState(null);
  const [contentimageError, setContentImageError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openRestoreForm, setOpenRestoreForm] = useState(false);
  const [currentCoupons, setCurrentCoupons] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [srno, setSrno] = useState('');
  
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:3005/couponsdata');
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('srno', srno); // Include SR
    formData.append('title', title);
    formData.append('description', description);
    formData.append('expiryDate', expiryDate);
    formData.append('uploadDate', new Date().toISOString()); // Setting upload date to current date and time
    formData.append('heading', heading);
    formData.append('paragraph', paragraph);
    formData.append('subheading', subheading);
    formData.append('subparagraph', subparagraph);

    if (image) {
      formData.append('image', image);
    }
    if (contentimage) {
      formData.append('contentimage', contentimage);
    }

    try {
      if (confirmAction === 'edit') {
        await axios.put(`http://localhost:3005/coupons-edit/${currentCoupons._id}`, formData);
        setSnackbarMessage('Coupons updated successfully');
      } else {
        await axios.post('http://localhost:3005/couponsupload', formData);
        setSnackbarMessage('Coupons uploaded successfully');
      }
      setSnackbarOpen(true);
      fetchCoupons();
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (couponsItem) => {
    setSrno(couponsItem.srno);
    setCurrentCoupons(couponsItem);
    setTitle(couponsItem.title);
    setDescription(couponsItem.description);
    setExpiryDate(couponsItem.expiryDate);
    setUploadDate(new Date().toISOString());
    setHeading(couponsItem.heading);
    setParagraph(couponsItem.paragraph);
    setSubheading(couponsItem.subheading);
    setSubparagraph(couponsItem.subparagraph);
    setOpenForm(true);
    setConfirmAction('edit');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/coupons-delete/${id}`);
      setSnackbarMessage('Coupons deleted successfully');
      setSnackbarOpen(true);
      fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupons:', error);
    }
  };

  const handleRestore = (couponsItem) => {
    setCurrentCoupons(couponsItem);
    setExpiryDate('');
    setUploadDate('');
    setOpenRestoreForm(true);
  };

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3005/coupons-restore/${currentCoupons._id}`, {
        srno: currentCoupons.srno,
        title: currentCoupons.title,
        description: currentCoupons.description,
        heading: currentCoupons.heading,
        paragraph: currentCoupons.paragraph,
        subheading: currentCoupons.subheading,
        subparagraph: currentCoupons.subparagraph,
        expiryDate: expiryDate,
        uploadDate: new Date().toISOString(),
      });
      setSnackbarMessage('Coupons restored successfully');
      setSnackbarOpen(true);
      fetchCoupons();
      handleCloseRestore();
    } catch (error) {
      console.error('Error restoring coupons:', error);
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
    setTitle('');
    setDescription('');
    setExpiryDate('');
    setUploadDate('');
    setHeading('');
    setParagraph('');
    setSubheading('');
    setSubparagraph('');
    setImage(null);
    setContentImage(null);
    setImageError('');
    setContentImageError('');
    setCurrentCoupons(null);
    setConfirmAction('');
    setSrno('');
  };

  const handleCloseRestore = () => {
    setOpenRestoreForm(false);
    setExpiryDate('');
    setUploadDate('');
    setCurrentCoupons(null);
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

  const filteredCoupons = coupons.filter((couponsItem) =>
    couponsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    couponsItem.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="brand-slider">
      <h2 className="slider-title">Coupons Management</h2>
      <div className="uploadbuttoncompany">
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Add Coupons
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
              <th>Description</th>
              <th>Uploaded On</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map((couponsItem, index) => (
              <tr key={couponsItem._id}>
                <td>{couponsItem.srno}</td>
                <td>{couponsItem.title}</td>
                <td>{couponsItem.description}</td>
                <td>{formatDate(couponsItem.uploadDate)}</td>
                <td>
                  {couponsItem.imageSource && (
                    <img
                      src={`http://localhost:3005/${couponsItem.imageSource}`}
                      alt={couponsItem.title}
                      style={{ width: '50px', height: '50px' }}
                      />
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isPastDate(couponsItem.expiryDate) ? (
                        <>
                          <IconButton onClick={() => handleRestore(couponsItem)}>
                            <Restore />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(couponsItem._id)}>
                            <Delete />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton onClick={() => handleEdit(couponsItem)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => navigate('/couponscontent', { state: { couponsItem } })}>
                            <MoreVert />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(couponsItem._id)}>
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
          <DialogTitle>{confirmAction === 'edit' ? 'Edit Coupons' : 'Upload Coupons'}</DialogTitle>
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
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Paragraph"
                value={paragraph}
                onChange={(e) => setParagraph(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Subheading"
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Subparagraph"
                value={subparagraph}
                onChange={(e) => setSubparagraph(e.target.value)}
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
              {contentimageError && <div style={{ color: 'red' }}>{contentimageError}</div>}
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
          <DialogTitle>Restore Coupons</DialogTitle>
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
  
  export default Coupons;
  
                     
