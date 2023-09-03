import React from 'react';
import Header from './components/header/Header';
import MenuBar from './components/menubar/MenuBar';
import Footer from './components/footer/Footer';
import { Box, Container } from '@mui/material';
import useResponsive from '~/hooks/useResponsive';

function AdminLayout({ children }) {
  const matches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  return (
    <>
      <Header />
      <>{!!matches ? <MenuBar /> : null}</>
      <Box
        sx={{
          height: matches ? 'calc(100vh - 50px - 42px)' : 'calc(100vh - 50px)',
        }}
      >
        <Container sx={{ height: '100%' }} maxWidth="xl">
          {children}
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default AdminLayout;
