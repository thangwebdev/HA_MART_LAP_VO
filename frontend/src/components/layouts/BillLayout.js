import React from 'react';
import Header from './components/header/Header';
import { Box, Container } from '@mui/material';

function BillLayout({ children }) {
  return (
    <Box sx={{ backgroundColor: 'primary.opacity' }}>
      <Header isAdmin={false}></Header>
      <Box>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}

export default BillLayout;
