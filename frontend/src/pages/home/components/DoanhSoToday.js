import { Box, Paper, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import BarChart from '~/components/chart/BarChart';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';

function DoanhSoToday() {
  const alertSnackbar = useSnackbarContext();
  const { asyncReport } = useApisContext();
  const [data, setData] = useState();

  const getRevenueThisWeek = async () => {
    try {
      const condition = { type: 1, time_type: 1 };
      const resp = await asyncReport({
        endpoint: 'doanhthu',
        data: condition,
      });
      setData(resp);
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    }
  };

  const labels = useMemo(() => {
    if (data?.data?.length > 0) {
      return (data?.data || []).map((item) => item.label);
    } else {
      return [];
    }
  }, [data]);

  useEffect(() => {
    getRevenueThisWeek();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: '13px', fontWeight: 550, mb: '10px' }}>
        {data?.title}
      </Typography>
      <Box>
        <BarChart
          datasets={[
            {
              label: 'Doanh thu thuần',
              data: data?.data?.map((item) => item.doanh_thu_thuan),
              barThickness: 50,
            },
          ]}
          labels={labels}
        />
      </Box>
    </Paper>
  );
}

export default DoanhSoToday;
