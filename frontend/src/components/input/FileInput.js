import React, { useState } from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import { HiPlus } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { useRef } from 'react';
import { useEffect } from 'react';
import { PUBLIC_URL } from '~/utils/constants';

function FileInput({ url, onChange }) {
  const inputRef = useRef();
  const [imageUrl, setImageUrl] = useState(() => {
    return url ? `${PUBLIC_URL}/${url}` : '';
  });

  const handleDeleteFile = () => {
    onChange(undefined);
    setImageUrl('');
  };
  const handleChooseFile = () => {
    inputRef.current.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const imageURL = URL.createObjectURL(file);
    onChange(file);
    setImageUrl(imageURL);
  };
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  return (
    <Box sx={{ paddingTop: '100%', width: '100%', position: 'relative' }}>
      {imageUrl ? (
        <>
          <Avatar
            src={imageUrl}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '4px',
            }}
          />
          <IconButton
            onClick={handleDeleteFile}
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              backgroundColor: 'whitish.pureWhite',
              color: '#000',
              padding: '5px',
              '&:hover': {
                backgroundColor: 'whitish.pureWhite',
              },
            }}
          >
            <MdClose fontSize="14px" />
          </IconButton>
        </>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: '0',
            backgroundColor: '#ededed',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconButton onClick={handleChooseFile}>
            <HiPlus fontSize="20px" />
          </IconButton>
          <input
            type="file"
            hidden
            ref={inputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
        </Box>
      )}
    </Box>
  );
}

export default FileInput;
