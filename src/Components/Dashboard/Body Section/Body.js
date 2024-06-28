import React, { useState, useEffect } from 'react';
import './Body.css';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Body = () => {
  const [images, setImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    fetchImageList();
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
         } else if (width < 200 || width > 2000 || height < 100 || height > 1200) {
          reject('Image dimensions must be between 200x100 and 2000x1200 pixels.');
        } else {
          resolve(true);
        }
      };
  
      image.onerror = () => {
        reject('Invalid image file.');
      };
    });
  };
  

  const fetchImageList = async () => {
    try {
      const response = await axios.get('http://localhost:3005/image-list');
      if (response.data && Array.isArray(response.data)) {
        setImages(response.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleDelete = async (imageUrl) => {
    setModalContent('Are you sure you want to delete this image?');
    setModalOpen(true);
    setCurrentImageUrl(imageUrl);
  };

  const handleReplace = async (imageUrl) => {
    setModalContent('Are you sure you want to replace this image?');
    setModalOpen(true);
    setCurrentImageUrl(imageUrl);
  };

  const handleConfirmAction = async (confirmation) => {
    setModalOpen(false); // Close the modal

    if (confirmation && modalContent === 'Are you sure you want to delete this image?') {
      try {
        await axios.delete('http://localhost:3005/delete-image', { data: { imageUrl: currentImageUrl } });
        fetchImageList(); 
        showSnackbar('Image deleted successfully!', 'success');// Refresh image list after deletion
      } catch (error) {
        console.error('Error deleting image:', error);
        showSnackbar('Failed to delete image');
      }
    } else if (confirmation && modalContent === 'Are you sure you want to replace this image?') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            await validateImage(file); 
            const formData = new FormData();
            formData.append('image', file);
            formData.append('previousImageUrl', currentImageUrl);

            const response = await axios.post('http://localhost:3005/replace-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const newImageUrl = response.data.imageUrl;
            setImages(images.map((img) => (img === currentImageUrl ? newImageUrl : img)));
            showSnackbar('Image replaced successfully!', 'success');
          } catch (error) {
            console.error('Error replacing image:', error);
            showSnackbar(error,'error');
          }
        }
      };

      fileInput.click();
    } else if (confirmation && modalContent === 'Do you want to upload new image?') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            await validateImage(file); 
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post('http://localhost:3005/upload-image', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const newImageUrl = response.data.imageUrl;
            setImages([...images, newImageUrl]);
            showSnackbar('Image uploaded successfully!', 'success');
          } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar(error,'error');
          }
        }
      };

      fileInput.click();
    }
  };

  const handleCancelAction = () => {
    setModalOpen(false); // Close the modal
  };

  const handleUpload = () => {
    setModalContent('Do you want to upload new image?');
    setModalOpen(true);
  };
  
  return (
    <div className="brand-slider">
       <h2 className="slider-title">Trending Offers Slider</h2>
      <div className="uploadbutton">
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Add Banner
        </Button>
      </div>
      <div className="image-table-container">
        <table className="image-table">
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((imageUrl, index) => (
              <tr key={index}>
                <td>{`Image ${index + 1}`}</td>
                <td>
                  <img src={imageUrl} alt={`Image ${index + 1}`} className="image" />
                </td>
                <td>
                  <Button variant="contained" color="primary" onClick={() => handleReplace(imageUrl)} sx={{ marginRight: '10px' }}>
                    Replace
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDelete(imageUrl)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={modalOpen} onClose={handleCancelAction}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>{modalContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction} color="primary">
            No
          </Button>
          <Button onClick={() => handleConfirmAction(true)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
        <MuiAlert elevation={6} variant="filled" severity={snackbarSeverity} onClose={handleSnackbarClose}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default Body;
