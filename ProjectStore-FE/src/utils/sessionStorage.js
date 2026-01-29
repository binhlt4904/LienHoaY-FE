/**
 * Session Storage utilities for FitCheck
 * Manages wardrobe and uploaded photo persistence
 */

const KEYS = {
  WARDROBE: 'fitcheck_wardrobe',
  UPLOADED_PHOTO: 'fitcheck_uploaded_photo',
  MODEL_IMAGE: 'fitcheck_model_image',
};

// Wardrobe Management
export const saveWardrobeToSession = (items) => {
  try {
    sessionStorage.setItem(KEYS.WARDROBE, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save wardrobe to session:', error);
  }
};

export const getWardrobeFromSession = () => {
  try {
    const data = sessionStorage.getItem(KEYS.WARDROBE);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get wardrobe from session:', error);
    return [];
  }
};

export const clearWardrobeSession = () => {
  try {
    sessionStorage.removeItem(KEYS.WARDROBE);
  } catch (error) {
    console.error('Failed to clear wardrobe session:', error);
  }
};

// Uploaded Photo Management
export const saveUploadedPhotoToSession = (photoDataUrl) => {
  try {
    sessionStorage.setItem(KEYS.UPLOADED_PHOTO, photoDataUrl);
  } catch (error) {
    console.error('Failed to save photo to session:', error);
    if (error.name === 'QuotaExceededError') {
      console.warn('Session storage quota exceeded. Clearing old data...');
      clearModelImageSession();
    }
  }
};

export const getUploadedPhotoFromSession = () => {
  try {
    return sessionStorage.getItem(KEYS.UPLOADED_PHOTO);
  } catch (error) {
    console.error('Failed to get photo from session:', error);
    return null;
  }
};

export const clearUploadedPhotoSession = () => {
  try {
    sessionStorage.removeItem(KEYS.UPLOADED_PHOTO);
  } catch (error) {
    console.error('Failed to clear photo session:', error);
  }
};

// Model Image Management (AI generated)
export const saveModelImageToSession = (modelImageUrl) => {
  try {
    sessionStorage.setItem(KEYS.MODEL_IMAGE, modelImageUrl);
  } catch (error) {
    console.error('Failed to save model image to session:', error);
  }
};

export const getModelImageFromSession = () => {
  try {
    return sessionStorage.getItem(KEYS.MODEL_IMAGE);
  } catch (error) {
    console.error('Failed to get model image from session:', error);
    return null;
  }
};

export const clearModelImageSession = () => {
  try {
    sessionStorage.removeItem(KEYS.MODEL_IMAGE);
  } catch (error) {
    console.error('Failed to clear model image session:', error);
  }
};

// Clear all FitCheck session data
export const clearAllFitCheckSession = () => {
  clearWardrobeSession();
  clearUploadedPhotoSession();
  clearModelImageSession();
};

// Check if session data exists
export const hasFitCheckSession = () => {
  return !!(
    getUploadedPhotoFromSession() ||
    getModelImageFromSession() ||
    getWardrobeFromSession().length > 0
  );
};
