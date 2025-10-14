import React, { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputref = useRef(null);
  const [previewurl, setPreviewurl] = useState(null);

  const handleimagechange = (event) => {
    const file = event.target.files[0];
    if (file) {
      //update the image state
      setImage(file);

      //generate preview url
      const preview = URL.createObjectURL(file);
      setPreviewurl(preview);
    }
  };

  const handleremoveImage = () => {
    setImage(null);
    setPreviewurl(null);
  };

  const onchoosefile = () => {
    inputref.current.click();
  }

  return <div className='flex justify-center mb-6'>
    <input type='file' accept='image/*' ref={inputref} onChange={handleimagechange} className='hidden' />
    {!image ? (
      <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative'>
        <LuUser className='text-4xl text-primary'/>

        <button
          type='button'
          // className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -botton-1 -right-1'
          className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
          onClick={onchoosefile}
        ><LuUpload />
        </button>
      </div>
    ) : (
      <div className='relative'>
        <img
          src={previewurl}
          alt='profile photo'
          className='w-20 h-20 rounded-full object-cover'
        />
        <button
          type='button'
          className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
          onClick={handleremoveImage}
        >
          <LuTrash />
        </button>
      </div>
    )}
  </div>
}

export default ProfilePhotoSelector