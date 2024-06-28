import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import './Form.css'; // Including form.css for styling

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FormComponent = () => {
  const [segments, setSegments] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openRestoreForm, setOpenRestoreForm] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(null);
  const [confirmAction, setConfirmAction] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSegments();
  }, []);

  const fetchSegments = async () => {
    try {
      const response = await axios.get('http://localhost:3005/segmentdata');
      setSegments(response.data);
    } catch (error) {
      console.error('Error fetching segments:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('expiryDate', expiryDate);
    
    if (image) {
      formData.append('image', image);
    }

    try {
      if (confirmAction === 'edit') {
        await axios.put(`http://localhost:3005/segment-edit/${currentSegment._id}`, formData);
        setSnackbarMessage('Segment updated successfully');
      } else {
        await axios.post('http://localhost:3005/segmentupload', formData);
        setSnackbarMessage('Segment uploaded successfully');
      }
      setSnackbarOpen(true);
      fetchSegments();
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (segment) => {
    setCurrentSegment(segment);
    setTitle(segment.title);
    setDescription(segment.description);
    setExpiryDate(segment.expiryDate);
    setOpenForm(true);
    setConfirmAction('edit');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3005/segment-delete/${id}`);
      setSnackbarMessage('Segment deleted successfully');
      setSnackbarOpen(true);
      fetchSegments();
    } catch (error) {
      console.error('Error deleting segment:', error);
    }
  };

  const handleRestore = (segment) => {
    setCurrentSegment(segment);
    setExpiryDate('');
    setOpenRestoreForm(true);
  };

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3005/segment-restore/${currentSegment._id}`, {
        title: currentSegment.title,
        description: currentSegment.description,
        expiryDate: expiryDate,
      });
      setSnackbarMessage('Segment restored successfully');
      setSnackbarOpen(true);
      fetchSegments();
      handleCloseRestore();
    } catch (error) {
      console.error('Error restoring segment:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width <= 50 && img.height <= 50) {
          setImage(file);
          setImageError('');
        } else {
          setImage(null);
          setImageError('Image must be 50x50 pixels');
        }
      };
    }
  };

  const handleClose = () => {
    setOpenForm(false);
    setTitle('');
    setDescription('');
    setExpiryDate('');
    setImage(null);
    setImageError('');
    setCurrentSegment(null);
    setConfirmAction('');
  };

  const handleCloseRestore = () => {
    setOpenRestoreForm(false);
    setExpiryDate('');
    setCurrentSegment(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const isPastDate = (selectedDate) => {
    const currentDate = new Date();
    return new Date(selectedDate) < currentDate;
  };

  const filteredSegments = segments.filter(segment =>
    segment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    segment.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="brand-slider">
      <h2 className="slider-title">Segment Management</h2>
      <div className="uploadbuttoncompany">
        <Button variant="contained" color="primary" onClick={() => setOpenForm(true)}>
          Add Segment
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
              <th>Title</th>
              <th>Description</th>
              <th>Expiry Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSegments.map((segment) => (
              <tr key={segment._id}>
                <td>{segment.title}</td>
                <td>{segment.description}</td>
                <td>
                  {isPastDate(segment.expiryDate) ? (
                    <span style={{ color: 'red' }}>Expired</span>
                  ) : (
                    `At ${new Date(segment.expiryDate).toLocaleString('en-US', { 
                      hour: 'numeric', 
                      minute: 'numeric', 
                      hour12: true, 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}`
                  )}
                </td>
                <td>
                  {segment.imageSource && (
                    <img
                      src={`http://localhost:3005/${segment.imageSource}`}
                      alt={segment.title}
                      style={{ width: '50px', height: '50px' }}
                    />
                  )}
                </td>
                <td>
                  {isPastDate(segment.expiryDate) ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRestore(segment)}
                    >
                      Restore
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(segment)}
                        sx={{ marginBottom: '10px' }} // Using MUI sx prop
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(segment._id)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{confirmAction === 'edit' ? 'Edit Segment' : 'Upload Segment'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit} encType="multipart/form-data">
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
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginTop: '16px' }}
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
        <DialogTitle>Restore Segment</DialogTitle>
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

export default FormComponent;
