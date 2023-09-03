import React from 'react';
import { Paper, Stack } from '@mui/material';
import ProductGroup from './ProductGroup';
import ProductList from './ProductList';
import { useState } from 'react';

function MainLeft() {
  const [maNvt, setMaNvt] = useState('');
  return (
    <Stack sx={{ width: '100%', height: '100%' }}>
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <ProductGroup maNvt={maNvt} setMaNvt={setMaNvt} />
        <ProductList maNvt={maNvt} />
      </Paper>
    </Stack>
  );
}

export default MainLeft;
