import { Box, Grid } from '@mui/material';
import React from 'react';
import { memo } from 'react';
import MainLeft from './MainLeft/MainLeft';
import MainRight from './MainRight/MainRight';
import useResponsive from '~/hooks/useResponsive';

function MainLayout() {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });

  return (
    <Box sx={{ flex: 1, width: '100%' }}>
      <Grid container spacing="5px" sx={{ width: '100%', height: '100%' }}>
        {mdMatches && (
          <Grid item xs={12} md={5.5}>
            <MainLeft />
          </Grid>
        )}
        <Grid item xs={12} md={6.5}>
          <MainRight />
        </Grid>
      </Grid>
    </Box>
  );
}

export default memo(MainLayout);
