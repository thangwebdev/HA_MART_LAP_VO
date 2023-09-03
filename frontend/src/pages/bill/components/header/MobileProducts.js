import React, { useState } from 'react';
import { Stack, IconButton, Box } from '@mui/material';
import { BiCategory } from 'react-icons/bi';
import DrawerBase from '~/components/drawer/DrawerBase';
import MainLeft from '../Main/MainLeft/MainLeft';

function MobileProducts() {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <DrawerBase
        open={openDrawer}
        title="Hàng hóa"
        onClose={() => setOpenDrawer(false)}
        anchor="right"
        zIndex={1}
      >
        <Box sx={{ width: '80vw', maxWidth: '600px', height: '100%' }}>
          <MainLeft />
        </Box>
      </DrawerBase>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ marginLeft: 'auto' }}
      >
        <IconButton
          sx={{
            backgroundColor: 'primary.main',
            color: 'whitish.pureWhite',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'whitish.pureWhite',
            },
          }}
          onClick={() => setOpenDrawer(true)}
        >
          <BiCategory size={16} />
        </IconButton>
      </Stack>
    </>
  );
}

export default MobileProducts;
