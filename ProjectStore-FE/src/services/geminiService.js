// Gemini Service - Backend Proxy Version
// All Gemini API calls now go through the backend for security
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

console.log("Gemini Service Initialized (Backend Proxy Mode)");
console.log("API Base URL:", API_BASE_URL);

/**
 * Handle errors from backend
 */
const handleGeminiError = (error) => {
  if (error.response) {
    // Backend returned error response
    const { status, data } = error.response;
    const errorMessage = data.error || data.details || 'Unknown error occurred';
    
    console.error(`Gemini API Error (${status}):`, errorMessage);
    throw new Error(errorMessage);
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error: Cannot reach backend server');
    throw new Error('Cannot reach backend server. Please check your connection.');
  } else {
    // Error setting up request
    console.error('Request Error:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Generate model image from user image
 * @param {File} userImage - User uploaded image file
 * @returns {Promise<string>} Data URL of generated model image
 */
export const generateModelImage = async (userImage) => {
  try {
    const formData = new FormData();
    formData.append('userImage', userImage);
    
    console.log('Calling backend: POST /api/gemini/generate-model');
    
    const response = await axios.post(
      `${API_BASE_URL}/gemini/generate-model`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout
      }
    );
    
    // Return image data URL (compatible with previous implementation)
    return response.data.imageData;
  } catch (error) {
    handleGeminiError(error);
  }
};

/**
 * Generate virtual try-on image
 * @param {string} modelImageUrl - Data URL of model image
 * @param {File} garmentImage - Garment image file
 * @returns {Promise<string>} Data URL of try-on result
 */
export const generateVirtualTryOnImage = async (modelImageUrl, garmentImage) => {
  try {
    const formData = new FormData();
    formData.append('modelImageUrl', modelImageUrl);
    formData.append('garmentImage', garmentImage);
    
    console.log('Calling backend: POST /api/gemini/virtual-try-on');
    
    const response = await axios.post(
      `${API_BASE_URL}/gemini/virtual-try-on`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      }
    );
    
    return response.data.imageData;
  } catch (error) {
    handleGeminiError(error);
  }
};

/**
 * Generate mix-match image with multiple garments
 * @param {string} modelImageUrl - Data URL of model image
 * @param {File} topImage - Top garment image file
 * @param {File} bottomImage - Bottom garment image file
 * @param {Array<File>|File} accessories - Accessory image(s)
 * @param {File} fullBodyImage - Full body garment image file
 * @returns {Promise<string>} Data URL of mix-match result
 */
export const generateMixMatchImage = async (
  modelImageUrl, 
  topImage, 
  bottomImage, 
  accessories = [], 
  fullBodyImage = null
) => {
  try {
    const formData = new FormData();
    formData.append('modelImageUrl', modelImageUrl);
    
    if (fullBodyImage) {
      formData.append('fullBodyImage', fullBodyImage);
    } else {
      if (topImage) formData.append('topImage', topImage);
      if (bottomImage) formData.append('bottomImage', bottomImage);
    }
    
    // Handle accessories (single file or array)
    if (accessories) {
      if (Array.isArray(accessories)) {
        // For now, backend only supports single accessory
        // Send first accessory if array provided
        if (accessories.length > 0) {
          formData.append('accessories', accessories[0]);
        }
      } else {
        formData.append('accessories', accessories);
      }
    }
    
    console.log('Calling backend: POST /api/gemini/mix-match');
    
    const response = await axios.post(
      `${API_BASE_URL}/gemini/mix-match`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      }
    );
    
    return response.data.imageData;
  } catch (error) {
    handleGeminiError(error);
  }
};

/**
 * Generate pose variation from try-on image
 * @param {string} tryOnImageUrl - Data URL of try-on image
 * @param {string} poseInstruction - Instruction for new pose
 * @returns {Promise<string>} Data URL of pose variation result
 */
export const generatePoseVariation = async (tryOnImageUrl, poseInstruction) => {
  try {
    const formData = new FormData();
    formData.append('tryOnImageUrl', tryOnImageUrl);
    formData.append('poseInstruction', poseInstruction);
    
    console.log('Calling backend: POST /api/gemini/pose-variation');
    
    const response = await axios.post(
      `${API_BASE_URL}/gemini/pose-variation`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      }
    );
    
    return response.data.imageData;
  } catch (error) {
    handleGeminiError(error);
  }
};
