import React, { memo } from 'react';
import { Grid } from '@mui/material';
import FileInput from '~/components/input/FileInput';

function ImageTab({ setThumbnails, defaultValues }) {
  const handleFileChange = (key, file) => {
    setThumbnails((prev) => {
      return { ...prev, [key]: file };
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={4}>
        <FileInput
          url={defaultValues?.hinh_anh1}
          onChange={(file) => handleFileChange('hinh_anh1', file)}
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <FileInput
          url={defaultValues?.hinh_anh2}
          onChange={(file) => handleFileChange('hinh_anh2', file)}
        />
      </Grid>
      <Grid item xs={6} md={4}>
        <FileInput
          url={defaultValues?.hinh_anh3}
          onChange={(file) => handleFileChange('hinh_anh3', file)}
        />
      </Grid>
    </Grid>
  );
}

export default memo(ImageTab);
