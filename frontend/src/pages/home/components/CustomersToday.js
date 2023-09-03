import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import LineChart from '~/components/chart/LineChart';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

function CustomersToday() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 550, mb: '10px' }}>
        SỐ LƯỢNG KHÁCH
      </Typography>
      <Box>
        <LineChart
          labels={labels}
          datasets={[
            { label: 'Khách', data: labels.map(() => Math.random() * 50) },
          ]}
        />
      </Box>
    </Paper>
  );
}

export default CustomersToday;
