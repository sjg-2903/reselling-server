import React, { useState, useEffect } from 'react';
import './BrandSlider.css';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, FormControl, Select, MenuItem } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const BrandSlider = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [images, setImages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [replaceImageUrl, setReplaceImageUrl] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const validateImage = (file) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      
      image.onload = () => {
        const { width, height } = image;
        const fileSize = file.size; // in bytes
  
        if (fileSize > 1024 * 1024) { // 1MB
          reject('Image size must be less than 1MB.');
         } else if (width < 50 || width > 110 || height < 10 || height > 100) {
          reject('Image dimensions must be between 50*10 and 110*100 pixels.');
        } else {
          resolve(true);
        }
      };
  
      image.onerror = () => {
        reject('Invalid image file.');
      };
    });
  };

  const fetchImages = async () => {
    try {
      const [storeResponse, brandResponse] = await Promise.all([
        axios.get('http://localhost:3005/image-store'),
        axios.get('http://localhost:3005/image-brand')
      ]);
      const storeImages = storeResponse.data.map(imageUrl => ({ imageUrl, location: 'Store' }));
      const brandImages = brandResponse.data.map(imageUrl => ({ imageUrl, location: 'Brand' }));
      setImages([...storeImages, ...brandImages]);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };
  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // const handleTypeSelect = (type) => {
  //   setSelectedType(type);
  //   setDialogOpen(false);
  //   document.getElementById('fileInput').click();
  // };

  const handleUpload = () => {
    setReplaceImageUrl(null);
    handleDialogOpen();
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file && selectedType) {
      if (replaceImageUrl) {
        handleReplaceImage(file);
      } else {
        handleUploadImage(file);
      }
    }
  };

  const handleUploadImage = async (file) => {
    try {
      await validateImage(file); 
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`http://localhost:3005/upload-${selectedType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newImageUrl = response.data.imageUrl;
      setImages([...images, { imageUrl: newImageUrl, location: selectedType }]);
      showSnackbar('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showSnackbar(error,'error');
    }
  };

  const handleReplaceImage = async (file) => {
    try {
      await validateImage(file); 
      const formData = new FormData();
      formData.append('image', file);
      formData.append('previousImageUrl', replaceImageUrl);

      const response = await axios.post(`http://localhost:3005/replace-${selectedType}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const newImageUrl = response.data.imageUrl;
      const updatedImages = images.map(image =>
        image.imageUrl === replaceImageUrl ? { ...image, imageUrl: newImageUrl } : image
      );
      setImages(updatedImages);
      showSnackbar('Image replaced successfully!', 'success');
    } catch (error) {
      console.error('Error replacing image:', error);
      showSnackbar(error,'error');
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      await axios.delete(`http://localhost:3005/delete-${getTypeFromUrl(imageUrl)}`, { data: { imageUrl } });
      const filteredImages = images.filter(image => image.imageUrl !== imageUrl);
      setImages(filteredImages);
      showSnackbar('Image deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting image:', error);
      showSnackbar('Failed to delete image');
    }
  };

  const getTypeFromUrl = (url) => {
    return url.includes('/stores/') ? 'store' : 'brand';
  };


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAction = (imageUrl, actionType) => {
    setSelectedType(getTypeFromUrl(imageUrl));
    if (actionType === 'replace') {
      setReplaceImageUrl(imageUrl);
      setConfirmMessage('Are you sure you want to replace this image?');
      setConfirmAction(() => () => document.getElementById('fileInput').click());
      setConfirmDialogOpen(true);
    } else if (actionType === 'delete') {
      setConfirmMessage('Are you sure you want to delete this image?');
      setConfirmAction(() => () => handleDeleteImage(imageUrl));
      setConfirmDialogOpen(true);
    }
  };
   
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  }

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmDialogYes = () => {
    if (confirmAction) {
      confirmAction();
    }
    setConfirmDialogOpen(false);
  };

  return (
    <div className="brand-slider">
      <h2 className="slider-title">Company Slider</h2>
      <div className="uploadbuttoncompany">
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Add Company
        </Button>
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Select Location</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <Select
              labelId="select-type-label"
              value={selectedType}
              onChange={handleTypeChange}
            >
              <MenuItem value="store">Store</MenuItem>
              <MenuItem value="brand">Brand</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Cancel</Button>
          <Button
            onClick={() => {
              handleDialogClose();
              document.getElementById('fileInput').click();
            }}
            color="primary"
            disabled={!selectedType}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <div className="image-table-container">
      <table className="image-table">
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Image</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((image, index) => (
              <tr key={index}>
                <td>{`Image ${index + 1}`}</td>
                <td>
                  <img src={image.imageUrl} alt={`Image ${index + 1}`} className="image" />
                </td>
                <td>{image.location}</td>
                <td>
                  <Button variant="contained" color="primary" onClick={() => handleAction(image.imageUrl, 'replace')} sx={{ marginRight: '10px' }}>
                    Replace
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleAction(image.imageUrl, 'delete')}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity} onClose={handleSnackbarClose}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <p>{confirmMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary">No</Button>
          <Button onClick={handleConfirmDialogYes} color="primary">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BrandSlider;
