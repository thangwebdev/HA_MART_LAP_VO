import React from 'react';
import { Box, Typography } from '@mui/material';
import NotFoundImage from '~/assets/img/notfound.png';

function NotFoundPage() {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
    >
      <Box
        sx={{
          width: '50vw',
          height: '50vh',
          borderRadius: '4px',
        }}
      >
        <img
          src={NotFoundImage}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </Box>
      <Typography
        sx={{ color: 'primary.main', fontSize: '20px', fontWeight: 550 }}
      >
        Không tìm thấy trang
      </Typography>
    </Box>
  );
}

export default NotFoundPage;
