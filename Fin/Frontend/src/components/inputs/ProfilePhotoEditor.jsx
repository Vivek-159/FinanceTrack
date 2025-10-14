import React, { useRef, useState, useContext } from 'react';
import { LuUser, LuUpload, LuTrash, LuSave } from 'react-icons/lu';
import { UserContext } from '../../context/Usercontext';
import uploadImage from '../../utils/uploadImage';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';

const ProfilePhotoEditor = ({ currentImage, onPhotoUpdate }) => {
  const { user, updateUser } = useContext(UserContext);
  const inputref = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewurl, setPreviewurl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPG, JPEG, or PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setError('');
      setSelectedFile(file);
      
      // Generate preview URL
      const preview = URL.createObjectURL(file);
      setPreviewurl(preview);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewurl(null);
    setError('');
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // First upload the image
      const uploadResponse = await uploadImage(selectedFile);
      const imageUrl = uploadResponse.imageurl;

      // Then update the user's profile photo
      const updateResponse = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE_PHOTO, {
        profileimageurl: imageUrl
      });

      // Update the user context
      updateUser(updateResponse.data.user);
      
      // Call the callback if provided
      if (onPhotoUpdate) {
        onPhotoUpdate(imageUrl);
      }

      // Clear the selected file and preview
      setSelectedFile(null);
      setPreviewurl(null);
      
      alert('Profile photo updated successfully!');
    } catch (err) {
      console.error('Error updating profile photo:', err);
      setError(err.response?.data?.message || 'Failed to update profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const onChooseFile = () => {
    inputref.current.click();
  };

  const displayImage = previewurl || currentImage || user?.profileimageurl;

  return (
    <div className='flex flex-col items-center space-y-4'>
      <input 
        type='file' 
        accept='image/*' 
        ref={inputref} 
        onChange={handleImageChange} 
        className='hidden' 
      />
      
      {/* Profile Photo Display */}
      <div className='relative'>
        {!displayImage ? (
          <div className='w-24 h-24 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full relative'>
            <LuUser className='text-5xl text-primary dark:text-purple-400'/>
            <button
              type='button'
              className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 hover:bg-purple-600 transition-colors'
              onClick={onChooseFile}
              disabled={isUploading}
            >
              <LuUpload size={16} />
            </button>
          </div>
        ) : (
          <div className='relative'>
            <img
              src={displayImage}
              alt='Profile photo'
              className='w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700'
            />
            <button
              type='button'
              className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 hover:bg-purple-600 transition-colors'
              onClick={onChooseFile}
              disabled={isUploading}
            >
              <LuUpload size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {selectedFile && (
        <div className='flex space-x-2'>
          <button
            type='button'
            className='flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleSavePhoto}
            disabled={isUploading}
          >
            <LuSave size={16} />
            {isUploading ? 'Saving...' : 'Save Photo'}
          </button>
          
          <button
            type='button'
            className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={handleRemoveImage}
            disabled={isUploading}
          >
            <LuTrash size={16} />
            Cancel
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='text-red-500 text-sm text-center max-w-xs'>
          {error}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className='text-blue-500 text-sm text-center'>
          Uploading photo...
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoEditor;